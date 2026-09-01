import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  documentPreprocessorDemo,
  getActiveDocumentRegion,
  getDocumentPreprocessorState,
  getDocumentRegionMarkerBounds,
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
    expect(documentPreprocessorDemo.title).toBe(
      "Document Extractor · Preprocessor"
    );
    expect(documentPreprocessorDemo.description).toBe(
      "PDF·DOCX·HWP등 처리가 복잡한 공공기관 문서의 제목·본문·표·그림등을 문맥에 맞는 구조 단위로 효율적으로 분리했습니다."
    );
    expect(documentPreprocessorDemo.actions).toEqual({
      collapsed: "구현 예시",
      expanded: "접기",
    });
    expect(documentPreprocessorDemo.source).toBe(
      "출처: 관세청 「2026년 7월 월간 수출입 현황 [확정치]」, 2026. 8. 18., 1쪽"
    );

    const ids = documentPreprocessorDemo.regions.map((region) => region.id);
    const labels = documentPreprocessorDemo.regions.map(
      (region) => region.label
    );
    expect(ids).toEqual(REGION_IDS);
    expect(new Set(ids).size).toBe(4);
    expect(new Set(labels).size).toBe(4);
    expect(
      documentPreprocessorDemo.regions.map((region) => region.accessibleName)
    ).toEqual(["문서 제목 선택", "텍스트 선택", "표 선택", "그림 선택"]);

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
    expect(
      documentPreprocessorDemo.regions.map((region) => region.result)
    ).toEqual([
      { kind: "text", lines: ["2026년 7월 월간 수출입 현황 [확정치]"] },
      {
        kind: "list",
        lines: [
          "- 수출 990억 달러로 14개월 연속 증가",
          "- 무역수지(304억 달러) 2개월 연속 300억 달러 넘어 18개월 연속 흑자",
          "- 반도체 수출(412억 달러) 2개월 연속 400억 달러 돌파 17개월 연속 증가",
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
      {
        kind: "figure",
        label: "[그림 1] 월별 수출입 현황 차트",
        caption: "[그림 2] 수출입 추이 차트",
      },
    ]);
  });

  it("keeps supplemental detections attached to their parent source regions", () => {
    const summary = documentPreprocessorDemo.regions[1];
    const table = documentPreprocessorDemo.regions[2];

    expect(
      "detectedRects" in summary ? summary.detectedRects : []
    ).toHaveLength(2);
    expect(
      "supplementalDetections" in summary ? summary.supplementalDetections : []
    ).toEqual([]);
    expect("detectedRects" in table ? table.detectedRects : []).toHaveLength(1);
    expect(
      "supplementalDetections" in table ? table.supplementalDetections : []
    ).toEqual([
      "7월 수출(63.0%)은 반도체 호조로 7월 기준 역대 최대실적으로 2개월 연속 900억 달러를 넘어서며, 14개월 연속 증가하였다.",
    ]);

    for (const rect of [
      ...("detectedRects" in summary ? summary.detectedRects ?? [] : []),
      ...("detectedRects" in table ? table.detectedRects ?? [] : []),
    ]) {
      for (const value of Object.values(rect)) {
        expect(value).toBeGreaterThan(0);
        expect(value).toBeLessThanOrEqual(1);
      }
      expect(rect.x + rect.width).toBeLessThanOrEqual(1);
      expect(rect.y + rect.height).toBeLessThanOrEqual(1);
    }

    const summaryRects =
      "detectedRects" in summary ? summary.detectedRects : [];
    const tableRects = "detectedRects" in table ? table.detectedRects : [];
    expect(summaryRects?.[0]?.height).toBeGreaterThanOrEqual(0.04);
    expect(summaryRects?.[1]?.height).toBeGreaterThanOrEqual(0.09);
    expect(tableRects?.[0]?.height).toBeGreaterThanOrEqual(0.065);
  });

  it("keeps numbered marker centers inside their regions and 44px targets apart", () => {
    expect(
      documentPreprocessorDemo.regions.map((region) => region.marker.number)
    ).toEqual(["1", "2", "3", "4"]);

    for (const region of documentPreprocessorDemo.regions) {
      expect(region.marker.point.x).toBeGreaterThanOrEqual(region.rect.x);
      expect(region.marker.point.x).toBeLessThanOrEqual(
        region.rect.x + region.rect.width
      );
      expect(region.marker.point.y).toBeGreaterThanOrEqual(region.rect.y);
      expect(region.marker.point.y).toBeLessThanOrEqual(
        region.rect.y + region.rect.height
      );
    }

    for (const preview of [
      { width: 190, height: 269 },
      { width: 450, height: 636 },
    ]) {
      const bounds = documentPreprocessorDemo.regions.map((region) =>
        getDocumentRegionMarkerBounds(region, preview)
      );
      for (const bound of bounds) {
        expect(bound.left).toBeGreaterThanOrEqual(0);
        expect(bound.top).toBeGreaterThanOrEqual(0);
        expect(bound.right).toBeLessThanOrEqual(preview.width);
        expect(bound.bottom).toBeLessThanOrEqual(preview.height);
      }
      for (let first = 0; first < bounds.length; first += 1) {
        for (let second = first + 1; second < bounds.length; second += 1) {
          const a = bounds[first];
          const b = bounds[second];
          expect(
            a.left < b.right &&
              a.right > b.left &&
              a.top < b.bottom &&
              a.bottom > b.top
          ).toBe(false);
        }
      }
    }
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
    expect(closed).toEqual({
      isOpen: false,
      hoveredRegion: null,
      focusedRegion: null,
      pinnedRegion: null,
    });
    const open = reduceDocumentPreprocessorState(closed, { type: "toggle" });
    expect(open).toEqual({
      isOpen: true,
      hoveredRegion: null,
      focusedRegion: null,
      pinnedRegion: null,
    });
    expect(reduceDocumentPreprocessorState(open, { type: "toggle" })).toEqual(
      closed
    );
  });

  it("keeps hover and focus previews independent with focus precedence", () => {
    let state = reduceDocumentPreprocessorState(
      getDocumentPreprocessorState(),
      {
        type: "toggle",
      }
    );
    state = reduceDocumentPreprocessorState(state, {
      type: "toggle-pin",
      region: "title",
    });
    state = reduceDocumentPreprocessorState(state, {
      type: "hover",
      region: "summary",
    });
    state = reduceDocumentPreprocessorState(state, {
      type: "focus",
      region: "table",
    });
    expect(getActiveDocumentRegion(state)).toBe("table");

    const hoverLeavesFirst = reduceDocumentPreprocessorState(state, {
      type: "clear-hover",
    });
    expect(getActiveDocumentRegion(hoverLeavesFirst)).toBe("table");
    expect(
      getActiveDocumentRegion(
        reduceDocumentPreprocessorState(hoverLeavesFirst, {
          type: "clear-focus",
        })
      )
    ).toBe("title");

    const focusBlursFirst = reduceDocumentPreprocessorState(state, {
      type: "clear-focus",
    });
    expect(getActiveDocumentRegion(focusBlursFirst)).toBe("summary");
    expect(
      getActiveDocumentRegion(
        reduceDocumentPreprocessorState(focusBlursFirst, {
          type: "clear-hover",
        })
      )
    ).toBe("title");
  });

  it("hovers, focuses, pins, replaces, unpins, and closes exactly", () => {
    let state = reduceDocumentPreprocessorState(
      getDocumentPreprocessorState(),
      {
        type: "toggle",
      }
    );
    state = reduceDocumentPreprocessorState(state, {
      type: "hover",
      region: "title",
    });
    expect(state.hoveredRegion).toBe("title");
    state = reduceDocumentPreprocessorState(state, {
      type: "toggle-pin",
      region: "title",
    });
    expect(state.pinnedRegion).toBe("title");
    state = reduceDocumentPreprocessorState(state, {
      type: "focus",
      region: "table",
    });
    expect(getActiveDocumentRegion(state)).toBe("table");
    state = reduceDocumentPreprocessorState(state, { type: "clear-focus" });
    expect(getActiveDocumentRegion(state)).toBe("title");
    state = reduceDocumentPreprocessorState(state, { type: "clear-hover" });
    expect(state).toEqual({
      isOpen: true,
      hoveredRegion: null,
      focusedRegion: null,
      pinnedRegion: "title",
    });
    state = reduceDocumentPreprocessorState(state, {
      type: "toggle-pin",
      region: "chart",
    });
    expect(state.pinnedRegion).toBe("chart");
    state = reduceDocumentPreprocessorState(state, {
      type: "toggle-pin",
      region: "chart",
    });
    expect(state.pinnedRegion).toBeNull();
    expect(reduceDocumentPreprocessorState(state, { type: "close" })).toEqual(
      getDocumentPreprocessorState()
    );
  });

  it("ignores source/result events while closed", () => {
    const closed = getDocumentPreprocessorState();
    for (const event of [
      { type: "hover", region: "summary" },
      { type: "focus", region: "summary" },
      { type: "toggle-pin", region: "summary" },
      { type: "clear-hover" },
      { type: "clear-focus" },
    ] as const) {
      expect(reduceDocumentPreprocessorState(closed, event)).toEqual(closed);
    }
  });
});
