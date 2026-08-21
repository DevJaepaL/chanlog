import type { MetadataRoute } from "next";

const SITE_URL = "https://chanlog.blog";

export interface SitemapPost {
  slug: string;
  publishedAt: string;
}

export function createSitemapEntries(
  posts: readonly SitemapPost[],
  generatedOn: string
): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, lastModified: generatedOn },
    { url: `${SITE_URL}/portfolio`, lastModified: generatedOn },
    ...posts.map((post) => ({
      url: `${SITE_URL}/posts/${post.slug}`,
      lastModified: post.publishedAt,
    })),
  ];
}
