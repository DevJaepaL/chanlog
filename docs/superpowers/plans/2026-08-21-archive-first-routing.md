# Archive-First Routing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make / the canonical thumbnail archive, split portfolio and pipeline into focused pages, and move shared Contact/GitHub actions from the portfolio Hero into the responsive global header.

**Architecture:** Pure library helpers establish post ordering, thumbnail normalization, navigation state, and header-contact semantics before UI work. Thin App Router pages only compose those contracts. Navbar receives hrefs from shared contacts; Footer remains unchanged and automatically receives the Contact label through that same data.

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript 5, Contentlayer2, Tailwind CSS 3, Vitest 4, next/image.

**Spec:** docs/superpowers/specs/2026-08-21-archive-first-routing-design.md

## Global Constraints

- Preserve Next.js 14 App Router, contentlayer2, existing Tailwind tokens, typography, sticky behavior, and reduced-motion rules.
- Add no dependency, palette, content model, hamburger menu, or new animation.
- / is the sole canonical archive; /posts calls server permanentRedirect("/") and returns HTTP 308; /posts/[slug] URLs and article OG URLs remain unchanged.
- NAV_ITEMS is exactly 아카이브 (/), 포트폴리오 (/portfolio), 파이프라인 (/pipeline). /posts and /posts/[slug] map to active /.
- Header resolves Contact/GitHub hrefs only from shared contacts. Contact is same-window mailto: with no target or rel; GitHub is _blank with rel="noopener noreferrer"; neither is an active tab.
- Desktop header is CHANLOG left and page tabs → subtle divider → Contact → GitHub right. Mobile is logo + Contact/GitHub row one and page tabs row two, with no overflow. Every link has focus-visible styling and a practical 44px minimum height.
- lib/profile.ts changes the displayed Email label to Contact without changing its mailto href. Do not modify components/footer.tsx; shared data makes it render Contact/GitHub/Instagram.
- Hero is identity/content only: no contacts import, filtering/mapping, Email/GitHub links, or replacement button.
- /portfolio contains exactly Hero, About, CareerTimeline, ProjectList, SkillGroups. /pipeline contains only PipelineSection. Delete page Contact and RecentPosts.
- Archive images use next/image and trim CR/LF/whitespace. Mobile cards have 16:9 top images; sm+ cards have fixed left images; missing/blank images create no media frame.
- Do not edit content/*.mdx, contentlayer.config.ts, .contentlayer/**, post detail, pipeline internals, or nested birthday-gf. Existing .contentlayer churn must not be staged or committed.
- Required final gates: npm test, npx tsc --noEmit, npm run build. Use the bundled Node fallbacks in Task 3 if wrappers fail.

---

## File Structure and Sequencing

| Task | Files | Independently reviewable result | Depends on |
|---|---|---|---|
| 1 | lib/posts.ts, lib/posts.test.ts, lib/navigation.ts, lib/navigation.test.ts, lib/profile.ts, lib/profile.test.ts | Tested pure data contracts | none |
| 2 | components/archive/post-archive.tsx, app/page.tsx, app/posts/page.tsx | Tested archive contract consumed by canonical routes | Task 1 |
| 3 | app/portfolio/page.tsx, app/pipeline/page.tsx, components/navbar.tsx, components/home/hero.tsx, app/layout.tsx, app/sitemap.ts, deleted home Contact/RecentPosts | Global integration, visual/HTTP QA | Tasks 1–2 |

Run tasks in this exact order. They share navigation/profile data, root routing, and global layout, so parallel work in one worktree would conflict.

### Task 1: Add Pure Post, Navigation, and Shared Contact Contracts

**Files:**

- Create: lib/posts.ts
- Create: lib/posts.test.ts
- Create: lib/navigation.ts
- Create: lib/navigation.test.ts
- Modify: lib/profile.ts
- Modify: lib/profile.test.ts

**Interfaces:**

- Produces ArchivePost: { title: string; publishedAt: string; summary: string; slug: string; thumbnail?: string }.
- Produces sortPostsByPublishedAt<T extends ArchivePost>(posts: readonly T[]): T[]; it returns a new date-descending array and breaks equal dates with ascending slug.
- Produces normalizeThumbnail(thumbnail: string | undefined): string | undefined.
- Produces NAV_ITEMS, getActiveNavHref(pathname: string | null): "/" | "/portfolio" | "/pipeline" | undefined, getHeaderContacts(contacts: readonly ContactLink[]): ContactLink[], and getHeaderActionAttributes(contact: Pick<ContactLink, "label">): { target?: "_blank"; rel?: "noopener noreferrer" }.
- Changes only contacts[0].label from Email to Contact, preserving mailto:wocks3254@gmail.com.

- [ ] **Step 1: Write failing tests for every public contract.**

Create lib/posts.test.ts:

~~~
import { describe, expect, it } from "vitest";
import { normalizeThumbnail, sortPostsByPublishedAt } from "@/lib/posts";

describe("archive post helpers", () => {
  it("sorts a copy by newest date and ascending slug for equal dates", () => {
    const posts = [
      { title: "B", summary: "", slug: "zeta", publishedAt: "2024-02-01" },
      { title: "A", summary: "", slug: "beta", publishedAt: "2025-01-01" },
      { title: "C", summary: "", slug: "alpha", publishedAt: "2025-01-01" },
    ];
    const original = [...posts];

    expect(sortPostsByPublishedAt(posts).map((post) => post.slug)).toEqual([
      "alpha", "beta", "zeta",
    ]);
    expect(posts).toEqual(original);
  });

  it("trims CR/LF whitespace and omits absent or blank thumbnails", () => {
    expect(normalizeThumbnail("\r\n /images/thumb.png \n")).toBe("/images/thumb.png");
    expect(normalizeThumbnail(" \r\n ")).toBeUndefined();
    expect(normalizeThumbnail(undefined)).toBeUndefined();
  });
});
~~~

Create lib/navigation.test.ts:

~~~
import { describe, expect, it } from "vitest";
import { contacts } from "@/lib/profile";
import {
  getActiveNavHref,
  getHeaderActionAttributes,
  getHeaderContacts,
  NAV_ITEMS,
} from "@/lib/navigation";

describe("navigation contracts", () => {
  it("exposes the exact page tabs in order", () => {
    expect(NAV_ITEMS).toEqual([
      { label: "아카이브", href: "/" },
      { label: "포트폴리오", href: "/portfolio" },
      { label: "파이프라인", href: "/pipeline" },
    ]);
  });

  it("maps archive and post paths to the archive tab", () => {
    expect(getActiveNavHref("/")).toBe("/");
    expect(getActiveNavHref("/posts")).toBe("/");
    expect(getActiveNavHref("/posts/my-first-post")).toBe("/");
    expect(getActiveNavHref("/portfolio")).toBe("/portfolio");
    expect(getActiveNavHref("/pipeline")).toBe("/pipeline");
    expect(getActiveNavHref("/missing")).toBeUndefined();
  });

  it("selects Contact then GitHub from shared contacts only", () => {
    expect(getHeaderContacts(contacts)).toEqual([
      contacts.find((contact) => contact.label === "Contact"),
      contacts.find((contact) => contact.label === "GitHub"),
    ]);
  });

  it("gives Contact same-window mail and GitHub safe new-window semantics", () => {
    const [contact, github] = getHeaderContacts(contacts);
    expect(contact.href).toMatch(/^mailto:/);
    expect(getHeaderActionAttributes(contact)).toEqual({});
    expect(github.href).toMatch(/^https:\/\//);
    expect(getHeaderActionAttributes(github)).toEqual({
      target: "_blank",
      rel: "noopener noreferrer",
    });
  });
});
~~~

Append this exact case within the existing profile data suite:

~~~
it("renames Email to Contact while preserving the shared mailto destination", () => {
  expect(contacts.map((contact) => contact.label)).toEqual([
    "Contact", "GitHub", "Instagram",
  ]);
  expect(contacts[0]).toEqual({
    label: "Contact",
    href: "mailto:wocks3254@gmail.com",
  });
});
~~~

- [ ] **Step 2: Run tests to verify red.**

Run: npm test -- lib/posts.test.ts lib/navigation.test.ts lib/profile.test.ts

Expected: FAIL because lib/posts.ts and lib/navigation.ts are absent and the profile still labels the mail link Email.

- [ ] **Step 3: Implement the smallest typed contracts.**

Create lib/posts.ts:

~~~
export interface ArchivePost {
  title: string;
  publishedAt: string;
  summary: string;
  slug: string;
  thumbnail?: string;
}

export function sortPostsByPublishedAt<T extends ArchivePost>(posts: readonly T[]): T[] {
  return [...posts].sort((left, right) => {
    const byDate = new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime();
    return byDate || left.slug.localeCompare(right.slug);
  });
}

export function normalizeThumbnail(thumbnail: string | undefined): string | undefined {
  const normalized = thumbnail?.trim();
  return normalized || undefined;
}
~~~

Create lib/navigation.ts:

~~~
import type { ContactLink } from "@/lib/profile";

export const NAV_ITEMS = [
  { label: "아카이브", href: "/" },
  { label: "포트폴리오", href: "/portfolio" },
  { label: "파이프라인", href: "/pipeline" },
] as const;

const HEADER_CONTACT_LABELS = ["Contact", "GitHub"] as const;

export function getActiveNavHref(pathname: string | null) {
  if (pathname === "/" || pathname === "/posts" || pathname?.startsWith("/posts/")) return "/";
  if (pathname === "/portfolio" || pathname === "/pipeline") return pathname;
  return undefined;
}

export function getHeaderContacts(contacts: readonly ContactLink[]): ContactLink[] {
  return HEADER_CONTACT_LABELS.flatMap((label) =>
    contacts.filter((contact) => contact.label === label)
  );
}

export function getHeaderActionAttributes(contact: Pick<ContactLink, "label">) {
  return contact.label === "GitHub"
    ? { target: "_blank" as const, rel: "noopener noreferrer" as const }
    : {};
}
~~~

In lib/profile.ts change only { label: "Email", href: "mailto:wocks3254@gmail.com" } to { label: "Contact", href: "mailto:wocks3254@gmail.com" }.

- [ ] **Step 4: Verify green and review the isolated unit.**

Run: npm test -- lib/posts.test.ts lib/navigation.test.ts lib/profile.test.ts

Expected: PASS. This proves immutable date sorting with slug tie-break, thumbnail trim/blank behavior, exact NAV_ITEMS order, post active mapping, Contact/GitHub selection/order, target semantics, and shared label migration without component mocks or source-text assertions.

Run: npx tsc --noEmit

Expected: PASS.

Run: git diff --check; git diff -- lib/posts.ts lib/posts.test.ts lib/navigation.ts lib/navigation.test.ts lib/profile.ts lib/profile.test.ts

Expected: no whitespace errors; exactly Task 1 files.

- [ ] **Step 5: Commit Task 1.**

~~~
git add -- lib/posts.ts lib/posts.test.ts lib/navigation.ts lib/navigation.test.ts lib/profile.ts lib/profile.test.ts
git commit -m "feat: add archive navigation contracts"
~~~

Expected: one focused commit and no staged .contentlayer file.

### Task 2: Render the Reusable Thumbnail Archive and Canonical Root

**Files:**

- Create: components/archive/post-archive.tsx
- Modify: app/page.tsx
- Modify: app/posts/page.tsx

**Interfaces:**

- Consumes ArchivePost, sortPostsByPublishedAt, normalizeThumbnail from @/lib/posts.
- Produces PostArchive({ posts }: { posts: readonly ArchivePost[] }); each card is a single /posts/[slug] Link.
- app/page.tsx passes allPosts to PostArchive. app/posts/page.tsx calls permanentRedirect("/").

- [ ] **Step 1: Add a failing blank-thumbnail regression test.**

Append this case to lib/posts.test.ts:

~~~
it("does not produce a source for a whitespace-only thumbnail", () => {
  const post = {
    title: "P", summary: "S", slug: "post", publishedAt: "2025-01-01", thumbnail: "\r\n ",
  };
  expect(normalizeThumbnail(post.thumbnail)).toBeUndefined();
});
~~~

- [ ] **Step 2: Run the test and establish the red/green dependency.**

Run: npm test -- lib/posts.test.ts

Expected on a checkout before Task 1: FAIL because normalizeThumbnail is unavailable. Expected after Task 1: PASS; retain this additional case as the renderer’s no-blank-src regression.

- [ ] **Step 3: Implement the component and routes.**

Create components/archive/post-archive.tsx as a server component. It must:

- Render existing Archive eyebrow and 아카이브 heading.
- Iterate sortPostsByPublishedAt(posts), calculate normalizeThumbnail(post.thumbnail) once per card, and use no other thumbnail cleanup path.
- Render one Link per card with href={"/posts/" + post.slug}; no nested links or clickable non-link wrapper.
- When thumbnail exists, use next/image with alt="", width={320}, height={180}, sizes="(min-width: 640px) 16rem, 100vw", object-cover, an aspect-video full-width mobile image, and sm:w-64 sm:shrink-0 left media.
- When thumbnail is absent, render no image wrapper; text receives the full card width.
- Preserve rounded-lg, border-hairline, bg-surface, hover:shadow-soft, text tokens, and an obvious focus-visible ring.

Use this central card shape:

~~~
<Link
  key={post.slug}
  href={"/posts/" + post.slug}
  className="group flex flex-col overflow-hidden rounded-lg border border-hairline bg-surface transition-shadow hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:flex-row"
>
  {thumbnail ? (
    <Image
      src={thumbnail}
      alt=""
      width={320}
      height={180}
      sizes="(min-width: 640px) 16rem, 100vw"
      className="aspect-video w-full object-cover sm:w-64 sm:shrink-0"
    />
  ) : null}
  <div className="flex flex-col gap-1 p-5">
    <p className="text-caption text-ink-muted">{post.publishedAt}</p>
    <h2 className="break-keep text-title text-ink group-hover:text-primary">{post.title}</h2>
    <p className="break-keep text-body-sm text-ink-muted">{post.summary}</p>
  </div>
</Link>
~~~

Replace app/page.tsx with archive metadata (title 아카이브; spec archive description; canonical and Open Graph URL https://chanlog.blog/) and <PostArchive posts={allPosts} />. Replace app/posts/page.tsx exactly:

~~~
import { permanentRedirect } from "next/navigation";

export default function PostsPage() {
  permanentRedirect("/");
}
~~~

- [ ] **Step 4: Verify archive behavior.**

Run: npm test -- lib/posts.test.ts

Expected: PASS, including immutable sorting, same-date slug order, CR/LF trim, and blank/missing fallbacks.

Run: rg -n "PostArchive|permanentRedirect\(\"/\"\)|from \"next/image\"|normalizeThumbnail" app/page.tsx app/posts/page.tsx components/archive/post-archive.tsx

Expected: root renders PostArchive, /posts redirects, and the archive component is the sole Image/thumbnail-normalization owner.

- [ ] **Step 5: Commit Task 2.**

Run: git diff --check; git diff -- components/archive/post-archive.tsx app/page.tsx app/posts/page.tsx

Expected: no whitespace errors and no global header/page split deletion in this commit.

~~~
git add -- components/archive/post-archive.tsx app/page.tsx app/posts/page.tsx lib/posts.test.ts
git commit -m "feat: make root the canonical archive"
~~~

Expected: one archive-only commit; lib/posts.test.ts is included for this task’s added regression.

### Task 3: Split Pages and Integrate the Responsive Global Header

**Files:**

- Create: app/portfolio/page.tsx
- Create: app/pipeline/page.tsx
- Modify: components/navbar.tsx
- Modify: components/home/hero.tsx
- Modify: app/layout.tsx
- Modify: app/sitemap.ts
- Modify: lib/navigation.test.ts
- Delete: components/home/contact.tsx
- Delete: components/home/recent-posts.tsx

**Interfaces:**

- Consumes NAV_ITEMS, getActiveNavHref, getHeaderContacts, getHeaderActionAttributes, and shared contacts.
- Produces one sticky global header containing nav aria-label="주 내비게이션"; action anchors spread getHeaderActionAttributes(contact).
- Produces /portfolio composed only of Hero, About, CareerTimeline, ProjectList, SkillGroups, in that order; /pipeline body contains only PipelineSection.
- Footer is not a modified file.

- [ ] **Step 1: Add the remaining failing data-contract assertions.**

Append to lib/navigation.test.ts:

~~~
it("does not select Instagram for header actions", () => {
  expect(getHeaderContacts(contacts).map((contact) => contact.label)).toEqual([
    "Contact", "GitHub",
  ]);
});

it("does not give Contact external-window attributes", () => {
  const contact = getHeaderContacts(contacts)[0];
  expect(getHeaderActionAttributes(contact).target).toBeUndefined();
  expect(getHeaderActionAttributes(contact).rel).toBeUndefined();
});
~~~

- [ ] **Step 2: Run focused TDD verification.**

Run: npm test -- lib/navigation.test.ts lib/profile.test.ts

Expected before Task 1: FAIL for absent helpers/old Email label. Expected after Task 1: PASS; these tests remain the DOM-independent proof of header action behavior.

- [ ] **Step 3: Implement the page split and global layout.**

Create app/portfolio/page.tsx with metadata title 포트폴리오, the spec portfolio description, and canonical/Open Graph URL https://chanlog.blog/portfolio. Its complete page body is:

~~~
<>
  <Hero />
  <About />
  <CareerTimeline />
  <ProjectList />
  <SkillGroups />
</>
~~~

Create app/pipeline/page.tsx with metadata title 문서 전처리 파이프라인, the spec pipeline description, canonical/Open Graph URL https://chanlog.blog/pipeline, and exactly <PipelineSection /> as the page body.

In components/navbar.tsx import contacts from @/lib/profile and NAV_ITEMS, getActiveNavHref, getHeaderActionAttributes, getHeaderContacts from @/lib/navigation. Remove its local NAV_ITEMS and pathname mutation. Render this structure, completing all anchors and Links with current token colors, min-h-11, horizontal padding, and focus-visible classes:

~~~
<header className="sticky top-0 z-50 w-full border-b border-hairline bg-canvas/90 backdrop-blur">
  <nav aria-label="주 내비게이션" className="mx-auto flex w-full max-w-5xl flex-wrap items-center px-6 sm:h-16 sm:flex-nowrap">
    <Link href="/" className="inline-flex min-h-11 items-center text-title text-ink">CHANLOG</Link>
    <ul className="order-3 flex basis-full items-center gap-1 sm:order-2 sm:ml-auto sm:basis-auto">
      {NAV_ITEMS.map(({ label, href }) => <li key={href}><Link href={href}>{label}</Link></li>)}
    </ul>
    <span aria-hidden="true" className="order-3 hidden h-5 w-px bg-hairline sm:order-3 sm:mx-3 sm:block" />
    <ul className="ml-auto flex min-h-11 items-center gap-1 sm:order-4 sm:ml-0">
      {getHeaderContacts(contacts).map((contact) => (
        <li key={contact.label}>
          <a href={contact.href} {...getHeaderActionAttributes(contact)}>{contact.label}</a>
        </li>
      ))}
    </ul>
  </nav>
</header>
~~~

Use getActiveNavHref(usePathname()) only for page-tab active classes. The page-tabs list is order-3 and basis-full on mobile, creating a second row after logo/actions; at sm+ it becomes logo → tabs → hidden-mobile divider → actions. Do not give an action an active class. Do not place Contact/GitHub href strings, target literals, or rel literals in Navbar.

In components/home/hero.tsx retain only next/image, avatar, and profile imports. Delete contacts, heroContacts, and the complete CTA div. Do not replace it.

In app/layout.tsx set default title CHANLOG | 기술 아카이브, description 백엔드·AI·데이터 파이프라인에 관한 이재찬의 기술 아카이브., and website Open Graph URL https://chanlog.blog/. Preserve metadataBase, ko_KR locale, robots, site name, and title template. In app/sitemap.ts return static URLs only for /, /portfolio, /pipeline plus all /posts/[slug]; omit /posts.

Before deletion, run rg -n "components/home/(contact|recent-posts)|<Contact|<RecentPosts" app components. Delete components/home/contact.tsx and components/home/recent-posts.tsx only when the output has no consumer import.

- [ ] **Step 4: Run tests, static checks, build, HTTP, and browser-or-fallback QA.**

Run: npm test -- lib/posts.test.ts lib/navigation.test.ts lib/profile.test.ts

Expected: PASS for post sorting, thumbnails, exact nav order, /posts and detail active mapping, Contact label, action selection/order, and target semantics.

Run: rg -n "contacts|heroContacts|Email|GitHub|target|rel" components/home/hero.tsx

Expected: no output.

Run: rg -n "<Hero|<About|<CareerTimeline|<ProjectList|<SkillGroups|<PipelineSection|<Contact|<RecentPosts" app/page.tsx app/portfolio/page.tsx app/pipeline/page.tsx

Expected: root contains none of the old portfolio sections; portfolio contains exactly the required five in order; pipeline contains only PipelineSection.

Run: npm test

Expected: PASS.

Run: npx tsc --noEmit

Expected: PASS.

Preserve existing tracked Contentlayer changes before build, restore only the build-created divergence, then restore the original baseline:

~~~
$contentlayerBaseline = Join-Path $env:TEMP "chanlog-contentlayer-before-build.patch"
git diff --binary -- .contentlayer | Set-Content -NoNewline $contentlayerBaseline
npm run build
git restore --source=HEAD -- .contentlayer
if ((Get-Item $contentlayerBaseline).Length -gt 0) { git apply --whitespace=nowarn $contentlayerBaseline }
Remove-Item -LiteralPath $contentlayerBaseline
~~~

Expected: npm run build PASS and git status --short -- .contentlayer matches its pre-build state. If npm/npx wrappers fail, run these exact bundled fallbacks and require the same green outcomes:

~~~
node .\node_modules\vitest\vitest.mjs run
node .\node_modules\typescript\bin\tsc --noEmit
node .\node_modules\next\dist\bin\next build
~~~

After a successful build, start the production server. Browser QA must check: / has the four current image URLs (/images/5-omc/image.png, /images/4-wrapper/thumb.png, /images/3-docker/thumb.png, /images/1-first/bg.jpg); /posts is 308 Location: /; /portfolio has exactly five components with no page Contact/Pipeline/recent content and no Hero buttons; Navbar has desktop order and mobile two rows with actions; /pipeline retains PipelineSection; /posts/my-first-post retains post content/TOC/article OG; sitemap includes root, portfolio, pipeline, post details and excludes bare /posts.

If browser tooling fails, inspect emitted HTML for the four image URLs and run curl.exe -I http://localhost:3000/posts. Record the residual visual risk: emitted HTML and HTTP prove structure, URLs, and redirect semantics but not responsive image crop, sticky behavior, focus-ring appearance, or measured touch targets.

- [ ] **Step 5: Final diff review and integration commit.**

Run: git diff --check; git status --short

Expected: no whitespace errors; no staged .contentlayer output; no birthday-gf change. If birthday-gf exists, run git -C .\birthday-gf status --short and preserve the result without staging or restoring it.

~~~
git add -- app/portfolio/page.tsx app/pipeline/page.tsx components/navbar.tsx components/home/hero.tsx app/layout.tsx app/sitemap.ts components/home/contact.tsx components/home/recent-posts.tsx lib/navigation.test.ts
git commit -m "feat: split portfolio routes and header actions"
~~~

Expected: one integration commit containing only the listed files.

## Final Verification Record

- [ ] npm test passes, or the bundled Vitest fallback passes.
- [ ] npx tsc --noEmit passes, or the bundled TypeScript fallback passes.
- [ ] npm run build passes, or the bundled Next fallback passes.
- [ ] .contentlayer matches its pre-build baseline; generated output and nested birthday-gf remain uncommitted.
- [ ] Browser QA covers /, /posts, /portfolio, /pipeline, /posts/my-first-post, and /sitemap.xml; fallback evidence documents the stated residual visual risk.
