import { allPosts } from "contentlayer/generated";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = allPosts.map((post) => ({
    url: `https://localhost/post/${post.slug}`,
    lastModified: post.publishedAt,
  }));

  const routes = ["", "/info", "/post"].map((route) => ({
    url: `https://localhost${route}`,
    lastModified: new Date().toISOString().split("T")[0],
  }));

  return [...routes, ...posts];
}
