import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PostArchive } from "@/components/archive/post-archive";

describe("PostArchive", () => {
  it("renders the first six entries with thumbnails, original content, filters, and more control", () => {
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
    expect(markup).toContain("Summary 1");
    expect(markup).toContain('/posts/post-1');
    // 최신 글 1개 + 목록 6개
    expect(markup.match(/<img/g) ?? []).toHaveLength(7);
    expect(markup.match(/fetchpriority="high"/g) ?? []).toHaveLength(1);
    expect(markup).toContain('aria-pressed="true"');
    expect(markup).toContain('aria-live="polite"');
  });

  it("collapses less-used tags behind a +N toggle", () => {
    const posts = Array.from({ length: 8 }, (_, index) => ({
      title: `Post ${index + 1}`,
      summary: "",
      slug: `post-${index + 1}`,
      publishedAt: `2025-01-${String(10 - index).padStart(2, "0")}`,
      tags: [`Tag ${index + 1}`, "Common"],
    }));

    const markup = renderToStaticMarkup(createElement(PostArchive, { posts }));
    const filterGroup = markup.match(/<div[^>]*aria-label="글 태그 필터"[\s\S]*?<\/div>/)![0];

    expect(filterGroup.match(/aria-pressed=/g)).toHaveLength(6);
    expect(filterGroup).toContain("Common");
    expect(filterGroup).toMatch(/<button[^>]*aria-expanded="false"[^>]*>\+4<\/button>/);
  });
});
