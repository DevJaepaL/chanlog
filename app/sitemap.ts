import { allPosts } from "contentlayer/generated";
import type { MetadataRoute } from "next";

const SITE_URL = "https://chanlog.blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = allPosts.map((post) => ({
    url: `${SITE_URL}/posts/${post.slug}`,
    lastModified: post.publishedAt,
  }));

  const routes = ["", "/portfolio", "/pipeline"].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date().toISOString().split("T")[0],
  }));

  return [...routes, ...posts];
}
