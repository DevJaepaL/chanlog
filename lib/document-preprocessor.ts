export type DocumentRegionId = "title" | "summary" | "table" | "chart";
export type DocumentRegionAccent = "orange" | "teal" | "purple" | "sky";

export interface NormalizedRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface NormalizedPoint {
  x: number;
  y: number;
}

type TextResult = { kind: "text" | "list"; lines: readonly string[] };
type TableResult = {
  kind: "table";
  columns: readonly ["구분", "2026년 7월", "전년 동월 대비"];
  rows: readonly [
    { label: "수출"; cells: readonly ["98,959백만 달러", "63.0% 증가"] },
    { label: "수입"; cells: readonly ["68,567백만 달러", "26.5% 증가"] }
  ];
};
type FigureResult = { kind: "figure"; label: string; caption: string };

export interface DocumentRegion {
  id: DocumentRegionId;
  label: "문서 제목" | "텍스트" | "표 (추출 예시)" | "그림";
  accessibleName: "문서 제목 선택" | "텍스트 선택" | "표 선택" | "그림 선택";
  accent: DocumentRegionAccent;
  rect: NormalizedRect;
  detectedRects?: readonly NormalizedRect[];
  supplementalDetections?: readonly string[];
  marker: {
    point: NormalizedPoint;
    number: "1" | "2" | "3" | "4";
  };
  result: TextResult | TableResult | FigureResult;
}

export interface DocumentPreprocessorDemo {
  sectionId: "document-preprocessor";
  panelId: "document-preprocessor-panel";
  title: string;
  description: string;
  contribution: string;
  preview: {
    label: "추출 결과 예시";
    marker: "1";
    field: "문서 제목";
    text: "2026년 7월 월간 수출입 현황 [확정치]";
  };
  actions: { collapsed: string; expanded: string };
  source: string;
  image: { src: string; width: 1785; height: 2523; alt: string };
  regions: readonly DocumentRegion[];
}

export const documentPreprocessorDemo = {
  sectionId: "document-preprocessor",
  panelId: "document-preprocessor-panel",
  title: "Document Extractor · Preprocessor",
  description:
    "PDF·DOCX·HWP등 처리가 복잡한 공공기관 문서의 제목·본문·표·그림등을 문맥에 맞는 구조 단위로 효율적으로 분리했습니다.",
  contribution:
    "개발을 진행하며 오픈소스 및 모델 학습을 적극적으로 연구·탐색하며 초기 개발에 큰 기여를 했습니다.",
  preview: {
    label: "추출 결과 예시",
    marker: "1",
    field: "문서 제목",
    text: "2026년 7월 월간 수출입 현황 [확정치]",
  },
  actions: { collapsed: "구현 예시", expanded: "접기" },
  source:
    "출처: 관세청 「2026년 7월 월간 수출입 현황 [확정치]」, 2026. 8. 18., 1쪽",
  image: {
    src: "/images/document-preprocessor/customs-2026-07-page-1.webp",
    width: 1785,
    height: 2523,
    alt: "관세청 2026년 7월 수출입 현황 확정치 보고서 1쪽",
  },
  regions: [
    {
      id: "title",
      label: "문서 제목",
      accessibleName: "문서 제목 선택",
      accent: "orange",
      rect: { x: 0.162, y: 0.157, width: 0.689, height: 0.032 },
      marker: { point: { x: 0.82, y: 0.173 }, number: "1" },
      result: { kind: "text", lines: ["2026년 7월 월간 수출입 현황 [확정치]"] },
    },
    {
      id: "summary",
      label: "텍스트",
      accessibleName: "텍스트 선택",
      accent: "teal",
      rect: { x: 0.104, y: 0.198, width: 0.804, height: 0.081 },
      detectedRects: [
        { x: 0.1, y: 0.3, width: 0.38, height: 0.04 },
        { x: 0.1, y: 0.345, width: 0.8, height: 0.1 },
      ],
      supplementalDetections: [],
      marker: { point: { x: 0.14, y: 0.239 }, number: "2" },
      result: {
        kind: "list",
        lines: [
          "- 수출 990억 달러로 14개월 연속 증가",
          "- 무역수지(304억 달러) 2개월 연속 300억 달러 넘어 18개월 연속 흑자",
          "- 반도체 수출(412억 달러) 2개월 연속 400억 달러 돌파 17개월 연속 증가",
        ],
      },
    },
    {
      id: "table",
      label: "표 (추출 예시)",
      accessibleName: "표 선택",
      accent: "purple",
      rect: { x: 0.16, y: 0.481, width: 0.737, height: 0.145 },
      detectedRects: [{ x: 0.12, y: 0.645, width: 0.78, height: 0.07 }],
      supplementalDetections: [
        "7월 수출(63.0%)은 반도체 호조로 7월 기준 역대 최대실적으로 2개월 연속 900억 달러를 넘어서며, 14개월 연속 증가하였다.",
      ],
      marker: { point: { x: 0.82, y: 0.554 }, number: "3" },
      result: {
        kind: "table",
        columns: ["구분", "2026년 7월", "전년 동월 대비"],
        rows: [
          { label: "수출", cells: ["98,959백만 달러", "63.0% 증가"] },
          { label: "수입", cells: ["68,567백만 달러", "26.5% 증가"] },
        ],
      },
    },
    {
      id: "chart",
      label: "그림",
      accessibleName: "그림 선택",
      accent: "sky",
      rect: { x: 0.157, y: 0.735, width: 0.743, height: 0.189 },
      marker: { point: { x: 0.18, y: 0.83 }, number: "4" },
      result: {
        kind: "figure",
        label: "[그림 1] 월별 수출입 현황 차트",
        caption: "[그림 2] 수출입 추이 차트",
      },
    },
  ],
} as const satisfies DocumentPreprocessorDemo;

export const DOCUMENT_REGION_MARKER_TARGET_SIZE = 44;
export const DOCUMENT_REGION_MARKER_VISUAL_SIZE = 20;

export function getDocumentRegionMarkerBounds(
  region: DocumentRegion,
  preview: { width: number; height: number }
) {
  const halfSize = DOCUMENT_REGION_MARKER_TARGET_SIZE / 2;
  const centerX = region.marker.point.x * preview.width;
  const centerY = region.marker.point.y * preview.height;
  return {
    left: centerX - halfSize,
    top: centerY - halfSize,
    right: centerX + halfSize,
    bottom: centerY + halfSize,
  };
}

export interface DocumentPreprocessorState {
  isOpen: boolean;
  hoveredRegion: DocumentRegionId | null;
  focusedRegion: DocumentRegionId | null;
  pinnedRegion: DocumentRegionId | null;
}

export type DocumentPreprocessorEvent =
  | { type: "toggle" }
  | { type: "hover"; region: DocumentRegionId }
  | { type: "clear-hover" }
  | { type: "focus"; region: DocumentRegionId }
  | { type: "clear-focus" }
  | { type: "toggle-pin"; region: DocumentRegionId }
  | { type: "close" };

export function getDocumentPreprocessorState(): DocumentPreprocessorState {
  return {
    isOpen: false,
    hoveredRegion: null,
    focusedRegion: null,
    pinnedRegion: null,
  };
}

export function getActiveDocumentRegion(
  state: DocumentPreprocessorState
): DocumentRegionId | null {
  return state.focusedRegion ?? state.hoveredRegion ?? state.pinnedRegion;
}

export function reduceDocumentPreprocessorState(
  state: DocumentPreprocessorState,
  event: DocumentPreprocessorEvent
): DocumentPreprocessorState {
  if (event.type === "close") return getDocumentPreprocessorState();
  if (event.type === "toggle") {
    return state.isOpen
      ? getDocumentPreprocessorState()
      : {
          isOpen: true,
          hoveredRegion: null,
          focusedRegion: null,
          pinnedRegion: null,
        };
  }
  if (!state.isOpen) return state;
  if (event.type === "hover") return { ...state, hoveredRegion: event.region };
  if (event.type === "clear-hover") return { ...state, hoveredRegion: null };
  if (event.type === "focus") return { ...state, focusedRegion: event.region };
  if (event.type === "clear-focus") return { ...state, focusedRegion: null };
  return {
    ...state,
    pinnedRegion: state.pinnedRegion === event.region ? null : event.region,
  };
}
