# 포트폴리오 사이트 전면 개편 설계

작성일: 2026-08-07
대상: `chanlog.blog` (Next.js 14 App Router + contentlayer2 + Tailwind)

## 1. 목표

기존 개인 블로그를 **포트폴리오 사이트**로 전면 개편한다. 블로그 기능은 유지하되 홈을
경력·프로젝트·역량을 보여주는 원페이지로 재구성하고, 문서 전처리 파이프라인 설계 역량을
인터랙티브 컴포넌트로 시연한다.

디자인은 `DESIGN.md`(Notion 디자인 언어)를 따른다.

## 2. 확정된 결정 사항

| 항목 | 결정 |
|---|---|
| 사이트 구조 | 원페이지 홈 + 블로그 분리 |
| 다크모드 | 미지원 (라이트 전용) |
| 비주얼 방향 | Notion 정석 + 절제된 진입 애니메이션 |
| 파이프라인 UI | 가로 스텝 플로우 + Document Parse 3블록 |
| 컴포넌트 배치 | Projects 뒤 독립 섹션, 고객사와 분리 |
| 데모 문서 | 공개 법령 + 관세청 보도자료 |
| `CLAUDE.md` | 신규 생성 |
| `/info` | 삭제 |

## 3. 정보 구조

### 3.1 라우트

| 경로 | 내용 | 변경 |
|---|---|---|
| `/` | 원페이지 포트폴리오 (8개 섹션) | 전면 재작성 |
| `/posts` | 글 목록 | 디자인 개편 |
| `/posts/[slug]` | 글 상세 | 디자인 개편 |
| `/info` | — | 삭제 (내용은 홈 About/Career로 흡수) |

### 3.2 홈 섹션

| # | 섹션 | 내용 |
|---|---|---|
| ① | Hero | 딥 인디고 풀블리드 밴드. 아바타, 이름, 직무, 한 줄 요약, CTA(GitHub/Email) |
| ② | About | 자기소개 4문장 |
| ③ | Career | 세로 타임라인 2건 |
| ④ | Projects | 카드 4개 — 텍스트만 |
| ⑤ | 문서 전처리 파이프라인 | 시그니처 섹션. 3블록 인터랙티브 |
| ⑥ | Skills | 카테고리별 컬러 칩 |
| ⑦ | Writing | 최근 글 3개 + 전체보기 |
| ⑧ | Contact | Email / GitHub / Instagram |

Hero는 페이지에서 유일한 다크 구간이다. `DESIGN.md`의 "단일 나이트 밴드" 원칙에 따라
다른 섹션에서 인디고 배경을 반복하지 않는다.

## 4. 콘텐츠

### 4.1 About

> 만 3년차 서버 및 AI 관련 개발 업무를 맡아온 이재찬입니다.
> 백엔드 및 서버 개발 경력을 바탕으로 Python과 Java를 활용한 다양한 프로젝트 경험을 보유하고 있습니다.
> FastAPI를 중심으로 REST API 및 MSA 기반 서비스 아키텍처를 설계·구축했고,
> Docker·Podman을 통한 배포 자동화와 Git 협업에 익숙합니다.
> MariaDB·MongoDB 등 다양한 데이터베이스 경험과 RAG 서비스의 데이터 전처리·관리 역량을 갖추고 있으며,
> ReactJS 프론트엔드 연동 경험도 있습니다.
> 대학 시절 과 대표로 학과 프로젝트와 팀워크를 이끌며 리더십과 소통 능력을 키웠습니다.

### 4.2 Career

| 회사 | 기간 | 직책 | 담당 |
|---|---|---|---|
| (주)메타버스 | 2025.09 ~ 재직중 | 공간정보 개발팀 대리 | 백엔드/서버 개발 |
| (주)그리드원 | 2023.08 ~ 2025.07 | AI R&D 주임 | 생성형 AI 데이터 전처리 |

### 4.3 Projects

카드 4개. **파이프라인 상세는 붙이지 않는다** — 각 카드는 기간/소속/역할/경험 텍스트만 담는다.

1. **농식품 팜맵 서비스 개선** — 메타버스 · 농정원, 2025.09 ~ 진행중
   GIS 기반 데이터 처리 파이프라인 설계 및 개발, 연구개발팀 신규 체계 및 환경 구성,
   Python 기반 GUI 소프트웨어 개발
2. **한국수자원공사 생성형 AI 시범사업 및 운영** — 그리드원 · K-water, 2024.06 ~ 2025.05
   문서 데이터 전처리 및 임베딩, 컨테이너 기술, NoSQL DB 관리
3. **부산은행 생성형 AI 실증사업** — 그리드원 · BNK, 2024.02 ~ 2024.03
   데이터 전처리 및 임베딩
4. **생성형 AI ChatBot & RAG 솔루션** — 그리드원, 2023.11 ~ 2025.04
   데이터 전처리 및 임베딩, 오픈소스 아키텍처 분석 및 신기술 연구

> 초기 논의에서 부산은행 건을 K-water 카드에 접어 넣는 방안을 검토했으나,
> 카드에서 파이프라인 상세를 제거하면서 내용 중복 문제가 해소되어 4개 카드를 그대로 유지한다.

### 4.4 Skills

| 카테고리 | 항목 | 닷 컬러 |
|---|---|---|
| Language | Python, Java | `accent-orange` |
| Backend | FastAPI, REST API, MSA, Spring | `accent-teal` |
| AI / Data | LangChain, LangGraph, RAG, 데이터 전처리 | `accent-purple` |
| Database | MariaDB, MongoDB | `accent-pink` |
| Infra | Docker, Podman, Kubernetes, Git | `accent-sky` |
| Frontend | ReactJS | `accent-green` |

## 5. 문서 전처리 파이프라인 섹션 (⑤)

### 5.1 프레이밍 원칙

이 섹션은 **특정 고객사 프로젝트가 아니라 본인의 방법론 시연**이다.

- 섹션 제목: "문서 전처리 파이프라인 — 이렇게 설계합니다"
- 고객사명(K-water, 부산은행)을 이 섹션에 표기하지 않는다
- 대상 문서는 공개 자료만 사용한다
- 처리 건수·데이터 규모·정확도 등 **수치를 일절 기재하지 않는다**
- 담당 범위와 연동 범위를 시각적으로 구분한다

### 5.2 블록 1 — 파이프라인 개요

가로 스텝 플로우. 5단계 노드 + 화살표, 노드 클릭 시 하단에 상세 패널이 펼쳐진다.
모바일에서는 세로 스택으로 전환한다.

```
구조 파싱 → 계층 인식 → 의미 단위 청킹 → 이중 색인 → 검색 연동
```

### 5.3 블록 2 — 계층 인식 청킹 (핵심)

문서 유형 탭 2종: `규정·지침`, `보도자료`.

**경계 규칙** — 정규식을 화면에 노출한다.

```
^제\s*\d+\s*장       ^제\s*\d+\s*조
^\s*[①-⑳]           ^\s*\d+\.\s
```

**청킹 로직**

- 기준 단위는 **문자 수 2,000–3,000자** (토큰 아님)
- 단의 내용이 짧으면 그대로 한 청크에 담고, 이어지는 장 내용으로 채운다
- 헤더 아래 내용이 상한을 넘으면 청크를 분리하되 **헤더는 각 조각에 유지**한다
- 연관 문단을 묶어 **paragraphs group** 으로 구성한다

**레이아웃** — 좌측 계층 트리 ↔ 우측 생성 청크. 각 청크에 계층 경로, 문자 수, 메타데이터를 표시한다.

### 5.4 블록 3 — 이중 색인

담당 범위와 연동 범위를 시각적으로 분리한다.

**담당 범위** (실선 카드, 강조)
- Chroma — 청크를 BGE 계열 임베딩으로 변환해 적재. 계층 경로를 메타데이터로 저장
- Elasticsearch — 동일 청크를 BM25 키워드 색인으로 이중 적재

**연동 범위** (점선 카드, `opacity: .72`)
- 검색·랭킹은 사내 연구소가 개발한 모델을 API로 연동

**금지 사항** — 유사도 스코어 수치, RRF 등 결합 방식, 형태소 분석기는 표기하지 않는다.
본인 소관이 아니어서 검증할 수 없는 값이다.

기술 칩: `Python` `FastAPI` `BGE 계열 임베딩` `Chroma` `Elasticsearch`

> 임베딩 모델은 "BGE 계열"로만 표기한다. 정확한 버전이 확인되지 않았으므로
> `BGE-m3` 같은 특정 버전을 명시하지 않는다.

### 5.5 데모 문서

| 탭 | 문서 | 근거 |
|---|---|---|
| 규정·지침 | 공개 법령 (수도법 시행규칙 등) | 국가법령정보센터, 공공누리 제1유형 |
| 보도자료 | 관세청 수출입 현황 보도자료 (2026.7.21) | 공개 보도자료 |

좌측 문서 패널은 **HTML로 재현**한다. PDF 원본 이미지를 게시하지 않으므로 저작권 이슈가 없다.
법령 조문은 출처를 명시한다.

### 5.6 대비 블록

같은 표에 대한 두 가지 추출 결과를 나란히 보여준다.

- `pdftotext` 순진한 추출 → 행·열이 무너져 숫자가 뒤엉킴
- 구조 보존 파싱 → 셀 관계 유지, 정확한 근거 제시 가능

## 6. 디자인 시스템

### 6.1 폰트

요청 스택을 그대로 적용한다.

```css
font-family: 'SF Pro Display', 'SF Pro Text', 'PretendardLocal', sans-serif;
```

**구현 방식 변경** — 현재 `next/font/local`은 해시된 패밀리명을 생성하므로 `PretendardLocal`
이라는 이름이 실제로 매칭되지 않는다. `app/globals.css`에 `@font-face`를 직접 선언하여
패밀리명을 `PretendardLocal`로 고정하고, `next/font/local` 사용을 제거한다.

```css
@font-face {
  font-family: 'PretendardLocal';
  src: url('/fonts/Pretendard-Regular.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
}
/* SemiBold 600, Bold 700, Black 900 동일 패턴 */
```

`tailwind.config.js`의 `theme.extend.fontFamily.sans`를 위 스택으로 교체하고,
`app/layout.tsx`에서 `localFont` 호출과 `pretendard.variable` 클래스를 제거한 뒤
Regular/Bold `<link rel="preload">`를 추가한다.

> SF Pro는 Apple 기기에만 설치되어 있으므로 Windows·Android에서는 Pretendard로 렌더된다.
> 두 폰트 모두 기하학적 산세리프라 레이아웃은 유지되나 자간 인상이 기기별로 달라진다.
> 요청에 따라 의도된 동작이다.

### 6.2 색상 토큰

`tailwind.config.js`의 `theme.extend.colors`에 `DESIGN.md` 값을 등록한다.

| 역할 | 토큰 | 값 |
|---|---|---|
| 페이지 캔버스 | `canvas-soft` | `#f6f5f4` |
| 카드 표면 | `surface` | `#ffffff` |
| 헤어라인 | `hairline` | `#e6e6e6` |
| 본문 | `ink` / `ink-secondary` / `ink-muted` / `ink-faint` | `#000000` / `#31302e` / `#615d59` / `#a39e98` |
| 구조 액센트 | `primary` | `#0075de` |
| 히어로 밴드 | `secondary` | `#213183` |
| 스티커 | `accent-*` | sky/purple/pink/orange/teal/green |

**사용 규칙**

- `primary`는 CTA·링크·포커스에만 쓴다. 장식 용도 금지
- `accent-*`는 스킬 칩 닷, 파이프라인 노드, 파싱 요소 분류에만 쓴다. CTA·구조 채색 금지
- 페이지 배경은 `canvas-soft`, 카드는 `surface`로 figure/ground를 만든다
- `secondary`는 Hero 밴드에만 쓴다

### 6.3 타이포그래피

`DESIGN.md`의 스케일을 Tailwind `fontSize`에 등록한다. 음수 자간을 명시적으로 적용한다.

| 토큰 | 크기 / 굵기 / 자간 |
|---|---|
| `display-1` | 64px / 700 / −2.125px |
| `heading-1` | 40px / 700 / −1px |
| `heading-2` | 26px / 700 / −0.625px |
| `heading-3` | 22px / 700 / −0.25px |
| `title` | 20px / 600 / −0.125px |
| `body-md` | 16px / 400 / 0 |
| `body-sm` | 15px / 400 / 0 |
| `caption` | 14px / 400 / 0 |
| `eyebrow` | 12px / 600 / +0.125px |

### 6.4 형태 · 깊이

- 카드 `rounded-lg` 12px, 대형 컨테이너 `rounded-xl` 16px, 칩·CTA `rounded-full`
- 입력 필드는 `rounded-xs` 4px — 알약 모양 금지
- 기본 elevation은 헤어라인만. 부양 카드에만 다층 미세 그림자

### 6.5 애니메이션

`framer-motion`으로 섹션 진입 시 페이드업만 적용한다. (`opacity 0→1`, `y 12px→0`, 400ms)

- 스크롤 진행 표시, 시차 효과, 스태거는 넣지 않는다
- `prefers-reduced-motion` 존중

## 7. 데이터 모델

경력·프로젝트·스킬을 컴포넌트에서 분리해 `lib/profile.ts`에 타입과 함께 둔다.
컴포넌트는 렌더링만 담당하고, 내용 수정은 이 파일 한 곳에서 이뤄진다.

```ts
export interface CareerItem {
  company: string; period: string; role: string;
  team?: string; summary: string; highlights: string[];
}

export interface ProjectItem {
  title: string; org: string; client?: string;
  period: string; role: string; experience: string[];
}

export interface SkillGroup {
  category: string; accent: AccentColor; items: string[];
}
```

파이프라인 데이터는 별도로 `lib/pipeline.ts`에 둔다.

```ts
export interface PipelineStage {
  id: string; label: string; caption: string;
  accent: AccentColor; detail: string; stack: string[];
}

export interface ParsedDocument {
  id: string; label: string; source: string;
  boundaryRules: string[];
  hierarchy: HierarchyNode[];
  chunks: DocumentChunk[];
}
```

## 8. 파일 구조

```
app/
  layout.tsx              폰트 preload, 메타데이터
  page.tsx                홈 — 섹션 조립만
  globals.css             @font-face, 디자인 토큰, MDX 스타일
  posts/…                 기존 유지, 디자인만 개편
  info/                   삭제

components/
  navbar.tsx              개편
  footer.tsx              개편
  home/
    hero.tsx
    about.tsx
    career-timeline.tsx
    project-list.tsx
    skill-groups.tsx
    recent-posts.tsx
    contact.tsx
  pipeline/
    pipeline-section.tsx  섹션 컨테이너, 3블록 조립
    pipeline-flow.tsx     블록 1 — 가로 스텝 플로우 (재사용 가능)
    chunking-view.tsx     블록 2 — 계층 트리 ↔ 청크
    index-view.tsx        블록 3 — 이중 색인
    extraction-compare.tsx 대비 블록
  ui/
    section.tsx           섹션 래퍼 (제목 + 여백 + 페이드업)
    chip.tsx
    card.tsx

lib/
  profile.ts              경력·프로젝트·스킬 데이터
  pipeline.ts             파이프라인·문서·청크 데이터
  toc.ts                  기존 유지

CLAUDE.md                 신규
```

`pipeline-flow.tsx`는 데이터 주입형 재사용 컴포넌트로 만든다. 1차 구현에서는 문서 전처리
섹션에서만 사용하고, 팜맵 GIS 파이프라인 적용은 후속 과제로 남긴다.

## 9. CLAUDE.md

루트에 신규 생성하며 다음을 담는다.

- 프로젝트 개요와 기술 스택
- 디자인 토큰 사용 규칙 (§6.2의 사용 규칙)
- 폰트 스택과 `@font-face` 방식을 쓰는 이유
- 디렉터리 구조와 컴포넌트 배치 원칙
- 콘텐츠 데이터는 `lib/profile.ts`·`lib/pipeline.ts`에서만 수정한다는 규칙
- 포트폴리오 기재 원칙 (§10)
- 빌드·개발 명령어, `.claude/launch.json` 안내

## 10. 기재 원칙 (콘텐츠 안전성)

**기재 가능**
- 범용 오픈소스 스택명 (FastAPI, Chroma, Elasticsearch, Docker 등)
- 설계 방법론 (계층 인식 청킹, 헤더 유지, paragraphs group)
- 공개 자료를 대상으로 한 시연

**기재 금지**
- 고객사 실제 문서 내용 및 샘플
- 처리 건수, 데이터 규모, 정확도·성능 수치
- 내부 시스템 구성도, 서버 스펙, 망 구조
- 미공개 사업 범위·일정
- 확신 없는 기술 세부값 (특정 모델 버전, 결합 알고리즘, 형태소 분석기)

마지막 항목이 중요하다. 확신 없는 값을 문서에 박아두면 면접에서 본인이 갇힌다.
불확실하면 범위로 쓰거나(예: "BGE 계열") 아예 쓰지 않는다.

## 11. 범위 외 (YAGNI)

- 다크모드
- 이력서 PDF 다운로드
- 프로젝트 상세 페이지
- 태그·검색·페이지네이션 등 블로그 기능 확장
- 방문자 분석 대시보드
- 다국어

## 12. 후속 과제

- 팜맵 GIS 파이프라인에 `pipeline-flow` 적용
- 기술 매뉴얼 문서 유형 탭 추가
- 프로젝트별 상세 내용 보강 (2·3·4번 프로젝트의 차별점)
