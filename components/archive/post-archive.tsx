import Image from "next/image";
import Link from "next/link";
import {
  normalizeThumbnail,
  sortPostsByPublishedAt,
  type ArchivePost,
} from "@/lib/posts";

export function PostArchive({ posts }: { posts: readonly ArchivePost[] }) {
  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-16">
      <p className="mb-2 text-eyebrow uppercase text-ink-muted">Archive</p>
      <h1 className="mb-8 text-heading-2 text-ink sm:text-heading-1">
        아카이브
      </h1>
      <div className="flex flex-col gap-4">
        {sortPostsByPublishedAt(posts).map((post) => {
          const thumbnail = normalizeThumbnail(post.thumbnail);

          return (
            <Link
              key={post.slug}
              href={"/posts/" + post.slug}
              className="group flex flex-col overflow-hidden rounded-lg border border-hairline bg-surface transition-shadow hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:flex-row"
            >
              {thumbnail ? (
                <Image
                  src={thumbnail}
                  alt=""
                  width={320}
                  height={180}
                  sizes="(min-width: 640px) 16rem, 100vw"
                  className="aspect-video w-full object-cover sm:w-64 sm:shrink-0"
                />
              ) : null}
              <div className="flex flex-col gap-1 p-5">
                <p className="text-caption text-ink-muted">
                  {post.publishedAt}
                </p>
                <h2 className="break-keep text-title text-ink group-hover:text-primary">
                  {post.title}
                </h2>
                <p className="break-keep text-body-sm text-ink-muted">
                  {post.summary}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
