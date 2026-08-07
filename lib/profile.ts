import type { AccentColor } from "@/lib/accent";

export interface CareerItem {
  company: string;
  period: string;
  startedAt: string;
  role: string;
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
  role: "Backend & AI Engineer",
  tagline: "서버와 AI 데이터 파이프라인을 만듭니다.",
  about: [
    "만 3년차 서버 및 AI 관련 개발 업무를 맡아온 이재찬입니다. 백엔드 및 서버 개발 경력을 바탕으로 Python과 Java를 활용한 다양한 프로젝트 경험을 보유하고 있습니다.",
    "FastAPI를 중심으로 REST API 및 MSA 기반 서비스 아키텍처를 설계하고 구축했으며, Docker와 Podman을 통한 배포 자동화와 Git 협업에 익숙합니다.",
    "MariaDB·MongoDB 등 다양한 데이터베이스 경험과 RAG 서비스에 사용되는 데이터 전처리·관리 역량을 갖추고 있고, ReactJS를 통한 프론트엔드 연동 경험도 있습니다.",
    "대학 시절 과 대표로 선출되어 학과 내 프로젝트와 팀워크를 이끌며 리더십과 소통 능력을 키웠습니다.",
  ],
} as const;

export const careers: CareerItem[] = [
  {
    company: "(주)메타버스",
    period: "2025.09 ~ 재직중",
    startedAt: "2025-09",
    role: "대리",
    team: "공간정보 개발팀",
    summary: "백엔드·서버 개발",
    highlights: [
      "GIS 기반 데이터 처리 파이프라인 설계 및 개발",
      "연구개발팀 신규 체계 및 환경 구성",
      "Python 기반 GUI 소프트웨어 개발",
    ],
  },
  {
    company: "(주)그리드원",
    period: "2023.08 ~ 2025.07",
    startedAt: "2023-08",
    role: "주임",
    team: "AI(인공지능) R&D",
    summary: "생성형 AI(RAG) 데이터 전처리 담당 및 개발",
    highlights: [
      "문서 전처리기(PDF·DOCX·HWP) 서비스 개발",
      "MSA 아키텍처 서비스 개발",
      "LangChain·LangGraph 프레임워크 활용",
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
    role: "GIS 데이터 처리 및 개발 파이프라인 구성",
    experience: [
      "개발팀 체계 및 환경 구축",
      "GIS 데이터 처리 파이프라인 설계",
    ],
  },
  {
    title: "한국수자원공사 생성형 AI 서비스 시범사업 및 운영",
    org: "그리드원",
    client: "한국수자원공사",
    period: "2024.06 ~ 2025.05",
    startedAt: "2024-06",
    role: "데이터 전처리 및 임베딩",
    experience: [
      "문서 데이터 전처리",
      "컨테이너 기술 활용",
      "NoSQL 방식 DB 관리",
    ],
  },
  {
    title: "부산은행 생성형 AI 서비스 실증사업",
    org: "그리드원",
    client: "BNK 부산은행",
    period: "2024.02 ~ 2024.03",
    startedAt: "2024-02",
    role: "데이터 전처리 및 임베딩",
    experience: ["금융 도메인 문서 전처리 및 임베딩"],
  },
  {
    title: "생성형 AI ChatBot & RAG 솔루션",
    org: "그리드원",
    period: "2023.11 ~ 2025.04",
    startedAt: "2023-11",
    role: "데이터 전처리 및 임베딩",
    experience: [
      "다양한 오픈소스 아키텍처 분석",
      "신기술 연구 및 적용",
    ],
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
  { label: "Email", href: "mailto:wocks3254@gmail.com" },
  { label: "GitHub", href: "https://github.com/DevJaepaL" },
  { label: "Instagram", href: "https://www.instagram.com/jaechane" },
];
