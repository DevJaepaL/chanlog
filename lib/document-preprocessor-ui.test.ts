import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { DocumentPreprocessorSection } from "@/components/portfolio/document-preprocessor-section";

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
});
