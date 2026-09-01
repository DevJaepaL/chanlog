import { describe, expect, it } from "vitest";
import {
  filterArchivePosts,
  getArchiveTagCounts,
  getInitialArchiveVisibleCount,
  getNextArchiveVisibleCount,
  getArchiveStatusMessage,
  getVisibleArchivePosts,
  normalizePostTags,
  normalizeThumbnail,
  sortPostsByPublishedAt,
  toArchivePost,
} from "@/lib/posts";

describe("archive post helpers", () => {
  it("sorts a copy by newest date and ascending slug for equal dates", () => {
    const posts = [
      { title: "B", summary: "", slug: "zeta", publishedAt: "2024-02-01" },
      { title: "A", summary: "", slug: "beta", publishedAt: "2025-01-01" },
      { title: "C", summary: "", slug: "alpha", publishedAt: "2025-01-01" },
    ];
    const original = [...posts];

    expect(sortPostsByPublishedAt(posts).map((post) => post.slug)).toEqual([
      "alpha",
      "beta",
      "zeta",
    ]);
    expect(posts).toEqual(original);
  });

  it("trims CR/LF whitespace and omits absent or blank thumbnails", () => {
    expect(normalizeThumbnail("\r\n /images/thumb.png \n")).toBe(
      "/images/thumb.png"
    );
    expect(normalizeThumbnail(" \r\n ")).toBeUndefined();
    expect(normalizeThumbnail(undefined)).toBeUndefined();
  });

  it("normalizes post tags by trimming, omitting blanks, and retaining one of each tag", () => {
    expect(
      normalizePostTags([" Python ", "", "Python", "  ", "FastAPI "])
    ).toEqual(["Python", "FastAPI"]);
  });

  it("derives deterministic tag counts from real post tags without double-counting a post", () => {
    const posts = [
      {
        title: "A",
        summary: "",
        slug: "a",
        publishedAt: "2025-01-03",
        tags: [" Python ", "Python", "FastAPI"],
      },
      {
        title: "B",
        summary: "",
        slug: "b",
        publishedAt: "2025-01-02",
        tags: ["FastAPI", "AI 도구"],
      },
      {
        title: "C",
        summary: "",
        slug: "c",
        publishedAt: "2025-01-01",
        tags: ["", "AI 도구"],
      },
    ];

    expect(getArchiveTagCounts(posts)).toEqual([
      { tag: "AI 도구", count: 2 },
      { tag: "FastAPI", count: 2 },
      { tag: "Python", count: 1 },
    ]);
    expect(
      filterArchivePosts(posts, " FastAPI ").map((post) => post.slug)
    ).toEqual(["a", "b"]);
    expect(filterArchivePosts(posts, null)).toEqual(posts);
  });

  it("treats the UI all sentinel as null so a literal 전체 tag remains filterable", () => {
    const posts = [
      {
        title: "All tag",
        summary: "",
        slug: "all",
        publishedAt: "2025-01-02",
        tags: ["전체"],
      },
      {
        title: "Other",
        summary: "",
        slug: "other",
        publishedAt: "2025-01-01",
        tags: ["Python"],
      },
    ];

    expect(filterArchivePosts(posts, null).map((post) => post.slug)).toEqual([
      "all",
      "other",
    ]);
    expect(filterArchivePosts(posts, "전체").map((post) => post.slug)).toEqual([
      "all",
    ]);
  });

  it("projects only serializable archive metadata from a Contentlayer document", () => {
    const archivePost = toArchivePost({
      title: "Lean post",
      publishedAt: "2025-02-01",
      summary: "A summary",
      slug: "lean-post",
      thumbnail: "/lean.png",
      tags: ["TypeScript"],
      _id: "Post__lean-post.mdx",
      _raw: { sourceFilePath: "lean-post.mdx" },
      body: { raw: "# private", code: "compiledBody()" },
    });

    expect(archivePost).toEqual({
      title: "Lean post",
      publishedAt: "2025-02-01",
      summary: "A summary",
      slug: "lean-post",
      thumbnail: "/lean.png",
      tags: ["TypeScript"],
    });
    expect(Object.keys(archivePost).sort()).toEqual([
      "publishedAt",
      "slug",
      "summary",
      "tags",
      "thumbnail",
      "title",
    ]);
  });

  it("omits optional archive metadata that is not present on a Contentlayer document", () => {
    expect(
      toArchivePost({
        title: "No optional metadata",
        publishedAt: "2025-02-01",
        summary: "A summary",
        slug: "no-optionals",
      })
    ).toEqual({
      title: "No optional metadata",
      publishedAt: "2025-02-01",
      summary: "A summary",
      slug: "no-optionals",
      thumbnail: undefined,
      tags: undefined,
    });
  });

  it("includes the currently displayed post count in the live archive status", () => {
    expect(getArchiveStatusMessage(null, 13, 6)).toBe(
      "전체 13개의 글 · 6개 표시"
    );
    expect(getArchiveStatusMessage("Python", 3, 3)).toBe(
      "Python · 3개의 글 · 3개 표시"
    );
  });

  it("shows the archive fixture in 6, then 12, then all 13 posts", () => {
    const posts = Array.from({ length: 13 }, (_, index) => ({
      title: `Post ${index + 1}`,
      summary: "",
      slug: `post-${index + 1}`,
      publishedAt: "2025-01-01",
      tags: [],
    }));

    const firstVisibleCount = getInitialArchiveVisibleCount(posts.length);
    const secondVisibleCount = getNextArchiveVisibleCount(
      firstVisibleCount,
      posts.length
    );
    const finalVisibleCount = getNextArchiveVisibleCount(
      secondVisibleCount,
      posts.length
    );

    expect(getVisibleArchivePosts(posts, firstVisibleCount)).toHaveLength(6);
    expect(getVisibleArchivePosts(posts, secondVisibleCount)).toHaveLength(12);
    expect(getVisibleArchivePosts(posts, finalVisibleCount)).toHaveLength(13);
    expect(getInitialArchiveVisibleCount(8)).toBe(6);
  });
});
