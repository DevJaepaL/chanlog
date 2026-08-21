import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { DocumentPreprocessorSection } from "@/components/portfolio/document-preprocessor-section";
import {
  documentPreprocessorDemo,
  getDocumentRegionMarkerBounds,
} from "@/lib/document-preprocessor";

describe("DocumentPreprocessorSection", () => {
  it("renders the collapsed portfolio section from the shared demo contract", () => {
    const markup = renderToStaticMarkup(
      createElement(DocumentPreprocessorSection)
    );

    expect(markup).toContain('id="document-preprocessor"');
    expect(markup).toContain("문서 전처리기 구현");
    expect(markup).toContain(
      "PDF·DOCX·HWP의 제목·본문·표·차트를 구조 단위로 분리했습니다."
    );
    expect(markup).toContain("구현 보기");
    expect(markup).toContain('aria-expanded="false"');
    expect(markup).toContain('aria-controls="document-preprocessor-panel"');
    expect(markup).not.toContain('id="document-preprocessor-panel"');
    expect(markup).not.toMatch(
      /Chroma|Elasticsearch|BGE|indexing|정확도|고객사|내부 네트워크/
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
