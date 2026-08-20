import type { AccentColor } from "@/lib/accent";

export const CHUNK_MIN_CHARS = 2000;
export const CHUNK_MAX_CHARS = 3000;

export interface PipelineStage {
  id: string;
  label: string;
  caption: string;
  accent: AccentColor;
  detail: string;
  stack: string[];
}

export interface HierarchyNode {
  id: string;
  label: string;
  level: 1 | 2 | 3;
  chunkId?: string;
}

export interface DocumentChunk {
  id: string;
  path: string;
  charCount: number;
  text: string;
  headerRepeated?: boolean;
}

export interface DemoDocument {
  id: string;
  label: string;
  source: string;
  sourceUrl: string;
  disclaimer?: string;
  boundaryRules: string[];
  hierarchy: HierarchyNode[];
  chunks: DocumentChunk[];
}

export interface IndexTarget {
  id: string;
  label: string;
  accent: AccentColor;
  description: string;
  owned: boolean;
}

export const pipelineStages: PipelineStage[] = [
  {
    id: "parse",
    label: "구조 파싱",
    caption: "PDF·DOCX·HWP → 요소 트리",
    accent: "orange",
    detail:
      "형식이 제각각인 원본 문서를 공통 중간 표현으로 변환합니다. 표는 구조를 유지한 채 분리하고, 머리말·꼬리말·페이지 번호처럼 검색 품질을 떨어뜨리는 노이즈를 제거합니다.",
    stack: ["Python", "FastAPI"],
  },
  {
    id: "hierarchy",
    label: "계층 인식",
    caption: "장·조·항 경계 판별",
    accent: "teal",
    detail:
      "문서 유형별로 다른 개행 표현식을 적용해 장·조·항 경계를 찾습니다. 고정 길이로 자르면 조문 중간이 끊기므로, 계층 경계를 먼저 확정한 뒤 그 안에서만 분할합니다.",
    stack: ["Python"],
  },
  {
    id: "chunk",
    label: "의미 단위 청킹",
    caption: "문자 수 상한에 맞춰 절삭",
    accent: "purple",
    detail:
      "내용이 짧은 단은 그대로 한 청크에 담고, 상한을 넘으면 청크를 분리하되 헤더는 각 조각에 유지합니다. 연관 문단을 묶어 paragraphs group으로 구성합니다.",
    stack: ["Python"],
  },
  {
    id: "index",
    label: "이중 색인",
    caption: "Vector DB + BM25",
    accent: "pink",
    detail:
      "동일한 청크를 임베딩 벡터와 키워드 색인 양쪽에 적재합니다. 계층 경로를 메타데이터로 함께 저장해 검색 결과가 어느 조문에서 왔는지 추적할 수 있게 합니다.",
    stack: ["Chroma", "Elasticsearch"],
  },
  {
    id: "serve",
    label: "검색 연동",
    caption: "근거 청크 반환",
    accent: "green",
    detail:
      "적재된 두 인덱스를 질의해 근거 청크를 반환합니다. 검색·랭킹 모델은 사내 연구소가 개발한 것을 API로 연동했습니다.",
    stack: ["FastAPI"],
  },
];

export const demoDocuments: DemoDocument[] = [
  {
    id: "regulation",
    label: "법령",
    source: "국가법령정보센터 「수도법 시행규칙」 [시행 2026. 3. 24.]",
    sourceUrl: "https://www.law.go.kr/lsInfoP.do?lsId=007531",
    disclaimer:
      "공개 법령의 제1조 내용을 UI 시연에 맞게 축약·재구성했습니다.",
    boundaryRules: [
      "^제\\s*\\d+\\s*장",
      "^제\\s*\\d+\\s*조",
      "^\\s*[①-⑳]",
      "^\\s*\\d+\\.\\s",
    ],
    hierarchy: [
      {
        id: "water-rule",
        label: "수도법 시행규칙 [시행 2026. 3. 24.]",
        level: 1,
      },
      {
        id: "water-rule-a1",
        label: "제1조 목적",
        level: 2,
        chunkId: "chunk_001",
      },
    ],
    chunks: [
      {
        id: "chunk_001",
        path: "수도법 시행규칙 › 제1조 목적",
        charCount: 70,
        text: "제1조(목적) 이 규칙은 「수도법」과 같은 법 시행령에서 위임된 사항과 그 시행에 필요한 사항을 정하는 것을 목적으로 합니다.",
      },
    ],
  },
  {
    id: "press",
    label: "보도자료",
    source: "관세청 「2026년 7월 1일~7월 20일 수출입 현황」 (2026.7.21 배포)",
    sourceUrl:
      "https://www.customs.go.kr/kcs/na/ntt/selectNttInfo.do?nttSn=10170523&nttSnUrl=0cf5ecc6b10e0e5e7d8aed6856284263",
    boundaryRules: ["^\\s*<.+>\\s*$", "^\\s*ㅇ\\s", "^\\s*□\\s", "^\\s*-\\s"],
    hierarchy: [
      { id: "p-sum", label: "<요약>", level: 1, chunkId: "chunk_101" },
      { id: "p-total", label: "총괄", level: 1, chunkId: "chunk_102" },
      { id: "p-export", label: "수출현황", level: 1, chunkId: "chunk_103" },
      { id: "p-export-item", label: "ㅇ 주요품목", level: 2 },
      { id: "p-export-country", label: "ㅇ 주요국가", level: 2 },
      { id: "p-import", label: "수입현황", level: 1, chunkId: "chunk_104" },
    ],
    chunks: [
      {
        id: "chunk_101",
        path: "<요약>",
        charCount: 2050,
        text: "관세청은 21일, 7월 1일~20일 기간의 수출입 현황 잠정치를 발표했다. 동기간 수출은 549억 달러로 전년동기대비 52.3% 증가했다.",
      },
      {
        id: "chunk_102",
        path: "총괄",
        charCount: 2470,
        text: "(7.1.~7.20.) 수출 549억 달러, 수입 427억 달러로 전년동기대비 수출 52.3% 증가, 수입 20.0% 증가",
      },
      {
        id: "chunk_103",
        path: "수출현황 › 주요품목",
        charCount: 2760,
        text: "전년동기대비 반도체(180.6%), 석유제품(33.4%), 컴퓨터 주변기기(231.9%) 등 증가, 승용차(△10.6%) 등 감소",
      },
      {
        id: "chunk_104",
        path: "수입현황 › 주요품목",
        charCount: 2310,
        text: "전년동기대비 반도체(54.9%), 원유(27.5%), 반도체 제조장비(56.9%), 가스(27.9%) 등 증가",
      },
    ],
  },
];

export const indexTargets: IndexTarget[] = [
  {
    id: "chroma",
    label: "Chroma — dense 적재",
    accent: "pink",
    description:
      "청크를 BGE 계열 임베딩으로 변환해 적재합니다. 계층 경로를 메타데이터로 함께 저장합니다.",
    owned: true,
  },
  {
    id: "elasticsearch",
    label: "Elasticsearch — BM25 적재",
    accent: "sky",
    description:
      "동일한 청크를 키워드 색인으로 이중 적재합니다. 조문 번호 같은 고유 표기에 대응하기 위함입니다.",
    owned: true,
  },
  {
    id: "retrieval",
    label: "검색 · 랭킹",
    accent: "green",
    description:
      "사내 연구소가 개발한 검색 모델을 API로 연동했습니다. 적재된 두 인덱스를 질의해 근거 청크를 반환합니다.",
    owned: false,
  },
];

export const extractionComparison = {
  caption: "같은 표, 두 가지 추출 결과",
  naive: {
    label: "pdftotext — 순진한 텍스트 추출",
    output:
      "수 출 3△6,058 37△0,723 61,916\n54,933 551,281 (전년동기대비 증감률)\n( 2.2) ( 0.3) (60.2) (52.3) (48.7)",
    note: "행·열이 무너져 숫자와 증감부호가 뒤엉킵니다. 이 상태로 임베딩하면 검색이 틀린 값을 근거로 반환합니다.",
  },
  structured: {
    label: "구조 보존 파싱",
    output:
      "| 구분 | 당월 | 연간누계 |\n|---|---|---|\n| 수출 | 54,933 | 551,281 |\n| 수입 | 42,715 | 401,374 |",
    note: "셀 관계가 유지되어 특정 항목을 물었을 때 정확한 값을 근거로 제시할 수 있습니다.",
  },
};

export const pipelineStack = [
  "Python",
  "FastAPI",
  "BGE 계열 임베딩",
  "Chroma",
  "Elasticsearch",
];
