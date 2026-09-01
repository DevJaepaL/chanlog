export type RpaPipelineItemId =
  | "bpr-server"
  | "java-scheduler"
  | "image-download"
  | "rpa-cloud"
  | "ocr-msa";

export type RpaPipelineGroup = "external" | "owned" | "integrated";
export type RpaPipelineTone = "orange" | "teal" | "sky" | "purple" | "pink";

export interface RpaPipelineStage {
  id: RpaPipelineItemId;
  step: string;
  group: RpaPipelineGroup;
  label: string;
  title: string;
  description: string;
  tone: RpaPipelineTone;
}

export const rpaPipelineStages = [
  {
    id: "bpr-server",
    step: "01",
    group: "external",
    label: "BPR 서버",
    title: "대규모 원본 이미지 보관/조회",
    description:
      "OCR 처리 대상을 조회할 수 있도록 대규모 원본 이미지를 보관하는 서버",
    tone: "orange",
  },
  {
    id: "java-scheduler",
    step: "02",
    group: "owned",
    label: "Java 스케줄러",
    title: "매일 정해진 시간에 작업 시작",
    description:
      "반복 운영 업무가 누락되지 않도록 정해진 시간에 처리를 시작하고, 이미지를 수집합니다.",
    tone: "teal",
  },
  {
    id: "image-download",
    step: "03",
    group: "owned",
    label: "이미지 다운로드",
    title: "OCR 대상 이미지 일괄 수집",
    description: "선별된 OCR 대상 이미지를 파이프라인을 거쳐 일괄 수집합니다.",
    tone: "sky",
  },
  {
    id: "rpa-cloud",
    step: "04",
    group: "owned",
    label: "RPA Cloud 전달",
    title: "OCR MSA 요청 데이터 전송",
    description: "수집한 이미지를 OCR 처리 요청에 맞는 데이터로 전달합니다.",
    tone: "purple",
  },
  {
    id: "ocr-msa",
    step: "05",
    group: "integrated",
    label: "OCR MSA",
    title: "이미지 문자 인식 처리",
    description:
      "마이크로 서비스에 배포된 OCR 서비스를 호출하여 결과를 반환합니다.",
    tone: "pink",
  },
] as const satisfies readonly RpaPipelineStage[];

export const rpaPipelineGroups = {
  external: rpaPipelineStages.filter((stage) => stage.group === "external"),
  owned: rpaPipelineStages.filter((stage) => stage.group === "owned"),
  integrated: rpaPipelineStages.filter((stage) => stage.group === "integrated"),
} as const;

export interface RpaPipelineState {
  isOpen: boolean;
  hoveredId: RpaPipelineItemId | null;
  focusedId: RpaPipelineItemId | null;
}

export type RpaPipelineEvent =
  | { type: "open" }
  | { type: "hover"; id: RpaPipelineItemId }
  | { type: "clear-hover" }
  | { type: "focus"; id: RpaPipelineItemId }
  | { type: "clear-focus" }
  | { type: "close" };

export function getRpaPipelineState(): RpaPipelineState {
  return { isOpen: false, hoveredId: null, focusedId: null };
}

export function getActiveRpaPipelineItemId(
  state: RpaPipelineState
): RpaPipelineItemId | null {
  return state.focusedId ?? state.hoveredId;
}

export function reduceRpaPipelineState(
  state: RpaPipelineState,
  event: RpaPipelineEvent
): RpaPipelineState {
  if (event.type === "open") return { ...state, isOpen: true };
  if (event.type === "close") return getRpaPipelineState();
  if (event.type === "hover") return { ...state, hoveredId: event.id };
  if (event.type === "clear-hover") {
    return state.hoveredId === null ? state : { ...state, hoveredId: null };
  }
  if (event.type === "focus") return { ...state, focusedId: event.id };
  if (event.type === "clear-focus") return { ...state, focusedId: null };
  return state;
}
