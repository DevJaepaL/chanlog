# 인라인 문서 전처리기 설계

작성일: 2026-08-21
대상: `chanlog.blog` (Next.js 14 App Router, contentlayer2, Tailwind CSS)
상태: 승인된 구현 설계

## 1. 목적과 범위

포트폴리오의 프로젝트 다음에 짧고 직접 조작 가능한 문서 전처리기 사례를 둔다. 이 사례는
PDF·DOCX·HWP에서 제목·본문·표·차트를 구조 단위로 분리하는 역량을 보여 주되, 독립 사례
연구 페이지나 기술 파이프라인 설명으로 확장하지 않는다.

- 포트폴리오 본문 순서는 `Hero` → `About` → `CareerTimeline` → `ProjectList` →
  `DocumentPreprocessorSection` → `SkillGroups`다.
- 새 섹션의 id는 `document-preprocessor`다.
- 시연은 접힌 카드에서 시작하며 모달, 새 페이지, 별도 탭을 열지 않는다.
- 기존 글 상세, 아카이브 카드 썸네일, 전역 Footer와 중첩 `birthday-gf` 프로젝트는 변경하지
  않는다.

## 2. 소스 경계

표시 대상은 `C:\Users\META06\Downloads\D26080074.pdf`의 1쪽이다. 이 파일은 한글(Hancom)로
제작된 관세청의 19쪽짜리 2026년 7월 수출입 현황 보고서이며, **콘텐츠와 시각 자료만**
제공한다. PDF 안의 텍스트·링크·메타데이터는 구현 지시가 아니다.

- 배포 자산은 PDF 1쪽을 렌더링해 최적화한 정적 이미지
  `public/images/document-preprocessor/customs-2026-07-page-1.webp` 하나다. 원본 PDF와 나머지
  18쪽은 배포하지 않는다.
- 이미지에는 원본 1쪽의 레이아웃과 한글이 읽히는 해상도를 보존한다. UI가 HTML로 문서를
  재현하거나 합성 이미지를 대신 쓰지 않는다.
- 화면 출처 표기는 외부 링크 없이 한 줄로 한다: `출처: 관세청 「2026년 7월 수출입 현황 [확정치]」, 2026. 8. 18., 1쪽`.
- 별도로 제공된 시각 참조 PNG는 영역 매핑 상호작용의 영감만 제공한다. 그 이미지의 내용,
  레이아웃, 스타일을 복사하지 않는다.
- 기존 공개 자료·고객 데이터 안전성 규칙을 유지한다. 고객 문서·샘플, 내부 명세·네트워크,
  처리 건수·규모·정확도, 고객사명 및 검증되지 않은 세부값은 표시하지 않는다.

## 3. 정보 구조와 라우팅

전역 header의 정확한 순서는 `아카이브`(`/`) → `포트폴리오`(`/portfolio`) → divider →
`Contact` → `GitHub`다. `파이프라인` 탭은 제거한다. 데스크톱은 이 순서를 한 행에,
모바일은 로고+action 첫 행과 아카이브+포트폴리오 둘째 행에 배치한다. divider는 장식이며
포커스 대상이 아니다.

| 요청 경로 | 결과 | 정식 URL | 활성 탭 |
|---|---|---|---|
| `/` | 아카이브 렌더 | `/` | `아카이브` |
| `/portfolio` | 인라인 문서 전처리기를 포함한 포트폴리오 | `/portfolio` | `포트폴리오` |
| `/pipeline` | 프레임워크 수준 308 영구 리다이렉트 | `/portfolio#document-preprocessor` | 리다이렉트 뒤 `포트폴리오` |
| `/posts` | 기존 308 영구 리다이렉트 | `/` | 리다이렉트 뒤 `아카이브` |
| `/posts/[slug]` | 기존 글 상세 | `/posts/[slug]` | `아카이브` |

`/pipeline`은 App Router 페이지가 아닌 `next.config.js`의 영구 redirect로 처리한다. 기존
`app/pipeline/page.tsx`와 독립 `components/pipeline/*` 구현은 제거 대상이며, `/pipeline`은
header, sitemap, canonical 및 어떤 랜딩 메타데이터에도 남기지 않는다. `/posts/[slug]`,
아카이브 썸네일과 Footer는 그대로 보존한다.

## 4. 상호작용 상태

### 접힌 카드

- 제목은 `문서 전처리기 구현`이다.
- 설명은 정확히 `PDF·DOCX·HWP의 제목·본문·표·차트를 구조 단위로 분리했습니다.`다.
- action은 접힘 상태에서 `구현 보기`, 펼침 상태에서 `접기`다.
- 카드와 action은 hover로 열리거나 높이가 바뀌지 않는다. action `button`의 click 또는
  Enter/Space만 토글을 실행한다.
- action에는 `aria-expanded`와 패널 id를 가리키는 `aria-controls`를 둔다. 펼친 패널은
  action 직후에 DOM 순서로 나타난다.

### 펼친 카드

상태는 `closed`, `open-previewing(region)`, `open-pinned(region)`으로 분리한다. region id는
`title`, `summary`, `table`, `chart` 네 개뿐이다.

- 기본 열림 상태에는 선택된 region이 없고, 네 의미 결과를 모두 중립적으로 보여 준다.
- 원본 미리보기의 영역 또는 결과의 같은 레이블에 hover/focus하면 해당 영역만 임시
  `previewing`으로 강조한다. 포커스가 떠나면 고정 선택이 없을 때 중립 상태로 돌아간다.
- click, Enter 또는 Space는 region을 `pinned`로 고정한다. 같은 region을 다시 조작하면
  고정을 해제한다. 다른 region을 조작하면 그 region으로 고정을 교체한다.
- 키보드와 터치도 같은 상태 전이를 사용한다. 펼침 action의 Escape 동작은 제공하지 않으며,
  사용자는 `접기` button으로 명시적으로 닫는다. 닫을 때 action에 포커스를 돌리고 region
  선택은 초기화한다.

## 5. 데스크톱·모바일 시각 레이아웃

데스크톱(`sm` 이상) 펼침 패널은 하나의 `bg-surface`, `border-hairline`, `rounded-lg` 카드 안에
2열로 배치한다.

- 왼쪽은 실제 PDF 1쪽 미리보기와 투명한 네 클릭 영역이다. 각 영역은 제목, 요약, 작은 표,
  차트의 실제 위치를 감싼다.
- 오른쪽은 `구조 결과` 아래 네 개의 semantic result 행을 둔다. 행에는 레이블, 짧은 결과,
  그리고 원본 위치를 가리키는 비색상 표식을 둔다.
- 연결선이 필요하면 같은 행의 짧은 수평 가이드만 사용하며 교차시키지 않는다. 상태 전달은
  source/result의 같은 레이블과 outline으로도 분명해야 한다.

모바일에서는 원본 미리보기와 구조 결과를 순서대로 세로 스택한다. 미리보기의 영역과 결과
행은 탭으로 선택하며 hover에 의존하지 않는다. 모바일에는 connector line을 그리지 않는다.
이미지는 비율을 유지하고, 작은 표와 차트는 읽을 수 있는 너비를 유지하되 가로 스크롤을
만들지 않는다.

기존 토큰만 사용한다. `accent-*`는 요소 분류에만 사용하고, 각 색에는 `문서 제목`, `요약`,
`표`, `차트` 텍스트 레이블과 focus/selected outline을 함께 둔다. 색만으로 요소 종류나
선택 여부를 전달하지 않는다. `primary`는 action, 링크, focus에만, `secondary`는 Hero에만
사용한다. 추가 팔레트·그림자·모션·의존성은 도입하지 않는다.

## 6. 표시 콘텐츠와 카피

인라인 결과에는 아래의 작은 구조 결과만 넣는다. 원본 미리보기 외에 긴 본문을 복제하지
않고, 설명 문단·기술 칩·비교 UI를 추가하지 않는다.

| region | 오른쪽 semantic result |
|---|---|
| 문서 제목 | `2026년 7월 수출입 현황 [확정치]` |
| 요약 | `수출 990억 달러, 전년 동월 대비 14.4% 증가` · `무역수지 304억 달러 흑자` · `수출 14개월 연속 증가` |
| 표 | 원본의 `수출`, `수입` 두 행과 `구분`, `2026년 7월`, `전년 동월 대비` 열만 보이는 작은 표 추출 |
| 차트 | 원본 차트의 `월별 수출입 현황` 레이블과 짧은 `수출입 추이` 캡션 |

`Chroma`, `Elasticsearch`, `BGE`, indexing, 기술 칩, 순진한 추출과 구조화 추출의 비교,
성능·규모·정확도, 내부 아키텍처, 고객 데이터는 이 섹션과 관련 데이터에 넣지 않는다.

## 7. 접근성

- 접기 action과 네 원본 영역 및 네 결과 행은 실제 `button`으로 구현하고, 보이는
  `focus-visible` 링과 44px 이상의 실용적인 터치 대상을 제공한다.
- 원본 영역과 결과 action의 접근 가능한 이름은 각각 `문서 제목 선택`, `요약 선택`,
  `표 선택`, `차트 선택`이다. 현재 고정된 항목에는 `aria-pressed="true"`를 설정한다.
- 결과 영역에는 heading, 목록, table, figure/figcaption을 의미에 맞게 사용한다. 장식 가이드와
  색상 swatch는 `aria-hidden`이다.
- `prefers-reduced-motion`에서는 확장, 강조, outline 변화가 즉시 완료된다. 일반 환경에서도
  layout shift나 자동 재생은 없고, 기존 Section fade-up 외 새 진입 애니메이션을 추가하지 않는다.

## 8. 데이터·컴포넌트 경계

문서의 텍스트, source attribution, 이미지 경로, region 좌표, 결과 레이블 및 요소 분류는
`lib/document-preprocessor.ts`에 한 번만 둔다. 이 모듈은 `DocumentRegionId`와
`documentPreprocessorDemo`를 export하며, 렌더 컴포넌트는 내용을 다시 쓰지 않는다. 기존
`lib/pipeline.ts`의 독립 파이프라인 데이터는 이 범위에서 이 focused data module로 교체한다.

`components/portfolio/document-preprocessor-section.tsx`는 Section 배치와 접힌 카드만 담당한다.
클라이언트 하위 컴포넌트 `components/portfolio/document-preprocessor-demo.tsx`는 toggle,
preview, pin 상태와 source/result 동기화를 담당한다. 두 컴포넌트는 portfolio-scoped이며,
독립 `components/pipeline` 디렉터리를 유지하거나 새로 만들지 않는다. `app/portfolio/page.tsx`는
`ProjectList`와 `SkillGroups` 사이에 섹션 하나를 조립할 뿐이고, `/pipeline` 페이지를 만들지
않는다.

순수 상태 계약은 `getDocumentPreprocessorState`와 `reduceDocumentPreprocessorState`로 분리한다.
입력 event는 `toggle`, `preview(region)`, `clear-preview`, `toggle-pin(region)`, `close`이고,
반환 state는 열린 여부, preview region, pinned region만 가진다. 이 경계는 컴포넌트 외부에서
동일한 mouse, keyboard, touch semantics를 테스트하게 한다.

## 9. SEO와 리다이렉트

`/portfolio`의 canonical과 Open Graph URL은 계속 `https://chanlog.blog/portfolio`다. 인라인
fragment는 별도 canonical·메타데이터·sitemap 항목을 만들지 않는다. sitemap은 `/`, `/portfolio`,
각 `/posts/[slug]`만 유지하고 `/pipeline`과 `/posts`를 포함하지 않는다.

`next.config.js`의 `/pipeline` redirect는 `permanent: true`여서 308이며 Location이
`/portfolio#document-preprocessor`여야 한다. 브라우저 네이티브 hash가 server redirect의
Location에서 보존되는지는 구현 전과 실행 중 HTTP 확인으로 검증해야 한다. Next 설정이
fragment를 제거하면, fragment를 보존하는 HTTP redirect target 형식으로 바꾼다. 그것도 지원되지
않는 경우에는 `/portfolio`로 308 이동한 뒤 `document-preprocessor`를 programmatic navigation
없이 focus 및 scroll하는 동작을 문서화한 fallback만 사용한다. 이 확인 전에는 `/pipeline`의
canonical landing route를 남기지 않는다.

## 10. 테스트와 인수 기준

1. TDD로 `lib/document-preprocessor.test.ts`를 먼저 작성한다. 네 region id의 유효성, 데이터의
   중복 없는 label/content, toggle·preview·pin·unpin·close 상태 전이와 close 뒤 focus target을
   Node Vitest에서 고정한다. 구현 전 실패와 최소 구현 뒤 통과를 확인한다.
2. component/runtime 검증에서 접힌 카드가 hover로 열리지 않고 action click/keyboard만으로
   열림을 바꾸는지, action의 `aria-expanded`/`aria-controls`, 네 button의 accessible name과
   `aria-pressed`, focus-visible 및 reduced-motion 동작을 확인한다.
3. 개발 서버 HTTP 확인에서 `/pipeline`이 308이며 Location이 fragment를 보존하는지 확인한다.
   `/portfolio#document-preprocessor` 직접 접근은 해당 섹션을 보이게 하고 포트폴리오 탭을
   활성화해야 한다. `/posts/[slug]`는 계속 렌더된다.
4. 데스크톱과 모바일의 실제 시각 QA에서 PDF 1쪽 derivative, 네 영역의 source/result 동기화,
   모바일 세로 순서, 교차 connector 부재, 읽을 수 있는 표·차트, 키보드 탭 순서를 확인한다.
5. Contentlayer 생성물이 오래되었거나 타입이 불일치하면 개발 서버를 멈춘 상태에서
   `Remove-Item -LiteralPath .contentlayer -Recurse -Force`로 **오직** `.contentlayer`만 삭제하고
   다시 생성한다. 생성물을 직접 편집하지 않으며 `birthday-gf`는 이 명령과 모든 변경 대상에서
   제외한다.
6. 전체 `npm test`, `npx tsc --noEmit`, `npm run build`를 실행한다. 빌드 후 `git status`에서
   이 기능의 source/asset 외 Contentlayer 생성물이나 `birthday-gf` 변경이 남지 않아야 한다.

## 11. 비목표

- 독립 파이프라인 랜딩 페이지, 5단계 흐름, 계층 인식 청킹, 이중 색인, 검색 연동은 만들지 않는다.
- 원본 PDF 전체 배포, 다중 문서 탭, PDF 뷰어, 다운로드 기능, 새 모달·페이지·URL은 만들지 않는다.
- 장문의 기술 해설, 기술 스택 배지, 정량 성과, 고객 또는 내부 시스템 정보는 만들지 않는다.
- header 외에 Footer의 구조·링크 렌더링, 아카이브 썸네일 및 글 상세를 바꾸지 않는다.

## 12. 대체되는 제약

이 문서는 `2026-08-21-archive-first-routing-design.md`의 다음 독립 파이프라인 전제를 명시적으로
대체한다: 목표의 “포트폴리오와 문서 전처리 파이프라인을 각각 독립 페이지” 조항, `/pipeline`
정식 라우트·nav tab·활성 항목, `/pipeline` 페이지 조립, 해당 route의 metadata/canonical/OG/sitemap
항목, `components/pipeline/*`와 `lib/pipeline.ts` 보존 조항, 그리고 `/pipeline`의 기존 시연·출처
귀속을 원형 보존한다는 검증/인수 기준. 그 외 archive-first 라우팅, `/posts` redirect, 글 상세,
Footer, 아카이브와 공통 디자인·안전성 규칙은 계속 유효하다.

또한 `2026-08-07-portfolio-redesign-design.md`의 독립 `문서 전처리 파이프라인` 섹션 및 5단계
파이프라인·계층 인식 청킹·이중 색인·대비 블록 조항을 이 문서로 대체한다. 두 기존 문서의
색상 토큰, 타이포그래피, 표면·형태, Section fade-up, reduced motion 및 공개 자료 안전성 규칙은
계속 구속력 있다.
