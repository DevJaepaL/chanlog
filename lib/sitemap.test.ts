import { describe, expect, it } from "vitest";
import { createSitemapEntries } from "@/lib/sitemap";

describe("sitemap entries", () => {
  it("contains canonical archive, portfolio, and post URLs only", () => {
    const entries = createSitemapEntries(
      [{ slug: "my-first-post", publishedAt: "2023-12-06" }],
      "2026-08-21"
    );
    expect(entries).toEqual([
      { url: "https://chanlog.blog", lastModified: "2026-08-21" },
      { url: "https://chanlog.blog/portfolio", lastModified: "2026-08-21" },
      {
        url: "https://chanlog.blog/posts/my-first-post",
        lastModified: "2023-12-06",
      },
    ]);
    expect(entries.map((entry) => entry.url).join("\n")).not.toMatch(
      /\/pipeline|\/posts$|#document-preprocessor/
    );
  });
});
