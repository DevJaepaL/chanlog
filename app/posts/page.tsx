import type { Metadata } from "next";
import Link from "next/link";
import { allPosts } from "contentlayer/generated";

export const metadata: Metadata = {
  title: "Archive",
  description: "기록",
};

function PostPage() {
  const posts = [...allPosts].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-16">
      <p className="mb-2 text-eyebrow uppercase text-ink-faint">Archive</p>
      <h1 className="mb-8 text-heading-2 text-ink sm:text-heading-1">
        아카이브
      </h1>
      <div className="flex flex-col gap-4">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/posts/${post.slug}`}
            className="group flex flex-col gap-1 rounded-lg border border-hairline bg-surface p-5 transition-shadow hover:shadow-soft"
          >
            <p className="text-caption text-ink-faint">{post.publishedAt}</p>
            <h2 className="break-keep text-title text-ink group-hover:text-primary">
              {post.title}
            </h2>
            <p className="break-keep text-body-sm text-ink-muted">
              {post.summary}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
export default PostPage;
