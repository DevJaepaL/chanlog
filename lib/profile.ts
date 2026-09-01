import type { AccentColor } from "@/lib/accent";

export interface CareerItem {
  company: string;
  period: string;
  startedAt: string;
  // role: string;
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
  skills: string[];
  previews?: ProjectPreview[];
  detail?: "rpa-ocr-pipeline" | "document-preprocessor-pipeline";
  logo?: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
}
export interface ProjectPreview {
  label: string;
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
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
  role: "AI Engineer & Backend Developer",
  tagline: "",
  about: {
    greeting:
      "서버 개발 및 LLM & RAG 관련 개발 업무를 진행해온 만 3년차 개발자 이재찬입니다.",
    summaries: [
      [
        "FastAPI를 활용한 백엔드 서비스 개발과 MSA 아키텍처 기반 서비스를",
        "실무에서 설계·개발해왔으며, 관련 기술을 익숙하게 다루고 있어요.",
      ],
      [
        "공공기관 및 사규 문서 등 비정형 데이터 중심의 전처리 연구와",
        "개발 업무를 가장 많이 수행하며 관련 경험을 쌓아왔어요.",
      ],
      [
        "RAG 아키텍처와 데이터 파이프라인 전반을 설계하고,",
        "오픈소스·오픈 모델을 실제 서비스에 적용한 경험이 있어요.",
      ],
    ],
  },
} as const;

export const careers: CareerItem[] = [
  {
    company: "㈜메타버스",
    period: "2025.09 ~ 재직중",
    startedAt: "2025-09",
    // role: "대리",
    team: "공간정보 연구소",
    summary: "백엔드·서버 개발",
    highlights: [
      "GIS 기반 전국 단위의 빅데이터 전처리 파이프라인 설계 및 개발",
      "PyQt6 및 PyQGIS 기반 GUI 소프트웨어 개발",
      "신규 연구개발팀 초기 개발 환경 구축 및 사내 업무망 내에 원활한 개발 환경 서비스 구성",
    ],
  },
  {
    company: "㈜그리드원",
    period: "2023.08 ~ 2025.07",
    startedAt: "2023-08",
    // role: "주임",
    team: "솔루션개발본부",
    summary: "생성형 AI(RAG) 데이터 전처리 담당 및 개발",
    highlights: [
      "MSA 아키텍처 서비스 활용 및 개발",
      "RAG 구축을 위한 LangChain·LangGraph 프레임워크 활용",
      "비정형 데이터 및 문서 전처리기(PDF·DOCX·HWP) 서비스 개발",
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
    role: "전국 단위 GIS 빅데이터 처리 및 프로세스 파이프라인 구성",
    experience: [
      "GIS 데이터 처리 파이프라인 설계",
      "초기 개발팀 체계 및 환경 구축",
    ],
    skills: ["Python", "PyQGIS", "PyQt6", "GIS"],
    previews: [
      {
        label: "영상 기반 객체 판별 흐름",
        src: "/images/project-previews/farm-map-01.png",
        alt: "항공정사영상에서 SegFormer·Pix2Poly·Swin Transformer를 거쳐 HITL과 QGIS 작업자가 검토하는 객체 판별 흐름",
        width: 643,
        height: 306,
      },
      {
        label: "팜맵 데이터 추출·가공 흐름",
        src: "/images/project-previews/farm-map-02.png",
        alt: "갱신 후·전 팜맵, LX맵, 경작신고 농경지에서 데이터를 수집·연계·추출하고 로그와 메타데이터를 관리하는 흐름",
        width: 802,
        height: 242,
      },
      {
        label: "팜맵 애플리케이션 컴포넌트 구조",
        src: "/images/project-previews/farm-map-03.png",
        alt: "전자정부 표준 프레임워크의 디자인과 기반소스 코드 위에 업무·공통·공간정보 공통 컴포넌트를 구성한 구조",
        width: 771,
        height: 457,
      },
    ],
    logo: {
      src: "/images/project-logos/epis-ci.png",
      alt: "농림수산식품교육문화정보원 로고",
      width: 783,
      height: 500,
    },
  },
  {
    title: "생성형 AI ChatBot & RAG · 문서 처리 솔루션",
    org: "그리드원",
    period: "2023.11 ~ 2025.04",
    startedAt: "2023-11",
    role: "PDF·DOCX·HWP 문서 구조 추출 및 전처리 초기 개발",
    experience: [
      "PDF·DOCX·HWP 문서의 제목·본문·표·그림을 구조 단위로 추출·전처리",
      "문서 처리에 활용할 오픈소스와 오픈 모델을 연구·탐색",
      "문서 전처리 초기 개발에 기여",
    ],
    skills: ["Python", "LangChain", "LangGraph", "RAG"],
    detail: "document-preprocessor-pipeline",
    logo: {
      src: "/images/project-logos/gridone-logo.svg",
      alt: "그리드원 로고",
      width: 273,
      height: 46,
    },
  },
  {
    title: "한국수자원공사 생성형 AI 서비스 시범사업 및 운영",
    org: "그리드원",
    client: "한국수자원공사",
    period: "2024.06 ~ 2025.05",
    startedAt: "2024-06",
    role: "RAG 데이터 전처리 및 임베딩",
    experience: [
      "문서 데이터 전처리",
      "컨테이너 기술 활용",
      "NoSQL 방식 DB 관리",
    ],
    skills: ["Python", "Docker", "Mongo DB", "RAG", "FastAPI"],
    previews: [
      {
        label: "메인 화면",
        src: "/images/project-previews/k-water-01.webp",
        alt: "K-water 생성형 AI 서비스 메인 화면",
      },
      {
        label: "질의응답 화면",
        src: "/images/project-previews/k-water-02.webp",
        alt: "K-water 생성형 AI 서비스 질의응답 화면",
      },
      {
        label: "보고서 생성 화면",
        src: "/images/project-previews/k-water-03.webp",
        alt: "K-water 생성형 AI 서비스 보고서 생성 화면",
      },
    ],
    logo: {
      src: "/images/project-logos/k-water-ci.png",
      alt: "한국수자원공사 K-water 로고",
      width: 2508,
      height: 1134,
    },
  },
  {
    title: "신한카드 RPA 운영 고도화 프로젝트",
    org: "그리드원",
    client: "신한카드",
    period: "2025.04 ~ 2025.06",
    startedAt: "2025-04",
    role: "기존 운영 업무 시간 단축을 위한 모듈 및 파이프라인 개발",
    experience: [
      "BPR 서버의 대규모 이미지를 OCR 처리 대상으로 선별 및 다운로드하는 Java 모듈 개발",
      "다운로드한 이미지를 RPA Cloud의 OCR MSA로 전달하는 연동 흐름 구현",
      "전체 처리 과정을 매일 실행하도록 스케줄링하여 반복 운영 업무 시간 단축",
    ],
    skills: ["Java", "Cron Scheduler", "RPA", "Spring", "MSA"],
    detail: "rpa-ocr-pipeline",
    logo: {
      src: "/images/project-logos/shinhan-card-logo.gif",
      alt: "신한카드 로고",
      width: 380,
      height: 131,
    },
  },
  {
    title: "B은행 생성형 AI 서비스 실증사업",
    org: "그리드원",
    client: "B은행",
    period: "2024.02 ~ 2024.03",
    startedAt: "2024-02",
    role: "데이터 전처리 및 임베딩",
    experience: [
      "초기 사내 RAG 솔루션 개발을 위한 연구 및 경험",
      "금융,사규등의 도메인 문서 전처리 및 임베딩",
    ],
    skills: ["Python", "RAG", "데이터 전처리"],
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
  { label: "Contact", href: "mailto:wocks3254@gmail.com" },
  { label: "GitHub", href: "https://github.com/DevJaepaL" },
  { label: "Instagram", href: "https://www.instagram.com/jaechane" },
];
