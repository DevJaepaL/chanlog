import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  documentPreprocessorDemo,
  getDocumentPreprocessorState,
  reduceDocumentPreprocessorState,
  type DocumentRegionId,
} from "@/lib/document-preprocessor";

const REGION_IDS: DocumentRegionId[] = ["title", "summary", "table", "chart"];

function resultStrings() {
  return documentPreprocessorDemo.regions.flatMap((region) => {
    if (region.result.kind === "table") {
      return [
        ...region.result.columns,
        ...region.result.rows.flatMap((row) => [row.label, ...row.cells]),
      ];
    }
    if (region.result.kind === "figure") {
      return [region.result.label, region.result.caption];
    }
    return [...region.result.lines];
  });
}

describe("documentPreprocessorDemo", () => {
  it("owns the exact public copy and four unique region contracts", () => {
    expect(documentPreprocessorDemo.title).toBe("문서 전처리기 구현");
    expect(documentPreprocessorDemo.description).toBe(
      "PDF·DOCX·HWP의 제목·본문·표·차트를 구조 단위로 분리했습니다."
    );
    expect(documentPreprocessorDemo.actions).toEqual({
      collapsed: "구현 보기",
      expanded: "접기",
    });
    expect(documentPreprocessorDemo.source).toBe(
      "출처: 관세청 「2026년 7월 수출입 현황 [확정치]」, 2026. 8. 18., 1쪽"
    );

    const ids = documentPreprocessorDemo.regions.map((region) => region.id);
    const labels = documentPreprocessorDemo.regions.map((region) => region.label);
    expect(ids).toEqual(REGION_IDS);
    expect(new Set(ids).size).toBe(4);
    expect(new Set(labels).size).toBe(4);
    expect(documentPreprocessorDemo.regions.map((region) => region.accessibleName)).toEqual([
      "문서 제목 선택",
      "요약 선택",
      "표 선택",
      "차트 선택",
    ]);

    for (const region of documentPreprocessorDemo.regions) {
      for (const value of Object.values(region.rect)) {
        expect(value).toBeGreaterThan(0);
        expect(value).toBeLessThanOrEqual(1);
      }
      expect(region.rect.x + region.rect.width).toBeLessThanOrEqual(1);
      expect(region.rect.y + region.rect.height).toBeLessThanOrEqual(1);
    }

    const content = resultStrings();
    expect(content.every((value) => value.trim().length > 0)).toBe(true);
    expect(new Set(content).size).toBe(content.length);
    expect(content).not.toContain("문서 제목");
    expect(JSON.stringify(documentPreprocessorDemo)).not.toMatch(
      /Chroma|Elasticsearch|BGE|indexing|정확도|고객사|내부 네트워크/
    );
  });

  it("contains the exact semantic results", () => {
    expect(documentPreprocessorDemo.regions.map((region) => region.result)).toEqual([
      { kind: "text", lines: ["2026년 7월 수출입 현황 [확정치]"] },
      {
        kind: "list",
        lines: [
          "수출 990억 달러, 전년 동월 대비 63.0% 증가",
          "무역수지 304억 달러 흑자",
          "수출 14개월 연속 증가",
        ],
      },
      {
        kind: "table",
        columns: ["구분", "2026년 7월", "전년 동월 대비"],
        rows: [
          { label: "수출", cells: ["98,959백만 달러", "63.0% 증가"] },
          { label: "수입", cells: ["68,567백만 달러", "26.5% 증가"] },
        ],
      },
      { kind: "figure", label: "월별 수출입 현황", caption: "수출입 추이" },
    ]);
  });

  it("references the single deterministic full-page WebP derivative", () => {
    expect(documentPreprocessorDemo.image).toEqual({
      src: "/images/document-preprocessor/customs-2026-07-page-1.webp",
      width: 1785,
      height: 2523,
      alt: "관세청 2026년 7월 수출입 현황 확정치 보고서 1쪽",
    });
    const bytes = readFileSync(
      resolve("public/images/document-preprocessor/customs-2026-07-page-1.webp")
    );
    expect(bytes.subarray(0, 4).toString("ascii")).toBe("RIFF");
    expect(bytes.subarray(8, 12).toString("ascii")).toBe("WEBP");
    expect(createHash("sha256").update(bytes).digest("hex").toUpperCase()).toBe(
      "7B4B5F0B5A1250A166147899FA834B19A89DE03453350F05DD6CA0FD1AEAF38E"
    );
  });
});

describe("document preprocessor state", () => {
  it("starts closed and opens/closes in a neutral reset state", () => {
    const closed = getDocumentPreprocessorState();
    expect(closed).toEqual({ isOpen: false, previewRegion: null, pinnedRegion: null });
    const open = reduceDocumentPreprocessorState(closed, { type: "toggle" });
    expect(open).toEqual({ isOpen: true, previewRegion: null, pinnedRegion: null });
    expect(reduceDocumentPreprocessorState(open, { type: "toggle" })).toEqual(closed);
  });

  it("previews, clears preview, pins, replaces, unpins, and closes exactly", () => {
    let state = reduceDocumentPreprocessorState(getDocumentPreprocessorState(), {
      type: "toggle",
    });
    state = reduceDocumentPreprocessorState(state, { type: "preview", region: "title" });
    expect(state.previewRegion).toBe("title");
    state = reduceDocumentPreprocessorState(state, { type: "toggle-pin", region: "title" });
    expect(state.pinnedRegion).toBe("title");
    state = reduceDocumentPreprocessorState(state, { type: "preview", region: "table" });
    expect(state.previewRegion ?? state.pinnedRegion).toBe("table");
    state = reduceDocumentPreprocessorState(state, { type: "clear-preview" });
    expect(state).toEqual({ isOpen: true, previewRegion: null, pinnedRegion: "title" });
    state = reduceDocumentPreprocessorState(state, { type: "toggle-pin", region: "chart" });
    expect(state.pinnedRegion).toBe("chart");
    state = reduceDocumentPreprocessorState(state, { type: "toggle-pin", region: "chart" });
    expect(state.pinnedRegion).toBeNull();
    expect(reduceDocumentPreprocessorState(state, { type: "close" })).toEqual(
      getDocumentPreprocessorState()
    );
  });

  it("ignores source/result events while closed", () => {
    const closed = getDocumentPreprocessorState();
    for (const event of [
      { type: "preview", region: "summary" },
      { type: "toggle-pin", region: "summary" },
      { type: "clear-preview" },
    ] as const) {
      expect(reduceDocumentPreprocessorState(closed, event)).toEqual(closed);
    }
  });
});
