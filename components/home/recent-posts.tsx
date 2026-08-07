import Link from "next/link";
import { allPosts } from "contentlayer/generated";
import { Section } from "@/components/ui/section";

export function RecentPosts() {
  const posts = [...allPosts]
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    .slice(0, 3);

  return (
    <Section id="writing" eyebrow="Writing" title="최근 글">
      <div className="flex flex-col gap-4">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/posts/${post.slug}`}
            className="group flex flex-col gap-1 rounded-lg border border-hairline bg-surface p-5 transition-shadow hover:shadow-soft"
          >
            <p className="text-caption text-ink-faint">{post.publishedAt}</p>
            <h3 className="break-keep text-title text-ink group-hover:text-primary">
              {post.title}
            </h3>
            <p className="break-keep text-body-sm text-ink-muted">
              {post.summary}
            </p>
          </Link>
        ))}
      </div>
      <Link
        href="/posts"
        className="mt-6 inline-block text-body-sm text-primary hover:underline"
      >
        전체 보기 →
      </Link>
    </Section>
  );
}
