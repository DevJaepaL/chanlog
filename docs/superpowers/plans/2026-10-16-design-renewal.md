# CHANLOG Design Renewal Implementation Plan

> **폐기됨 (2026-11-10):** 이 계획은 실행하지 않는다. 구현 결과를 사용자가 거부했고, 현재 기준은 토스 테크형 A안(`design-review/mockup-a-toss.html`)이다. 상태는 `docs/handoff/2026-11-10-design-renewal.md`를 본다.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 승인된 기술 노트 디자인을 운영 사이트에 적용하되 아카이브 썸네일을 제외하고 기존 포트폴리오 콘텐츠와 기능 전체를 보존한다.

**Architecture:** 현행 Next.js 라우트와 데이터 모듈을 유지하고 화면 조립·스타일을 변경한다. 두 작업자가 파일 소유권을 나눠 공용 화면/아카이브와 포트폴리오/글 상세를 구현한다. 기존 interactive 컴포넌트는 제거·정적 복제하지 않는다.

**Tech Stack:** Next.js 14.0.3, React 18.2, Tailwind CSS 3.4, TypeScript, MDX/contentlayer2, Framer Motion, Vitest 4.

**Spec:** `docs/superpowers/specs/2026-10-16-design-renewal-design.md` (최신 사용자 지시), `design-review/review.md` (설계 배경).

## Global Constraints

- 홈 아카이브에는 **썸네일을 표시하지 않는다**. 원본 파일과 MDX frontmatter는 삭제하지 않는다. 글 본문의 이미지와 포트폴리오 이미지는 유지한다.
- 직접 작성된 제목·요약·본문·소개·경력·프로젝트·연락 정보를 그대로 사용한다. AI 슬로건, 임의 성과, 가짜 사례를 추가하지 않는다.
- 기존 컴포넌트의 모든 데모·갤러리·RPA·경력·스킬·연락 기능을 보존한다.
- 새 패키지, 라우트 개편, 원문 재작성은 범위 밖이다.
- 현재 dirty workspace를 사용하고 기존 수정/미추적 파일을 보존한다. git reset/clean/전체 add/commit을 하지 않는다.
- 구현은 이미 승인되었다. 계획을 저장한 뒤 추가 승인 대기 없이 지정 작업자에게 넘긴다.

## Review Focus

1. 글에 thumbnail 값이 있어도 홈은 텍스트로만 표시하고 제목·요약·태그·링크는 보존해야 한다 (Task A SSR 검사).
2. 목업에 없었던 신한 RPA 상세 노드와 문서 전처리 demo가 새 프로젝트 구성에도 존재해야 한다 (Task B 보존 검사 + 브라우저 열기/선택/Escape).
3. 716px 중간 폭에서 긴 제목·목차·프로젝트 도해가 서로 겹치거나 페이지 밖으로 나가지 않아야 한다 (Task B + 통합 화면 검사).
4. 경력·스킬·로고·연락 링크는 화면 재배열 뒤에도 사라지지 않아야 한다 (Task B 데이터 기반 보존 검사).
5. 적은 글/빈 필터 결과/긴 코드/키보드 탐색에서도 상태 안내와 콘텐츠 접근이 유지되어야 한다 (Task A 아카이브 기존 로직 검사, Task B 목차·overflow 검사).

## 작업 소유권과 인터페이스

| 작업자 | 독점 수정 파일 |
|---|---|
| A designer | `tailwind.config.js`, `app/globals.css`, `app/layout.tsx`(필요한 shell 클래스만), `components/navbar.tsx`, `components/footer.tsx`, `components/archive/post-archive.tsx`, `components/ui/section.tsx`, `components/ui/card.tsx`, `lib/chrome.test.ts`, `lib/post-archive.test.ts`, `lib/navigation.test.ts`(필요 시), `design-review/chanlog-redesign.html`, `DESIGN.md`, `CLAUDE.md` 디자인 규칙 부분 |
| B executor | `app/portfolio/page.tsx`, `app/posts/[slug]/page.tsx`, `components/home/*`, `components/portfolio/*`, `components/mdx.tsx`, `components/post-toc.tsx`, `lib/portfolio-ui.test.ts`, `lib/document-preprocessor-ui.test.ts`, 필요 시 새 `lib/post-reading-ui.test.ts`와 글 상세 전용 컴포넌트 |
| Architect | 본 계획·spec, `design-review/review.md` 최신 지시 기록 |

`lib/profile.ts`, `lib/posts.ts`, `lib/document-preprocessor.ts`, `lib/rpa-pipeline.ts`, `lib/pipeline.ts`, `lib/toc.ts`, `content/*`는 기본적으로 읽기 전용이다. 소유권 밖 수정이 필요하면 부모에게 요청한다.

공용 인터페이스는 기존 그대로 유지한다:

```tsx
NavbarView({ pathname }: { pathname: string | null })
PostArchive({ posts }: { posts: readonly ArchivePost[] })
PostToc({ items, title }: { items: TocItem[]; title: string })
Mdx({ code }: { code: string })
Section({ id, eyebrow, title, children, wide }: SectionProps)
```

`SectionProps`의 기존 속성은 삭제하지 않는다. B는 기존 semantic token 이름을 사용하고 globals.css에 직접 쓰지 않는다. 본문·표 CSS 변경 요청은 A에게 전달한다. A는 token 설정 후 B에게 알린다. 공용 `chrome.test.ts`에 Hero 관련 검사가 있으므로 A는 Hero 구조 assertions를 B의 변경과 조정하며 중복 파일 편집은 하지 않는다.

## Task A: 공용 디자인과 텍스트 아카이브

- [ ] 현재 토큰·헤더·푸터·아카이브를 읽고 기존 테스트를 실행해 baseline 실패를 기록한다.
- [ ] `lib/post-archive.test.ts`의 썸네일 우선 로딩 검사를 제거하고 원본 데이터를 가진 텍스트 목록 계약으로 바꾼다. 최소 핵심 assertion:

```tsx
expect(markup).toContain("Post 1");
expect(markup).toContain("Summary 1");
expect(markup).toContain('/posts/post-1');
expect(markup).not.toContain('<img');
expect(markup).toContain('aria-pressed="true"');
expect(markup).toContain('aria-live="polite"');
```

- [ ] 기존 13개 fixture의 첫 6개/더 보기 계약을 유지한다. 테스트를 먼저 실행하여 썸네일 제거 전 실패를 확인한다.
- [ ] spec의 색상 값을 기존 semantic token에 적용한다. 헤더는 밝은 배경의 로고·글·About를 읽기 쉬운 크기로 보여 주고 외부 링크는 푸터에서 계속 접근 가능하게 한다. active nav/focus/44px 타깃을 보존한다.
- [ ] 아카이브의 Image import, 렌더링과 빈 이미지 placeholder를 제거하고 날짜·제목·요약·원래 태그의 행 목록으로 배치한다. 필터·결과 수·더 보기 로직은 그대로 사용한다.
- [ ] shared Section은 SSR/모션 제한 환경에서도 콘텐츠가 보이게 한다. B의 Hero 구조 변경을 존중하며 새 화면에서 navy hero를 강제하지 않는다.
- [ ] 기존 글 글로벌 CSS에서 표·코드의 내부 스크롤을 보존한다. B 요청이 오면 본문 가독성 스타일만 통합한다.
- [ ] mockup도 홈 썸네일 제거로 동기화하고 DESIGN.md/CLAUDE.md의 낡은 디자인 규칙을 새 승인안으로 갱신하되 데이터·안전성 규칙은 보존한다.
- [ ] navy 배경/11px 글자/특정 여백만 고정하는 chrome test를 현재 링크·선택·focus 의미 보존 테스트로 변경한다. 낡은 외형 테스트 때문에 제품을 이전 디자인으로 되돌리지 않는다.
- [ ] `lib/chrome.test.ts`, `lib/post-archive.test.ts`, `lib/navigation.test.ts`, `lib/posts.test.ts` 실행 결과와 변경 파일을 부모에게 보고한다.

## Task B: 전체 포트폴리오 보존과 읽기 화면

- [ ] 페이지 조립과 모든 프로젝트 detail 분기를 읽고 baseline `portfolio-ui`, `document-preprocessor-ui`, `rpa-pipeline`, `toc` 테스트를 실행한다.
- [ ] 전체 프로젝트 원문/데모가 살아 있는지 확인하는 regression assertion을 추가한다. 기존 SSR 렌더 방식과 escaping을 사용한다:

```tsx
const markup = renderToStaticMarkup(createElement(ProjectList));
expect(markup).toContain('id="rpa-pipeline-panel"');
expect(markup).toContain('RPA 이미지 처리 파이프라인');
expect(markup).toContain('id="document-preprocessor"');
expect(markup).toContain('신한카드 RPA 운영 고도화 프로젝트');
expect(markup).toContain('B은행 생성형 AI 서비스 실증사업');
```

- [ ] `profile.about.greeting`, summaries, 각 project.role/experience/skills를 직접 사용한다. 줄배치와 섹션 순서는 바꿔도 원문 문자열·프로젝트·경력·스킬·연락은 삭제하지 않는다. 프로필 사진과 조직 로고도 재배치하여 유지한다.
- [ ] 소개/대표 프로젝트/나머지 프로젝트/경력/기술 구조로 재배열한다. 프로젝트 details 분기는 반드시 그대로 연결한다:

```tsx
{project.previews && <ProjectGallery previews={project.previews} />}
{project.detail === "rpa-ocr-pipeline" && <RpaPipelineDisclosure />}
{project.detail === "document-preprocessor-pipeline" && <DocumentPreprocessorDetail />}
```

- [ ] RPA hover/focus/click/Escape state, 문서 영역 선택 및 원문·결과 표시, 갤러리 dialog·닫힘 포커스는 원 구현을 재사용한다. 목업의 정적 도표로 교체하지 않는다.
- [ ] 본문 16–18px와 line-height 약 1.8을 Mdx wrapper에 적용한다. PostToc는 동일 items/title 인터페이스로 모바일 `<details>`와 데스크톱 sticky 구성을 제공한다. 목차 없는 글은 아무것도 렌더하지 않는다.
- [ ] `PostToc` SSR 검사에서 작은 화면용 summary, 모든 heading href, items=[]의 빈 출력 조건을 확인한다. 본문과 목차는 같은 grid/container에 두어 fixed right 위치가 본문을 침범하지 않게 한다.
- [ ] 글 날짜·제목·요약·원문을 보존한다. 기존 h1 원문 수정은 하지 않으며 필요하면 MDX heading 렌더러 계층을 조정해 원문 글자를 보존한다. 새 code-copy 기능은 이번 보존·스타일 변경의 필수 범위가 아니다.
- [ ] 기존 portfolio test의 이전 정확한 섹션 순서·class 문자열 기대값만 새 설계로 갱신한다. 원문·로고·데모·갤러리 assertion은 유지한다.
- [ ] 집중 테스트를 실행한 뒤 보존된 모든 기능과 변경 파일을 부모에게 보고한다.

## 검증 명령 및 통합 게이트

부모가 확인한 baseline: Vitest 14 files / 83 tests 통과. `TEMP`와 `TMP`는 필요 시 `D:\chanlog\tmp`를 사용한다. 이 작업의 dev 서버는 3100이며 3000의 별도 앱을 종료하지 않는다. researcher가 Next.js 14 client boundary, Tailwind 3 mobile-first, native details 공식 문서를 확인했다.

런타임을 새로 설치하지 않고 프로젝트 문서의 번들 Node를 사용한다:

```powershell
& 'C:\Users\META06\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' '.\node_modules\vitest\vitest.mjs' run
& 'C:\Users\META06\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' '.\node_modules\typescript\bin\tsc' --noEmit
& 'C:\Users\META06\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' '.\node_modules\next\dist\bin\next' build
```

- [ ] 두 작업 종료 후 부모가 전체 Vitest, TypeScript, production build를 실행하고 출력에서 통과 여부를 확인한다. 생성물 충돌을 피하려고 build/dev를 동시에 돌리지 않는다.
- [ ] 부모가 390·716·1440px에서 `/`, `/portfolio`, 긴 글 `/posts/omc-intro`를 확인한다. 첫 화면, 페이지 가로 overflow, 작은 화면 목차, 헤더 메뉴를 확인한다.
- [ ] 홈에 이미지 없음, 원본 글 이미지 있음, RPA 노드 열기/닫기, 문서 데모 펼침·영역 선택·접기, 갤러리 열기/Escape·포커스 복귀를 실제 브라우저로 확인한다.
- [ ] Architect가 diff와 실제 검증 결과를 검토한다. 수정 전에 존재한 dirty 파일은 사용자 변경으로 취급하고 이번 작업 때문에 삭제·되돌리지 않았는지 확인한다.
- [ ] 결과를 사용자에게 제공한다. 실제 배포나 커밋 완료로 표현하지 않는다.
