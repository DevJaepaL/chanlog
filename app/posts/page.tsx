import type { Metadata } from "next";
import { allPosts } from "contentlayer/generated";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Post",
  description: "공부 공간",
};

function PostPage() {
  return (
    <section>
      <h1 className="mb-6 text-2xl font-bold">지식을 <br /> 쌓아둡니다.</h1>
      <div className="w-[30%] my-[5%] border-[3px] border-black/40"></div>
      {allPosts
        /* 게시글 날짜 내림차순으로 정렬 */
        .sort((a, b) => {
          if (new Date(a.publishedAt) > new Date(b.publishedAt)) return -1;
          return 1;
        })
        .map((post) => (
          <article key={post.slug} className="mb-6">
            <Link href={`/posts/${post.slug}`}>
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <h6 className="my-1 text-sm font-normal text-gray-400">
                {post.summary}
              </h6>
              <p>
                <small className="mr-2">{post.publishedAt}</small>
              </p>
            </Link>
          </article>
        ))}
    </section>
  );
}
export default PostPage;
