# 포트폴리오 사이트 전면 개편 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 기존 개인 블로그를 Notion 디자인 언어 기반 원페이지 포트폴리오 사이트로 개편하고, 문서 전처리 파이프라인 설계 역량을 인터랙티브 컴포넌트로 시연한다.

**Architecture:** 콘텐츠 데이터를 `lib/profile.ts`·`lib/pipeline.ts`로 완전히 분리하고, 컴포넌트는 렌더링만 담당한다. 홈은 `app/page.tsx`가 8개 섹션 컴포넌트를 조립하는 얇은 셸이 된다. 디자인 토큰은 `tailwind.config.js`에 등록해 임의 색상값 사용을 막는다.

**Tech Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS 3, contentlayer2, framer-motion, vitest

## Global Constraints

- 대상 스펙: `docs/superpowers/specs/2026-08-07-portfolio-redesign-design.md`
- 다크모드 미지원. `dark:` 유틸리티를 새로 추가하지 않는다
- 폰트 스택은 정확히 `'SF Pro Display', 'SF Pro Text', 'PretendardLocal', sans-serif`
- 색상은 반드시 Tailwind 토큰으로 지정한다. `#` 리터럴이나 `bg-blue-950` 같은 기본 팔레트 사용 금지
- `primary`(`#0075de`)는 CTA·링크·포커스 전용. 장식 금지
- `accent-*`는 칩 닷·파이프라인 노드·파싱 요소 분류 전용. CTA·구조 채색 금지
- `secondary`(`#213183`)는 Hero 밴드에만 사용
- 애니메이션은 진입 페이드업만. `prefers-reduced-motion` 존중
- 처리 건수·데이터 규모·정확도 등 수치를 UI에 넣지 않는다
- 고객사명(K-water, 부산은행)을 파이프라인 섹션에 넣지 않는다
- 각 태스크 종료 시 `npx tsc --noEmit`과 `npm run build`가 통과해야 한다

## 테스트 전략에 대한 메모

이 프로젝트는 대부분 프레젠테이션 컴포넌트라 유닛 테스트의 가치가 낮다. 실제 로직이 있는 곳
(`lib/toc.ts`의 파싱, `lib/*.ts`의 데이터 무결성)에만 vitest 테스트를 쓰고, 컴포넌트는
`tsc --noEmit` + `npm run build` + 브라우저 육안 확인으로 검증한다. 컴포넌트 렌더 테스트를
위한 jsdom·testing-library는 설치하지 않는다 (YAGNI).

---

### Task 1: 테스트 환경 구축 + `lib/toc.ts` 회귀 테스트

기존 `extractToc`는 실제 파싱 로직이 있는 유일한 함수다. 개편 중 깨지지 않도록 먼저 고정한다.

**Files:**
- Create: `vitest.config.ts`
- Create: `lib/toc.test.ts`
- Modify: `package.json` (scripts, devDependencies)

**Interfaces:**
- Consumes: 없음
- Produces: `npm test` 명령. 이후 모든 태스크가 이 명령으로 검증한다.

- [ ] **Step 1: vitest 설치**

```bash
npm install -D vitest
```

- [ ] **Step 2: `vitest.config.ts` 생성**

```ts
import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  test: {
    environment: "node",
    include: ["lib/**/*.test.ts"],
  },
});
```

- [ ] **Step 3: `package.json`에 스크립트 추가**

`"scripts"` 블록에 두 줄을 추가한다.

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 4: 실패하는 테스트 작성 — `lib/toc.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { extractToc } from "@/lib/toc";

describe("extractToc", () => {
  it("h2와 h3만 추출하고 레벨을 기록한다", () => {
    const raw = ["# 제목", "## 설치", "### 요구사항", "#### 무시됨"].join("\n");

    expect(extractToc(raw)).toEqual([
      { id: "설치", text: "설치", level: 2 },
      { id: "요구사항", text: "요구사항", level: 3 },
    ]);
  });

  it("코드블록 안의 주석을 헤딩으로 오인하지 않는다", () => {
    const raw = ["## 진짜 헤딩", "```bash", "## 가짜 헤딩", "```"].join("\n");

    expect(extractToc(raw)).toHaveLength(1);
    expect(extractToc(raw)[0].text).toBe("진짜 헤딩");
  });

  it("중복 헤딩에 서로 다른 id를 부여한다", () => {
    const raw = ["## 설정", "## 설정"].join("\n");
    const toc = extractToc(raw);

    expect(toc[0].id).not.toBe(toc[1].id);
  });

  it("마크다운 문법을 제거한 텍스트를 쓴다", () => {
    const raw = "## `코드` 와 **굵게** 와 [링크](https://example.com)";

    expect(extractToc(raw)[0].text).toBe("코드 와 굵게 와 링크");
  });

  it("헤딩이 없으면 빈 배열을 반환한다", () => {
    expect(extractToc("본문만 있습니다.")).toEqual([]);
  });
});
```

- [ ] **Step 5: 테스트 실행**

Run: `npm test`
Expected: 5개 테스트 모두 PASS. 실패한다면 `extractToc`의 기존 동작이 위 기대와 다른 것이므로,
**테스트를 실제 동작에 맞춰 고친다** (기존 동작이 정답이다 — 이건 회귀 테스트이지 사양 변경이 아니다).

- [ ] **Step 6: 커밋**

```bash
git add vitest.config.ts lib/toc.test.ts package.json package-lock.json
git commit -m "test: vitest 도입 및 extractToc 회귀 테스트 추가"
```

---

### Task 2: 디자인 토큰 + 폰트 전환

**Files:**
- Modify: `tailwind.config.js` (전체 교체)
- Modify: `app/globals.css:1-19` (상단 블록 교체)
- Modify: `app/layout.tsx:1-30, 65-66` (localFont 제거, preload 추가)

**Interfaces:**
- Produces: Tailwind 토큰 `bg-canvas-soft` `bg-surface` `text-ink` `text-ink-muted` `border-hairline` `text-primary` `bg-secondary` `bg-accent-teal` 등, `text-display-1` `text-heading-1` `text-body-md` 등 타이포 토큰. 이후 모든 컴포넌트가 이 토큰만 사용한다.

- [ ] **Step 1: `tailwind.config.js` 전체 교체**

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,md,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,md,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#0075de", active: "#005bab" },
        secondary: "#213183",
        canvas: { DEFAULT: "#ffffff", soft: "#f6f5f4" },
        surface: "#ffffff",
        ink: {
          DEFAULT: "#000000",
          secondary: "#31302e",
          muted: "#615d59",
          faint: "#a39e98",
        },
        hairline: "#e6e6e6",
        accent: {
          sky: "#62aef0",
          purple: "#d6b6f6",
          "purple-deep": "#391c57",
          pink: "#ff64c8",
          orange: "#dd5b00",
          "orange-deep": "#793400",
          teal: "#2a9d99",
          green: "#1aae39",
          brown: "#523410",
        },
      },
      fontFamily: {
        sans: [
          "'SF Pro Display'",
          "'SF Pro Text'",
          "'PretendardLocal'",
          "sans-serif",
        ],
      },
      fontSize: {
        "display-1": ["64px", { lineHeight: "1", letterSpacing: "-2.125px", fontWeight: "700" }],
        "display-2": ["54px", { lineHeight: "1.04", letterSpacing: "-1.875px", fontWeight: "700" }],
        "heading-1": ["40px", { lineHeight: "1.1", letterSpacing: "-1px", fontWeight: "700" }],
        "heading-2": ["26px", { lineHeight: "1.23", letterSpacing: "-0.625px", fontWeight: "700" }],
        "heading-3": ["22px", { lineHeight: "1.27", letterSpacing: "-0.25px", fontWeight: "700" }],
        title: ["20px", { lineHeight: "1.4", letterSpacing: "-0.125px", fontWeight: "600" }],
        "body-md": ["16px", { lineHeight: "1.5", letterSpacing: "0" }],
        "body-sm": ["15px", { lineHeight: "1.33", letterSpacing: "0" }],
        button: ["16px", { lineHeight: "1.5", letterSpacing: "0", fontWeight: "500" }],
        caption: ["14px", { lineHeight: "1.43", letterSpacing: "0" }],
        eyebrow: ["12px", { lineHeight: "1.33", letterSpacing: "0.125px", fontWeight: "600" }],
      },
      borderRadius: {
        xs: "4px",
        sm: "5px",
        md: "8px",
        lg: "12px",
        xl: "16px",
      },
      boxShadow: {
        soft: "0 0.175px 1.041px rgba(0,0,0,0.01), 0 0.8px 2.925px rgba(0,0,0,0.02), 0 2.025px 7.847px rgba(0,0,0,0.027), 0 4px 18px rgba(0,0,0,0.04)",
        elevated:
          "0 0.175px 1.041px rgba(0,0,0,0.01), 0 0.8px 2.925px rgba(0,0,0,0.02), 0 2.025px 7.847px rgba(0,0,0,0.027), 0 4px 18px rgba(0,0,0,0.04), 0 23px 52px rgba(0,0,0,0.05)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
```

`darkMode: "class"`와 `./pages/**` content 경로는 제거했다 — 다크모드 미지원이고 `pages/` 디렉터리가 없다.

- [ ] **Step 2: `app/globals.css` 1~19행을 교체**

기존 `@tailwind` 3줄과 `html`/`body` 블록을 아래로 바꾼다. 20행 이후(`.prose .anchor` 부터)는 그대로 둔다.

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@font-face {
  font-family: "PretendardLocal";
  src: url("/fonts/Pretendard-Regular.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "PretendardLocal";
  src: url("/fonts/Pretendard-SemiBold.woff2") format("woff2");
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "PretendardLocal";
  src: url("/fonts/Pretendard-Bold.woff2") format("woff2");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "PretendardLocal";
  src: url("/fonts/Pretendard-Black.woff2") format("woff2");
  font-weight: 900;
  font-style: normal;
  font-display: swap;
}

html {
  font-size: 16px;
  scroll-behavior: smooth;
}

body {
  min-height: 100vh;
  overflow-x: clip;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}
```

기존 `html { font-size: 14px }` + 640px 미디어쿼리는 제거한다. 디자인 토큰이 px 고정값이라
루트 폰트 크기 변동과 충돌한다.

- [ ] **Step 3: `app/layout.tsx` 교체**

```tsx
import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { AnalyticsWrapper } from "@/components/analytics";
import { SpeedInsights } from "@vercel/speed-insights/next";

const SITE_URL = "https://chanlog.blog";
const SITE_DESCRIPTION = "서버·AI 데이터 파이프라인을 만드는 백엔드 개발자 이재찬입니다.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "이재찬 | Backend & AI Engineer",
    template: "%s | Chanlog",
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: "이재찬 | Backend & AI Engineer",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: "ko_KR",
    type: "website",
    siteName: "Chanlog",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "standard",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="font-sans">
      <head>
        <link
          rel="preload"
          href="/fonts/Pretendard-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Pretendard-Bold.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="flex min-h-screen flex-col bg-canvas-soft text-ink antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <AnalyticsWrapper />
        <SpeedInsights />
      </body>
    </html>
  );
}
```

`main`에서 `max-w-3xl` 제약을 제거했다 — Hero 밴드가 풀블리드여야 하므로 폭 제한은 각 섹션이 담당한다.
이 변경으로 `/posts` 페이지가 일시적으로 전체 폭이 되지만 Task 13에서 복구한다.

- [ ] **Step 4: 타입 체크와 빌드**

Run: `npx tsc --noEmit && npm run build`
Expected: 둘 다 성공. `localFont` import 제거 누락이 있으면 여기서 잡힌다.

- [ ] **Step 5: 브라우저에서 폰트 적용 확인**

개발 서버가 떠 있는지 확인하고 `http://localhost:3000`을 연다. DevTools 콘솔에서 실행:

```js
getComputedStyle(document.body).fontFamily
```

Expected: `"SF Pro Display", "SF Pro Text", "PretendardLocal", sans-serif`

- [ ] **Step 6: 커밋**

```bash
git add tailwind.config.js app/globals.css app/layout.tsx
git commit -m "feat: 디자인 토큰 등록 및 PretendardLocal 폰트 스택 전환"
```

---

### Task 3: 공용 UI 프리미티브

**Files:**
- Create: `components/ui/section.tsx`
- Create: `components/ui/chip.tsx`
- Create: `components/ui/card.tsx`
- Create: `lib/accent.ts`

**Interfaces:**
- Produces:
  - `type AccentColor = "sky" | "purple" | "pink" | "orange" | "teal" | "green"`
  - `accentDotClass(accent: AccentColor): string`
  - `<Section id?: string; eyebrow?: string; title?: string; children: ReactNode; wide?: boolean>`
  - `<Chip children: ReactNode; accent?: AccentColor>`
  - `<Card children: ReactNode; className?: string; elevated?: boolean>`

- [ ] **Step 1: `lib/accent.ts` 생성**

Tailwind는 클래스명을 정적으로 스캔하므로 `bg-accent-${accent}` 같은 동적 조합은 purge된다.
매핑 테이블로 전체 클래스명을 명시한다.

```ts
export type AccentColor =
  | "sky"
  | "purple"
  | "pink"
  | "orange"
  | "teal"
  | "green";

const DOT: Record<AccentColor, string> = {
  sky: "bg-accent-sky",
  purple: "bg-accent-purple",
  pink: "bg-accent-pink",
  orange: "bg-accent-orange",
  teal: "bg-accent-teal",
  green: "bg-accent-green",
};

export const accentDotClass = (accent: AccentColor) => DOT[accent];
```

- [ ] **Step 2: `components/ui/section.tsx` 생성**

```tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

interface SectionProps {
  id?: string;
  eyebrow?: string;
  title?: string;
  children: ReactNode;
  wide?: boolean;
}

export function Section({ id, eyebrow, title, children, wide }: SectionProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      id={id}
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="px-6 py-16 sm:py-20"
    >
      <div className={`mx-auto w-full ${wide ? "max-w-5xl" : "max-w-3xl"}`}>
        {eyebrow && (
          <p className="mb-2 text-eyebrow uppercase text-ink-faint">{eyebrow}</p>
        )}
        {title && (
          <h2 className="mb-8 text-heading-2 text-ink sm:text-heading-1">
            {title}
          </h2>
        )}
        {children}
      </div>
    </motion.section>
  );
}
```

- [ ] **Step 3: `components/ui/chip.tsx` 생성**

```tsx
import type { ReactNode } from "react";
import type { AccentColor } from "@/lib/accent";
import { accentDotClass } from "@/lib/accent";

export function Chip({
  children,
  accent,
}: {
  children: ReactNode;
  accent?: AccentColor;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-hairline bg-surface px-3 py-1 text-caption text-ink-secondary">
      {accent && (
        <span className={`h-2 w-2 rounded-full ${accentDotClass(accent)}`} />
      )}
      {children}
    </span>
  );
}
```

- [ ] **Step 4: `components/ui/card.tsx` 생성**

```tsx
import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
  elevated = false,
}: {
  children: ReactNode;
  className?: string;
  elevated?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border border-hairline bg-surface p-6 ${
        elevated ? "shadow-soft" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 5: 타입 체크**

Run: `npx tsc --noEmit`
Expected: 성공

- [ ] **Step 6: 커밋**

```bash
git add lib/accent.ts components/ui
git commit -m "feat: Section/Chip/Card 공용 UI 프리미티브 추가"
```

---

### Task 4: 프로필 데이터 레이어

**Files:**
- Create: `lib/profile.ts`
- Create: `lib/profile.test.ts`

**Interfaces:**
- Consumes: `AccentColor` (Task 3의 `lib/accent.ts`)
- Produces: `profile`, `careers`, `projects`, `skillGroups`, `contacts` 및 각 타입

- [ ] **Step 1: 실패하는 테스트 작성 — `lib/profile.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { careers, contacts, profile, projects, skillGroups } from "@/lib/profile";

const ACCENTS = ["sky", "purple", "pink", "orange", "teal", "green"];

describe("profile 데이터", () => {
  it("기본 프로필 필드가 비어있지 않다", () => {
    expect(profile.name.length).toBeGreaterThan(0);
    expect(profile.role.length).toBeGreaterThan(0);
    expect(profile.tagline.length).toBeGreaterThan(0);
    expect(profile.about.length).toBeGreaterThan(0);
  });

  it("경력은 최신순으로 정렬되어 있다", () => {
    const starts = careers.map((c) => c.startedAt);
    const sorted = [...starts].sort().reverse();
    expect(starts).toEqual(sorted);
  });

  it("모든 경력에 필수 필드가 있다", () => {
    for (const career of careers) {
      expect(career.company).toBeTruthy();
      expect(career.period).toBeTruthy();
      expect(career.role).toBeTruthy();
      expect(career.highlights.length).toBeGreaterThan(0);
    }
  });

  it("프로젝트는 최신순으로 정렬되어 있다", () => {
    const starts = projects.map((p) => p.startedAt);
    const sorted = [...starts].sort().reverse();
    expect(starts).toEqual(sorted);
  });

  it("모든 프로젝트에 필수 필드가 있다", () => {
    for (const project of projects) {
      expect(project.title).toBeTruthy();
      expect(project.org).toBeTruthy();
      expect(project.period).toBeTruthy();
      expect(project.role).toBeTruthy();
      expect(project.experience.length).toBeGreaterThan(0);
    }
  });

  it("스킬 그룹의 accent가 유효한 토큰이다", () => {
    for (const group of skillGroups) {
      expect(ACCENTS).toContain(group.accent);
      expect(group.items.length).toBeGreaterThan(0);
    }
  });

  it("스킬 그룹 accent는 서로 중복되지 않는다", () => {
    const used = skillGroups.map((g) => g.accent);
    expect(new Set(used).size).toBe(used.length);
  });

  it("연락처 href가 mailto 또는 https로 시작한다", () => {
    for (const contact of contacts) {
      expect(contact.href).toMatch(/^(mailto:|https:\/\/)/);
    }
  });
});
```

- [ ] **Step 2: 테스트 실행 (실패 확인)**

Run: `npm test`
Expected: FAIL — `Failed to resolve import "@/lib/profile"`

- [ ] **Step 3: `lib/profile.ts` 작성**

```ts
import type { AccentColor } from "@/lib/accent";

export interface CareerItem {
  company: string;
  period: string;
  startedAt: string;
  role: string;
  team?: string;
  summary: string;
  highlights: string[];
}

export interface ProjectItem {
  title: string;
  org: string;
  client?: string;
  period: string;
  startedAt: string;
  role: string;
  experience: string[];
}

export interface SkillGroup {
  category: string;
  accent: AccentColor;
  items: string[];
}

export interface ContactLink {
  label: string;
  href: string;
}

export const profile = {
  name: "이재찬",
  nameEn: "Jae Chan Lee",
  role: "Backend & AI Engineer",
  tagline: "서버와 AI 데이터 파이프라인을 만듭니다.",
  about: [
    "만 3년차 서버 및 AI 관련 개발 업무를 맡아온 이재찬입니다. 백엔드 및 서버 개발 경력을 바탕으로 Python과 Java를 활용한 다양한 프로젝트 경험을 보유하고 있습니다.",
    "FastAPI를 중심으로 REST API 및 MSA 기반 서비스 아키텍처를 설계하고 구축했으며, Docker와 Podman을 통한 배포 자동화와 Git 협업에 익숙합니다.",
    "MariaDB·MongoDB 등 다양한 데이터베이스 경험과 RAG 서비스에 사용되는 데이터 전처리·관리 역량을 갖추고 있고, ReactJS를 통한 프론트엔드 연동 경험도 있습니다.",
    "대학 시절 과 대표로 선출되어 학과 내 프로젝트와 팀워크를 이끌며 리더십과 소통 능력을 키웠습니다.",
  ],
} as const;

export const careers: CareerItem[] = [
  {
    company: "(주)메타버스",
    period: "2025.09 ~ 재직중",
    startedAt: "2025-09",
    role: "대리",
    team: "공간정보 개발팀",
    summary: "백엔드·서버 개발",
    highlights: [
      "GIS 기반 데이터 처리 파이프라인 설계 및 개발",
      "연구개발팀 신규 체계 및 환경 구성",
      "Python 기반 GUI 소프트웨어 개발",
    ],
  },
  {
    company: "(주)그리드원",
    period: "2023.08 ~ 2025.07",
    startedAt: "2023-08",
    role: "주임",
    team: "AI(인공지능) R&D",
    summary: "생성형 AI(RAG) 데이터 전처리 담당 및 개발",
    highlights: [
      "문서 전처리기(PDF·DOCX·HWP) 서비스 개발",
      "MSA 아키텍처 서비스 개발",
      "LangChain·LangGraph 프레임워크 활용",
    ],
  },
];

export const projects: ProjectItem[] = [
  {
    title: "농식품 팜맵 서비스 개선",
    org: "메타버스",
    client: "농정원",
    period: "2025.09 ~ 진행중",
    startedAt: "2025-09",
    role: "GIS 데이터 처리 및 개발 파이프라인 구성",
    experience: [
      "개발팀 체계 및 환경 구축",
      "GIS 데이터 처리 파이프라인 설계",
    ],
  },
  {
    title: "한국수자원공사 생성형 AI 서비스 시범사업 및 운영",
    org: "그리드원",
    client: "한국수자원공사",
    period: "2024.06 ~ 2025.05",
    startedAt: "2024-06",
    role: "데이터 전처리 및 임베딩",
    experience: [
      "문서 데이터 전처리",
      "컨테이너 기술 활용",
      "NoSQL 방식 DB 관리",
    ],
  },
  {
    title: "부산은행 생성형 AI 서비스 실증사업",
    org: "그리드원",
    client: "BNK 부산은행",
    period: "2024.02 ~ 2024.03",
    startedAt: "2024-02",
    role: "데이터 전처리 및 임베딩",
    experience: ["금융 도메인 문서 전처리 및 임베딩"],
  },
  {
    title: "생성형 AI ChatBot & RAG 솔루션",
    org: "그리드원",
    period: "2023.11 ~ 2025.04",
    startedAt: "2023-11",
    role: "데이터 전처리 및 임베딩",
    experience: [
      "다양한 오픈소스 아키텍처 분석",
      "신기술 연구 및 적용",
    ],
  },
];

export const skillGroups: SkillGroup[] = [
  { category: "Language", accent: "orange", items: ["Python", "Java"] },
  {
    category: "Backend",
    accent: "teal",
    items: ["FastAPI", "REST API", "MSA", "Spring"],
  },
  {
    category: "AI / Data",
    accent: "purple",
    items: ["LangChain", "LangGraph", "RAG", "데이터 전처리"],
  },
  { category: "Database", accent: "pink", items: ["MariaDB", "MongoDB"] },
  {
    category: "Infra",
    accent: "sky",
    items: ["Docker", "Podman", "Kubernetes", "Git"],
  },
  { category: "Frontend", accent: "green", items: ["ReactJS"] },
];

export const contacts: ContactLink[] = [
  { label: "Email", href: "mailto:wocks3254@gmail.com" },
  { label: "GitHub", href: "https://github.com/DevJaepaL" },
  { label: "Instagram", href: "https://www.instagram.com/jaechane" },
];
```

- [ ] **Step 4: 테스트 실행**

Run: `npm test`
Expected: 전체 PASS

- [ ] **Step 5: 커밋**

```bash
git add lib/profile.ts lib/profile.test.ts
git commit -m "feat: 경력·프로젝트·스킬 데이터 레이어 추가"
```

---

### Task 5: 파이프라인 데이터 레이어

**Files:**
- Create: `lib/pipeline.ts`
- Create: `lib/pipeline.test.ts`

**Interfaces:**
- Consumes: `AccentColor`
- Produces: `pipelineStages`, `demoDocuments`, `extractionComparison`, `indexTargets`, `pipelineStack` 및 타입

**데모 문서에 대한 결정:** 스펙은 공개 법령 사용을 명시했으나, 실제 법령 조문을 정확히 인용하려면
국가법령정보센터에서 원문을 확보해야 한다. 초기 구현은 **UI에 "구조 설명용 예시 문서"라고 명시 표기한
가상 규정**을 쓴다. 데이터 주도 구조이므로 실제 법령으로 교체할 때 `lib/pipeline.ts`의 배열만 바꾸면 된다.
관세청 보도자료 탭은 실제 공개 자료의 내용을 쓴다.

- [ ] **Step 1: 실패하는 테스트 작성 — `lib/pipeline.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import {
  CHUNK_MAX_CHARS,
  CHUNK_MIN_CHARS,
  demoDocuments,
  extractionComparison,
  indexTargets,
  pipelineStages,
} from "@/lib/pipeline";

describe("pipelineStages", () => {
  it("5단계로 구성된다", () => {
    expect(pipelineStages).toHaveLength(5);
  });

  it("모든 단계에 id가 유일하다", () => {
    const ids = pipelineStages.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("모든 단계에 상세 설명이 있다", () => {
    for (const stage of pipelineStages) {
      expect(stage.label).toBeTruthy();
      expect(stage.caption).toBeTruthy();
      expect(stage.detail.length).toBeGreaterThan(10);
    }
  });
});

describe("demoDocuments", () => {
  it("최소 2종의 문서 유형을 제공한다", () => {
    expect(demoDocuments.length).toBeGreaterThanOrEqual(2);
  });

  it("모든 문서에 출처가 명시되어 있다", () => {
    for (const doc of demoDocuments) {
      expect(doc.source).toBeTruthy();
    }
  });

  it("모든 문서에 경계 규칙이 있다", () => {
    for (const doc of demoDocuments) {
      expect(doc.boundaryRules.length).toBeGreaterThan(0);
    }
  });

  it("청크 id가 문서 안에서 유일하다", () => {
    for (const doc of demoDocuments) {
      const ids = doc.chunks.map((c) => c.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it("청크 문자 수가 선언된 범위 안에 있다", () => {
    for (const doc of demoDocuments) {
      for (const chunk of doc.chunks) {
        expect(chunk.charCount).toBeGreaterThan(0);
        expect(chunk.charCount).toBeLessThanOrEqual(CHUNK_MAX_CHARS);
      }
    }
  });

  it("헤더가 반복된 청크는 직전 청크와 같은 계층 경로를 갖는다", () => {
    for (const doc of demoDocuments) {
      doc.chunks.forEach((chunk, i) => {
        if (!chunk.headerRepeated) return;
        expect(i).toBeGreaterThan(0);
        expect(doc.chunks[i - 1].path).toBe(chunk.path);
      });
    }
  });

  it("계층 트리가 참조하는 청크는 실제로 존재한다", () => {
    for (const doc of demoDocuments) {
      const chunkIds = new Set(doc.chunks.map((c) => c.id));
      for (const node of doc.hierarchy) {
        if (node.chunkId) expect(chunkIds.has(node.chunkId)).toBe(true);
      }
    }
  });

  it("청크 상한이 하한보다 크다", () => {
    expect(CHUNK_MAX_CHARS).toBeGreaterThan(CHUNK_MIN_CHARS);
  });
});

describe("indexTargets", () => {
  it("담당 범위와 연동 범위를 구분한다", () => {
    expect(indexTargets.some((t) => t.owned)).toBe(true);
    expect(indexTargets.some((t) => !t.owned)).toBe(true);
  });

  it("어떤 항목에도 수치 스코어를 담지 않는다", () => {
    for (const target of indexTargets) {
      expect(target.description).not.toMatch(/\d+\.\d{2}/);
    }
  });
});

describe("extractionComparison", () => {
  it("naive와 structured 두 결과를 모두 갖는다", () => {
    expect(extractionComparison.naive.output).toBeTruthy();
    expect(extractionComparison.structured.output).toBeTruthy();
  });
});
```

- [ ] **Step 2: 테스트 실행 (실패 확인)**

Run: `npm test`
Expected: FAIL — `Failed to resolve import "@/lib/pipeline"`

- [ ] **Step 3: `lib/pipeline.ts` 작성**

```ts
import type { AccentColor } from "@/lib/accent";

export const CHUNK_MIN_CHARS = 2000;
export const CHUNK_MAX_CHARS = 3000;

export interface PipelineStage {
  id: string;
  label: string;
  caption: string;
  accent: AccentColor;
  detail: string;
  stack: string[];
}

export interface HierarchyNode {
  id: string;
  label: string;
  level: 1 | 2 | 3;
  chunkId?: string;
}

export interface DocumentChunk {
  id: string;
  path: string;
  charCount: number;
  text: string;
  headerRepeated?: boolean;
}

export interface DemoDocument {
  id: string;
  label: string;
  source: string;
  disclaimer?: string;
  boundaryRules: string[];
  hierarchy: HierarchyNode[];
  chunks: DocumentChunk[];
}

export interface IndexTarget {
  id: string;
  label: string;
  accent: AccentColor;
  description: string;
  owned: boolean;
}

export const pipelineStages: PipelineStage[] = [
  {
    id: "parse",
    label: "구조 파싱",
    caption: "PDF·DOCX·HWP → 요소 트리",
    accent: "orange",
    detail:
      "형식이 제각각인 원본 문서를 공통 중간 표현으로 변환합니다. 표는 구조를 유지한 채 분리하고, 머리말·꼬리말·페이지 번호처럼 검색 품질을 떨어뜨리는 노이즈를 제거합니다.",
    stack: ["Python", "FastAPI"],
  },
  {
    id: "hierarchy",
    label: "계층 인식",
    caption: "장·조·항 경계 판별",
    accent: "teal",
    detail:
      "문서 유형별로 다른 개행 표현식을 적용해 장·조·항 경계를 찾습니다. 고정 길이로 자르면 조문 중간이 끊기므로, 계층 경계를 먼저 확정한 뒤 그 안에서만 분할합니다.",
    stack: ["Python"],
  },
  {
    id: "chunk",
    label: "의미 단위 청킹",
    caption: "문자 수 상한에 맞춰 절삭",
    accent: "purple",
    detail:
      "내용이 짧은 단은 그대로 한 청크에 담고, 상한을 넘으면 청크를 분리하되 헤더는 각 조각에 유지합니다. 연관 문단을 묶어 paragraphs group으로 구성합니다.",
    stack: ["Python"],
  },
  {
    id: "index",
    label: "이중 색인",
    caption: "Vector DB + BM25",
    accent: "pink",
    detail:
      "동일한 청크를 임베딩 벡터와 키워드 색인 양쪽에 적재합니다. 계층 경로를 메타데이터로 함께 저장해 검색 결과가 어느 조문에서 왔는지 추적할 수 있게 합니다.",
    stack: ["Chroma", "Elasticsearch"],
  },
  {
    id: "serve",
    label: "검색 연동",
    caption: "근거 청크 반환",
    accent: "green",
    detail:
      "적재된 두 인덱스를 질의해 근거 청크를 반환합니다. 검색·랭킹 모델은 사내 연구소가 개발한 것을 API로 연동했습니다.",
    stack: ["FastAPI"],
  },
];

export const demoDocuments: DemoDocument[] = [
  {
    id: "regulation",
    label: "규정 · 지침",
    source: "구조 설명용 예시 문서",
    disclaimer:
      "실제 문서가 아니라 장·조·항 계층 구조를 설명하기 위해 작성한 예시입니다.",
    boundaryRules: [
      "^제\\s*\\d+\\s*장",
      "^제\\s*\\d+\\s*조",
      "^\\s*[①-⑳]",
      "^\\s*\\d+\\.\\s",
    ],
    hierarchy: [
      { id: "ch1", label: "제1장 총칙", level: 1 },
      { id: "ch1-a1", label: "제1조 목적", level: 2, chunkId: "chunk_001" },
      { id: "ch1-a2", label: "제2조 정의", level: 2, chunkId: "chunk_002" },
      { id: "ch2", label: "제2장 시행규칙", level: 1 },
      { id: "ch2-a3", label: "제3조 적용 범위", level: 2, chunkId: "chunk_003" },
      { id: "ch2-a4", label: "제4조 검사 절차", level: 2, chunkId: "chunk_004" },
      { id: "ch2-a4-c1", label: "① 검사 주기", level: 3 },
      { id: "ch2-a4-c2", label: "② 예외 사유", level: 3 },
    ],
    chunks: [
      {
        id: "chunk_001",
        path: "제1장 총칙 › 제1조 목적",
        charCount: 2140,
        text: "제1조(목적) 이 규정은 대상 업무의 처리 절차와 기준을 정하여 업무의 일관성과 효율을 확보하는 것을 목적으로 한다.",
      },
      {
        id: "chunk_002",
        path: "제1장 총칙 › 제2조 정의",
        charCount: 2380,
        text: "제2조(정의) 이 규정에서 사용하는 용어의 뜻은 다음과 같다.",
      },
      {
        id: "chunk_003",
        path: "제2장 시행규칙 › 제3조 적용 범위",
        charCount: 1920,
        text: "제3조(적용 범위) 이 규정은 별표에 정한 대상에 대하여 적용한다.",
      },
      {
        id: "chunk_004",
        path: "제2장 시행규칙 › 제4조 검사 절차",
        charCount: 2840,
        text: "제4조(검사 절차) ① 검사는 정해진 주기에 따라 실시한다. ② 다만 다음 각 호에 해당하는 경우에는 그러하지 아니하다.",
      },
      {
        id: "chunk_005",
        path: "제2장 시행규칙 › 제4조 검사 절차",
        charCount: 1610,
        text: "(이어짐) 검사 결과는 문서로 기록하여 보존하며, 필요한 경우 재검사를 실시할 수 있다.",
        headerRepeated: true,
      },
    ],
  },
  {
    id: "press",
    label: "보도자료",
    source: "관세청 「2026년 7월 1일~7월 20일 수출입 현황」 (2026.7.21 배포)",
    boundaryRules: ["^\\s*<.+>\\s*$", "^\\s*ㅇ\\s", "^\\s*□\\s", "^\\s*-\\s"],
    hierarchy: [
      { id: "p-sum", label: "<요약>", level: 1, chunkId: "chunk_101" },
      { id: "p-total", label: "총괄", level: 1, chunkId: "chunk_102" },
      { id: "p-export", label: "수출현황", level: 1, chunkId: "chunk_103" },
      { id: "p-export-item", label: "ㅇ 주요품목", level: 2 },
      { id: "p-export-country", label: "ㅇ 주요국가", level: 2 },
      { id: "p-import", label: "수입현황", level: 1, chunkId: "chunk_104" },
    ],
    chunks: [
      {
        id: "chunk_101",
        path: "<요약>",
        charCount: 2050,
        text: "관세청은 21일, 7월 1일~20일 기간의 수출입 현황 잠정치를 발표했다. 동기간 수출은 549억 달러로 전년동기대비 52.3% 증가했다.",
      },
      {
        id: "chunk_102",
        path: "총괄",
        charCount: 2470,
        text: "(7.1.~7.20.) 수출 549억 달러, 수입 427억 달러로 전년동기대비 수출 52.3% 증가, 수입 20.0% 증가",
      },
      {
        id: "chunk_103",
        path: "수출현황 › 주요품목",
        charCount: 2760,
        text: "전년동기대비 반도체(180.6%), 석유제품(33.4%), 컴퓨터 주변기기(231.9%) 등 증가, 승용차(△10.6%) 등 감소",
      },
      {
        id: "chunk_104",
        path: "수입현황 › 주요품목",
        charCount: 2310,
        text: "전년동기대비 반도체(54.9%), 원유(27.5%), 반도체 제조장비(56.9%), 가스(27.9%) 등 증가",
      },
    ],
  },
];

export const indexTargets: IndexTarget[] = [
  {
    id: "chroma",
    label: "Chroma — dense 적재",
    accent: "pink",
    description:
      "청크를 BGE 계열 임베딩으로 변환해 적재합니다. 계층 경로를 메타데이터로 함께 저장합니다.",
    owned: true,
  },
  {
    id: "elasticsearch",
    label: "Elasticsearch — BM25 적재",
    accent: "sky",
    description:
      "동일한 청크를 키워드 색인으로 이중 적재합니다. 조문 번호 같은 고유 표기에 대응하기 위함입니다.",
    owned: true,
  },
  {
    id: "retrieval",
    label: "검색 · 랭킹",
    accent: "green",
    description:
      "사내 연구소가 개발한 검색 모델을 API로 연동했습니다. 적재된 두 인덱스를 질의해 근거 청크를 반환합니다.",
    owned: false,
  },
];

export const extractionComparison = {
  caption: "같은 표, 두 가지 추출 결과",
  naive: {
    label: "pdftotext — 순진한 텍스트 추출",
    output:
      "수 출 3△6,058 37△0,723 61,916\n54,933 551,281 (전년동기대비 증감률)\n( 2.2) ( 0.3) (60.2) (52.3) (48.7)",
    note: "행·열이 무너져 숫자와 증감부호가 뒤엉킵니다. 이 상태로 임베딩하면 검색이 틀린 값을 근거로 반환합니다.",
  },
  structured: {
    label: "구조 보존 파싱",
    output:
      "| 구분 | 당월 | 연간누계 |\n|---|---|---|\n| 수출 | 54,933 | 551,281 |\n| 수입 | 42,715 | 401,374 |",
    note: "셀 관계가 유지되어 특정 항목을 물었을 때 정확한 값을 근거로 제시할 수 있습니다.",
  },
};

export const pipelineStack = [
  "Python",
  "FastAPI",
  "BGE 계열 임베딩",
  "Chroma",
  "Elasticsearch",
];
```

- [ ] **Step 4: 테스트 실행**

Run: `npm test`
Expected: 전체 PASS

- [ ] **Step 5: 커밋**

```bash
git add lib/pipeline.ts lib/pipeline.test.ts
git commit -m "feat: 문서 전처리 파이프라인 데이터 레이어 추가"
```

---

### Task 6: Navbar / Footer 개편

**Files:**
- Modify: `components/navbar.tsx` (전체 교체)
- Modify: `components/footer.tsx` (전체 교체)

**Interfaces:**
- Consumes: `contacts` (`lib/profile.ts`)

- [ ] **Step 1: `components/navbar.tsx` 전체 교체**

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { name: "홈", href: "/" },
  { name: "아카이브", href: "/posts" },
] as const;

function Navbar() {
  let pathName = usePathname();
  if (pathName?.startsWith("/posts")) pathName = "/posts";

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-hairline bg-canvas/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-6">
        <Link href="/" className="text-title text-ink">
          CHANLOG
        </Link>
        <ul className="flex items-center gap-5 text-body-sm">
          {NAV_ITEMS.map(({ name, href }) => (
            <li key={href}>
              <Link
                href={href}
                className={
                  pathName === href
                    ? "font-semibold text-primary"
                    : "text-ink-secondary transition-colors hover:text-ink"
                }
              >
                {name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
```

`framer-motion`으로 만들던 빈 `motion.div` 인디케이터는 제거했다 — 크기가 없어 화면에 아무것도
그리지 않던 죽은 코드다. GitHub·Instagram 아이콘은 Footer와 Contact 섹션에 있으므로 네비에서 뺀다.

- [ ] **Step 2: `components/footer.tsx` 전체 교체**

```tsx
import { contacts, profile } from "@/lib/profile";

function Footer() {
  return (
    <footer className="mt-auto w-full border-t border-hairline bg-canvas-soft">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-4 px-6 py-10">
        <div className="flex gap-5 text-caption">
          {contacts.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink-secondary transition-colors hover:text-primary"
            >
              {label}
            </a>
          ))}
        </div>
        <p className="text-caption text-ink-faint">
          © {new Date().getFullYear()} {profile.name}. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
```

- [ ] **Step 3: 빌드 검증**

Run: `npx tsc --noEmit && npm run build`
Expected: 성공

- [ ] **Step 4: 커밋**

```bash
git add components/navbar.tsx components/footer.tsx
git commit -m "feat: Navbar·Footer를 디자인 토큰 기반으로 개편"
```

---

### Task 7: Hero · About · Career 섹션

**Files:**
- Create: `components/home/hero.tsx`
- Create: `components/home/about.tsx`
- Create: `components/home/career-timeline.tsx`

**Interfaces:**
- Consumes: `profile`, `careers`, `contacts` (`lib/profile.ts`), `Section` (`components/ui/section.tsx`)
- Produces: `<Hero />`, `<About />`, `<CareerTimeline />`

- [ ] **Step 1: `components/home/hero.tsx` 생성**

```tsx
import Image from "next/image";
import avatar from "@/app/avatar.jpg";
import { contacts, profile } from "@/lib/profile";

export function Hero() {
  return (
    <section className="w-full bg-secondary px-6 py-20 sm:py-28">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 text-center">
        <Image
          src={avatar}
          alt={profile.name}
          placeholder="blur"
          priority
          className="h-32 w-32 rounded-full object-cover sm:h-40 sm:w-40"
        />
        <div className="flex flex-col gap-2">
          <h1 className="text-heading-1 text-surface sm:text-display-2">
            {profile.name}
          </h1>
          <p className="text-body-md text-accent-sky">{profile.role}</p>
        </div>
        <p className="max-w-xl break-keep text-body-md text-surface/85">
          {profile.tagline}
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-3">
          {contacts.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-surface px-5 py-2 text-button text-ink shadow-soft transition-transform active:scale-95"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: `components/home/about.tsx` 생성**

```tsx
import { Section } from "@/components/ui/section";
import { profile } from "@/lib/profile";

export function About() {
  return (
    <Section id="about" eyebrow="About" title="소개">
      <div className="flex flex-col gap-4">
        {profile.about.map((paragraph) => (
          <p
            key={paragraph.slice(0, 16)}
            className="break-keep text-body-md text-ink-secondary"
          >
            {paragraph}
          </p>
        ))}
      </div>
    </Section>
  );
}
```

- [ ] **Step 3: `components/home/career-timeline.tsx` 생성**

```tsx
import { Section } from "@/components/ui/section";
import { careers } from "@/lib/profile";

export function CareerTimeline() {
  return (
    <Section id="career" eyebrow="Career" title="경력">
      <ol className="flex flex-col">
        {careers.map((career, index) => (
          <li
            key={career.company}
            className={`relative border-l border-hairline pl-6 ${
              index === careers.length - 1 ? "pb-0" : "pb-10"
            }`}
          >
            <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary" />
            <p className="text-caption text-ink-faint">{career.period}</p>
            <h3 className="mt-1 text-heading-3 text-ink">{career.company}</h3>
            <p className="mt-1 text-body-sm text-ink-muted">
              {career.team ? `${career.team} · ` : ""}
              {career.role} · {career.summary}
            </p>
            <ul className="mt-3 flex flex-col gap-1.5">
              {career.highlights.map((highlight) => (
                <li
                  key={highlight}
                  className="break-keep text-body-sm text-ink-secondary before:mr-2 before:text-ink-faint before:content-['—']"
                >
                  {highlight}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </Section>
  );
}
```

- [ ] **Step 4: 타입 체크**

Run: `npx tsc --noEmit`
Expected: 성공

- [ ] **Step 5: 커밋**

```bash
git add components/home
git commit -m "feat: Hero·About·Career 섹션 컴포넌트 추가"
```

---

### Task 8: Projects · Skills · Writing · Contact 섹션

**Files:**
- Create: `components/home/project-list.tsx`
- Create: `components/home/skill-groups.tsx`
- Create: `components/home/recent-posts.tsx`
- Create: `components/home/contact.tsx`

**Interfaces:**
- Consumes: `projects`, `skillGroups`, `contacts`, `Section`, `Card`, `Chip`, `allPosts`
- Produces: `<ProjectList />`, `<SkillGroups />`, `<RecentPosts />`, `<Contact />`

- [ ] **Step 1: `components/home/project-list.tsx` 생성**

```tsx
import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { projects } from "@/lib/profile";

export function ProjectList() {
  return (
    <Section id="projects" eyebrow="Projects" title="주요 프로젝트">
      <div className="flex flex-col gap-4">
        {projects.map((project) => (
          <Card key={project.title}>
            <div className="flex flex-col gap-1">
              <h3 className="break-keep text-heading-3 text-ink">
                {project.title}
              </h3>
              <p className="text-caption text-ink-faint">
                {project.org}
                {project.client ? ` · ${project.client}` : ""} | {project.period}
              </p>
            </div>
            <p className="mt-3 break-keep text-body-sm text-ink-secondary">
              <span className="text-ink-faint">주요 역할</span> {project.role}
            </p>
            <ul className="mt-2 flex flex-col gap-1">
              {project.experience.map((item) => (
                <li
                  key={item}
                  className="break-keep text-body-sm text-ink-secondary before:mr-2 before:text-ink-faint before:content-['—']"
                >
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </Section>
  );
}
```

- [ ] **Step 2: `components/home/skill-groups.tsx` 생성**

```tsx
import { Chip } from "@/components/ui/chip";
import { Section } from "@/components/ui/section";
import { skillGroups } from "@/lib/profile";

export function SkillGroups() {
  return (
    <Section id="skills" eyebrow="Skills" title="기술 스택">
      <div className="flex flex-col gap-6">
        {skillGroups.map((group) => (
          <div key={group.category} className="flex flex-col gap-2">
            <p className="text-eyebrow uppercase text-ink-faint">
              {group.category}
            </p>
            <div className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <Chip key={item} accent={group.accent}>
                  {item}
                </Chip>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
```

- [ ] **Step 3: `components/home/recent-posts.tsx` 생성**

```tsx
import Link from "next/link";
import { allPosts } from "contentlayer/generated";
import { Section } from "@/components/ui/section";

export function RecentPosts() {
  const posts = [...allPosts]
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    .slice(0, 3);

  return (
    <Section id="writing" eyebrow="Writing" title="최근 글">
      <div className="flex flex-col gap-4">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/posts/${post.slug}`}
            className="group flex flex-col gap-1 rounded-lg border border-hairline bg-surface p-5 transition-shadow hover:shadow-soft"
          >
            <p className="text-caption text-ink-faint">{post.publishedAt}</p>
            <h3 className="break-keep text-title text-ink group-hover:text-primary">
              {post.title}
            </h3>
            <p className="break-keep text-body-sm text-ink-muted">
              {post.summary}
            </p>
          </Link>
        ))}
      </div>
      <Link
        href="/posts"
        className="mt-6 inline-block text-body-sm text-primary hover:underline"
      >
        전체 보기 →
      </Link>
    </Section>
  );
}
```

- [ ] **Step 4: `components/home/contact.tsx` 생성**

```tsx
import { Section } from "@/components/ui/section";
import { contacts } from "@/lib/profile";

export function Contact() {
  return (
    <Section id="contact" eyebrow="Contact" title="연락처">
      <div className="flex flex-wrap gap-3">
        {contacts.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-hairline bg-surface px-5 py-2 text-button text-ink transition-colors hover:border-primary hover:text-primary"
          >
            {label}
          </a>
        ))}
      </div>
    </Section>
  );
}
```

- [ ] **Step 5: 타입 체크**

Run: `npx tsc --noEmit`
Expected: 성공

- [ ] **Step 6: 커밋**

```bash
git add components/home
git commit -m "feat: Projects·Skills·Writing·Contact 섹션 컴포넌트 추가"
```

---

### Task 9: 파이프라인 블록 1 — PipelineFlow

**Files:**
- Create: `components/pipeline/pipeline-flow.tsx`

**Interfaces:**
- Consumes: `PipelineStage`, `accentDotClass`
- Produces: `<PipelineFlow stages={PipelineStage[]} />`

- [ ] **Step 1: `components/pipeline/pipeline-flow.tsx` 생성**

```tsx
"use client";

import { useState } from "react";
import { accentDotClass } from "@/lib/accent";
import type { PipelineStage } from "@/lib/pipeline";

export function PipelineFlow({ stages }: { stages: PipelineStage[] }) {
  const [activeId, setActiveId] = useState(stages[0]?.id ?? "");
  const active = stages.find((stage) => stage.id === activeId) ?? stages[0];

  return (
    <div className="flex flex-col gap-4">
      <ol className="flex flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-0 sm:overflow-x-auto sm:pb-1">
        {stages.map((stage, index) => {
          const isActive = stage.id === active?.id;
          return (
            <li key={stage.id} className="flex items-center sm:flex-shrink-0">
              <button
                type="button"
                onClick={() => setActiveId(stage.id)}
                aria-pressed={isActive}
                className={`w-full rounded-lg border bg-surface p-4 text-left transition-shadow sm:w-[9.5rem] ${
                  isActive
                    ? "border-primary shadow-soft"
                    : "border-hairline hover:shadow-soft"
                }`}
              >
                <span
                  className={`mb-2 block h-6 w-6 rounded-full ${accentDotClass(
                    stage.accent
                  )}`}
                />
                <span className="block text-body-sm font-semibold text-ink">
                  {stage.label}
                </span>
                <span className="mt-1 block text-caption text-ink-faint">
                  {stage.caption}
                </span>
              </button>
              {index < stages.length - 1 && (
                <span
                  aria-hidden
                  className="hidden px-2 text-ink-faint sm:inline"
                >
                  →
                </span>
              )}
            </li>
          );
        })}
      </ol>

      {active && (
        <div className="rounded-lg border border-hairline bg-surface p-6">
          <p className="mb-2 text-eyebrow uppercase text-primary">
            {active.label}
          </p>
          <p className="break-keep text-body-sm text-ink-secondary">
            {active.detail}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {active.stack.map((item) => (
              <span
                key={item}
                className="rounded-full border border-hairline px-3 py-1 text-eyebrow text-primary"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: 타입 체크**

Run: `npx tsc --noEmit`
Expected: 성공

- [ ] **Step 3: 커밋**

```bash
git add components/pipeline/pipeline-flow.tsx
git commit -m "feat: 파이프라인 가로 스텝 플로우 컴포넌트 추가"
```

---

### Task 10: 파이프라인 블록 2 — ChunkingView

**Files:**
- Create: `components/pipeline/chunking-view.tsx`

**Interfaces:**
- Consumes: `DemoDocument`, `CHUNK_MIN_CHARS`, `CHUNK_MAX_CHARS`
- Produces: `<ChunkingView documents={DemoDocument[]} />`

- [ ] **Step 1: `components/pipeline/chunking-view.tsx` 생성**

```tsx
"use client";

import { useState } from "react";
import {
  CHUNK_MAX_CHARS,
  CHUNK_MIN_CHARS,
  type DemoDocument,
} from "@/lib/pipeline";

export function ChunkingView({ documents }: { documents: DemoDocument[] }) {
  const [activeId, setActiveId] = useState(documents[0]?.id ?? "");
  const doc = documents.find((item) => item.id === activeId) ?? documents[0];

  if (!doc) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {documents.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveId(item.id)}
            aria-pressed={item.id === doc.id}
            className={`rounded-full px-4 py-1.5 text-caption transition-colors ${
              item.id === doc.id
                ? "bg-secondary text-surface"
                : "border border-hairline bg-surface text-ink-muted hover:text-ink"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-hairline bg-surface p-6">
        <p className="mb-3 text-eyebrow uppercase text-primary">적용 경계 규칙</p>
        <div className="flex flex-wrap gap-2">
          {doc.boundaryRules.map((rule) => (
            <code
              key={rule}
              className="rounded-xs bg-canvas-soft px-2 py-1 text-caption text-ink-secondary"
            >
              {rule}
            </code>
          ))}
        </div>
        <p className="mt-4 break-keep text-caption text-ink-faint">
          고정 길이로 자르면 조문 중간이 끊깁니다. 계층 경계를 먼저 확정한 뒤 그 안에서만
          분할하고, 상한({CHUNK_MIN_CHARS.toLocaleString()}–
          {CHUNK_MAX_CHARS.toLocaleString()}자)을 넘으면 헤더를 유지한 채 분리합니다.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-lg border border-hairline bg-surface p-6">
          <p className="mb-3 text-eyebrow uppercase text-ink-faint">인식된 계층</p>
          <ul className="flex flex-col gap-1">
            {doc.hierarchy.map((node) => (
              <li
                key={node.id}
                className={
                  node.level === 1
                    ? "text-body-sm font-semibold text-ink"
                    : node.level === 2
                      ? "ml-3 border-l border-hairline pl-3 text-body-sm text-ink-secondary"
                      : "ml-6 border-l border-hairline pl-3 text-caption text-ink-faint"
                }
              >
                {node.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-hairline bg-surface p-6">
          <p className="mb-3 text-eyebrow uppercase text-ink-faint">생성된 청크</p>
          <ul className="flex flex-col gap-3">
            {doc.chunks.map((chunk) => (
              <li
                key={chunk.id}
                className="rounded-r-md border-l-[3px] border-accent-teal bg-canvas-soft px-4 py-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-caption font-semibold text-accent-teal">
                    {chunk.id}
                  </span>
                  <span className="text-caption text-ink-faint">
                    {chunk.charCount.toLocaleString()}자
                  </span>
                </div>
                <p className="mt-1 text-caption text-ink-faint">
                  {chunk.path}
                  {chunk.headerRepeated && (
                    <span className="ml-2 text-accent-orange">(헤더 유지)</span>
                  )}
                </p>
                <p className="mt-2 break-keep text-body-sm text-ink-secondary">
                  {chunk.text}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="text-caption text-ink-faint">
        출처: {doc.source}
        {doc.disclaimer ? ` — ${doc.disclaimer}` : ""}
      </p>
    </div>
  );
}
```

- [ ] **Step 2: 타입 체크**

Run: `npx tsc --noEmit`
Expected: 성공

- [ ] **Step 3: 커밋**

```bash
git add components/pipeline/chunking-view.tsx
git commit -m "feat: 계층 인식 청킹 뷰 컴포넌트 추가"
```

---

### Task 11: 파이프라인 블록 3 + 대비 블록

**Files:**
- Create: `components/pipeline/index-view.tsx`
- Create: `components/pipeline/extraction-compare.tsx`

**Interfaces:**
- Consumes: `indexTargets`, `extractionComparison`, `accentDotClass`
- Produces: `<IndexView />`, `<ExtractionCompare />`

- [ ] **Step 1: `components/pipeline/index-view.tsx` 생성**

```tsx
import { accentDotClass } from "@/lib/accent";
import { indexTargets, pipelineStack } from "@/lib/pipeline";

export function IndexView() {
  const owned = indexTargets.filter((target) => target.owned);
  const external = indexTargets.filter((target) => !target.owned);

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg border-2 border-primary bg-surface p-6">
        <p className="mb-4 text-eyebrow uppercase text-primary">담당 범위</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {owned.map((target) => (
            <div key={target.id} className="rounded-md bg-canvas-soft p-4">
              <div className="mb-2 flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${accentDotClass(
                    target.accent
                  )}`}
                />
                <span className="text-body-sm font-semibold text-ink">
                  {target.label}
                </span>
              </div>
              <p className="break-keep text-caption text-ink-muted">
                {target.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {external.map((target) => (
        <div
          key={target.id}
          className="rounded-lg border border-dashed border-hairline bg-surface p-5 opacity-75"
        >
          <p className="mb-2 text-eyebrow uppercase text-ink-faint">연동 범위</p>
          <p className="break-keep text-body-sm text-ink-muted">
            {target.description}
          </p>
        </div>
      ))}

      <div className="flex flex-wrap gap-2">
        {pipelineStack.map((item) => (
          <span
            key={item}
            className="rounded-full border border-hairline bg-surface px-3 py-1 text-eyebrow text-primary"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: `components/pipeline/extraction-compare.tsx` 생성**

```tsx
import { extractionComparison } from "@/lib/pipeline";

export function ExtractionCompare() {
  const { naive, structured, caption } = extractionComparison;

  return (
    <div className="rounded-lg border border-hairline bg-surface p-6">
      <p className="mb-4 text-eyebrow uppercase text-primary">
        왜 필요한가 — {caption}
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-caption font-semibold text-accent-orange">
            ✕ {naive.label}
          </p>
          <pre className="overflow-x-auto rounded-md bg-canvas-soft p-3 text-caption text-ink-muted">
            {naive.output}
          </pre>
          <p className="mt-2 break-keep text-caption text-ink-faint">
            {naive.note}
          </p>
        </div>
        <div>
          <p className="mb-2 text-caption font-semibold text-accent-green">
            ✓ {structured.label}
          </p>
          <pre className="overflow-x-auto rounded-md bg-canvas-soft p-3 text-caption text-ink-secondary">
            {structured.output}
          </pre>
          <p className="mt-2 break-keep text-caption text-ink-faint">
            {structured.note}
          </p>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: 타입 체크**

Run: `npx tsc --noEmit`
Expected: 성공

- [ ] **Step 4: 커밋**

```bash
git add components/pipeline
git commit -m "feat: 이중 색인 뷰 및 추출 방식 대비 블록 추가"
```

---

### Task 12: 파이프라인 섹션 조립 + 홈 조립

**Files:**
- Create: `components/pipeline/pipeline-section.tsx`
- Modify: `app/page.tsx` (전체 교체)

**Interfaces:**
- Consumes: Task 7~11의 모든 컴포넌트
- Produces: 완성된 홈 페이지

- [ ] **Step 1: `components/pipeline/pipeline-section.tsx` 생성**

```tsx
import { Section } from "@/components/ui/section";
import { ChunkingView } from "@/components/pipeline/chunking-view";
import { ExtractionCompare } from "@/components/pipeline/extraction-compare";
import { IndexView } from "@/components/pipeline/index-view";
import { PipelineFlow } from "@/components/pipeline/pipeline-flow";
import { demoDocuments, pipelineStages } from "@/lib/pipeline";

export function PipelineSection() {
  return (
    <Section
      id="pipeline"
      eyebrow="Document Pipeline"
      title="문서 전처리 파이프라인 — 이렇게 설계합니다"
      wide
    >
      <div className="flex flex-col gap-12">
        <div className="flex flex-col gap-4">
          <h3 className="text-heading-3 text-ink">파이프라인 개요</h3>
          <PipelineFlow stages={pipelineStages} />
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-heading-3 text-ink">계층 인식 청킹</h3>
          <ChunkingView documents={demoDocuments} />
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-heading-3 text-ink">이중 색인</h3>
          <IndexView />
        </div>

        <ExtractionCompare />
      </div>
    </Section>
  );
}
```

- [ ] **Step 2: `app/page.tsx` 전체 교체**

```tsx
import { About } from "@/components/home/about";
import { CareerTimeline } from "@/components/home/career-timeline";
import { Contact } from "@/components/home/contact";
import { Hero } from "@/components/home/hero";
import { ProjectList } from "@/components/home/project-list";
import { RecentPosts } from "@/components/home/recent-posts";
import { SkillGroups } from "@/components/home/skill-groups";
import { PipelineSection } from "@/components/pipeline/pipeline-section";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <CareerTimeline />
      <ProjectList />
      <PipelineSection />
      <SkillGroups />
      <RecentPosts />
      <Contact />
    </>
  );
}
```

- [ ] **Step 3: 빌드 및 테스트**

Run: `npm test && npx tsc --noEmit && npm run build`
Expected: 전부 성공

- [ ] **Step 4: 브라우저에서 확인**

`http://localhost:3000`을 열고 확인한다:
- Hero가 딥 인디고 풀블리드 밴드로 표시되는가
- 8개 섹션이 순서대로 나타나는가
- 파이프라인 노드를 클릭하면 하단 상세가 바뀌는가
- 문서 유형 탭을 누르면 계층/청크가 바뀌는가
- 모바일 폭(375px)에서 가로 스크롤이 발생하지 않는가

- [ ] **Step 5: 커밋**

```bash
git add components/pipeline/pipeline-section.tsx app/page.tsx
git commit -m "feat: 파이프라인 섹션 및 홈 페이지 조립"
```

---

### Task 13: 블로그 페이지 개편

**Files:**
- Modify: `app/posts/page.tsx` (전체 교체)
- Modify: `app/posts/[slug]/page.tsx` (전체 교체)
- Modify: `components/post-toc.tsx` (전체 교체)
- Modify: `components/mdx.tsx:38` (article className)
- Modify: `app/globals.css` (`.prose a` 및 테이블 색상 토큰화)

**Interfaces:**
- Consumes: `allPosts`, `extractToc`, `TocItem`

- [ ] **Step 1: `app/posts/page.tsx` 전체 교체**

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { allPosts } from "contentlayer/generated";

export const metadata: Metadata = {
  title: "Archive",
  description: "기록",
};

function PostPage() {
  const posts = [...allPosts].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-16">
      <p className="mb-2 text-eyebrow uppercase text-ink-faint">Archive</p>
      <h1 className="mb-8 text-heading-2 text-ink sm:text-heading-1">아카이브</h1>
      <div className="flex flex-col gap-4">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/posts/${post.slug}`}
            className="group flex flex-col gap-1 rounded-lg border border-hairline bg-surface p-5 transition-shadow hover:shadow-soft"
          >
            <p className="text-caption text-ink-faint">{post.publishedAt}</p>
            <h2 className="break-keep text-title text-ink group-hover:text-primary">
              {post.title}
            </h2>
            <p className="break-keep text-body-sm text-ink-muted">
              {post.summary}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default PostPage;
```

- [ ] **Step 2: `app/posts/[slug]/page.tsx` 전체 교체**

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Balancer from "react-wrap-balancer";
import { allPosts } from "contentlayer/generated";
import { Mdx } from "@/components/mdx";
import { PostToc } from "@/components/post-toc";
import { extractToc } from "@/lib/toc";

export async function generateStaticParams() {
  return allPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata | undefined> {
  const post = allPosts.find((item) => item.slug === params.slug);
  if (!post) return;

  const { title, publishedAt: publishedTime, summary: description, slug } = post;

  return {
    title,
    description,
    openGraph: {
      title: { absolute: title },
      description,
      type: "article",
      publishedTime,
      url: `https://chanlog.blog/posts/${slug}`,
    },
  };
}

const Post = ({ params }: { params: { slug: string } }) => {
  const post = allPosts.find((item) => item.slug === params.slug);
  if (!post) notFound();

  const toc = extractToc(post.body.raw);

  return (
    <>
      <PostToc items={toc} title={post.title} />
      <article className="mx-auto w-full max-w-3xl px-6 py-16">
        <header className="mb-8 border-b border-hairline pb-6">
          <p className="text-caption text-ink-faint">{post.publishedAt}</p>
          <h1 className="mt-2 break-keep text-heading-2 text-ink sm:text-heading-1">
            <Balancer>{post.title}</Balancer>
          </h1>
          <p className="mt-2 break-keep text-body-md text-ink-muted">
            {post.summary}
          </p>
        </header>
        <Mdx code={post.body.code} />
      </article>
    </>
  );
};

export default Post;
```

기존 `if (!post) return false;`는 잘못된 처리다 (React 컴포넌트가 `false`를 반환하면 빈 페이지가
200으로 응답된다). `notFound()`로 바꿔 404를 반환한다.

- [ ] **Step 3: `components/post-toc.tsx` 전체 교체**

```tsx
import type { TocItem } from "@/lib/toc";

export function PostToc({ items, title }: { items: TocItem[]; title: string }) {
  if (items.length === 0) return null;

  return (
    <aside className="fixed right-8 top-24 hidden max-h-[calc(100vh-8rem)] w-60 overflow-y-auto xl:block">
      <div className="rounded-xl border border-hairline bg-surface p-4 shadow-soft">
        <p className="mb-3 line-clamp-2 text-eyebrow uppercase text-ink-faint">
          {title}
        </p>
        <ul className="flex flex-col gap-1">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`block rounded-sm px-2 py-1.5 text-caption transition-colors hover:bg-canvas-soft hover:text-primary ${
                  item.level === 3
                    ? "ml-2 border-l border-hairline pl-3 text-ink-faint"
                    : "text-ink-secondary"
                }`}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
```

- [ ] **Step 4: `components/mdx.tsx`의 `article` className 교체**

38행의 긴 className을 아래로 바꾼다.

```tsx
    <article className="prose prose-sm max-w-none break-keep text-ink-secondary prose-headings:text-ink prose-a:text-primary sm:prose-base">
```

`dark:prose-invert`를 제거했다 — 다크모드 미지원.

- [ ] **Step 5: `app/globals.css`의 하드코딩 색상 토큰화**

`.prose a`의 `text-decoration-color: #374151;`를 지우고 다크모드 클래스를 제거한다.

```css
.prose a {
  @apply decoration-[0.1em] underline-offset-2 transition-all;
}
```

`code` 규칙의 다크모드 클래스도 제거한다.

```css
code {
  @apply bg-canvas-soft;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
}
```

`div[data-rehype-pretty-code-title]`의 `dark:bg-[#0F141D]`를 제거한다.

```css
div[data-rehype-pretty-code-title] {
  @apply bg-[#1f2937];
  color: #fff;
  padding: 0.5em 1.14286em;
  border-radius: 0.375rem 0.375rem 0 0;
  transform: translateY(10px);
  font-size: 0.875rem;
}
```

테이블 규칙의 `#cbd5e1` `#e2e8f0` `#f8fafc` `#0f172a`는 각각 `#e6e6e6` `#e6e6e6` `#f6f5f4`
`#000000`으로 바꾼다 (총 8곳 — 데스크톱 규칙 5곳, 모바일 미디어쿼리 3곳).

- [ ] **Step 6: 빌드 및 브라우저 확인**

Run: `npm test && npx tsc --noEmit && npm run build`
Expected: 전부 성공

브라우저에서 `http://localhost:3000/posts`와 글 상세 페이지 하나를 열어 표·코드블록·TOC가
정상 표시되는지 확인한다.

- [ ] **Step 7: 커밋**

```bash
git add app/posts components/post-toc.tsx components/mdx.tsx app/globals.css
git commit -m "feat: 블로그 목록·상세 페이지 디자인 개편 및 404 처리 수정"
```

---

### Task 14: `/info` 삭제 · 메타데이터 정리 · CLAUDE.md 작성

**Files:**
- Delete: `app/info/page.tsx`
- Modify: `app/sitemap.ts` (전체 교체)
- Create: `CLAUDE.md`

- [ ] **Step 1: `/info` 라우트 삭제**

```bash
git rm -r app/info
```

- [ ] **Step 2: `app/sitemap.ts` 전체 교체**

```ts
import { allPosts } from "contentlayer/generated";
import type { MetadataRoute } from "next";

const SITE_URL = "https://chanlog.blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = allPosts.map((post) => ({
    url: `${SITE_URL}/posts/${post.slug}`,
    lastModified: post.publishedAt,
  }));

  const routes = ["", "/posts"].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date().toISOString().split("T")[0],
  }));

  return [...routes, ...posts];
}
```

두 가지를 고쳤다: 글 URL이 `/post/`였던 오타를 `/posts/`로, 삭제된 `/info`를 목록에서 제거.

- [ ] **Step 3: `CLAUDE.md` 작성**

````markdown
# CLAUDE.md

이재찬의 포트폴리오 사이트 겸 블로그. Next.js 14 App Router 기반.

## 명령어

```bash
npm run dev     # 개발 서버 (포트 3000)
npm run build   # 프로덕션 빌드
npm test        # vitest 실행
npx tsc --noEmit  # 타입 체크
```

개발 서버는 `.claude/launch.json`에 `chanlog`라는 이름으로 등록되어 있다.

## 기술 스택

Next.js 14 (App Router) · TypeScript · Tailwind CSS 3 · contentlayer2 (MDX) ·
framer-motion · vitest

## 디렉터리 구조

```
app/            라우트. page.tsx는 섹션 조립만 담당한다
components/
  home/         홈 섹션 컴포넌트
  pipeline/     문서 전처리 파이프라인 시연 컴포넌트
  ui/           Section·Chip·Card 프리미티브
lib/
  profile.ts    경력·프로젝트·스킬 데이터
  pipeline.ts   파이프라인·데모 문서·청크 데이터
  accent.ts     accent 색상 클래스 매핑
content/        블로그 글 (.mdx)
```

## 콘텐츠 수정 규칙

경력·프로젝트·스킬·파이프라인 내용은 **반드시 `lib/profile.ts`와 `lib/pipeline.ts`에서만**
수정한다. 컴포넌트에 문자열을 직접 넣지 않는다. 두 파일에는 데이터 무결성 테스트가 붙어 있다.

## 디자인 규칙

디자인 언어는 `DESIGN.md`(Notion 분석)를 따른다. 설계 근거는
`docs/superpowers/specs/2026-08-07-portfolio-redesign-design.md`에 있다.

- **색상은 반드시 Tailwind 토큰으로 지정한다.** `#` 리터럴이나 `bg-blue-950` 같은
  기본 팔레트를 쓰지 않는다
- `primary` (`#0075de`) — CTA·링크·포커스 전용. 장식에 쓰지 않는다
- `secondary` (`#213183`) — Hero 밴드에만. 반복하지 않는다
- `accent-*` — 칩 닷·파이프라인 노드·요소 분류 전용. CTA나 구조 채색에 쓰지 않는다
- 페이지 배경은 `bg-canvas-soft`, 카드는 `bg-surface` + `border-hairline`
- 그림자는 `shadow-soft` / `shadow-elevated`만 사용. 강한 드롭섀도 금지
- 타이포는 `text-display-1` `text-heading-2` `text-body-md` 등 토큰만 사용
- **다크모드 미지원.** `dark:` 유틸리티를 추가하지 않는다
- 애니메이션은 섹션 진입 페이드업만. `Section` 컴포넌트가 처리하며
  `prefers-reduced-motion`을 존중한다

## 폰트

```css
font-family: 'SF Pro Display', 'SF Pro Text', 'PretendardLocal', sans-serif;
```

`next/font/local`을 쓰지 않는다. 해시된 패밀리명이 생성되어 `PretendardLocal`이라는 이름이
매칭되지 않기 때문이다. `app/globals.css`에서 `@font-face`로 직접 선언한다.
SF Pro는 Apple 기기에만 있으므로 그 외 환경은 Pretendard로 렌더된다. 의도된 동작이다.

## 포트폴리오 기재 원칙

**기재 가능** — 범용 오픈소스 스택명, 설계 방법론, 공개 자료를 대상으로 한 시연

**기재 금지**
- 고객사 실제 문서 내용 및 샘플
- 처리 건수·데이터 규모·정확도 등 수치
- 내부 시스템 구성도, 서버 스펙, 망 구조
- 확신 없는 기술 세부값 (특정 모델 버전, 결합 알고리즘, 형태소 분석기)

파이프라인 섹션에는 고객사명을 넣지 않는다. 이 섹션은 특정 프로젝트가 아니라
**본인의 방법론 시연**으로 프레이밍한다.
````

- [ ] **Step 4: 전체 검증**

Run: `npm test && npx tsc --noEmit && npm run build`
Expected: 전부 성공. 빌드 출력에 `/info` 라우트가 없어야 한다.

- [ ] **Step 5: 브라우저 최종 확인**

- `http://localhost:3000` — 8개 섹션 전체
- `http://localhost:3000/posts` — 목록
- `http://localhost:3000/info` — 404
- 375px 폭에서 가로 스크롤 없음

- [ ] **Step 6: 커밋**

```bash
git add -A
git commit -m "feat: /info 삭제, 사이트맵 URL 수정, CLAUDE.md 추가"
```

---

## 완료 후

전체 태스크가 끝나면 `superpowers:finishing-a-development-branch` 스킬로 `main` 병합 여부를
결정한다. Vercel 프로덕션 배포 전 프리뷰 배포에서 폰트 로딩과 모바일 레이아웃을 확인할 것.
