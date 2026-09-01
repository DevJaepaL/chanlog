"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ARCHIVE_ALL_TAG,
  filterArchivePosts,
  getArchiveTagCounts,
  getInitialArchiveVisibleCount,
  getNextArchiveVisibleCount,
  getArchiveStatusMessage,
  getVisibleArchivePosts,
  normalizePostTags,
  normalizeThumbnail,
  sortPostsByPublishedAt,
  type ArchivePost,
} from "@/lib/posts";

export function PostArchive({ posts }: { posts: readonly ArchivePost[] }) {
  const sortedPosts = useMemo(() => sortPostsByPublishedAt(posts), [posts]);
  const tagCounts = useMemo(
    () => getArchiveTagCounts(sortedPosts),
    [sortedPosts]
  );
  const [selectedTag, setSelectedTag] = useState<string | null>(
    ARCHIVE_ALL_TAG
  );
  const filteredPosts = useMemo(
    () => filterArchivePosts(sortedPosts, selectedTag),
    [selectedTag, sortedPosts]
  );
  const [visibleCount, setVisibleCount] = useState(() =>
    getInitialArchiveVisibleCount(sortedPosts.length)
  );
  const visiblePosts = getVisibleArchivePosts(filteredPosts, visibleCount);
  const hasMorePosts = visiblePosts.length < filteredPosts.length;

  function selectTag(tag: string | null) {
    setSelectedTag(tag);
    setVisibleCount(
      getInitialArchiveVisibleCount(filterArchivePosts(sortedPosts, tag).length)
    );
  }

  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-16">
      <p className="mb-2 text-eyebrow uppercase text-ink-muted">Archive</p>
      <h1 className="text-heading-2 text-ink sm:text-heading-1">아카이브</h1>

      <div className="mt-6 border-y border-hairline py-3">
        <div
          aria-label="글 태그 필터"
          className="flex flex-wrap gap-2"
          role="group"
        >
          <button
            type="button"
            aria-pressed={selectedTag === ARCHIVE_ALL_TAG}
            onClick={() => selectTag(ARCHIVE_ALL_TAG)}
            className={`inline-flex min-h-11 items-center rounded-full border px-3 text-caption transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas-soft ${
              selectedTag === ARCHIVE_ALL_TAG
                ? "border-chrome bg-chrome text-white"
                : "border-hairline bg-surface text-ink-secondary hover:text-ink"
            }`}
          >
            전체 {sortedPosts.length}
          </button>
          {tagCounts.map(({ tag, count }) => (
            <button
              key={tag}
              type="button"
              aria-pressed={selectedTag === tag}
              onClick={() => selectTag(tag)}
              className={`inline-flex min-h-11 items-center rounded-full border px-3 text-caption transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas-soft ${
                selectedTag === tag
                  ? "border-chrome bg-chrome text-white"
                  : "border-hairline bg-surface text-ink-secondary hover:text-ink"
              }`}
            >
              {tag} {count}
            </button>
          ))}
        </div>
      </div>

      <p aria-live="polite" className="mt-5 text-caption text-ink-muted">
        {getArchiveStatusMessage(
          selectedTag,
          filteredPosts.length,
          visiblePosts.length
        )}
      </p>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {visiblePosts.map((post, index) => {
          const thumbnail = normalizeThumbnail(post.thumbnail);
          const tags = normalizePostTags(post.tags);

          return (
            <Link
              key={post.slug}
              href={`/posts/${post.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-lg border border-hairline bg-surface transition-shadow hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas-soft"
            >
              {thumbnail ? (
                <Image
                  src={thumbnail}
                  alt=""
                  width={640}
                  height={360}
                  sizes="(min-width: 640px) 50vw, 100vw"
                  priority={index < 2}
                  className="aspect-video w-full object-cover"
                />
              ) : (
                <div
                  aria-hidden="true"
                  className="aspect-video w-full border-b border-hairline bg-canvas-soft"
                />
              )}
              <div className="flex flex-1 flex-col p-5">
                <p className="text-caption text-ink-muted">
                  {post.publishedAt}
                </p>
                <h2 className="mt-1 break-keep text-title text-ink transition-colors group-hover:text-primary">
                  {post.title}
                </h2>
                <p className="mt-1 break-keep text-body-sm text-ink-muted">
                  {post.summary}
                </p>
                {tags.length ? (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-hairline bg-canvas-soft px-2 py-1 text-eyebrow text-ink-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </Link>
          );
        })}
      </div>

      {hasMorePosts ? (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() =>
              setVisibleCount(
                getNextArchiveVisibleCount(visibleCount, filteredPosts.length)
              )
            }
            className="inline-flex min-h-11 items-center rounded-md border border-hairline bg-surface px-4 text-button text-ink-secondary transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas-soft"
          >
            더 보기
          </button>
        </div>
      ) : null}
    </section>
  );
}
