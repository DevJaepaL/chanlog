import type { Metadata } from "next";
import { allPosts } from "contentlayer/generated";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Diary",
  description: "생각을 정리하고 작성하는 공간",
};

function PostPage() {
  return (
    <section>
      <h1 className="mb-6 text-3xl font-bold">Diary</h1>

      {allPosts
        .sort((a, b) => {
          if (new Date(a.publishedAt) > new Date(b.publishedAt)) return -1;

          return 1;
        })
        .map((post) => (
          <article key={post.slug} className="mb-6">
            <Link href={`/diary/${post.slug}`}>
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
