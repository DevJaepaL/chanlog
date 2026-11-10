# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

---

# Chanlog 프로젝트 가이드

## 개요

이재찬의 기술 아카이브 겸 포트폴리오 사이트입니다. Next.js 14 App Router로 구성되며, `/`는 글 아카이브, `/portfolio`는 인라인 문서 전처리기 사례를 포함한 포트폴리오, `/posts/[slug]`는 글 상세를 제공합니다. 기존 `/pipeline`은 페이지가 아니라 `/portfolio#document-preprocessor`로 이동하는 308 영구 redirect입니다. `/pipeline`에는 별도 canonical, 내비게이션, sitemap 항목이 없습니다.

2026-11-10 현재 운영 코드에는 사용자가 목업 비교로 선택한 **토스 테크형 A안**(`design-review/mockup-a-toss.html`)이 적용돼 있습니다(커밋 전). 아카이브 썸네일은 유지합니다. 썸네일을 없앤 밝은 기술 노트 리뉴얼은 사용자가 거부했으므로 다시 적용하지 않습니다. 최신 상태는 `docs/handoff/2026-11-10-design-renewal.md`, 재개 규칙은 `AGENTS.md`를 읽습니다. 새 행동 원칙은 이미 결정된 요구사항을 다시 승인받거나 관련 없는 개선을 추가하기 위한 절차가 아닙니다.

## 명령어

- `& 'C:\Users\META06\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' '.\node_modules\next\dist\bin\next' dev` — 개발 서버 실행
- `& 'C:\Users\META06\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' '.\node_modules\next\dist\bin\next' build` — 프로덕션 빌드
- `& 'C:\Users\META06\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' '.\node_modules\vitest\vitest.mjs' run` — Vitest 테스트 실행
- `& 'C:\Users\META06\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' '.\node_modules\typescript\bin\tsc' --noEmit` — TypeScript 검사

## 스택과 구조

- Next.js 14 App Router, TypeScript, Tailwind CSS 3, contentlayer2/MDX, framer-motion, Vitest
- `app/`: 아카이브·포트폴리오·글 상세 라우트와 얇은 페이지 조립 코드
- `components/home`, `components/portfolio`, `components/ui`: 포트폴리오 섹션, 인라인 문서 전처리기 시연, 공용 UI
- `components/portfolio/document-preprocessor-section.tsx`: 섹션 shell과 접힌 카드 조립
- `components/portfolio/document-preprocessor-demo.tsx`: client toggle·preview·pin 상호작용
- `components/ui/skill-icon.tsx`: 기술 칩의 브랜드 로고·개념 아이콘 매핑
- `lib/profile.ts`, `lib/document-preprocessor.ts`, `lib/accent.ts`: 프로필 데이터, 인라인 데모 데이터·상태 계약, 색상 매핑
- `content/`: MDX 블로그 글

경력·프로젝트·스킬 데이터는 `lib/profile.ts`에서만 수정합니다. 인라인 데모의 카피, 이미지 경로, 출처, 영역 좌표, semantic result, 상태 계약은 `lib/document-preprocessor.ts`에서만 수정합니다. 컴포넌트에 이 데이터를 중복하지 않습니다.

## 디자인 규칙

현재 시각 기준은 `design-review/mockup-a-toss.html`(토스 테크형 A안)과 사용자의 최신 명시적 지시입니다. `docs/superpowers/specs/2026-10-16-design-renewal-design.md`와 같은 날짜의 plan은 거부된 리뉴얼 기록이며 구현 기준이 아닙니다. `DESIGN.md`, `docs/superpowers/specs/2026-08-07-portfolio-redesign-design.md`, `docs/superpowers/specs/2026-08-21-inline-document-preprocessor-design.md`는 이전 디자인 및 기능 배경입니다. A안은 남색 공통 헤더/Hero 등 충돌하는 시각 규칙을 대체하며, 기존 데이터 소유권·공개 자료 안전성·URL/앵커·포트폴리오 기능 보존 규칙은 계속 적용합니다. 새 디자인 변경은 목업으로 먼저 비교받습니다. 아래 토큰 사용 규칙에서 기존 색상의 사용 범위를 제한한 것은 해당 색상을 새 화면에 반드시 사용하라는 뜻이 아닙니다.

- 임의 색상·그림자·타이포그래피 대신 Tailwind 디자인 토큰만 사용합니다.
- `primary`는 CTA·링크·포커스·활성 선택 상태와 명시된 `badge-pill` 컴포넌트, 글의 첫 태그(`primary-soft` 배경)에만, `secondary`는 Hero에만 사용합니다.
- `accent-*`는 아이콘이 없는 칩의 점, 파이프라인 노드, 요소 분류에만 사용합니다. 기술 칩의 브랜드 로고 색은 `skill-icon.tsx`의 공식 브랜드 색을 따릅니다.
- 표면은 `bg-surface`, `bg-canvas-soft`, `bg-canvas-muted`, `border-canvas-muted`, `border-hairline`으로 구분하고 그림자는 `shadow-soft` 또는 `shadow-elevated`만 사용합니다.
- 타이포그래피 토큰을 사용하며 다크 모드는 지원하지 않습니다.
- Framer Motion/페이지 애니메이션은 Section 진입 fade-up만 허용하고 reduced motion 환경을 존중합니다. CSS hover·focus 상호작용 피드백은 허용합니다.
- 파이프라인 도식(RPA, 문서 전처리)은 `components/portfolio/pipeline-run.tsx`의 "실행 화면형" 단계 재생(대기→처리 중→완료, 연결선 채움, 하단 단계 안내 바)을 사용합니다. 사용자 결정으로 OS 동작 줄이기 설정과 관계없이 화면에 보이면 자동 재생하며, 일시정지·이전·다음 버튼을 반드시 유지합니다. 동작 줄이기 환경에서는 이동하는 점과 회전 아이콘만 생략합니다.
- 헤더는 아카이브·About·Contact(글자 링크)만 둡니다. GitHub·Instagram·Contact 버튼(이 순서)은 프로필 카드(메인 카드, About Hero)에만 둡니다.
- About은 상단 고정 바로가기 탭(`app/portfolio/layout.tsx`)과 섹션·프로젝트 접기를 사용합니다. 접힌 내용도 마크업에 남기고(`hidden`), URL 해시가 가리키면 자동으로 펼칩니다(`components/ui/use-hash-reveal.ts`).
- 구분선은 `border-hairline`을 사용합니다(`canvas-muted`는 흰 바탕에서 거의 보이지 않음).

글꼴 스택은 정확히 `'SF Pro Display', 'SF Pro Text', 'PretendardLocal', sans-serif`입니다. `PretendardLocal`은 안정적인 패밀리명을 유지해야 하므로 `next/font/local` 대신 `@font-face`로 선언합니다.

## 포트폴리오 안전성

범용 OSS 스택, 설계 방법론, 공개 자료 기반 데모는 기재할 수 있습니다. 고객 문서·샘플, 처리 건수·규모·정확도, 내부 아키텍처·명세·네트워크, 확신 없는 기술 세부값은 기재하지 않습니다. 문서 전처리기 데모는 공개 자료인 관세청 PDF 1쪽의 단일 derivative만 사용하고, 고객·내부·정량 주장을 만들지 않습니다. `Chroma`, `Elasticsearch`, `BGE`, indexing 등 금지된 기술 상세도 이 데모에 추가하지 않습니다.
