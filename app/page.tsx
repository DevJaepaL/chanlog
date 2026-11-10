import { allPosts } from "contentlayer/generated";
import { PostArchive } from "@/components/archive/post-archive";
import { ProfileCard } from "@/components/home/profile-card";
import { createLandingMetadata } from "@/lib/metadata";
import { toArchivePost } from "@/lib/posts";

export const metadata = createLandingMetadata({
  title: "아카이브",
  description: "이재찬의 기술 블로그",
  url: "https://www.chanlog.blog/",
});

export default function Home() {
  return (
    <>
      <ProfileCard />
      <PostArchive posts={allPosts.map(toArchivePost)} />
    </>
  );
}
