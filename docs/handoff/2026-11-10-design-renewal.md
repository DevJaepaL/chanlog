# Chanlog 디자인 인계

작성일: 2026-11-10 (Asia/Seoul)
작업 경로: `D:\chanlog`
기준 HEAD: `298e46e44b636e2515893280d8e2165b788df0ed` — `fix: keep mobile navigation on one line`

## 현재 승인 상태 — 토스 테크형 A안

1. `docs/superpowers/specs/2026-10-16-design-renewal-design.md`의 밝은 기술 노트 리뉴얼(썸네일 없는 행 목록)은 실제 코드에 구현했으나 사용자가 거부했다. 그 구현본은 `git stash`의 "2026-11-10 design renewal attempt (reverted at user request)"에 있다. **다시 적용하지 않는다.**
2. 사용자는 "AI Slop 느낌이 최대한 안 나게, 대기업 개발 기술 블로그(친숙한 느낌)를 참고"하라고 지시했다. 토스 테크형(A)과 우아한기술블로그형(B) 목업을 비교해 **A안을 선택**했다.
3. A안은 운영 코드에 적용됐다. 커밋·푸시·배포는 하지 않았다.

시각 기준은 `design-review/mockup-a-toss.html`이다. B안 목업(`mockup-b-woowa.html`)은 비교용 기록이다. `mockup-data.js`는 생성 파일이므로 손으로 고치지 않는다.

### A안 핵심

- 흰 바탕, 쿨 그레이 텍스트, 파란 `primary`(`#0075de`)와 연한 파랑 `primary-soft`.
- 흰색 고정 헤더: CHANLOG, 아카이브·About 메뉴, GitHub(회색)·Contact(파랑). 모바일은 메뉴만 표시하고 연락 링크는 About Hero와 푸터에서 접근한다.
- 아카이브: 최신 글을 큰 썸네일과 함께 상단에 배치하고, 그 아래 필터·결과 안내·6개 단위 더 보기가 있는 썸네일 목록. 최신 글은 목록에도 다시 나온다(필터·개수 로직 유지). **썸네일은 유지한다.**
- 글 상세: 태그·제목·요약·작성자·날짜, 본문 17px(모바일 16px), xl 이상 오른쪽 sticky 목차, 그 미만 접이식 목차.
- About: Hero → 소개 → 프로젝트 → 경력 → 기술 스택. 프로젝트는 회색 카드, 로고는 흰 박스, 기술 칩은 실제 브랜드 로고/개념 아이콘(`components/ui/skill-icon.tsx`).
- Section 진입 fade-up은 `CLAUDE.md` 규칙대로 유지한다.

### 2차 반영 (2026-11-10)

- 헤더·About Hero·메인 프로필 카드의 연락 버튼: Contact·GitHub·Instagram (`components/home/contact-buttons.tsx` 공용).
- 메인 맨 위에 About 프로필을 줄인 가로 카드(`components/home/profile-card.tsx`)와 "About 보기 →" 링크.
- 구분선은 `border-hairline`: 헤더·푸터, 최신 글과 아카이브 목록 사이, 목록 행, About 섹션 사이, 글 상세 헤더 아래.
- 아카이브 태그 필터: 알약 대신 글자 탭(선택은 굵게+밑줄), 글 수 상위 5개만 표시하고 나머지는 `+N`/접기(`splitArchiveTags`).
- (3차에서 대체됨) 파이프라인 CSS 릴레이 애니메이션.

### 3차 반영 (2026-11-10)

- 헤더: 아카이브·About·Contact(같은 글자 링크). 프로필 카드·About Hero의 버튼 순서는 GitHub·Instagram·Contact.
- 파이프라인 두 개를 "실행 화면형"으로 재설계(`components/portfolio/pipeline-run.tsx`, 단계 진행은 `lib/pipeline-run.ts`). GitHub Actions 실행 그래프처럼 카드마다 상태(대기·처리 중·완료)와 단계 제목이 보이고, 연결선이 채워지며, 아래 어두운 안내 바에 현재 단계 설명과 ◀ ⏯ ▶가 있다. 카드·칩에 마우스/포커스/탭하면 그 항목 설명을 보여 주며 재생을 멈추고, Escape로 해제한다. 문서 파이프라인은 칩이 있어 개발 영역 줄과 연동 줄을 위아래로 둔다.
- 이 PC는 Windows 애니메이션 효과가 꺼져 있어 브라우저가 동작 줄이기를 보고한다. 사용자 결정: 그래도 자동 재생 + 일시정지 버튼. 이동 점·회전 아이콘만 생략.
- About: 상단 고정 바로가기 탭, 소개·프로젝트·경력·기술 스택 섹션 접기, 프로젝트별 요약(로고·제목·기간·기술) + 펼치기, "모두 펼치기/접기". 프로젝트는 기본 접힘이며 `#document-preprocessor` 등 해시로 들어오면 자동 펼침.
- `components/ui/card.tsx`는 더 이상 쓰이지 않는다(커밋 전 수정분이 있어 삭제하지 않음).

### 4차 반영 (2026-11-10)

- 프로젝트 순서: 팜맵 → 한국수자원공사(명칭 "…시범사업 구축 및 운영") → 그리드원 ChatBot → 신한카드 → B은행.
- "문서 전처리 파이프라인" 도식은 한국수자원공사 카드로 이동(`detail: "document-pipeline"`). "Document Extractor · Preprocessor" 구현 예시와 `#document-preprocessor` 앵커(`/pipeline` redirect 대상)는 그리드원 카드에 남음.
- 메인 프로필 카드 링크 "About →". 프로필 사진은 원본 `lib/images/profile_2.jpg`에서 얼굴 중심으로 자른 480px 정사각형 `lib/images/profile_2-avatar.jpg`를 사용(작은 원에서 얼굴이 뭉개지지 않도록, `quality={90}`·`sizes` 지정). `app/avatar.jpg`는 더 이상 쓰이지 않음.
- 글 상세 모바일 목차는 기본 펼침.
- "Document Extractor · Preprocessor" 구현 예시는 버튼 없이 항상 펼쳐 보임(구현 예시/접기 문구 제거).

### 5차 반영 (2026-11-10)

- About은 소개만 기본 펼침, 프로젝트·경력·기술 스택은 접힌 채 시작(`Section`의 `defaultOpen`). 해시·탭 링크로 들어오면 자동 펼침.
- About 항목 스타일 통일(`components/home/about-styles.ts`): 모든 항목은 같은 회색 카드(`rounded-2xl bg-canvas-muted`, `p-5 sm:p-8`, 간격 `gap-3 sm:gap-4`), 항목 제목 20→24px, 메타 15px, 라벨 14px, 본문 16→17px `text-ink-secondary`. 경력은 카드, 기술 스택은 분류별 카드(넓은 화면 2열), 칩은 모두 compact 흰색.

## 보존할 데이터와 공개 범위

- `lib/profile.ts`: 프로필, 경력, 프로젝트, 스킬, 연락 데이터의 단일 출처.
- `lib/document-preprocessor.ts`: 문서 데모 문구·이미지·출처·영역·상태 계약.
- `lib/rpa-pipeline.ts`, `lib/pipeline.ts`: 기존 파이프라인 데이터와 상태/설명.
- `content/*`: 원문 MDX. 디자인 작업에서 임의로 재작성하지 않는다.
- 기존 작성 문구만 사용한다. 새 슬로건·임의 성과·샘플 문구를 넣지 않는다.
- 신한카드 RPA 구현 프로세스, 문서 전처리 데모·파이프라인, 갤러리, 로고, 전체 5개 프로젝트, 경력·스킬·연락 정보를 보존한다.
- `/`, `/portfolio`, `/posts/[slug]`, `/posts`→`/`, `/pipeline`→`/portfolio#document-preprocessor` 리디렉션 유지.
- `projects`, `career`, `skills`, `document-preprocessor`, `rpa-pipeline-panel` 앵커 유지.
- 문서 전처리 시연의 공개 범위 제한은 `CLAUDE.md`를 따른다.

## 검증 기록 (2026-11-10, A안 적용 후)

- Vitest: 16개 파일, 89개 테스트 모두 통과. 거부된 리뉴얼 기준으로 미리 작성됐던 테스트 3개(아카이브 `<img>` 없음, Section SSR opacity 없음, 목차에 글 제목 표시)는 A안 기준으로 수정했다.
- TypeScript `--noEmit`, `next build` 통과.
- 390·716·1440px: 가로 넘침·깨진 이미지 없음. 필터·결과 안내, 모바일 접이식 목차·앵커, RPA hover/focus/Escape, 문서 데모 펼치기/접기·영역 선택, 갤러리 열기/Escape/포커스 복귀 확인.

## 작업 트리 주의

`.contentlayer/*`, `.gitignore`, 8월 21일 설계/계획 문서는 이 작업 전부터 수정돼 있었다. `.gitattributes`, `.vscode/`, `scripts/`, `tmp/`, `.playwright-mcp/`, `design-review/` 등 미추적 파일도 보존한다. 전체 add/reset/clean을 하지 않는다. generated Contentlayer 파일을 손으로 고쳐 제품 동작을 바꾸지 않는다.

## 재개·검증 명령

Windows PowerShell과 번들 Node를 사용한다. 새 세션에서는 경로가 아직 있는지 먼저 확인한다.

```powershell
Set-Location 'D:\chanlog'
git status --short
$env:TEMP = 'D:\chanlog\tmp'
$env:TMP = 'D:\chanlog\tmp'
& 'C:\Users\META06\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' '.\node_modules\vitest\vitest.mjs' run
& 'C:\Users\META06\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' '.\node_modules\typescript\bin\tsc' --noEmit
& 'C:\Users\META06\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' '.\node_modules\next\dist\bin\next' build
```

`TEMP`/`TMP` 변경은 Vitest SSR 임시 파일 rename 권한 오류를 피하는 방법이다. build와 dev는 같은 `.next`를 쓰므로 동시에 실행하지 않는다.

로컬 확인은 `.claude/launch.json`의 `chanlog`(dev, 포트 3000)와 `chanlog-mockups`(`design-review` 폴더만 4173에서 제공)를 사용한다. 이전 세션의 서버가 살아 있다고 가정하지 않는다.

## 남은 일

- 커밋·푸시·배포는 사용자 요청 시에만 한다.
- 새 디자인 변경은 목업으로 먼저 비교받는 방식을 사용자가 선호한다.
