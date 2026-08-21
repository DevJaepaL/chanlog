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
  label: "문서 제목" | "요약" | "표" | "차트";
  accessibleName: "문서 제목 선택" | "요약 선택" | "표 선택" | "차트 선택";
  accent: DocumentRegionAccent;
  rect: NormalizedRect;
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
  actions: { collapsed: string; expanded: string };
  source: string;
  image: { src: string; width: 1785; height: 2523; alt: string };
  regions: readonly DocumentRegion[];
}

export const documentPreprocessorDemo = {
  sectionId: "document-preprocessor",
  panelId: "document-preprocessor-panel",
  title: "문서 전처리기 구현",
  description: "PDF·DOCX·HWP의 제목·본문·표·차트를 구조 단위로 분리했습니다.",
  actions: { collapsed: "구현 보기", expanded: "접기" },
  source: "출처: 관세청 「2026년 7월 수출입 현황 [확정치]」, 2026. 8. 18., 1쪽",
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
      result: { kind: "text", lines: ["2026년 7월 수출입 현황 [확정치]"] },
    },
    {
      id: "summary",
      label: "요약",
      accessibleName: "요약 선택",
      accent: "teal",
      rect: { x: 0.104, y: 0.198, width: 0.804, height: 0.081 },
      marker: { point: { x: 0.14, y: 0.239 }, number: "2" },
      result: {
        kind: "list",
        lines: [
          "수출 990억 달러, 전년 동월 대비 63.0% 증가",
          "무역수지 304억 달러 흑자",
          "수출 14개월 연속 증가",
        ],
      },
    },
    {
      id: "table",
      label: "표",
      accessibleName: "표 선택",
      accent: "purple",
      rect: { x: 0.16, y: 0.481, width: 0.737, height: 0.145 },
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
      label: "차트",
      accessibleName: "차트 선택",
      accent: "sky",
      rect: { x: 0.157, y: 0.735, width: 0.743, height: 0.189 },
      marker: { point: { x: 0.18, y: 0.83 }, number: "4" },
      result: {
        kind: "figure",
        label: "월별 수출입 현황",
        caption: "수출입 추이",
      },
    },
  ],
} as const satisfies DocumentPreprocessorDemo;

const DOCUMENT_REGION_MARKER_SIZE = 44;

export function getDocumentRegionMarkerBounds(
  region: DocumentRegion,
  preview: { width: number; height: number }
) {
  const halfSize = DOCUMENT_REGION_MARKER_SIZE / 2;
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
