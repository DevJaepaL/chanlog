import { createElement } from "react";
import type { Dispatch } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { DocumentPreprocessorPanel } from "@/components/portfolio/document-preprocessor-panel";
import { DocumentPreprocessorDetail } from "@/components/portfolio/document-preprocessor-section";
import {
  documentPreprocessorDemo,
  getDocumentPreprocessorState,
  getDocumentRegionMarkerBounds,
  reduceDocumentPreprocessorState,
  type DocumentPreprocessorEvent,
} from "@/lib/document-preprocessor";

function getOpenPanelState() {
  return reduceDocumentPreprocessorState(getDocumentPreprocessorState(), {
    type: "toggle",
  });
}

function renderOpenPanel(state = getOpenPanelState()) {
  const dispatch: Dispatch<DocumentPreprocessorEvent> = (event) => {
    reduceDocumentPreprocessorState(state, event);
  };

  return renderToStaticMarkup(
    createElement(DocumentPreprocessorPanel, { state, dispatch })
  );
}

describe("DocumentPreprocessorDetail", () => {
  it("renders the collapsed project-card detail from the shared demo contract", () => {
    const markup = renderToStaticMarkup(
      createElement(DocumentPreprocessorDetail)
    );

    expect(markup).toContain("Document Extractor · Preprocessor");
    expect(markup).toContain(
      "PDF·DOCX·HWP등 처리가 복잡한 공공기관 문서의 제목·본문·표·그림등을 문맥에 맞는 구조 단위로 효율적으로 분리했습니다."
    );
    expect(markup).toContain("구현 예시");
    expect(markup).toContain('aria-expanded="false"');
    expect(markup).toContain('aria-controls="document-preprocessor-panel"');
    expect(markup).not.toContain('id="document-preprocessor-panel"');
    expect(markup).not.toContain("주요 구현 성과");
    expect(markup).not.toContain(">Experience<");
    expect(markup).not.toContain("추출 결과 예시");
    expect(markup).not.toMatch(
      /Elasticsearch|BGE|indexing|정확도|고객사|내부 네트워크/
    );
  });

  it("renders a compact visual marker inside each full-size source control when opened", () => {
    const markup = renderOpenPanel();
    const sourcePreview = markup.slice(
      markup.indexOf("원본 1쪽"),
      markup.indexOf("구조 결과")
    );

    expect(markup.match(/width:44px;height:44px/g)).toHaveLength(4);
    expect(markup.match(/width:20px;height:20px/g)).toHaveLength(4);
    expect(sourcePreview.match(/role="presentation"/g)).toHaveLength(7);
    expect(sourcePreview.match(/tabindex="-1"/g)).toHaveLength(7);
    expect(markup).not.toContain("추출 결과 예시");
  });

  it("keeps active emphasis on the source boundary, outer result card, and small marker", () => {
    const activeSummary = reduceDocumentPreprocessorState(getOpenPanelState(), {
      type: "toggle-pin",
      region: "summary",
    });
    const markup = renderOpenPanel(activeSummary);
    const summaryButtons = [
      ...markup.matchAll(
        /<button[^>]*aria-label="텍스트 선택"[^>]*>[\s\S]*?<\/button>/g
      ),
    ].map(([button]) => button);
    const sourceSummaryButton = summaryButtons[0];
    const resultSummaryButton = summaryButtons[1];
    const resultSummaryButtonOpeningTag =
      resultSummaryButton?.match(/^<button[^>]*>/)?.[0];
    const sourceSummaryRect = markup.match(
      /<div[^>]*style="left:10\.4%;top:19\.8%;width:80\.4%;height:8\.1%"[^>]*>/
    )?.[0];

    expect(resultSummaryButtonOpeningTag).not.toContain(
      "outline outline-2 outline-primary"
    );
    expect(sourceSummaryButton).toMatch(
      /<span[^>]*class="[^"]*outline outline-2 outline-primary[^"]*"[^>]*>2<\/span>/
    );
    expect(sourceSummaryRect).toContain("border-[3px]");
    expect(sourceSummaryRect).not.toContain("outline-offset-2");
    expect(markup).toMatch(
      /<div class="[^"]*rounded-md[^"]*border-2[^"]*border-primary[^"]*"[^>]*><button[^>]*aria-label="텍스트 선택"/
    );
    expect(resultSummaryButtonOpeningTag).toContain("focus-visible:ring-2");
  });

  it("reserves the same result-card border width before and during activation", () => {
    const inactiveMarkup = renderOpenPanel();
    const activeMarkup = renderOpenPanel(
      reduceDocumentPreprocessorState(getOpenPanelState(), {
        type: "toggle-pin",
        region: "summary",
      })
    );
    const inactiveSummaryCard = inactiveMarkup.match(
      /<div class="([^"]*)"><button[^>]*aria-label="텍스트 선택"/
    )?.[1];
    const activeSummaryCard = activeMarkup.match(
      /<div class="([^"]*)"><button[^>]*aria-label="텍스트 선택"/
    )?.[1];

    expect(inactiveSummaryCard).toContain("border-2 border-hairline");
    expect(activeSummaryCard).toContain("border-2 border-primary");
  });

  it("shows supplemental detections in the expanded structure results", () => {
    const markup = renderOpenPanel();
    const sourcePreview = markup.slice(
      markup.indexOf("원본 1쪽"),
      markup.indexOf("구조 결과")
    );

    for (const label of ["문서 제목", "텍스트", "표", "그림"]) {
      expect(sourcePreview).not.toContain(`>${label}</span>`);
    }
    expect(markup).not.toContain("추가 감지 문장");
    expect(markup).not.toContain("1. 2026년 7월 수출입 현황");
    expect(markup).toMatch(
      /<p[^>]*class="[^"]*break-keep[^"]*"[^>]*>7월 수출\(63\.0%\)은 반도체 호조로 7월 기준 역대 최대실적으로 2개월 연속 900억 달러를 넘어서며, 14개월 연속 증가하였다\.<\/p>/
    );
    expect(markup).toContain('class="mb-2 text-body-sm text-ink">구조 결과');
    expect(markup).toMatch(
      /<button[^>]*class="[^"]*min-h-11[^"]*text-body-sm font-medium[^"]*"[^>]*>[\s\S]*?<span>문서 제목<\/span>/
    );
  });

  it("keeps every 44px source control inside the preview without overlap", () => {
    for (const viewport of [
      { width: 190, height: 269 },
      { width: 450, height: 636 },
    ]) {
      const bounds = documentPreprocessorDemo.regions.map((region) =>
        getDocumentRegionMarkerBounds(region, viewport)
      );

      for (const bound of bounds) {
        expect(bound.right - bound.left).toBeCloseTo(44);
        expect(bound.bottom - bound.top).toBeCloseTo(44);
        expect(bound.left).toBeGreaterThanOrEqual(0);
        expect(bound.top).toBeGreaterThanOrEqual(0);
        expect(bound.right).toBeLessThanOrEqual(viewport.width);
        expect(bound.bottom).toBeLessThanOrEqual(viewport.height);
      }
      for (let first = 0; first < bounds.length; first += 1) {
        for (let second = first + 1; second < bounds.length; second += 1) {
          const a = bounds[first];
          const b = bounds[second];
          const overlaps =
            a.left < b.right &&
            a.right > b.left &&
            a.top < b.bottom &&
            a.bottom > b.top;
          expect(overlaps).toBe(false);
        }
      }
    }
  });
});
