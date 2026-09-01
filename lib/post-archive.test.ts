import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PostArchive } from "@/components/archive/post-archive";

describe("PostArchive", () => {
  it("renders only the first six cards, shows more, and prioritizes the first two thumbnails", () => {
    const posts = Array.from({ length: 13 }, (_, index) => ({
      title: `Post ${index + 1}`,
      summary: `Summary ${index + 1}`,
      slug: `post-${index + 1}`,
      publishedAt: `2025-01-${String(13 - index).padStart(2, "0")}`,
      thumbnail: `/thumbnails/${index + 1}.png`,
      tags: [],
    }));

    const markup = renderToStaticMarkup(createElement(PostArchive, { posts }));

    expect(markup).toContain("Post 1");
    expect(markup).toContain("Post 6");
    expect(markup).not.toContain("Post 7");
    expect(markup).toContain(">더 보기<");
    expect(markup).toContain("전체 13개의 글 · 6개 표시");
    expect(markup.match(/fetchpriority=\"high\"/g) ?? []).toHaveLength(2);
  });
});
