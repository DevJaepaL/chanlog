import { describe, expect, it } from "vitest";
import { normalizeThumbnail, sortPostsByPublishedAt } from "@/lib/posts";

describe("archive post helpers", () => {
  it("sorts a copy by newest date and ascending slug for equal dates", () => {
    const posts = [
      { title: "B", summary: "", slug: "zeta", publishedAt: "2024-02-01" },
      { title: "A", summary: "", slug: "beta", publishedAt: "2025-01-01" },
      { title: "C", summary: "", slug: "alpha", publishedAt: "2025-01-01" },
    ];
    const original = [...posts];

    expect(sortPostsByPublishedAt(posts).map((post) => post.slug)).toEqual([
      "alpha", "beta", "zeta",
    ]);
    expect(posts).toEqual(original);
  });

  it("trims CR/LF whitespace and omits absent or blank thumbnails", () => {
    expect(normalizeThumbnail("\r\n /images/thumb.png \n")).toBe("/images/thumb.png");
    expect(normalizeThumbnail(" \r\n ")).toBeUndefined();
    expect(normalizeThumbnail(undefined)).toBeUndefined();
  });
});
