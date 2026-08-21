# Chanlog 프로젝트 가이드

## 개요

이재찬의 기술 아카이브 겸 포트폴리오 사이트입니다. Next.js 14 App Router로 구성되며, `/`는 썸네일 글 아카이브, `/portfolio`는 포트폴리오, `/pipeline`은 문서 전처리 파이프라인, `/posts/[slug]`는 글 상세를 제공합니다.

## 명령어

- `npm run dev` — 개발 서버 실행 (`.claude/launch.json`에는 `chanlog` 이름으로 등록됨)
- `npm run build` — 프로덕션 빌드
- `npm test` — Vitest 테스트 실행
- `npx tsc --noEmit` — TypeScript 검사

## 스택과 구조

- Next.js 14 App Router, TypeScript, Tailwind CSS 3, contentlayer2/MDX, framer-motion, Vitest
- `app/`: 아카이브·포트폴리오·파이프라인·글 상세 라우트와 얇은 페이지 조립 코드
- `components/home`, `components/pipeline`, `components/ui`: 포트폴리오 섹션, 파이프라인 시연, 공용 UI
- `lib/profile.ts`, `lib/pipeline.ts`, `lib/accent.ts`: 포트폴리오와 파이프라인 데이터·타입·색상 매핑
- `content/`: MDX 블로그 글

경력·프로젝트·스킬·파이프라인 콘텐츠는 컴포넌트가 아닌 `lib/profile.ts`와 `lib/pipeline.ts`에서만 수정합니다. 해당 데이터 소유 규칙을 검증하는 integrity 테스트가 있습니다.

## 디자인 규칙

디자인의 기준 문서는 `DESIGN.md`와 `docs/superpowers/specs/2026-08-07-portfolio-redesign-design.md`입니다.

- 임의 색상·그림자·타이포그래피 대신 Tailwind 디자인 토큰만 사용합니다.
- `primary`는 CTA·링크·포커스·활성 선택 상태와 명시된 `badge-pill` 컴포넌트에만, `secondary`는 Hero에만 사용합니다.
- `accent-*`는 칩의 점, 파이프라인 노드, 요소 분류에만 사용합니다.
- 표면은 `bg-canvas-soft`, `bg-surface`, `border-hairline`으로 구분하고 그림자는 `shadow-soft` 또는 `shadow-elevated`만 사용합니다.
- 타이포그래피 토큰을 사용하며 다크 모드는 지원하지 않습니다.
- Framer Motion/페이지 애니메이션은 Section 진입 fade-up만 허용하고 reduced motion 환경을 존중합니다. CSS hover·focus 상호작용 피드백은 허용합니다.

글꼴 스택은 정확히 `'SF Pro Display', 'SF Pro Text', 'PretendardLocal', sans-serif`입니다. `PretendardLocal`은 안정적인 패밀리명을 유지해야 하므로 `next/font/local` 대신 `@font-face`로 선언합니다.

## 포트폴리오 안전성

범용 OSS 스택, 설계 방법론, 공개 자료 기반 데모는 기재할 수 있습니다. 고객 문서·샘플, 처리 건수·규모·정확도, 내부 아키텍처·명세·네트워크, 확신 없는 기술 세부값은 기재하지 않습니다. 파이프라인은 고객사명을 제외한 방법론 시연으로만 다룹니다.
