import { allPosts } from "contentlayer/generated";
import { PostArchive } from "@/components/archive/post-archive";
import { createLandingMetadata } from "@/lib/metadata";

export const metadata = createLandingMetadata({
  title: "아카이브",
  description: "백엔드·AI·데이터 파이프라인에 관한 이재찬의 기술 아카이브.",
  url: "https://chanlog.blog/",
});

export default function Home() {
  return <PostArchive posts={allPosts} />;
}
