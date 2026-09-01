import { allPosts } from "contentlayer/generated";
import { createSitemapEntries } from "@/lib/sitemap";

export default function sitemap() {
  return createSitemapEntries(allPosts, new Date().toISOString().split("T")[0]);
}
