# CHANLOG production design renewal

> **폐기됨 (2026-11-10):** 이 리뉴얼은 구현 후 사용자가 거부해 되돌렸다. 현재 기준은 토스 테크형 A안(`design-review/mockup-a-toss.html`)이며 상태는 `docs/handoff/2026-11-10-design-renewal.md`를 본다. 아래 내용은 기록용이다.

2026-10-16 사용자가 개편안의 실제 적용을 승인했다. 이 문서는 `design-review/review.md` 및 HTML 목업보다 최신인 구현 기준이다.

- 홈 아카이브에는 **썸네일을 표시하지 않는다**. 원본 파일과 MDX frontmatter는 삭제하지 않는다. 글 본문의 이미지와 포트폴리오 이미지는 유지한다.
- 승인된 밝은 기술 노트 디자인, 읽기 쉬운 글 목록, About의 소개와 프로젝트 구성을 운영 코드에 적용한다.
- 직접 작성된 제목·요약·본문·소개·경력·프로젝트·연락 정보를 그대로 사용한다. AI 슬로건, 임의 성과, 가짜 사례를 추가하지 않는다.
- 목업에서 생략된 운영 콘텐츠도 모두 유지한다. 특히 신한카드 RPA 구현 과정과 상호작용, 문서 전처리 데모와 파이프라인, 프로젝트 갤러리·로고, 전체 5개 프로젝트, 경력, 기술 스택, 모든 연락 링크를 보존한다.
- `lib/profile.ts`, `lib/document-preprocessor.ts`, `lib/rpa-pipeline.ts`, `lib/pipeline.ts`의 데이터를 UI에 복사하지 않는다. 현재 컴포넌트를 재사용한다.
- 기존 URL, 메타데이터, 앵커 `projects`, `career`, `skills`, `document-preprocessor`, `rpa-pipeline-panel`과 기존 리디렉션을 유지한다.
- 모바일 본문은 최소 16px, 주요 메뉴는 최소 14px. 모바일 접이식 목차와 넓은 화면 목차를 제공한다. 키보드 포커스, 결과 안내, dialog 복귀, reduced-motion 처리를 유지한다.
- 기존 정확한 SF Pro/PretendardLocal 서체 스택과 라이트 전용 정책을 유지한다. 새 패키지를 추가하지 않는다.
- 현재 작업 디렉터리에서 진행하고 기존 수정·미추적 파일을 덮어쓰거나 리셋하지 않는다. 커밋·배포는 이번 구현에 포함하지 않는다.

## 공용 디자인 계약

기존 semantic token 이름을 유지한다. primary `#2454C6`, primary.active `#1D43A0`, canvas.soft `#FAF9F5`, surface/canvas `#FFFFFF`, ink `#19212E`, ink.secondary `#414B5C`, ink.muted `#626976`, hairline `#D9DCD9`를 시작점으로 사용한다. accent 계열은 기존 데모의 의미 구분에 필요하므로 보존한다. chrome/secondary를 없애지 않는다. 새 화면은 밝은 공통 헤더·푸터를 사용한다. 전체 max-width 약 1152px, 본문 720px, 모바일 px-5~px-6, 좌측 정렬을 기본으로 한다.

실제 브라우저에서 390·716·1440px 레이아웃과 주요 상호작용을 확인한다. 테스트는 원문·인터랙션·경로 보존을 확인하고 이전 디자인의 클래스 문자열만 강제하는 검사는 새 설계에 맞게 바꾼다.
