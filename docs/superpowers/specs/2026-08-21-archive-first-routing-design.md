# 아카이브 중심 라우팅 설계

작성일: 2026-08-21
대상: `chanlog.blog` (Next.js 14 App Router, contentlayer2, Tailwind CSS)
상태: 승인된 구현 설계

## 1. 맥락과 문제

현재 사이트는 `/`에 포트폴리오의 여덟 섹션을 조립하고 `/posts`에 별도 글 목록을
제공한다. 이 구조에서는 CHANLOG의 지속적으로 갱신되는 기록이 보조 목적처럼 보이고,
포트폴리오와 파이프라인 시연의 목적도 하나의 긴 페이지에서 경쟁한다. 또한 홈과 글
목록은 서로 다른 진입점을 가지므로 사이트의 주 정체성과 공유할 대표 URL이 분산된다.

이번 변경은 CHANLOG를 **조용한 기술 아카이브가 먼저 보이는 사이트**로 재정의한다.
포트폴리오와 파이프라인은 각각 독립된 의도를 가진 페이지로 분리한다. 기존 글 상세
URL은 보존하고, 이전 글 목록 URL은 영구 리다이렉트로 호환한다.

`docs/superpowers/specs/2026-08-07-portfolio-redesign-design.md`는 **라우트/페이지 조립과
홈의 정확히 여덟 섹션이라는 가정에 한해서만** 이 문서로 대체된다. 해당 문서의 토큰,
타이포그래피, 형태·깊이, 단일 나이트 밴드, 모션, 콘텐츠 안전성 규칙은 계속 구속력이
있다.

## 2. 목표와 비목표

### 목표

- `/`를 CHANLOG의 유일한 정식 글 아카이브 및 주 랜딩 페이지로 만든다.
- 기존 `/posts/[slug]` 글 상세 URL과 각 글의 OG URL을 변경하지 않는다.
- 포트폴리오와 문서 전처리 파이프라인을 각자의 독립 페이지로 분리한다.
- 모든 현재 MDX 글의 썸네일을 아카이브 카드에 복원하되, 썸네일이 없는 미래 글도
  자연스럽게 지원한다.
- 내비게이션, SEO, 사이트맵, 리다이렉트가 한 개의 정식 URL 집합을 가리키게 한다.
- 기존 디자인 토큰과 절제된 모션 규칙 안에서 반응형·키보드 접근 가능한 UI를 유지한다.

### 비목표

- 글 상세의 본문, TOC, MDX 렌더링 또는 글 슬러그 체계를 재작성하지 않는다.
- 태그, 검색, 페이지네이션, 새 콘텐츠 모델, 새 애니메이션, 새 색상 팔레트,
  새 의존성을 추가하지 않는다.
- Footer 자체의 구조·스타일·링크 렌더링 방식은 변경하지 않는다. 연락처 데이터의
  `Email` 표시 라벨을 `Contact`로 바꾸는 결과는 Footer에도 공유 데이터로 반영된다.
- Hero에 연락처 CTA를 남기거나, hamburger 메뉴·새 내비게이션 의존성을 추가하지 않는다.
- `PipelineSection` 내부의 시연 내용, 상호작용, 공개 출처 귀속을 변경하지 않는다.
- Contentlayer가 추적하는 생성 파일을 기능 변경으로 직접 편집하지 않는다.

## 3. 선택한 아키텍처

App Router의 페이지는 얇게 유지한다. `/`는 서버 컴포넌트로서 Contentlayer 글을 받아
공용 `PostArchive`를 렌더링하고, `/portfolio`는 기존 포트폴리오 섹션만 조립하며,
`/pipeline`은 기존 `PipelineSection`만 조립한다. `/posts`는 `permanentRedirect("/")`를
호출하는 전용 리다이렉트 페이지로 만든다.

글 목록의 날짜 정렬과 썸네일 정규화는 순수 `lib/posts.ts` 헬퍼로 분리한다. 내비게이션
항목과 활성 경로 판정도 순수 `lib/navigation.ts`로 분리해 클라이언트 `Navbar`가 URL
문자열 규칙을 독자적으로 갖지 않게 한다. 이 두 경계는 Node 환경 Vitest로 먼저 검증할
수 있어 UI 렌더러에 의존하지 않는다.

이 방식은 기존 Contentlayer 모델(`title`, `publishedAt`, `summary`, `slug`, 선택
`thumbnail`)과 기존 컴포넌트 및 Tailwind 토큰을 재사용한다. 새 런타임 라이브러리,
새 상태 저장소, 새 레이아웃 시스템은 필요 없다.

## 4. 고려한 대안

| 대안 | 장점 | 채택하지 않은 이유 |
|---|---|---|
| 홈을 포트폴리오로 유지하고 아카이브만 보강 | 기존 홈 링크를 그대로 유지 | 기록이 주 정체성이라는 결정과 맞지 않고, 파이프라인·최근 글·연락처가 계속 한 페이지에 섞인다. |
| `/posts`를 정식 아카이브로 유지 | 기존 목록 링크에 리다이렉트가 필요 없다 | 홈과 아카이브가 중복된 주 진입점이 되어 정식 URL과 활성 내비게이션이 분산된다. |
| `/posts`에서 아카이브를 렌더링하고 `/`에서 이를 임베드 | 단기 구현량이 작아 보인다 | 동일 콘텐츠의 두 URL과 중복 SEO를 만들며, 영구 리다이렉트 요구를 충족하지 못한다. |
| 썸네일을 각 페이지에 인라인으로 중복 구현 | 빠른 국소 변경 | 정렬·썸네일 누락 처리·접근성 규칙이 분기되어 재사용성과 테스트 가능성을 잃는다. |

## 5. 라우트와 내비게이션 계약

### 5.1 정식 라우트

| 요청 경로 | HTTP/렌더 결과 | 정식 URL | 내비게이션 라벨 | 활성 항목 |
|---|---|---|---|---|
| `/` | 아카이브 렌더 | `/` | `아카이브` | `/` |
| `/portfolio` | 포트폴리오 렌더 | `/portfolio` | `포트폴리오` | `/portfolio` |
| `/pipeline` | 파이프라인 사례 연구 렌더 | `/pipeline` | `파이프라인` | `/pipeline` |
| `/posts` | 308 영구 리다이렉트 | `/` | — | 리다이렉트 후 `/` |
| `/posts/[slug]` | 기존 글 상세 렌더 | `/posts/[slug]` | — | `/` |

Navbar는 전역 header 안에서 다음의 정확한 정보 구조를 제공한다.

| 화면 | 첫 영역/행 | 둘째 영역/행 |
|---|---|---|
| 데스크톱 (`sm` 이상) | 왼쪽: `CHANLOG` 로고(`/`) | 오른쪽: 페이지 탭 `아카이브`(`/`) → `포트폴리오`(`/portfolio`) → `파이프라인`(`/pipeline`), 미묘한 세로 divider, action 링크 `Contact` → `GitHub` |
| 모바일 (기본) | 첫 행: 왼쪽 `CHANLOG` 로고(`/`), 오른쪽 `Contact` → `GitHub` action 링크 | 둘째 행: `아카이브` → `포트폴리오` → `파이프라인` 페이지 탭 |

페이지 탭의 순서와 href는 `아카이브`, `포트폴리오`, `파이프라인` 순서로 고정한다. divider는
데스크톱에서만 페이지 탭과 action 링크를 구분하는 장식이며, 링크·탭·포커스 대상이 아니다.
CHANLOG 로고는 항상 `/`로 연결한다. `/posts/[slug]`는 글 상세 중에도 `아카이브`를 활성
상태로 보이게 한다. `/posts`는 서버에서 즉시 `/`로 이동하므로 사용자에게 독립적인 활성
상태를 노출하지 않는다. `Contact`와 `GitHub`는 외부 action 링크이지 활성 경로 탭이 아니다.

### 5.2 내비게이션 경계

`lib/navigation.ts`는 다음의 순수 계약을 제공한다.

- `NAV_ITEMS`: 위 표 순서와 라벨을 가진 읽기 전용 항목 목록
- `getActiveNavHref(pathname)`: `/`와 모든 `/posts/...`를 `/`로, `/portfolio`를
  `/portfolio`로, `/pipeline`을 `/pipeline`으로 반환한다. 그 밖의 경로는 활성 항목을
  반환하지 않는다.
- `getHeaderContacts(contacts)`: 전달받은 공유 `ContactLink` 목록에서 라벨이 `Contact`,
  `GitHub`인 항목만 그 순서대로 반환한다. 이 함수와 Navbar는 email/GitHub href 문자열을
  재정의하지 않는다.
- `getHeaderActionAttributes(contact)`: `Contact`에는 빈 속성 객체를 반환해 mailto 링크에
  `target`/`rel`을 붙이지 않고, `GitHub`에는
  `{ target: "_blank", rel: "noopener noreferrer" }`를 반환한다. 이 계약은 action의
  새 창·보안 의미를 DOM 렌더러 없이 검사 가능하게 한다.

`components/navbar.tsx`는 `usePathname()` 값을 활성 경로 헬퍼에 전달하고, `contacts`를
`getHeaderContacts(contacts)`에 전달해 action을 렌더링한다. Navbar 내부에 경로 접두어 검사,
링크 목록, 또는 Contact/GitHub href 문자열을 중복 정의하지 않는다. action별 속성은
`getHeaderActionAttributes`의 결과를 그대로 사용한다.

## 6. 페이지별 조립

### `/` — 아카이브

`app/page.tsx`는 아카이브 페이지 메타데이터와 `PostArchive`만 조립한다. Hero, About,
CareerTimeline, ProjectList, PipelineSection, SkillGroups, RecentPosts, Contact를 포함하지
않는다. 화면은 기존 목록의 `Archive` 눈썹 라벨과 `아카이브` 제목을 유지하고, 날짜 내림차순
카드 목록을 표시한다. 이것이 사이트의 quiet index이며 별도 영웅 배너를 추가하지 않는다.

### `/portfolio` — 포트폴리오

새 `app/portfolio/page.tsx`는 아래 다섯 기존 컴포넌트만 이 순서로 조립한다.

1. `Hero`
2. `About`
3. `CareerTimeline`
4. `ProjectList`
5. `SkillGroups`

`PipelineSection`, `RecentPosts`, 페이지 수준 `Contact`는 포함하지 않는다. 전역
`Footer`는 RootLayout의 공통 UI로 남으며, 공유 데이터에 따른 `Contact`/`GitHub`/`Instagram`
표시를 유지한다. `Hero`는 아바타·이름·직무·tagline만 가진 identity/content 영역이며
Email/GitHub 버튼이나 연락처 import·매핑을 포함하지 않는다.

### `/pipeline` — 파이프라인 사례 연구

새 `app/pipeline/page.tsx`는 페이지 메타데이터와 기존 `PipelineSection`만 조립한다.
`PipelineSection` 및 하위 `PipelineFlow`, `ChunkingView`, `IndexView`,
`ExtractionCompare`의 상호작용과 공개 문서 출처 귀속은 원형 그대로 유지한다. 이 페이지는
포트폴리오 섹션이나 최근 글, 별도 Contact를 추가하지 않는다.

### `/posts/[slug]` — 글 상세

`app/posts/[slug]/page.tsx`의 `generateStaticParams`, 찾지 못한 글의 `notFound`, MDX 본문,
TOC, 제목·날짜·요약 및 현행 글별 Open Graph URL을 보존한다. 내비게이션 활성 상태만
공용 경로 헬퍼를 통해 아카이브로 해석된다.

## 7. 아카이브 카드와 썸네일

새 `components/archive/post-archive.tsx`는 아카이브 제목/눈썹과 카드 목록의 공용 렌더링
경계다. `/`가 이 컴포넌트의 첫 소비자이며, 이후 다른 목록이 필요해도 동일한 동작을
재사용한다. 현재 네 MDX 글은 모두 선택 `thumbnail` front matter 값과 `public/images`
아래의 파일을 가진다.

`lib/posts.ts`는 Contentlayer 전체 타입에 결합하지 않는 최소 `ArchivePost` 계약과 다음
순수 함수를 제공한다.

- `sortPostsByPublishedAt(posts)`: 입력을 변경하지 않고 `publishedAt` 내림차순의 새 배열을
  반환한다. 같은 날짜면 `slug` 오름차순으로 안정된 표시 순서를 만든다.
- `normalizeThumbnail(thumbnail)`: 문자열이면 `trim()`한 값을 반환하고, 누락되었거나
  trim 결과가 빈 문자열이면 `undefined`를 반환한다. 이는 Windows에서 추적/생성된
  Contentlayer JSON에 들어갈 수 있는 CR/LF를 제거하기 위한 경계다.

각 카드는 제목 링크 하나가 카드 전체를 감싼다. 따라서 마우스뿐 아니라 키보드 Tab으로도
명확히 도달하고, 기존 링크 포커스 스타일과 일관된 눈에 보이는 `focus-visible` 외곽선/링을
제공한다. 별도의 중첩 링크나 클릭 전용 컨테이너는 만들지 않는다.

`normalizeThumbnail(post.thumbnail)`이 URL을 반환할 때만 `next/image`의 `Image`를
렌더링한다. `alt=""`를 사용한다. 이미 인접한 링크 제목이 같은 글을 식별하므로 썸네일은
중복 장식이며 스크린 리더에 반복해 읽히지 않아야 한다. `object-cover`를 적용해 이미지가
고정 프레임을 채우되 왜곡하지 않는다.

| 화면 폭 | 카드 레이아웃 | 미디어 동작 |
|---|---|---|
| 기본(모바일) | 세로 카드, 미디어가 텍스트 위 | 가로 16:9 영역, 전체 폭, `object-cover` |
| `sm` 이상 | 가로 카드, 왼쪽 미디어·오른쪽 텍스트 | 고정 폭 썸네일 열, 텍스트가 나머지 폭 사용 |
| 썸네일 없음/공백 | 모든 폭에서 텍스트 전용 카드 | 미디어 영역을 만들지 않고 텍스트가 전체 폭 사용 |

카드는 기존 `rounded-lg`, `border-hairline`, `bg-surface`, `hover:shadow-soft` 및 기존
텍스트 토큰을 유지한다. 썸네일은 새 팔레트나 별도 애니메이션을 도입하지 않는다.

## 8. 컴포넌트·데이터 경계와 파일 변경

| 경로 | 책임 | 작업 |
|---|---|---|
| `lib/posts.ts` | 정렬·썸네일 정규화의 순수 계약 | 생성 |
| `lib/posts.test.ts` | 정렬과 CR/공백 썸네일 정규화의 선행 행동 테스트 | 생성 |
| `lib/navigation.ts` | 정식 nav 모델과 활성 경로 해석 | 생성 |
| `lib/navigation.test.ts` | 탭 순서, 활성 경로, header 연락처 선택·action 속성 테스트 | 생성 |
| `lib/profile.ts` | 공유 연락처의 `Email` → `Contact` 라벨 마이그레이션 | 수정 |
| `lib/profile.test.ts` | 공유 Contact 라벨과 mailto href 보존 테스트 | 수정 |
| `components/archive/post-archive.tsx` | 공용 아카이브 제목과 클릭 가능한 반응형 카드 목록 | 생성 |
| `app/page.tsx` | 얇은 정식 아카이브 페이지 | 교체 |
| `app/posts/page.tsx` | 영구 리다이렉트 전용 페이지 | 교체 |
| `app/portfolio/page.tsx` | 얇은 다섯 섹션 포트폴리오 조립 | 생성 |
| `app/pipeline/page.tsx` | 얇은 파이프라인 사례 연구 조립 | 생성 |
| `components/navbar.tsx` | 반응형 2행/데스크톱 header, 공용 nav·연락처 계약 소비 | 수정 |
| `components/home/hero.tsx` | 연락처 import·선택·CTA 제거, identity/content 전용 유지 | 수정 |
| `app/layout.tsx` | archive-first 전역 기본 메타데이터 | 수정 |
| `app/sitemap.ts` | 정식 정적 라우트와 글 상세 URL만 노출 | 수정 |
| `components/home/contact.tsx` | 페이지 수준 Contact의 유일한 구현 | 삭제 |
| `components/home/recent-posts.tsx` | 포트폴리오에서 제거되는 최근 글 구현 | 삭제 |

`components/footer.tsx`, `components/pipeline/*`, `lib/pipeline.ts`,
`app/posts/[slug]/page.tsx`는 이 변경에서 내용을 바꾸지 않는다. Footer의 `Contact` 표시는
수정된 공유 `contacts` 데이터에서 자동으로 나온다. `content/*.mdx`, `contentlayer.config.ts`,
그리고 `.contentlayer/**` 생성 파일도 기능 구현 대상으로 삼지 않는다.

## 9. 메타데이터, SEO, 사이트맵

전역 기본값은 아카이브 우선 정체성을 반영한다.

- 기본 title: `CHANLOG | 기술 아카이브`
- 기본 description: `백엔드·AI·데이터 파이프라인에 관한 이재찬의 기술 아카이브.`
- 전역 웹사이트 OG URL: `https://chanlog.blog/`
- 기존 `metadataBase`, 한국어 locale, robots 정책, 사이트 이름, title template은 보존한다.

페이지별 메타데이터는 다음처럼 명시한다.

| 페이지 | title | description | canonical / OG URL |
|---|---|---|---|
| `/` | `아카이브` | 전역 아카이브 설명 | `https://chanlog.blog/` |
| `/portfolio` | `포트폴리오` | 이재찬의 백엔드·AI 엔지니어 경력, 프로젝트, 기술 역량 | `https://chanlog.blog/portfolio` |
| `/pipeline` | `문서 전처리 파이프라인` | 공개 자료를 이용한 문서 구조 파싱·계층 인식 청킹·이중 색인 사례 연구 | `https://chanlog.blog/pipeline` |

각 페이지는 자기 정식 URL을 `alternates.canonical`과 Open Graph `url`에 사용한다. 글
상세는 현행 `https://chanlog.blog/posts/${slug}` article OG URL을 그대로 보존한다.
`/posts`는 리다이렉트 전용이므로 독립 메타데이터나 사이트맵 항목을 갖지 않는다.

`app/sitemap.ts`는 다음 정식 URL만 반환한다.

- `https://chanlog.blog/`
- `https://chanlog.blog/portfolio`
- `https://chanlog.blog/pipeline`
- Contentlayer의 각 `https://chanlog.blog/posts/[slug]`

`https://chanlog.blog/posts`는 절대 포함하지 않는다. 글의 `lastModified`는 기존처럼
`publishedAt`을 사용하고, 정적 페이지는 sitemap 생성일의 ISO 날짜를 사용한다.

## 10. 접근성, 반응형, 모션

- 아카이브 카드 전체는 하나의 링크이며 제목은 해당 링크 안의 heading으로 유지한다.
  키보드 포커스는 마우스 hover와 독립적으로 식별 가능해야 한다.
- 장식 썸네일은 빈 alt를 사용하고, 이미지가 없을 때 비어 있는 프레임이나 불필요한
  접근성 노드를 만들지 않는다.
- 모바일에서 이미지는 제목보다 앞에 오지만 의미상 중복 장식이므로 읽기 순서를 해치지
  않는다. `sm` 이상에서는 고정 폭 썸네일과 유연한 텍스트 열이 좁은 화면에서 넘치지
  않도록 한다.
- Navbar는 sticky 동작과 기존 토큰을 유지한다. 기본 폭에서는 첫 행의 로고와 Contact/GitHub
  action, 둘째 행의 세 페이지 탭을 분리해 가로 overflow를 만들지 않는다. `sm` 이상에서는
  한 행의 로고·탭·divider·action 구성이 된다. 모든 로고, 탭, action 링크에는 식별 가능한
  `focus-visible` 스타일과 실용적인 최소 44px 높이의 터치 대상(필요한 padding 포함)을
  제공한다.
- `Contact` action은 같은 창의 `mailto:` 링크라서 `target`과 `rel`을 설정하지 않는다.
  `GitHub` action은 새 창의 외부 링크라서 정확히 `target="_blank"` 및
  `rel="noopener noreferrer"`를 가진다. action은 active tab 클래스를 받지 않는다.
- Hero는 버튼이 없는 identity/content 영역으로 남아, 동일한 Contact/GitHub action이
  본문과 header에 중복 노출되지 않는다.
- 2026-08-07 설계의 `Section` fade-up(400ms, `y: 12px`)과 reduced-motion 존중 규칙은
  포트폴리오와 파이프라인에 그대로 적용된다. 아카이브 카드는 새 진입·스크롤·시차
  애니메이션을 추가하지 않고 기존 hover shadow transition만 사용한다.
- 기존 토큰(색상, 타이포그래피, `rounded-lg`, hairline, surface/canvas)을 재사용한다.
  새 색상, 의존성, 모션 언어는 도입하지 않는다.

## 11. 호환성과 리다이렉트 동작

`app/posts/page.tsx`는 Next.js 서버 리다이렉트 API로 `permanentRedirect("/")`를
호출한다. 이는 브라우저와 HTTP 확인에서 영구 리다이렉트(308)로 관찰되어야 하며,
클라이언트 렌더 뒤의 자바스크립트 이동이나 meta refresh로 대체하지 않는다. 기존에
`/posts`를 북마크하거나 외부에서 링크한 사용자는 `/`의 동일한 정식 아카이브에 도착한다.

`/posts/[slug]`의 정적 경로 생성과 직접 방문은 그대로 작동한다. 리다이렉트 규칙은
`/posts/[slug]`보다 정확히 `/posts`에만 적용되므로 글 상세를 가로채지 않는다.

## 12. 구현 순서와 TDD 전략

구현자는 다음 순서를 지킨다. 첫 두 작업은 UI 전에 순수 동작을 고정하기 위한
red → green 사이클이다.

1. `lib/posts.test.ts`에 날짜 내림차순·동일 날짜 slug 보조 정렬, 입력 배열 비변경,
   `undefined`, 공백, `\r`/`\n`이 붙은 썸네일의 정규화 행동을 작성한다. `lib/profile.test.ts`
   및 `lib/navigation.test.ts`에는 `Email` → `Contact` 데이터 마이그레이션, 세 페이지 탭의
   정확한 순서/라벨/href, `/`, `/posts`, `/posts/[slug]`, `/portfolio`, `/pipeline`, 알 수 없는
   경로의 활성 매핑, 공유 header 연락처의 선택/순서 및 action target 의미를 작성한다.
   구현 전 대상 테스트가 실패함을 확인한다.
2. 최소 `lib/posts.ts`, `lib/navigation.ts`, `lib/profile.ts` 변경을 구현하고 대상 테스트가
   통과함을 확인한다.
3. `PostArchive`, 각 얇은 페이지, `/posts` 영구 리다이렉트, Navbar의 responsive/action
   layout, Hero CTA 제거, 메타데이터, sitemap을 구현한다. 이어서 고아 import가 남지 않게
   `Contact`와 `RecentPosts`를 삭제한다.
4. 모든 검증과 수동/정적 점검을 수행한 뒤에만 커밋한다.

이 저장소의 Vitest 설정은 `lib/**/*.test.ts`를 Node 환경에서 실행하므로 순수 헬퍼 테스트는
DOM 도구나 새 테스트 의존성 없이 유지한다. UI 렌더링은 기존 프로젝트에 테스트 인프라가
없으므로 아래의 빌드·정적·HTTP·브라우저 확인으로 검증한다.

## 13. 검증 전략

### 자동 게이트

구현 완료 전 아래 세 명령은 모두 성공해야 한다.

```powershell
npm test
npx tsc --noEmit
npm run build
```

`npm run build`는 Contentlayer를 재생성할 수 있다. 빌드 후 `git status --short`를 확인하고,
생성물의 churn이 있다면 `.contentlayer/**`의 **생성 파일만** 기계적으로 HEAD 상태로
복원한다. 수동 변경이나 기능 파일을 되돌리지 않는다. 마지막 커밋 직전에는 기능 변경과
의도된 파일만 남았는지, 커밋 후에는 `git status --short`가 깨끗한지 확인한다.

### 정적·HTTP 확인

생성 산출물 또는 실행 중인 프로덕션 서버로 다음을 확인한다.

| 대상 | 확인 기준 |
|---|---|
| `/` | `아카이브` 목록과 네 개의 이미지 URL이 렌더되며 각 카드는 해당 `/posts/[slug]` 링크다. |
| `/posts` | `Location: /`와 영구 308 리다이렉트다. |
| `/portfolio` | 정확히 Hero, About, CareerTimeline, ProjectList, SkillGroups가 있고 Pipeline/최근 글/페이지 Contact는 없다. Hero에는 버튼이 없고, 전역 Navbar는 Contact/GitHub action을 제공하며 Footer는 Contact/GitHub/Instagram을 표시한다. |
| `/pipeline` | 기존 파이프라인 제목, 상호작용용 마크업, 공개 출처 귀속이 존재한다. |
| `/posts/[slug]` | 기존 글 제목, 본문/TOC, 정식 article OG URL이 그대로다. |
| `/sitemap.xml` | `/`, `/portfolio`, `/pipeline`, 각 글 상세는 있고 `/posts` 단독 항목은 없다. |

### 반응형·시각 QA

브라우저 플러그인이 정상 동작하면 모바일 폭과 `sm` 이상 폭에서 아카이브 카드, 포커스
표시, 썸네일 crop, 썸네일 없는 카드의 전폭 텍스트, sticky Navbar의 2행/데스크톱 1행 전환,
44px 실용 터치 대상, 페이지 탭 활성 상태와 Contact/GitHub action 의미를 직접 확인한다.
신뢰된 경로 bootstrap 실패가 알려진 플러그인 제약이므로 실패 시에는 빌드된 HTML과
HTTP 응답으로 위의 구조·링크·이미지 조건을 확인하고, CSS 실제 렌더링과 키보드 포커스의
시각적 외관은 잔여 위험으로 명시한다.

## 14. 마이그레이션·삭제 목록

- 기존 `/posts` 방문자는 308을 통해 `/`로 이동하므로 외부 링크·북마크의 수동 교체는
  필요 없다.
- `/posts/[slug]` 링크는 변경하지 않는다.
- `components/home/contact.tsx`와 `components/home/recent-posts.tsx`는 남은 import가
  없음을 검색한 뒤 삭제한다.
- Footer는 남고 파일 자체는 변경하지 않는다. `contacts` 데이터의 첫 라벨만 `Email`에서
  `Contact`로 변경되므로 Footer는 공유 데이터로 `Contact`/`GitHub`/`Instagram`을 표시한다.
- Hero에서는 contacts import, Email/GitHub 선택 로직, CTA 버튼을 제거한다. 전역 Navbar가
  공유 contacts에서 Contact/GitHub action을 선택하므로 email/GitHub href를 다른 파일에
  복제하지 않는다.
- `content/*.mdx`와 `.contentlayer/**`를 썸네일 정규화 문제의 해결책으로 수정하지 않는다.
- 작업 트리에 존재하는 무관한 `.contentlayer` 생성 변경이나 ignored nested `birthday-gf`
  저장소는 이 작업의 범위 밖이며, 검사·복원·커밋에서 보존한다.

## 15. 수용 기준

- [ ] `/`가 유일한 정식 글 아카이브이며 게시일 내림차순의 네 현재 글을 표시한다.
- [ ] 모든 현재 글 카드가 정규화된 `thumbnail`로 `next/image` 이미지를 표시하고,
  모바일은 16:9 상단 이미지, `sm` 이상은 고정 폭 왼쪽 이미지가 된다.
- [ ] 빈/공백 썸네일은 미디어 영역 없이 전폭 텍스트 카드가 되며, CR/LF가 있는 값도
  trim되어 올바르게 사용된다.
- [ ] 카드 전체가 하나의 클릭 가능하고 키보드-가시적인 `/posts/[slug]` 링크이며,
  썸네일의 alt는 빈 문자열이다.
- [ ] `/posts`는 308 영구 리다이렉트로 `/`에 도착하고 `/posts/[slug]` 상세는 그대로
  렌더된다.
- [ ] `/portfolio`는 정확히 Hero, About, CareerTimeline, ProjectList, SkillGroups만
  페이지 본문에 조립한다. Hero는 identity/content만 표시하고 버튼·contacts import가 없으며,
  Pipeline/최근 글/페이지 Contact는 없다. 전역 Footer는 Contact/GitHub/Instagram을 표시한다.
- [ ] `/pipeline`은 기존 `PipelineSection`과 기존 상호작용·공개 출처 귀속을 제공한다.
- [ ] Navbar는 데스크톱에서 왼쪽 CHANLOG(`/`), 오른쪽 `아카이브`(`/`) →
  `포트폴리오`(`/portfolio`) → `파이프라인`(`/pipeline`) → 미묘한 divider → Contact → GitHub
  순서이며, 모바일에서는 로고+Contact/GitHub 첫 행과 세 페이지 탭 둘째 행으로 overflow 없이
  전환한다. 모든 링크는 keyboard focus와 44px 실용 터치 대상을 유지한다.
- [ ] Navbar action은 공유 `contacts`에서 Contact/GitHub href를 가져오며 Contact는 target 없이
  `mailto:`를 열고 GitHub만 `_blank` 및 `noopener noreferrer`를 사용한다. action은 활성 탭이
  아니다.
- [ ] `lib/profile.ts`의 표시 라벨은 `Contact`이고, mailto href는 유지되며 Footer는 파일 수정
  없이 Contact/GitHub/Instagram을 표시한다.
- [ ] 전역과 페이지별 metadata가 archive-first 정체성 및 각 페이지의 정식 URL을 반영하고,
  글 상세 article OG URL은 변하지 않는다.
- [ ] sitemap에는 `/`, `/portfolio`, `/pipeline`, 글 상세만 있고 `/posts`는 없다.
- [ ] 새 팔레트, 의존성, 애니메이션을 추가하지 않으며 기존 토큰·타이포그래피·reduced-motion
  규칙을 지킨다.
- [ ] `npm test`, `npx tsc --noEmit`, `npm run build`가 성공하고 Contentlayer 생성 churn만
  복원한 뒤 작업 트리가 깨끗하다.

## 16. 잔여 위험

- Contentlayer가 Windows에서 생성 JSON을 CR/LF로 다시 쓸 수 있다. 런타임 경계의
  `trim()`과 빌드 후 생성 churn만 복원하는 절차가 이를 완화하지만, 생성물을 직접 수정해
  해결해서는 안 된다.
- 브라우저 플러그인의 trusted-path bootstrap 문제 때문에 자동 브라우저 QA가 불가능할 수
  있다. 이 경우 emitted HTML/HTTP 검사는 구조·SEO·리다이렉트를 검증하지만 실제 브라우저의
  responsive crop과 포커스 링 외관까지 증명하지 못한다. 해당 항목은 플러그인 복구 후
  재확인할 시각 QA 잔여 위험으로 남는다.
