export type PipelineItemId =
  | "nifi"
  | "document-extractor"
  | "hwp"
  | "pdf"
  | "docx"
  | "preprocessor"
  | "index-store"
  | "llm-response"
  | "bm25"
  | "chroma-db"
  | "mongodb";

export type PipelineTone = "orange" | "teal" | "purple" | "sky" | "pink";
export type PipelineStageGroup = "owned" | "integrated";
export type PipelineDetailPosition = "left" | "center" | "right";

export function getPipelineDetailPosition(
  index: number,
  count: number
): PipelineDetailPosition {
  if (index === 0) return "left";
  if (index === count - 1) return "right";
  return "center";
}

export interface PipelineTarget {
  id: PipelineItemId;
  label: string;
  title: string;
  description: string;
  tone: PipelineTone;
}

export interface PipelineStage extends PipelineTarget {
  step: "01" | "02" | "03" | "04" | "05";
  group: PipelineStageGroup;
  extractors?: readonly PipelineTarget[];
  stores?: readonly PipelineTarget[];
}

export const pipelineStages = [
  {
    id: "nifi",
    step: "01",
    group: "owned",
    label: "NiFi",
    title: "데이터 수집 스케줄링",
    description:
      "지정한 시간(Cron)에 따라 최신 문서를 수집하고 전처리 작업 지시합니다.",
    tone: "orange",
  },
  {
    id: "document-extractor",
    step: "02",
    group: "owned",
    label: "문서 데이터 추출",
    title: "문서 추출 오케스트레이터",
    description: "문서 형식에 맞는 Extractor를 호출하고 내용을 추출합니다.",
    tone: "teal",
    extractors: [
      {
        id: "hwp",
        label: "HWP",
        title: "HWP Extractor",
        description:
          "공식 문서와 오픈소스를 조합해 한글 문서 구조를 추출했습니다.",
        tone: "orange",
      },
      {
        id: "pdf",
        label: "PDF",
        title: "PDF Extractor",
        description:
          "AI 모델을 탑재하고 오픈소스 모델 튜닝·학습을 담당했습니다.",
        tone: "purple",
      },
      {
        id: "docx",
        label: "DOCX",
        title: "DOCX Extractor",
        description: "오픈소스를 활용하여 문단과 표 구조를 추출했습니다.",
        tone: "sky",
      },
    ],
  },
  {
    id: "preprocessor",
    step: "03",
    group: "owned",
    label: "전처리기",
    title: "텍스트 청킹·전처리",
    description: "Extractor와 상호작용하며 청킹·정제 과정을 오케스트레이션",
    tone: "purple",
  },
  {
    id: "index-store",
    step: "04",
    group: "integrated",
    label: "지식 DB 색인·저장",
    title: "검색·원문 데이터 적재",
    description: "BM25·MongoDB에 검색 데이터와 원문을 적재합니다.",
    tone: "sky",
    stores: [
      {
        id: "bm25",
        label: "BM25",
        title: "BM25 키워드 색인",
        description:
          "조문 번호와 고유 표기를 찾을 수 있도록 키워드 기반 색인을 구성합니다.",
        tone: "sky",
      },
      // {
      //   id: "chroma-db",
      //   label: "Chroma DB",
      //   title: "Chroma DB 벡터 저장",
      //   description: "임베딩 벡터와 계층 경로 메타데이터를 저장합니다.",
      //   tone: "purple",
      // },
      {
        id: "mongodb",
        label: "MongoDB",
        title: "MongoDB 원문 관리",
        description: "원문과 파싱 결과, 처리 메타데이터를 저장합니다.",
        tone: "teal",
      },
    ],
  },
  {
    id: "llm-response",
    step: "05",
    group: "integrated",
    label: "LLM 모델의 응답 처리",
    title: "근거 기반 응답 생성",
    description: "검색된 근거를 조합해 LLM 응답을 생성합니다.",
    tone: "pink",
  },
] as const satisfies readonly PipelineStage[];

export const pipelineStageGroups = {
  owned: pipelineStages.filter((stage) => stage.group === "owned"),
  integrated: pipelineStages.filter((stage) => stage.group === "integrated"),
} as const;

export interface PipelineState {
  hoveredId: PipelineItemId | null;
  focusedId: PipelineItemId | null;
}

export type PipelineEvent =
  | { type: "hover"; id: PipelineItemId }
  | { type: "clear-hover" }
  | { type: "focus"; id: PipelineItemId }
  | { type: "clear-focus" }
  | { type: "close" };

export function getPipelineState(): PipelineState {
  return { hoveredId: null, focusedId: null };
}

export function getActivePipelineItemId(
  state: PipelineState
): PipelineItemId | null {
  return state.focusedId ?? state.hoveredId;
}

export function reducePipelineState(
  state: PipelineState,
  event: PipelineEvent
): PipelineState {
  if (event.type === "close") return getPipelineState();
  if (event.type === "hover") return { ...state, hoveredId: event.id };
  if (event.type === "clear-hover") {
    return state.hoveredId === null ? state : { ...state, hoveredId: null };
  }
  if (event.type === "focus") return { ...state, focusedId: event.id };
  if (event.type === "clear-focus") return { ...state, focusedId: null };
  return state;
}
