# Chanlog 프로젝트 가이드

## 개요

이재찬의 기술 아카이브 겸 포트폴리오 사이트입니다. Next.js 14 App Router로 구성되며, `/`는 썸네일 글 아카이브, `/portfolio`는 인라인 문서 전처리기 사례를 포함한 포트폴리오, `/posts/[slug]`는 글 상세를 제공합니다. 기존 `/pipeline`은 페이지가 아니라 `/portfolio#document-preprocessor`로 이동하는 308 영구 redirect입니다. `/pipeline`에는 별도 canonical, 내비게이션, sitemap 항목이 없습니다.

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
- `lib/profile.ts`, `lib/document-preprocessor.ts`, `lib/accent.ts`: 프로필 데이터, 인라인 데모 데이터·상태 계약, 색상 매핑
- `content/`: MDX 블로그 글

경력·프로젝트·스킬 데이터는 `lib/profile.ts`에서만 수정합니다. 인라인 데모의 카피, 이미지 경로, 출처, 영역 좌표, semantic result, 상태 계약은 `lib/document-preprocessor.ts`에서만 수정합니다. 컴포넌트에 이 데이터를 중복하지 않습니다.

## 디자인 규칙

디자인의 기준 문서는 `DESIGN.md`, `docs/superpowers/specs/2026-08-07-portfolio-redesign-design.md`, `docs/superpowers/specs/2026-08-21-inline-document-preprocessor-design.md`입니다. 마지막 문서는 두 이전 설계의 독립 파이프라인 섹션만 제한적으로 대체하며, 아카이브·공통 디자인·안전성 규칙은 계속 적용됩니다.

- 임의 색상·그림자·타이포그래피 대신 Tailwind 디자인 토큰만 사용합니다.
- `primary`는 CTA·링크·포커스·활성 선택 상태와 명시된 `badge-pill` 컴포넌트에만, `secondary`는 Hero에만 사용합니다.
- `accent-*`는 칩의 점, 파이프라인 노드, 요소 분류에만 사용합니다.
- 표면은 `bg-canvas-soft`, `bg-surface`, `border-hairline`으로 구분하고 그림자는 `shadow-soft` 또는 `shadow-elevated`만 사용합니다.
- 타이포그래피 토큰을 사용하며 다크 모드는 지원하지 않습니다.
- Framer Motion/페이지 애니메이션은 Section 진입 fade-up만 허용하고 reduced motion 환경을 존중합니다. CSS hover·focus 상호작용 피드백은 허용합니다.

글꼴 스택은 정확히 `'SF Pro Display', 'SF Pro Text', 'PretendardLocal', sans-serif`입니다. `PretendardLocal`은 안정적인 패밀리명을 유지해야 하므로 `next/font/local` 대신 `@font-face`로 선언합니다.

## 포트폴리오 안전성

범용 OSS 스택, 설계 방법론, 공개 자료 기반 데모는 기재할 수 있습니다. 고객 문서·샘플, 처리 건수·규모·정확도, 내부 아키텍처·명세·네트워크, 확신 없는 기술 세부값은 기재하지 않습니다. 문서 전처리기 데모는 공개 자료인 관세청 PDF 1쪽의 단일 derivative만 사용하고, 고객·내부·정량 주장을 만들지 않습니다. `Chroma`, `Elasticsearch`, `BGE`, indexing 등 금지된 기술 상세도 이 데모에 추가하지 않습니다.
