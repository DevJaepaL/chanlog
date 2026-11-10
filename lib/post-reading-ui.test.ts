import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PostToc } from "@/components/post-toc";
import { extractToc } from "@/lib/toc";

describe("responsive reading navigation", () => {
  it("offers a collapsed mobile contents list and a desktop list with identical anchors", () => {
    const items = extractToc("## 설치\n### 요구사항\n## 설치");
    const markup = renderToStaticMarkup(createElement(PostToc, { items }));
    expect(markup).toMatch(/<details[^>]*class="[^"]*xl:hidden/);
    expect(markup).toMatch(/<summary[^>]*>목차<\/summary>/);
    // The contents list starts expanded on every post; readers can still fold it.
    expect(markup).toMatch(/<details[^>]* open=""/);
    expect(markup).toContain("xl:sticky");
    expect(markup).not.toContain("fixed");
    for (const item of items) {
      expect(markup.split(`href="#${item.id}"`)).toHaveLength(3);
    }
    expect(markup).toContain("focus-visible:ring-2");
  });

  it("omits both navigation variants for a post without headings", () => {
    expect(renderToStaticMarkup(createElement(PostToc, { items: [] }))).toBe("");
  });
});
