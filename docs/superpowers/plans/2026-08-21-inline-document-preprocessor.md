# Inline Document Preprocessor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the standalone pipeline case-study route with a short, accessible, directly manipulable document-preprocessor demonstration embedded between Projects and Skills on `/portfolio`.

**Architecture:** A focused pure-data module owns the page-1 derivative metadata, normalized source rectangles, semantic result payloads, and a reducer shared by mouse, keyboard, and touch interactions. Portfolio-scoped components render one collapsed card and one responsive source/result panel, while a separate routing task removes the obsolete standalone UI and proves the permanent legacy redirect at the production HTTP boundary.

**Tech Stack:** Next.js 14.0.3 App Router, React 18.2, TypeScript 5.5, Tailwind CSS 3.4, Vitest 4.1, next/image, bundled Python with pypdfium2 and Pillow.

**Spec:** docs/superpowers/specs/2026-08-21-inline-document-preprocessor-design.md

## Global Constraints

- The portfolio body order is exactly `Hero` → `About` → `CareerTimeline` → `ProjectList` → `DocumentPreprocessorSection` → `SkillGroups`; the new section id is `document-preprocessor`.
- The demo starts collapsed and opens inline. It must not open a modal, new page, new tab, PDF viewer, download, or additional URL.
- The only deployed source asset is `public/images/document-preprocessor/customs-2026-07-page-1.webp`, rendered from page 1 of `C:\Users\META06\Downloads\D26080074.pdf`. Do not copy the PDF or render/deploy pages 2–19; do not recreate the document in HTML or substitute a synthetic image.
- The exact visible card copy is title `문서 전처리기 구현`, description `PDF·DOCX·HWP의 제목·본문·표·차트를 구조 단위로 분리했습니다.`, collapsed action `구현 보기`, expanded action `접기`, and source `출처: 관세청 「2026년 7월 수출입 현황 [확정치]」, 2026. 8. 18., 1쪽` with no external source link.
- Region ids are exactly `title`, `summary`, `table`, `chart`. Default open state is neutral; hover and focus are tracked independently with `focusedRegion ?? hoveredRegion ?? pinnedRegion` precedence, click/Enter/Space pins or unpins, another region replaces the pin, and close resets open/hover/focus/pinned state and returns focus to the expansion action. Escape is not an expansion-action behavior.
- Expansion occurs only through the outer action `button` click or its native Enter/Space activation. Card hover/focus and clicks outside that button must not expand or change height.
- The four exact source rects are non-interactive outlines. Four numbered source marker buttons have centers inside their corresponding rects and pair with four result actions; all eight controls use accessible names `문서 제목 선택`, `요약 선택`, `표 선택`, and `차트 선택`, visible `focus-visible` rings, practical minimum 44px targets, and `aria-pressed="true"` only for the pinned region. Keeping the shallow title rect separate from its 44px marker prevents title/summary hit-target overlap. The expansion action has `aria-expanded` and `aria-controls`.
- Desktop (`sm`+) uses one `bg-surface border-hairline rounded-lg` two-column panel; mobile stacks the source before results without horizontal scrolling or connector lines. Preserve the full page ratio and readable table/chart content.
- Use only existing Tailwind/DESIGN.md tokens. `accent-*` classifies the four element types and must be paired with text labels/outlines; `primary` is only action/link/focus/active selection, `secondary` remains Hero-only. Add no palette, shadow, animation, dependency, technical chips, or long technical explanation. Reduced motion makes all state feedback immediate; the existing Section fade-up is the only entrance animation.
- `lib/document-preprocessor.ts` is the single owner of text, source attribution, image metadata/path, normalized rectangles, marker points/numbers, labels, element classification, semantic result payloads, and interaction precedence. Rendering components must not repeat those values.
- Do not display `Chroma`, `Elasticsearch`, `BGE`, indexing, naive-versus-structured extraction, performance/scale/accuracy, internal architecture/network/specification, customer names, or customer/internal documents.
- Header order is exactly `아카이브` (`/`) → `포트폴리오` (`/portfolio`) → decorative divider → `Contact` → `GitHub`. Remove the `파이프라인` tab. Desktop remains one row; mobile remains logo/actions on row one and archive/portfolio on row two.
- `/pipeline` is not an App Router page. It must be a framework-level 308 redirect with raw `Location: /portfolio#document-preprocessor`; `/pipeline/...` is untouched and 404. Preserve the existing `/posts` 308 redirect to `/`, `/posts/[slug]`, archive thumbnails/posts, and the global Footer.
- `/portfolio` canonical and Open Graph URL remain exactly `https://chanlog.blog/portfolio`. Sitemap contains only `/`, `/portfolio`, and `/posts/[slug]`; it excludes bare `/posts`, `/pipeline`, and fragment entries.
- Add no dependency and install no browser. Use the existing in-app browser if available; otherwise use production HTTP/emitted HTML plus local image inspection and record the stated residual visual risk.
- Use bundled runtimes and local CLIs because global npm/npx wrappers are known broken: Node is `C:\Users\META06\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe`; Python is `C:\Users\META06\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe`.
- Never use broad `git restore`, recursive deletion, `git reset`, or `git clean`. After each build, inspect exact `.contentlayer` generated diffs and mechanically restore only the exact build-created paths. A build can churn four tracked Contentlayer files. The baseline pass reported four generated documents and changed three tracked paths on this checkout; another run can differ, so derive the exact list from `git diff --name-only -- .contentlayer` rather than assuming a count or filename.
- Preserve nested `birthday-gf` exactly: baseline HEAD is `42a6392628da27e32a787b07eb87d7bf8b369c81`, with pre-existing modifications to `package-lock.json`, `package.json`, and `src/app/layout.tsx`. Never stage, restore, delete, format, or otherwise alter that checkout.
- Current execution context is the normal checkout on feature branch `feat/portfolio-redesign`, not an isolated worktree. Each task stages only its explicitly owned files and creates one focused commit.
- This spec supersedes the two earlier specs only where section 12 says so: standalone `/pipeline` route/nav/metadata/sitemap/components/data and the former five-stage pipeline UI are replaced. Archive-first routing, `/posts` behavior, post detail, Footer, archive UI, shared design/safety rules, typography, surfaces, Section fade-up, and reduced motion remain binding.

---

## File Responsibility Map and Task Boundaries

| Task | Owned files | Single responsibility | Review gate |
|---|---|---|---|
| 1 | `public/images/document-preprocessor/customs-2026-07-page-1.webp`, `lib/document-preprocessor.ts`, `lib/document-preprocessor.test.ts` | Deterministic page-1 derivative, all demo data/types, and pure reducer contract | Asset/hash inspection plus genuine Vitest RED/GREEN |
| 2 | `components/portfolio/document-preprocessor-section.tsx`, `components/portfolio/document-preprocessor-demo.tsx`, `app/portfolio/page.tsx` | Portfolio-only rendering, accessibility, synchronization, and placement | Focused helper tests, typecheck/build, runtime interaction and responsive visual QA |
| 3 | `lib/navigation.ts`, `lib/navigation.test.ts`, `lib/metadata.test.ts`, `lib/sitemap.ts`, `lib/sitemap.test.ts`, `lib/routing.test.ts`, `app/sitemap.ts`, `next.config.js`, `CLAUDE.md`; delete `app/pipeline/page.tsx`, `components/pipeline/chunking-view.tsx`, `components/pipeline/extraction-compare.tsx`, `components/pipeline/index-view.tsx`, `components/pipeline/pipeline-flow.tsx`, `components/pipeline/pipeline-section.tsx`, `lib/pipeline.ts`, `lib/pipeline.test.ts`; verify `components/navbar.tsx` unchanged | Remove standalone route/UI/data, preserve global surfaces, and prove redirect/navigation/SEO contracts | Navigation/routing/sitemap RED/GREEN, full suite/build, exact production HTTP assertions |

Run tasks in this exact order. No file is owned by more than one task. Task 3 is the sole `CLAUDE.md` owner and updates routing, portfolio-component, and focused-data guidance together, avoiding cross-task documentation edits.

### Task 1: Create the Page-1 Asset and Pure Data/State Contract

**Files:**

- Create: `public/images/document-preprocessor/customs-2026-07-page-1.webp`
- Create: `lib/document-preprocessor.ts`
- Create: `lib/document-preprocessor.test.ts`
- Read only: `C:\Users\META06\Downloads\D26080074.pdf`

**Interfaces:**

- Produces `type DocumentRegionId = "title" | "summary" | "table" | "chart"`.
- Produces `interface NormalizedRect { x: number; y: number; width: number; height: number }`, where every value is normalized to `[0, 1]` against the complete 1785×2523 page image.
- Produces one normalized marker point and number inside each region plus a pure 44px marker-bounds helper.
- Produces `DocumentRegion`, `DocumentPreprocessorDemo`, and the immutable `documentPreprocessorDemo` payload shown below.
- Produces `DocumentPreprocessorState = { isOpen: boolean; hoveredRegion: DocumentRegionId | null; focusedRegion: DocumentRegionId | null; pinnedRegion: DocumentRegionId | null }`.
- Produces independent hover/focus event pairs, `{ type: "toggle-pin"; region }`, `{ type: "toggle" }`, and `{ type: "close" }`.
- Produces `getDocumentPreprocessorState`, `getActiveDocumentRegion`, and `reduceDocumentPreprocessorState` for Task 2. Active precedence is focus, then hover, then pin; mouseleave and blur clear only their own transient channels, and close resets all four fields.

- [ ] **Step 1: Write the complete failing pure-contract test.**

Create `lib/document-preprocessor.test.ts` before the module or asset exists:

```ts
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  documentPreprocessorDemo,
  getActiveDocumentRegion,
  getDocumentPreprocessorState,
  getDocumentRegionMarkerBounds,
  reduceDocumentPreprocessorState,
  type DocumentRegionId,
} from "@/lib/document-preprocessor";

const REGION_IDS: DocumentRegionId[] = ["title", "summary", "table", "chart"];

function resultStrings() {
  return documentPreprocessorDemo.regions.flatMap((region) => {
    if (region.result.kind === "table") {
      return [
        ...region.result.columns,
        ...region.result.rows.flatMap((row) => [row.label, ...row.cells]),
      ];
    }
    if (region.result.kind === "figure") {
      return [region.result.label, region.result.caption];
    }
    return [...region.result.lines];
  });
}

describe("documentPreprocessorDemo", () => {
  it("owns the exact public copy and four unique region contracts", () => {
    expect(documentPreprocessorDemo.title).toBe("문서 전처리기 구현");
    expect(documentPreprocessorDemo.description).toBe(
      "PDF·DOCX·HWP의 제목·본문·표·차트를 구조 단위로 분리했습니다."
    );
    expect(documentPreprocessorDemo.actions).toEqual({
      collapsed: "구현 보기",
      expanded: "접기",
    });
    expect(documentPreprocessorDemo.source).toBe(
      "출처: 관세청 「2026년 7월 수출입 현황 [확정치]」, 2026. 8. 18., 1쪽"
    );

    const ids = documentPreprocessorDemo.regions.map((region) => region.id);
    const labels = documentPreprocessorDemo.regions.map((region) => region.label);
    expect(ids).toEqual(REGION_IDS);
    expect(new Set(ids).size).toBe(4);
    expect(new Set(labels).size).toBe(4);
    expect(documentPreprocessorDemo.regions.map((region) => region.accessibleName)).toEqual([
      "문서 제목 선택",
      "요약 선택",
      "표 선택",
      "차트 선택",
    ]);

    for (const region of documentPreprocessorDemo.regions) {
      for (const value of Object.values(region.rect)) {
        expect(value).toBeGreaterThan(0);
        expect(value).toBeLessThanOrEqual(1);
      }
      expect(region.rect.x + region.rect.width).toBeLessThanOrEqual(1);
      expect(region.rect.y + region.rect.height).toBeLessThanOrEqual(1);
    }

    const content = resultStrings();
    expect(content.every((value) => value.trim().length > 0)).toBe(true);
    expect(new Set(content).size).toBe(content.length);
    expect(content).not.toContain("문서 제목");
    expect(JSON.stringify(documentPreprocessorDemo)).not.toMatch(
      /Chroma|Elasticsearch|BGE|indexing|정확도|고객사|내부 네트워크/
    );
  });

  it("contains the exact semantic results", () => {
    expect(documentPreprocessorDemo.regions.map((region) => region.result)).toEqual([
      { kind: "text", lines: ["2026년 7월 수출입 현황 [확정치]"] },
      {
        kind: "list",
        lines: [
          "수출 990억 달러, 전년 동월 대비 63.0% 증가",
          "무역수지 304억 달러 흑자",
          "수출 14개월 연속 증가",
        ],
      },
      {
        kind: "table",
        columns: ["구분", "2026년 7월", "전년 동월 대비"],
        rows: [
          { label: "수출", cells: ["98,959백만 달러", "63.0% 증가"] },
          { label: "수입", cells: ["68,567백만 달러", "26.5% 증가"] },
        ],
      },
      { kind: "figure", label: "월별 수출입 현황", caption: "수출입 추이" },
    ]);
  });

  it("references the single deterministic full-page WebP derivative", () => {
    expect(documentPreprocessorDemo.image).toEqual({
      src: "/images/document-preprocessor/customs-2026-07-page-1.webp",
      width: 1785,
      height: 2523,
      alt: "관세청 2026년 7월 수출입 현황 확정치 보고서 1쪽",
    });
    const bytes = readFileSync(
      resolve("public/images/document-preprocessor/customs-2026-07-page-1.webp")
    );
    expect(bytes.subarray(0, 4).toString("ascii")).toBe("RIFF");
    expect(bytes.subarray(8, 12).toString("ascii")).toBe("WEBP");
    expect(createHash("sha256").update(bytes).digest("hex").toUpperCase()).toBe(
      "7B4B5F0B5A1250A166147899FA834B19A89DE03453350F05DD6CA0FD1AEAF38E"
    );
  });
});

describe("document preprocessor state", () => {
  it("starts closed and opens/closes in a neutral reset state", () => {
    const closed = getDocumentPreprocessorState();
    expect(closed).toEqual({
      isOpen: false,
      hoveredRegion: null,
      focusedRegion: null,
      pinnedRegion: null,
    });
    const open = reduceDocumentPreprocessorState(closed, { type: "toggle" });
    expect(open).toEqual({
      isOpen: true,
      hoveredRegion: null,
      focusedRegion: null,
      pinnedRegion: null,
    });
    expect(reduceDocumentPreprocessorState(open, { type: "toggle" })).toEqual(closed);
  });

  it("keeps hover and focus independent with focus precedence", () => {
    let state = reduceDocumentPreprocessorState(getDocumentPreprocessorState(), {
      type: "toggle",
    });
    state = reduceDocumentPreprocessorState(state, { type: "toggle-pin", region: "title" });
    state = reduceDocumentPreprocessorState(state, { type: "hover", region: "summary" });
    state = reduceDocumentPreprocessorState(state, { type: "focus", region: "table" });
    expect(getActiveDocumentRegion(state)).toBe("table");

    const hoverLeavesFirst = reduceDocumentPreprocessorState(state, {
      type: "clear-hover",
    });
    expect(getActiveDocumentRegion(hoverLeavesFirst)).toBe("table");
    expect(
      getActiveDocumentRegion(
        reduceDocumentPreprocessorState(hoverLeavesFirst, { type: "clear-focus" })
      )
    ).toBe("title");

    const focusBlursFirst = reduceDocumentPreprocessorState(state, {
      type: "clear-focus",
    });
    expect(getActiveDocumentRegion(focusBlursFirst)).toBe("summary");
    expect(
      getActiveDocumentRegion(
        reduceDocumentPreprocessorState(focusBlursFirst, { type: "clear-hover" })
      )
    ).toBe("title");
  });

  it("resets every interaction channel on close", () => {
    let state = reduceDocumentPreprocessorState(getDocumentPreprocessorState(), {
      type: "toggle",
    });
    state = reduceDocumentPreprocessorState(state, { type: "hover", region: "summary" });
    state = reduceDocumentPreprocessorState(state, { type: "focus", region: "table" });
    state = reduceDocumentPreprocessorState(state, { type: "toggle-pin", region: "title" });
    expect(reduceDocumentPreprocessorState(state, { type: "close" })).toEqual(
      getDocumentPreprocessorState()
    );
  });

  it("ignores source/result events while closed", () => {
    const closed = getDocumentPreprocessorState();
    for (const event of [
      { type: "hover", region: "summary" },
      { type: "focus", region: "summary" },
      { type: "toggle-pin", region: "summary" },
      { type: "clear-hover" },
      { type: "clear-focus" },
    ] as const) {
      expect(reduceDocumentPreprocessorState(closed, event)).toEqual(closed);
    }
  });
});
```

- [ ] **Step 2: Run the focused test and witness a genuine RED.**

```powershell
$node = 'C:\Users\META06\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
& $node '.\node_modules\vitest\vitest.mjs' run lib/document-preprocessor.test.ts
```

Expected: FAIL because `@/lib/document-preprocessor` does not resolve. This failure must occur before creating the module or asset; a test that first runs after implementation does not satisfy this gate.

- [ ] **Step 3: Render only page 1 with the exact bundled script and verify its bytes.**

Run from repository root. The script first binds the source SHA-256, 19-page count, 595×841-point page size, full-page 3× render, and 1785×2523 output size. It writes one WebP and no PDF/PNG or additional page.

```powershell
$python = 'C:\Users\META06\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe'
$sourcePdf = 'C:\Users\META06\Downloads\D26080074.pdf'
$assetDirectory = 'public\images\document-preprocessor'
New-Item -ItemType Directory -Force -Path $assetDirectory | Out-Null

$renderPageOne = @'
import hashlib
from pathlib import Path

import pypdfium2 as pdfium
from PIL import Image

source = Path(r"C:\Users\META06\Downloads\D26080074.pdf")
output = Path(r"public\images\document-preprocessor\customs-2026-07-page-1.webp")
expected_source_sha = "3878FD752938C6E8954E097B7AC9C6D0A97482C86A7125E8919BFB6418011722"

assert hashlib.sha256(source.read_bytes()).hexdigest().upper() == expected_source_sha
document = pdfium.PdfDocument(source)
assert len(document) == 19
page = document[0]
assert page.get_size() == (595.0, 841.0)
image = page.render(scale=3.0).to_pil().convert("RGB")
assert image.size == (1785, 2523)
image.save(output, "WEBP", quality=88, method=6)

reopened = Image.open(output)
assert reopened.format == "WEBP"
assert reopened.size == (1785, 2523)
print(output.as_posix())
print(output.stat().st_size)
print(hashlib.sha256(output.read_bytes()).hexdigest().upper())
'@

$renderPageOne | & $python -
```

Expected output: path `public/images/document-preprocessor/customs-2026-07-page-1.webp`, byte size `216522`, and SHA-256 `7B4B5F0B5A1250A166147899FA834B19A89DE03453350F05DD6CA0FD1AEAF38E`. If the bundled renderer produces different bytes, do not silently update the test: confirm source SHA, dimensions, WebP format, and visual equality, then record the observed renderer/version and exact new SHA in the same commit review.

Open the WebP with the local image viewer. At 100% and fit-to-window, verify: the entire page including `- 1 -` is present; Korean title/body is not garbled; the table’s `수출`, `수입`, `98,959`, `68,567`, `63.0`, and `26.5` remain readable; both bottom charts and their labels are not cropped. Confirm `rg --files public/images/document-preprocessor` returns exactly the WebP.

- [ ] **Step 4: Implement the typed immutable payload and reducer minimally.**

Create `lib/document-preprocessor.ts` with these exact public types, values, and state transitions:

```ts
export type DocumentRegionId = "title" | "summary" | "table" | "chart";
export type DocumentRegionAccent = "orange" | "teal" | "purple" | "sky";

export interface NormalizedRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface NormalizedPoint {
  x: number;
  y: number;
}

type TextResult = { kind: "text" | "list"; lines: readonly string[] };
type TableResult = {
  kind: "table";
  columns: readonly ["구분", "2026년 7월", "전년 동월 대비"];
  rows: readonly [
    { label: "수출"; cells: readonly ["98,959백만 달러", "63.0% 증가"] },
    { label: "수입"; cells: readonly ["68,567백만 달러", "26.5% 증가"] },
  ];
};
type FigureResult = { kind: "figure"; label: string; caption: string };

export interface DocumentRegion {
  id: DocumentRegionId;
  label: "문서 제목" | "요약" | "표" | "차트";
  accessibleName: "문서 제목 선택" | "요약 선택" | "표 선택" | "차트 선택";
  accent: DocumentRegionAccent;
  rect: NormalizedRect;
  marker: {
    point: NormalizedPoint;
    number: "1" | "2" | "3" | "4";
  };
  result: TextResult | TableResult | FigureResult;
}

export interface DocumentPreprocessorDemo {
  sectionId: "document-preprocessor";
  panelId: "document-preprocessor-panel";
  title: string;
  description: string;
  actions: { collapsed: string; expanded: string };
  source: string;
  image: { src: string; width: 1785; height: 2523; alt: string };
  regions: readonly DocumentRegion[];
}

export const documentPreprocessorDemo = {
  sectionId: "document-preprocessor",
  panelId: "document-preprocessor-panel",
  title: "문서 전처리기 구현",
  description: "PDF·DOCX·HWP의 제목·본문·표·차트를 구조 단위로 분리했습니다.",
  actions: { collapsed: "구현 보기", expanded: "접기" },
  source: "출처: 관세청 「2026년 7월 수출입 현황 [확정치]」, 2026. 8. 18., 1쪽",
  image: {
    src: "/images/document-preprocessor/customs-2026-07-page-1.webp",
    width: 1785,
    height: 2523,
    alt: "관세청 2026년 7월 수출입 현황 확정치 보고서 1쪽",
  },
  regions: [
    {
      id: "title",
      label: "문서 제목",
      accessibleName: "문서 제목 선택",
      accent: "orange",
      rect: { x: 0.162, y: 0.157, width: 0.689, height: 0.032 },
      marker: { point: { x: 0.82, y: 0.173 }, number: "1" },
      result: { kind: "text", lines: ["2026년 7월 수출입 현황 [확정치]"] },
    },
    {
      id: "summary",
      label: "요약",
      accessibleName: "요약 선택",
      accent: "teal",
      rect: { x: 0.104, y: 0.198, width: 0.804, height: 0.081 },
      marker: { point: { x: 0.14, y: 0.239 }, number: "2" },
      result: {
        kind: "list",
        lines: [
          "수출 990억 달러, 전년 동월 대비 63.0% 증가",
          "무역수지 304억 달러 흑자",
          "수출 14개월 연속 증가",
        ],
      },
    },
    {
      id: "table",
      label: "표",
      accessibleName: "표 선택",
      accent: "purple",
      rect: { x: 0.16, y: 0.481, width: 0.737, height: 0.145 },
      marker: { point: { x: 0.82, y: 0.554 }, number: "3" },
      result: {
        kind: "table",
        columns: ["구분", "2026년 7월", "전년 동월 대비"],
        rows: [
          { label: "수출", cells: ["98,959백만 달러", "63.0% 증가"] },
          { label: "수입", cells: ["68,567백만 달러", "26.5% 증가"] },
        ],
      },
    },
    {
      id: "chart",
      label: "차트",
      accessibleName: "차트 선택",
      accent: "sky",
      rect: { x: 0.157, y: 0.735, width: 0.743, height: 0.189 },
      marker: { point: { x: 0.18, y: 0.83 }, number: "4" },
      result: { kind: "figure", label: "월별 수출입 현황", caption: "수출입 추이" },
    },
  ],
} as const satisfies DocumentPreprocessorDemo;

const DOCUMENT_REGION_MARKER_SIZE = 44;

export function getDocumentRegionMarkerBounds(
  region: DocumentRegion,
  preview: { width: number; height: number }
) {
  const halfSize = DOCUMENT_REGION_MARKER_SIZE / 2;
  const centerX = region.marker.point.x * preview.width;
  const centerY = region.marker.point.y * preview.height;
  return {
    left: centerX - halfSize,
    top: centerY - halfSize,
    right: centerX + halfSize,
    bottom: centerY + halfSize,
  };
}

export interface DocumentPreprocessorState {
  isOpen: boolean;
  hoveredRegion: DocumentRegionId | null;
  focusedRegion: DocumentRegionId | null;
  pinnedRegion: DocumentRegionId | null;
}

export type DocumentPreprocessorEvent =
  | { type: "toggle" }
  | { type: "hover"; region: DocumentRegionId }
  | { type: "clear-hover" }
  | { type: "focus"; region: DocumentRegionId }
  | { type: "clear-focus" }
  | { type: "toggle-pin"; region: DocumentRegionId }
  | { type: "close" };

export function getDocumentPreprocessorState(): DocumentPreprocessorState {
  return {
    isOpen: false,
    hoveredRegion: null,
    focusedRegion: null,
    pinnedRegion: null,
  };
}

export function getActiveDocumentRegion(
  state: DocumentPreprocessorState
): DocumentRegionId | null {
  return state.focusedRegion ?? state.hoveredRegion ?? state.pinnedRegion;
}

export function reduceDocumentPreprocessorState(
  state: DocumentPreprocessorState,
  event: DocumentPreprocessorEvent
): DocumentPreprocessorState {
  if (event.type === "close") return getDocumentPreprocessorState();
  if (event.type === "toggle") {
    return state.isOpen
      ? getDocumentPreprocessorState()
      : {
          isOpen: true,
          hoveredRegion: null,
          focusedRegion: null,
          pinnedRegion: null,
        };
  }
  if (!state.isOpen) return state;
  if (event.type === "hover") return { ...state, hoveredRegion: event.region };
  if (event.type === "clear-hover") return { ...state, hoveredRegion: null };
  if (event.type === "focus") return { ...state, focusedRegion: event.region };
  if (event.type === "clear-focus") return { ...state, focusedRegion: null };
  return {
    ...state,
    pinnedRegion: state.pinnedRegion === event.region ? null : event.region,
  };
}
```

- [ ] **Step 5: Run GREEN checks and review the owned diff.**

```powershell
$node = 'C:\Users\META06\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
& $node '.\node_modules\vitest\vitest.mjs' run lib/document-preprocessor.test.ts
& $node '.\node_modules\typescript\bin\tsc' --noEmit
git diff --check
git diff -- lib/document-preprocessor.ts lib/document-preprocessor.test.ts
git status --short -- public/images/document-preprocessor lib/document-preprocessor.ts lib/document-preprocessor.test.ts
```

Expected: focused Vitest PASS, TypeScript PASS, no whitespace errors, one WebP plus two library files only. Re-run the local image inspection after the final asset bytes are in place.

- [ ] **Step 6: Commit only Task 1.**

```powershell
git add -- public/images/document-preprocessor/customs-2026-07-page-1.webp lib/document-preprocessor.ts lib/document-preprocessor.test.ts
git diff --cached --name-only
git commit -m "feat: add document preprocessor data contract"
```

Expected staged names are exactly the three Task 1 paths; no PDF, other rendered page, `.contentlayer` file, or `birthday-gf` path is staged.

### Task 2: Build the Accessible Portfolio-Scoped Inline Demo

**Files:**

- Create: `components/portfolio/document-preprocessor-section.tsx`
- Create: `components/portfolio/document-preprocessor-demo.tsx`
- Modify: `app/portfolio/page.tsx`
- Test: reuse `lib/document-preprocessor.test.ts` from Task 1; no DOM test dependency is added

**Interfaces:**

- Consumes `documentPreprocessorDemo`, `DocumentRegion`, `DocumentRegionId`, `getDocumentPreprocessorState`, `getActiveDocumentRegion`, and `reduceDocumentPreprocessorState` exactly as Task 1 exports them. Region marker point/number and its 44px bounds helper also stay in the shared data boundary.
- Produces `<DocumentPreprocessorSection />`, whose only responsibilities are the `Section` placement, static card title/description, and card shell.
- Produces client `<DocumentPreprocessorDemo />`, whose only responsibilities are the expansion action, reducer state, focus restoration, responsive panel, and synchronized source/result actions.
- `app/portfolio/page.tsx` imports from `@/components/portfolio/document-preprocessor-section` and inserts one instance immediately after `<ProjectList />` and before `<SkillGroups />` without changing portfolio metadata.

- [ ] **Step 1: Re-run the focused helper contract before UI work.**

```powershell
$node = 'C:\Users\META06\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
& $node '.\node_modules\vitest\vitest.mjs' run lib/document-preprocessor.test.ts
```

Expected: PASS. This is the locked mouse/keyboard/touch state contract. If it fails, stop; Task 2 must consume rather than redefine it.

- [ ] **Step 2: Add the section shell and exact portfolio placement.**

Create `components/portfolio/document-preprocessor-section.tsx`:

```tsx
import { DocumentPreprocessorDemo } from "@/components/portfolio/document-preprocessor-demo";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { documentPreprocessorDemo } from "@/lib/document-preprocessor";

export function DocumentPreprocessorSection() {
  return (
    <Section id={documentPreprocessorDemo.sectionId} eyebrow="Document Parsing" wide>
      <Card>
        <div className="flex flex-wrap items-start gap-4">
          <div className="min-w-0 flex-1">
            <h2 className="break-keep text-heading-3 text-ink">
              {documentPreprocessorDemo.title}
            </h2>
            <p className="mt-2 break-keep text-body-sm text-ink-secondary">
              {documentPreprocessorDemo.description}
            </p>
          </div>
          <DocumentPreprocessorDemo />
        </div>
      </Card>
    </Section>
  );
}
```

Modify `app/portfolio/page.tsx` only by importing `DocumentPreprocessorSection` and placing `<DocumentPreprocessorSection />` between `<ProjectList />` and `<SkillGroups />`. Keep title, description, canonical, and Open Graph URL unchanged.

- [ ] **Step 3: Implement the client reducer wiring, semantic results, and synchronized actions.**

Create `components/portfolio/document-preprocessor-demo.tsx` with `"use client"`, `next/image`, `useReducer`, and `useRef`. Keep all visible data, marker point/number, and interaction-state decisions in `documentPreprocessorDemo` and its shared pure helpers; the only local mappings are static Tailwind class selections keyed by accent:

```tsx
"use client";

import Image from "next/image";
import { useReducer, useRef } from "react";
import {
  documentPreprocessorDemo,
  getActiveDocumentRegion,
  getDocumentPreprocessorState,
  reduceDocumentPreprocessorState,
  type DocumentRegion,
  type DocumentRegionId,
} from "@/lib/document-preprocessor";

const accentStyles = {
  orange: "border-accent-orange bg-accent-orange/10",
  teal: "border-accent-teal bg-accent-teal/10",
  purple: "border-accent-purple bg-accent-purple/10",
  sky: "border-accent-sky bg-accent-sky/10",
};

const accentBorderStyles = {
  orange: "border-accent-orange",
  teal: "border-accent-teal",
  purple: "border-accent-purple",
  sky: "border-accent-sky",
};

function ResultContent({ region }: { region: DocumentRegion }) {
  const { result } = region;
  if (result.kind === "text") {
    return <h4 className="mt-2 text-body-md font-semibold text-ink">{result.lines[0]}</h4>;
  }
  if (result.kind === "list") {
    return (
      <ul className="mt-2 space-y-1 text-body-sm text-ink-secondary">
        {result.lines.map((line) => <li key={line}>{line}</li>)}
      </ul>
    );
  }
  if (result.kind === "table") {
    return (
      <div className="mt-2 overflow-hidden rounded-md border border-hairline">
        <table className="w-full table-fixed text-left text-caption text-ink-secondary">
          <thead className="bg-canvas-soft text-ink">
            <tr>{result.columns.map((column) => <th key={column} scope="col" className="p-2">{column}</th>)}</tr>
          </thead>
          <tbody>
            {result.rows.map((row) => (
              <tr key={row.label} className="border-t border-hairline">
                <th scope="row" className="p-2 text-ink">{row.label}</th>
                {row.cells.map((cell) => <td key={cell} className="break-words p-2">{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  return (
    <figure className="mt-2 text-body-sm text-ink-secondary">
      <p className="font-medium text-ink">{result.label}</p>
      <figcaption>{result.caption}</figcaption>
    </figure>
  );
}

export function DocumentPreprocessorDemo() {
  const [state, dispatch] = useReducer(
    reduceDocumentPreprocessorState,
    undefined,
    getDocumentPreprocessorState
  );
  const actionRef = useRef<HTMLButtonElement>(null);
  const activeRegion = getActiveDocumentRegion(state);

  const hover = (region: DocumentRegionId) => dispatch({ type: "hover", region });
  const clearHover = () => dispatch({ type: "clear-hover" });
  const focus = (region: DocumentRegionId) => dispatch({ type: "focus", region });
  const clearFocus = () => dispatch({ type: "clear-focus" });
  const togglePin = (region: DocumentRegionId) => dispatch({ type: "toggle-pin", region });
  const toggleOpen = () => {
    if (!state.isOpen) {
      dispatch({ type: "toggle" });
      return;
    }
    dispatch({ type: "close" });
    window.requestAnimationFrame(() => actionRef.current?.focus());
  };

  return (
    <>
      <button
        ref={actionRef}
        type="button"
        aria-expanded={state.isOpen}
        aria-controls={documentPreprocessorDemo.panelId}
        onClick={toggleOpen}
        className="inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-button text-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
      >
        {state.isOpen
          ? documentPreprocessorDemo.actions.expanded
          : documentPreprocessorDemo.actions.collapsed}
      </button>

      {state.isOpen && (
        <div id={documentPreprocessorDemo.panelId} className="basis-full pt-6">
          <div className="grid gap-6 rounded-lg border border-hairline bg-surface p-4 sm:grid-cols-2 sm:p-6">
            <div>
              <h3 className="mb-3 text-title text-ink">원본 1쪽</h3>
              <div className="relative overflow-hidden rounded-md border border-hairline bg-canvas-soft">
                <Image
                  src={documentPreprocessorDemo.image.src}
                  width={documentPreprocessorDemo.image.width}
                  height={documentPreprocessorDemo.image.height}
                  alt={documentPreprocessorDemo.image.alt}
                  sizes="(min-width: 768px) 42vw, 100vw"
                  className="h-auto w-full"
                />
                {documentPreprocessorDemo.regions.map((region) => {
                  const active = activeRegion === region.id;
                  return (
                    <div
                      key={`${region.id}-outline`}
                      aria-hidden="true"
                      style={{
                        left: `${region.rect.x * 100}%`,
                        top: `${region.rect.y * 100}%`,
                        width: `${region.rect.width * 100}%`,
                        height: `${region.rect.height * 100}%`,
                      }}
                      className={`pointer-events-none absolute rounded-xs border-2 transition-colors motion-reduce:transition-none ${accentStyles[region.accent]} ${active ? "outline outline-2 outline-offset-2 outline-primary" : ""}`}
                    >
                      <span className="absolute left-0 top-0 bg-surface px-1 text-eyebrow text-ink">
                        {region.label}
                      </span>
                    </div>
                  );
                })}
                {documentPreprocessorDemo.regions.map((region) => {
                  const active = activeRegion === region.id;
                  return (
                    <button
                      key={region.id}
                      type="button"
                      aria-label={region.accessibleName}
                      aria-pressed={state.pinnedRegion === region.id}
                      onMouseEnter={() => hover(region.id)}
                      onMouseLeave={clearHover}
                      onFocus={() => focus(region.id)}
                      onBlur={clearFocus}
                      onClick={() => togglePin(region.id)}
                      style={{
                        left: `${region.marker.point.x * 100}%`,
                        top: `${region.marker.point.y * 100}%`,
                      }}
                      className={`absolute z-10 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 bg-surface text-button text-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-surface motion-reduce:transition-none ${accentBorderStyles[region.accent]} ${active ? "outline outline-2 outline-primary" : ""}`}
                    >
                      <span aria-hidden="true">{region.marker.number}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-title text-ink">구조 결과</h3>
              <div className="space-y-3">
                {documentPreprocessorDemo.regions.map((region) => {
                  const active = activeRegion === region.id;
                  return (
                    <div key={region.id} className="rounded-md border border-hairline p-3">
                      <button
                        type="button"
                        aria-label={region.accessibleName}
                        aria-pressed={state.pinnedRegion === region.id}
                        onMouseEnter={() => hover(region.id)}
                        onMouseLeave={clearHover}
                        onFocus={() => focus(region.id)}
                        onBlur={clearFocus}
                        onClick={() => togglePin(region.id)}
                        className={`flex min-h-11 w-full items-center gap-2 rounded-md text-left text-button text-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-surface motion-reduce:transition-none ${active ? "outline outline-2 outline-primary" : ""}`}
                      >
                        <span aria-hidden="true" className={`flex h-6 w-6 items-center justify-center rounded-full border text-caption ${accentStyles[region.accent]}`}>
                          {region.marker.number}
                        </span>
                        <span>{region.label}</span>
                      </button>
                      <ResultContent region={region} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <p className="mt-3 text-caption text-ink-muted">{documentPreprocessorDemo.source}</p>
        </div>
      )}
    </>
  );
}
```

Implementation review rules for this code:

- Do not add click/keyboard handlers to `Card`, `Section`, title, description, or panel; native action-button activation is the only expansion entry point.
- Keep the panel as the action button’s next DOM sibling. Do not add Escape handling.
- Source and result controls dispatch the same reducer events. Native button click supplies Enter/Space and touch behavior; do not duplicate `onKeyDown` and accidentally double-toggle.
- `focusedRegion ?? hoveredRegion ?? pinnedRegion` determines the active pair. `mouseleave` clears only hover and `blur` clears only focus, so mixed mouse/keyboard input cannot erase the other transient state; clearing both reveals a pin. Default open has no active outline.
- Render each exact source rect as a `pointer-events-none` outline. Put one 44×44 numbered marker button with its center inside that rect; do not inflate the shallow rect into the hit target. Shared marker data and bounds tests must prove the four targets remain inside the image and non-overlapping at supported small/large previews.
- The result action is a sibling of semantic content, not a button wrapping a table/figure. Preserve valid heading/list/table/figure/figcaption markup.
- Do not draw mobile connector lines. If a short desktop guide is judged necessary during visual QA, it must be `hidden sm:block`, `aria-hidden`, non-crossing, and made from `border-hairline`; omission is preferred because matching labels/outlines already communicate the relationship.

- [ ] **Step 4: Run focused GREEN, typecheck, build, and exact static assertions.**

```powershell
$node = 'C:\Users\META06\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
& $node '.\node_modules\vitest\vitest.mjs' run lib/document-preprocessor.test.ts
& $node '.\node_modules\typescript\bin\tsc' --noEmit
rg -n '<Hero|<About|<CareerTimeline|<ProjectList|<DocumentPreprocessorSection|<SkillGroups' app/portfolio/page.tsx
rg -n 'Chroma|Elasticsearch|BGE|indexing|정확도|고객사|내부 네트워크' components/portfolio lib/document-preprocessor.ts
$contentlayerBefore = Join-Path $env:TEMP 'chanlog-contentlayer-before-task2-build.patch'
git diff --binary -- .contentlayer | Set-Content -NoNewline -LiteralPath $contentlayerBefore
& $node '.\node_modules\next\dist\bin\next' build
$generatedChanges = @(git diff --name-only -- .contentlayer)
foreach ($path in $generatedChanges) { git diff --stat -- $path; git diff -- $path }
if ($generatedChanges.Count -gt 0) { git restore --source=HEAD -- $generatedChanges }
if ((Get-Item -LiteralPath $contentlayerBefore).Length -gt 0) {
  git apply --whitespace=nowarn $contentlayerBefore
}
Remove-Item -LiteralPath $contentlayerBefore
git status --short -- .contentlayer
```

Expected: focused test PASS; TypeScript PASS; portfolio grep shows the exact six components in order; forbidden-content grep has no output; Next build PASS. Every `$generatedChanges` entry is inspected and under `.contentlayer/`; the final generated status exactly matches its pre-build state.

- [ ] **Step 5: Perform runtime and responsive interaction QA with the existing in-app browser.**

Start the built app using bundled Node and a hidden process:

```powershell
$node = 'C:\Users\META06\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
$server = Start-Process -FilePath $node -ArgumentList @('.\node_modules\next\dist\bin\next','start','--hostname','127.0.0.1','--port','3100') -PassThru -WindowStyle Hidden
```

Open `http://127.0.0.1:3100/portfolio#document-preprocessor` in the existing in-app browser; do not install Chromium or any browser package. Assert all of the following manually and record pass/fail in the execution handoff:

1. The hash lands on the visible `document-preprocessor` section and the Portfolio nav tab is active; canonical remains `/portfolio`.
2. Initial card is collapsed. Hovering/focusing/clicking card whitespace/title/description does not open it or alter height. Action click, Enter, and Space each toggle; its visible label and `aria-expanded` change and `aria-controls="document-preprocessor-panel"` resolves to the immediately following panel.
3. Opening is neutral: all four results are visible and no source/result region is selected.
4. For every one of title/summary/table/chart, hover and keyboard focus on either source or result highlights the matching pair. Leaving clears a preview when unpinned. Click/Enter/Space pins; the matching two actions report `aria-pressed="true"`; repeating unpins; choosing another replaces the pin.
5. Clicking `접기` clears preview/pin, removes the panel, and visibly returns focus to the action. Reopening is neutral. Escape does nothing special.
6. At a desktop viewport of 1280×900, the actual full-page image and results are two columns in one flat white hairline card; all four overlays cover their real title/summary/table/chart positions; table/chart content is legible; there are no crossing connectors or added shadows.
7. At a mobile viewport of 390×844, source appears before results, the complete page ratio is preserved, table/chart remain legible without horizontal scroll, every action has a practical 44px target, and no connector appears.
8. Keyboard tab order is expansion action → source title/summary/table/chart → result title/summary/table/chart; focus rings are visible and do not rely on accent color alone. With reduced motion enabled, feedback is immediate and no new entrance animation plays.
9. Source line is exact and has no anchor. There are no chips, architecture prose, performance figures, customer/internal data, or technology names prohibited by Global Constraints.

If the in-app browser is unavailable, use production emitted HTML to prove section id, copy, image URL, panel/button names, and metadata, and use the local image viewer for the WebP. Record residual QA exactly: HTTP/HTML/image inspection cannot prove client reducer behavior, focus return, responsive two-column/stack geometry, hover/focus rings, 44px measured targets, or reduced-motion rendering; those items remain a human browser gate before merge.

Stop only the captured server process:

```powershell
if ($server -and -not $server.HasExited) { Stop-Process -Id $server.Id }
```

- [ ] **Step 6: Review and commit only Task 2.**

```powershell
git diff --check
git diff -- components/portfolio/document-preprocessor-section.tsx components/portfolio/document-preprocessor-demo.tsx app/portfolio/page.tsx
git add -- components/portfolio/document-preprocessor-section.tsx components/portfolio/document-preprocessor-demo.tsx app/portfolio/page.tsx
git diff --cached --name-only
git commit -m "feat: embed document preprocessor in portfolio"
```

Expected staged names are exactly the three Task 2 files. `CLAUDE.md`, Navbar, route removal, redirect, and sitemap remain untouched until Task 3.

### Task 3: Retire the Standalone Route and Prove Redirect/SEO Contracts

**Files:**

- Modify: `lib/navigation.ts`
- Modify: `lib/navigation.test.ts`
- Modify: `lib/metadata.test.ts`
- Create: `lib/sitemap.ts`
- Create: `lib/sitemap.test.ts`
- Create: `lib/routing.test.ts`
- Modify: `app/sitemap.ts`
- Modify: `next.config.js`
- Modify: `CLAUDE.md`
- Delete: `app/pipeline/page.tsx`
- Delete: `components/pipeline/chunking-view.tsx`
- Delete: `components/pipeline/extraction-compare.tsx`
- Delete: `components/pipeline/index-view.tsx`
- Delete: `components/pipeline/pipeline-flow.tsx`
- Delete: `components/pipeline/pipeline-section.tsx`
- Delete: `lib/pipeline.ts`
- Delete: `lib/pipeline.test.ts`
- Verify unchanged: `components/navbar.tsx`, `app/page.tsx`, `app/posts/[slug]/page.tsx`, `components/footer.tsx`, archive components/content, and nested `birthday-gf`

**Interfaces:**

- Changes `NAV_ITEMS` to exactly archive and portfolio and changes `getActiveNavHref(pathname)` return type to `"/" | "/portfolio" | undefined`; `/pipeline` is no longer an active rendered tab.
- Produces `createSitemapEntries(posts: readonly SitemapPost[], generatedOn: string): MetadataRoute.Sitemap`, returning root, portfolio, then post detail entries only.
- Produces `next.config.js` redirects in preserved order: `/posts` → `/` permanent, then `/pipeline` → `/portfolio#document-preprocessor` permanent.
- Deletes every standalone pipeline consumer and provider only after import search proves the Task 2 portfolio has no dependency on them.
- Keeps `createLandingMetadata` unchanged; metadata tests retain archive and portfolio only, and production HTML proves `/portfolio` canonical/OG values.

**Official Next.js 14 redirect ruling:** [Next.js 14 redirect documentation](https://nextjs.org/docs/14/pages/building-your-application/routing/redirecting) documents `permanent: true` as a 308 config redirect but does not explicitly guarantee fragment preservation. In v14.2.0, [`prepareDestination`](https://github.com/vercel/next.js/blob/v14.2.0/packages/next/src/shared/lib/router/utils/prepare-destination.ts) constructs the destination path from pathname plus hash and restores the parsed hash; [`router-server.ts`](https://github.com/vercel/next.js/blob/v14.2.0/packages/next/src/server/lib/router-server.ts) serializes the parsed URL into `Location`. This project actually runs 14.0.3, whose installed source has the same pathname/hash construction and URL serialization, but the binding decision is the exact `next build && next start` raw-header test below—not inference from 14.2 source.

If 14.0.3 strips the fragment, stop and record a routing ruling in `CLAUDE.md` containing the tested config, observed status/raw Location, and rejected behavior. Test a fragment-preserving HTTP destination form supported by the same framework config; do not guess from client navigation. If no framework target form preserves it, use only the spec’s final fallback: permanent 308 to `/portfolio`, then focus and scroll the existing `document-preprocessor` section without creating a `/pipeline` page/canonical, fragment sitemap entry, or programmatic navigation. Record that fallback and its production evidence in `CLAUDE.md`. Do not silently accept `Location: /portfolio` while claiming the primary contract passed.

- [ ] **Step 1: Write failing navigation, redirect, sitemap, and route-absence tests.**

Replace only the relevant expectations in `lib/navigation.test.ts`:

```ts
it("exposes the exact page tabs in order", () => {
  expect(NAV_ITEMS).toEqual([
    { label: "아카이브", href: "/" },
    { label: "포트폴리오", href: "/portfolio" },
  ]);
});

it("maps only rendered archive/post/portfolio paths", () => {
  expect(getActiveNavHref("/")).toBe("/");
  expect(getActiveNavHref("/posts")).toBe("/");
  expect(getActiveNavHref("/posts/my-first-post")).toBe("/");
  expect(getActiveNavHref("/portfolio")).toBe("/portfolio");
  expect(getActiveNavHref("/pipeline")).toBeUndefined();
  expect(getActiveNavHref("/missing")).toBeUndefined();
});
```

Create `lib/sitemap.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { createSitemapEntries } from "@/lib/sitemap";

describe("sitemap entries", () => {
  it("contains canonical archive, portfolio, and post URLs only", () => {
    const entries = createSitemapEntries(
      [{ slug: "my-first-post", publishedAt: "2023-12-06" }],
      "2026-08-21"
    );
    expect(entries).toEqual([
      { url: "https://chanlog.blog", lastModified: "2026-08-21" },
      { url: "https://chanlog.blog/portfolio", lastModified: "2026-08-21" },
      { url: "https://chanlog.blog/posts/my-first-post", lastModified: "2023-12-06" },
    ]);
    expect(entries.map((entry) => entry.url).join("\n")).not.toMatch(
      /\/pipeline|\/posts$|#document-preprocessor/
    );
  });
});
```

Create `lib/routing.test.ts`:

```ts
import { createRequire } from "node:module";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const require = createRequire(import.meta.url);
const nextConfig = require(resolve("next.config.js")) as {
  redirects(): Promise<Array<{ source: string; destination: string; permanent: boolean }>>;
};

describe("legacy redirects and route removal", () => {
  it("preserves posts and adds the exact pipeline fragment redirect", async () => {
    expect(await nextConfig.redirects()).toEqual([
      { source: "/posts", destination: "/", permanent: true },
      {
        source: "/pipeline",
        destination: "/portfolio#document-preprocessor",
        permanent: true,
      },
    ]);
  });

  it("has no App Router pipeline landing page", () => {
    expect(existsSync(resolve("app/pipeline/page.tsx"))).toBe(false);
  });
});
```

In `lib/metadata.test.ts`, remove the `pipeline` case and retain the exact archive/portfolio title, description, canonical-input, and complete Open Graph assertions. Immediately after `const metadata = createLandingMetadata({ title, description, url });` add `expect(metadata.alternates).toEqual({ canonical: url });`. Add a repository-bound absence check, including these imports:

```ts
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

it("keeps portfolio canonical metadata and removes pipeline landing metadata", () => {
  const portfolioPage = readFileSync(resolve("app/portfolio/page.tsx"), "utf8");
  expect(portfolioPage).toContain('url: "https://chanlog.blog/portfolio"');
  expect(portfolioPage).not.toContain("chanlog.blog/pipeline");
  expect(existsSync(resolve("app/pipeline/page.tsx"))).toBe(false);
});
```

- [ ] **Step 2: Run the routing tests and witness RED before deletion/config changes.**

```powershell
$node = 'C:\Users\META06\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
& $node '.\node_modules\vitest\vitest.mjs' run lib/navigation.test.ts lib/metadata.test.ts lib/sitemap.test.ts lib/routing.test.ts
```

Expected: FAIL for the third `파이프라인` nav item, missing `@/lib/sitemap`, absent `/pipeline` redirect, and the still-present `app/pipeline/page.tsx`. Capture this output before implementation.

- [ ] **Step 3: Implement navigation, sitemap helper, redirect, and route deletion.**

Change `lib/navigation.ts` to:

```ts
export const NAV_ITEMS = [
  { label: "아카이브", href: "/" },
  { label: "포트폴리오", href: "/portfolio" },
] as const;

export function getActiveNavHref(
  pathname: string | null
): "/" | "/portfolio" | undefined {
  if (pathname === "/" || pathname === "/posts" || pathname?.startsWith("/posts/")) return "/";
  if (pathname === "/portfolio") return "/portfolio";
  return undefined;
}
```

Keep contact/action helpers unchanged. `components/navbar.tsx` already renders `NAV_ITEMS`, so leave that file byte-for-byte unchanged. Verify the reduced array yields desktop `아카이브 → 포트폴리오 → divider → Contact → GitHub` and the existing mobile two-row arrangement. Do not create a replacement pipeline link or special active rule.

Create `lib/sitemap.ts`:

```ts
import type { MetadataRoute } from "next";

const SITE_URL = "https://chanlog.blog";

export interface SitemapPost {
  slug: string;
  publishedAt: string;
}

export function createSitemapEntries(
  posts: readonly SitemapPost[],
  generatedOn: string
): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, lastModified: generatedOn },
    { url: `${SITE_URL}/portfolio`, lastModified: generatedOn },
    ...posts.map((post) => ({
      url: `${SITE_URL}/posts/${post.slug}`,
      lastModified: post.publishedAt,
    })),
  ];
}
```

Replace `app/sitemap.ts` assembly with:

```ts
import { allPosts } from "contentlayer/generated";
import { createSitemapEntries } from "@/lib/sitemap";

export default function sitemap() {
  return createSitemapEntries(
    allPosts,
    new Date().toISOString().split("T")[0]
  );
}
```

Preserve the existing `/posts` object and append this exact object in `next.config.js`:

```js
{
  source: "/pipeline",
  destination: "/portfolio#document-preprocessor",
  permanent: true,
},
```

Before deleting anything, run:

```powershell
rg -n 'components/pipeline|@/lib/pipeline|PipelineSection|pipelineStages|demoDocuments|extractionComparison|indexTargets|pipelineStack' app components lib --glob '!app/pipeline/page.tsx' --glob '!components/pipeline/**' --glob '!lib/pipeline.ts' --glob '!lib/pipeline.test.ts'
```

Expected: no consumer outside the exact deletion set. Then delete only these eight exact source/test files with individual `Remove-Item -LiteralPath` calls; do not recursively delete a directory:

```powershell
Remove-Item -LiteralPath 'app/pipeline/page.tsx'
Remove-Item -LiteralPath 'components/pipeline/chunking-view.tsx'
Remove-Item -LiteralPath 'components/pipeline/extraction-compare.tsx'
Remove-Item -LiteralPath 'components/pipeline/index-view.tsx'
Remove-Item -LiteralPath 'components/pipeline/pipeline-flow.tsx'
Remove-Item -LiteralPath 'components/pipeline/pipeline-section.tsx'
Remove-Item -LiteralPath 'lib/pipeline.ts'
Remove-Item -LiteralPath 'lib/pipeline.test.ts'
```

Leave empty directories alone; Git does not track them. Re-run the import search and require no output.

- [ ] **Step 4: Update project guidance as the sole documentation-integration owner.**

Edit `CLAUDE.md` in this task only:

- Overview routes: `/` archive, `/portfolio` portfolio including the inline document preprocessor, `/pipeline` permanent 308 legacy redirect to `/portfolio#document-preprocessor`, and `/posts/[slug]` post detail. State that `/pipeline` has no page/canonical/nav/sitemap entry.
- Commands: replace npm/npx examples with the bundled Node/local CLI commands used in this plan, while keeping the semantic labels test/typecheck/build/dev clear.
- Structure: replace `components/pipeline` with `components/portfolio`; replace `lib/pipeline.ts` with `lib/document-preprocessor.ts`; state section shell versus client demo responsibilities.
- Data rule: profile data stays in `lib/profile.ts`; inline demo copy/image/source/rectangles/semantic results/state contract live only in `lib/document-preprocessor.ts`.
- Design authority: add `docs/superpowers/specs/2026-08-21-inline-document-preprocessor-design.md` and state its limited supersession of the two earlier specs while their archive/shared design/safety requirements continue.
- Safety: preserve public-source-only content, the single page-1 derivative, no customer/internal/quantitative claims, and no forbidden technology detail in this demo.

If the production fragment test selects a fallback, add the measured redirect ruling described in this task’s Official Next.js 14 redirect ruling. Otherwise document the primary exact redirect only.

- [ ] **Step 5: Run focused GREEN and static preservation checks.**

```powershell
$node = 'C:\Users\META06\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
& $node '.\node_modules\vitest\vitest.mjs' run lib/navigation.test.ts lib/metadata.test.ts lib/sitemap.test.ts lib/routing.test.ts
& $node '.\node_modules\typescript\bin\tsc' --noEmit
rg -n '파이프라인|/pipeline' lib/navigation.ts components/navbar.tsx app/sitemap.ts lib/sitemap.ts
rg -n 'components/pipeline|@/lib/pipeline|PipelineSection|pipelineStages|demoDocuments|extractionComparison|indexTargets|pipelineStack' app components lib
rg -n 'createLandingMetadata|https://chanlog.blog/portfolio' app/portfolio/page.tsx
```

Expected: focused tests PASS; TypeScript PASS; first grep has no output; second grep has no output; portfolio metadata grep shows the unchanged helper and exact canonical URL.

- [ ] **Step 6: Run full build and exact production HTTP/header assertions.**

```powershell
$node = 'C:\Users\META06\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
& $node '.\node_modules\vitest\vitest.mjs' run
& $node '.\node_modules\typescript\bin\tsc' --noEmit
$contentlayerBefore = Join-Path $env:TEMP 'chanlog-contentlayer-before-task3-build.patch'
git diff --binary -- .contentlayer | Set-Content -NoNewline -LiteralPath $contentlayerBefore
& $node '.\node_modules\next\dist\bin\next' build
$generatedChanges = @(git diff --name-only -- .contentlayer)
foreach ($path in $generatedChanges) { git diff --stat -- $path; git diff -- $path }
if ($generatedChanges.Count -gt 0) { git restore --source=HEAD -- $generatedChanges }
if ((Get-Item -LiteralPath $contentlayerBefore).Length -gt 0) {
  git apply --whitespace=nowarn $contentlayerBefore
}
Remove-Item -LiteralPath $contentlayerBefore
git status --short -- .contentlayer
```

Expected: all Vitest files PASS, TypeScript PASS, Next production build PASS, and route output has no rendered `/pipeline` page. Every generated diff is inspected and the final `.contentlayer` status matches its pre-build state before starting the server.

Start production and run raw assertions. This uses Node’s `http` API so automatic redirect following cannot hide the status or raw Location value:

```powershell
$server = Start-Process -FilePath $node -ArgumentList @('.\node_modules\next\dist\bin\next','start','--hostname','127.0.0.1','--port','3100') -PassThru -WindowStyle Hidden

$httpAssertions = @'
const http = require("node:http");
const assert = require("node:assert/strict");

function request(path) {
  return new Promise((resolve, reject) => {
    http.get({ host: "127.0.0.1", port: 3100, path }, (response) => {
      let body = "";
      response.setEncoding("utf8");
      response.on("data", (chunk) => (body += chunk));
      response.on("end", () => resolve({ response, body }));
    }).on("error", reject);
  });
}

(async () => {
  let result;
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try { result = await request("/"); break; }
    catch { await new Promise((resolve) => setTimeout(resolve, 1000)); }
  }
  assert.ok(result, "production server did not become ready");

  const pipeline = await request("/pipeline");
  assert.equal(pipeline.response.statusCode, 308);
  const locationIndex = pipeline.response.rawHeaders.findIndex(
    (value) => value.toLowerCase() === "location"
  );
  assert.notEqual(locationIndex, -1);
  assert.equal(
    pipeline.response.rawHeaders[locationIndex + 1],
    "/portfolio#document-preprocessor"
  );

  const descendant = await request("/pipeline/example");
  assert.equal(descendant.response.statusCode, 404);

  const posts = await request("/posts");
  assert.equal(posts.response.statusCode, 308);
  assert.equal(posts.response.headers.location, "/");

  const portfolio = await request("/portfolio");
  assert.equal(portfolio.response.statusCode, 200);
  assert.match(portfolio.body, /id="document-preprocessor"/);
  assert.match(portfolio.body, /문서 전처리기 구현/);
  assert.match(portfolio.body, /rel="canonical" href="https:\/\/chanlog\.blog\/portfolio"/);
  assert.doesNotMatch(portfolio.body, /chanlog\.blog\/pipeline/);

  const sitemap = await request("/sitemap.xml");
  assert.equal(sitemap.response.statusCode, 200);
  assert.match(sitemap.body, /<loc>https:\/\/chanlog\.blog<\/loc>/);
  assert.match(sitemap.body, /<loc>https:\/\/chanlog\.blog\/portfolio<\/loc>/);
  assert.doesNotMatch(sitemap.body, /\/pipeline|#document-preprocessor|<loc>https:\/\/chanlog\.blog\/posts<\/loc>/);

  const post = await request("/posts/my-first-post");
  assert.equal(post.response.statusCode, 200);
  assert.match(post.body, /잊조림/);

  const archive = await request("/");
  assert.equal(archive.response.statusCode, 200);
  for (const path of [
    "%2Fimages%2F5-omc%2Fimage.png",
    "%2Fimages%2F4-wrapper%2Fthumb.png",
    "%2Fimages%2F3-docker%2Fthumb.png",
    "%2Fimages%2F1-first%2Fbg.jpg",
  ]) assert.match(archive.body, new RegExp(path));
  for (const label of ["Contact", "GitHub", "Instagram"]) assert.match(archive.body, new RegExp(label));

  console.log("production HTTP assertions passed");
})().catch((error) => { console.error(error); process.exit(1); });
'@

& $node -e $httpAssertions
$httpExitCode = $LASTEXITCODE
if ($server -and -not $server.HasExited) { Stop-Process -Id $server.Id }
if ($httpExitCode -ne 0) { throw "Production HTTP assertions failed with exit code $httpExitCode" }
```

Expected: `production HTTP assertions passed`. The binding primary result is status exactly 308 and raw Location value exactly `/portfolio#document-preprocessor`. `/pipeline/example` is 404, not redirected. If the fragment assertion fails, follow the recorded fallback decision process above and repeat build/start/assertions before claiming success.

- [ ] **Step 7: Run final browser preservation QA and commit Task 3.**

In the existing in-app browser, check desktop and mobile Navbar order/two-row layout and active tabs on `/`, `/portfolio#document-preprocessor`, and `/posts/my-first-post`. Confirm `/pipeline` reaches the inline section, archive thumbnail cards and all current posts remain, post detail remains, and Footer still renders Contact/GitHub/Instagram. Re-run Task 2 interaction/visual assertions after redirect arrival.

Then review and commit:

```powershell
git diff --check
git status --short
git diff -- next.config.js lib/navigation.ts lib/navigation.test.ts lib/metadata.test.ts lib/sitemap.ts lib/sitemap.test.ts lib/routing.test.ts app/sitemap.ts CLAUDE.md app/pipeline components/pipeline lib/pipeline.ts lib/pipeline.test.ts
git diff --exit-code -- components/navbar.tsx
git add -- next.config.js lib/navigation.ts lib/navigation.test.ts lib/metadata.test.ts lib/sitemap.ts lib/sitemap.test.ts lib/routing.test.ts app/sitemap.ts CLAUDE.md app/pipeline/page.tsx components/pipeline/chunking-view.tsx components/pipeline/extraction-compare.tsx components/pipeline/index-view.tsx components/pipeline/pipeline-flow.tsx components/pipeline/pipeline-section.tsx lib/pipeline.ts lib/pipeline.test.ts
git diff --cached --name-only
git commit -m "feat: retire standalone pipeline route"
```

Expected: staged names are exactly Task 3’s owned modifications/additions/deletions. No Task 1/2 file, `.contentlayer` file, archive/post/Footer file, or `birthday-gf` path is staged.

## Final Verification and Safety Procedure

- [ ] **Run the complete bundled-runtime gate from a clean task staging state.**

```powershell
$node = 'C:\Users\META06\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
$contentlayerBefore = Join-Path $env:TEMP 'chanlog-contentlayer-before-inline-build.patch'
git diff --binary -- .contentlayer | Set-Content -NoNewline -LiteralPath $contentlayerBefore
& $node '.\node_modules\vitest\vitest.mjs' run
& $node '.\node_modules\typescript\bin\tsc' --noEmit
& $node '.\node_modules\next\dist\bin\next' build
```

Expected: full Vitest PASS, tsc PASS, Next build PASS. Do not substitute global npm/npx wrappers.

- [ ] **Inspect and reverse only exact build-created Contentlayer diffs.**

After the build:

```powershell
$generatedChanges = @(git diff --name-only -- .contentlayer)
$generatedChanges
foreach ($path in $generatedChanges) {
  git diff --stat -- $path
  git diff -- $path
}
```

Require every returned path to be under `.contentlayer/`. On the baseline checkout the build reported four generated documents and changed exactly `.contentlayer/generated/Post/_index.json`, `.contentlayer/generated/Post/my-first-post.mdx.json`, and `.contentlayer/package.json`; a later executor run may expose another tracked generated path. Restore each returned path explicitly in one command that names only those inspected paths—never `git restore .`, never recursive deletion, never `git clean`, never `git reset`:

```powershell
if ($generatedChanges.Count -gt 0) {
  git restore --source=HEAD -- $generatedChanges
}
if ((Get-Item -LiteralPath $contentlayerBefore).Length -gt 0) {
  git apply --whitespace=nowarn $contentlayerBefore
}
Remove-Item -LiteralPath $contentlayerBefore
git status --short -- .contentlayer
```

Expected: `.contentlayer` exactly matches its pre-build state. If a pre-build generated diff existed, the binary patch restores that user state; it must not be discarded or staged.

- [ ] **Repeat exact production HTTP and metadata/sitemap assertions.**

Run Task 3 Step 6 against the final build and require the exact 308/raw Location, 404 descendant, preserved `/posts` redirect, portfolio canonical/section, sitemap exclusions, archive thumbnails/Footer, and post-detail checks.

- [ ] **Repeat actual responsive visual/accessibility QA.**

Use the existing in-app browser at 1280×900 and 390×844. Repeat every Task 2 Step 5 assertion plus Navbar/redirect arrival. Inspect the final WebP locally at 100% and fit-to-window and re-run its RIFF/WEBP/dimensions/SHA test. No browser installation is authorized. If browser control is unavailable, record every residual QA item listed in Task 2 rather than claiming it was visually proven.

- [ ] **Verify preservation and nested-checkout safety exactly.**

```powershell
git diff --exit-code -- components/footer.tsx app/posts/[slug]/page.tsx
git status --short
git -C birthday-gf rev-parse HEAD
git -C birthday-gf status --short
```

Expected nested output remains HEAD `42a6392628da27e32a787b07eb87d7bf8b369c81` and modifications only to `package-lock.json`, `package.json`, `src/app/layout.tsx`. Main status contains only intentional feature paths or is clean after task commits; no `.contentlayer` churn remains. Use production HTML/browser checks to confirm archive thumbnails/posts and Footer were preserved without editing them.

- [ ] **Final self-review before completion.**

Review the implementation against every Global Constraint and the approved spec. Search all changed feature files for forbidden copy/technology, duplicate source data outside `lib/document-preprocessor.ts`, a standalone pipeline page/canonical/sitemap/nav item, placeholder language, arbitrary colors/shadows, and new dependencies. Confirm type names and event signatures match across library, tests, and component; each file was changed by its owning task only; all three task commits contain only scoped paths; and prior specs were superseded only at the explicit section-12 boundaries.
