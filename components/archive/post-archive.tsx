"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ARCHIVE_ALL_TAG,
  filterArchivePosts,
  formatPostDate,
  getArchiveTagCounts,
  getInitialArchiveVisibleCount,
  getNextArchiveVisibleCount,
  getArchiveStatusMessage,
  getVisibleArchivePosts,
  normalizePostTags,
  normalizeThumbnail,
  sortPostsByPublishedAt,
  splitArchiveTags,
  type ArchivePost,
} from "@/lib/posts";

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface";

function PostMeta({ post }: { post: ArchivePost }) {
  const tags = normalizePostTags(post.tags);

  return (
    <div className="mb-2.5 flex flex-wrap items-center gap-1.5">
      {tags.map((tag, index) => (
        <span
          key={tag}
          className={`inline-flex h-6 items-center rounded-md px-2 text-label ${
            index === 0
              ? "bg-primary-soft text-primary"
              : "bg-canvas-muted text-ink-tertiary"
          }`}
        >
          {tag}
        </span>
      ))}
      <time dateTime={post.publishedAt} className="ml-1 text-label font-normal text-ink-faint">
        {formatPostDate(post.publishedAt)}
      </time>
    </div>
  );
}

function Thumbnail({
  src,
  className,
  sizes,
  priority = false,
}: {
  src: string | undefined;
  className: string;
  sizes: string;
  priority?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden border border-canvas-muted bg-canvas-soft ${className}`}
    >
      {src ? (
        <Image
          src={src}
          alt=""
          fill
          sizes={sizes}
          priority={priority}
          className="object-contain transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none"
        />
      ) : null}
    </div>
  );
}

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
  const [tagsExpanded, setTagsExpanded] = useState(false);
  const [visibleCount, setVisibleCount] = useState(() =>
    getInitialArchiveVisibleCount(sortedPosts.length)
  );
  const visiblePosts = getVisibleArchivePosts(filteredPosts, visibleCount);
  const hasMorePosts = visiblePosts.length < filteredPosts.length;
  const featuredPost = sortedPosts[0];

  function selectTag(tag: string | null) {
    setSelectedTag(tag);
    setVisibleCount(
      getInitialArchiveVisibleCount(filterArchivePosts(sortedPosts, tag).length)
    );
  }

  const { visible: visibleTags, hidden: hiddenTags } = splitArchiveTags(
    tagCounts,
    selectedTag
  );
  const shownTags = tagsExpanded ? [...visibleTags, ...hiddenTags] : visibleTags;

  function filterTabClass(selected: boolean) {
    return `relative inline-flex min-h-11 items-center gap-1 rounded-md px-2 text-body-sm transition-colors ${FOCUS_RING} ${
      selected
        ? "font-bold text-ink after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:rounded-full after:bg-ink"
        : "font-medium text-ink-muted hover:text-ink"
    }`;
  }

  function renderFilterTab(tag: string | null, label: string, count: number) {
    const selected = selectedTag === tag;
    return (
      <button
        key={tag ?? "__all"}
        type="button"
        aria-pressed={selected}
        onClick={() => selectTag(tag)}
        className={filterTabClass(selected)}
      >
        {label}
        <span className="text-caption font-medium text-ink-faint">{count}</span>
      </button>
    );
  }

  return (
    <section className="mx-auto w-full max-w-5xl px-5 pb-20 sm:px-6">
      <h1 className="sr-only">아카이브</h1>

      {featuredPost ? (
        <Link
          href={`/posts/${featuredPost.slug}`}
          className={`group grid grid-cols-1 items-center gap-5 rounded-2xl py-7 md:grid-cols-2 md:gap-12 md:py-12 ${FOCUS_RING}`}
        >
          <div className="min-w-0">
            <PostMeta post={featuredPost} />
            <h2 className="break-keep text-heading-2 text-ink transition-colors group-hover:text-primary md:text-headline">
              {featuredPost.title}
            </h2>
            <p className="mt-3 break-keep text-body-md text-ink-muted md:text-body-lg">
              {featuredPost.summary}
            </p>
          </div>
          <Thumbnail
            src={normalizeThumbnail(featuredPost.thumbnail)}
            sizes="(min-width: 768px) 50vw, 100vw"
            priority
            className="-order-1 aspect-[16/10] rounded-xl md:order-none md:rounded-2xl"
          />
        </Link>
      ) : null}

      <h2 className="mt-2 border-t border-hairline pt-8 text-section text-ink md:pt-10">
        아카이브
      </h2>

      <div className="mt-3 border-b border-hairline">
        <div
          id="archive-tag-filter"
          aria-label="글 태그 필터"
          className="-mx-2 flex flex-wrap items-center"
          role="group"
        >
          {renderFilterTab(ARCHIVE_ALL_TAG, "전체", sortedPosts.length)}
          {shownTags.map(({ tag, count }) => renderFilterTab(tag, tag, count))}
          {hiddenTags.length > 0 && (
            <button
              type="button"
              aria-expanded={tagsExpanded}
              aria-controls="archive-tag-filter"
              aria-label={
                tagsExpanded ? "태그 접기" : `태그 ${hiddenTags.length}개 더 보기`
              }
              onClick={() => setTagsExpanded((expanded) => !expanded)}
              className={`inline-flex min-h-11 items-center rounded-md px-2 text-body-sm font-semibold text-primary hover:text-primary-active ${FOCUS_RING}`}
            >
              {tagsExpanded ? "접기" : `+${hiddenTags.length}`}
            </button>
          )}
        </div>
      </div>

      <p aria-live="polite" className="mt-3 text-caption text-ink-faint">
        {getArchiveStatusMessage(
          selectedTag,
          filteredPosts.length,
          visiblePosts.length
        )}
      </p>

      <ul className="mt-2">
        {visiblePosts.map((post) => (
          <li key={post.slug} className="border-t border-hairline first:border-t-0">
            <Link
              href={`/posts/${post.slug}`}
              className={`group grid grid-cols-[minmax(0,1fr)_6rem] items-start gap-4 rounded-xl py-6 sm:grid-cols-[minmax(0,1fr)_15rem] sm:items-center sm:gap-10 sm:py-7 ${FOCUS_RING}`}
            >
              <div className="min-w-0">
                <PostMeta post={post} />
                <h3 className="break-keep text-title font-bold text-ink transition-colors group-hover:text-primary sm:text-heading-3">
                  {post.title}
                </h3>
                <p className="mt-2 line-clamp-2 break-keep text-body-sm text-ink-muted sm:line-clamp-none sm:text-body-md">
                  {post.summary}
                </p>
              </div>
              <Thumbnail
                src={normalizeThumbnail(post.thumbnail)}
                sizes="(min-width: 640px) 240px, 96px"
                className="mt-9 aspect-square rounded-lg sm:mt-0 sm:aspect-[3/2] sm:rounded-xl"
              />
            </Link>
          </li>
        ))}
      </ul>

      {hasMorePosts ? (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() =>
              setVisibleCount(
                getNextArchiveVisibleCount(visibleCount, filteredPosts.length)
              )
            }
            className={`group inline-flex min-h-11 items-center rounded-lg ${FOCUS_RING}`}
          >
            <span className="inline-flex h-11 items-center rounded-lg bg-canvas-muted px-5 text-button text-ink-secondary transition-colors group-hover:bg-hairline">
              더 보기
            </span>
          </button>
        </div>
      ) : null}
    </section>
  );
}
