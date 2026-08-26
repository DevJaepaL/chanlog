export interface ArchivePost {
  title: string;
  publishedAt: string;
  summary: string;
  slug: string;
  thumbnail?: string;
  tags?: readonly string[];
}

export const ARCHIVE_PAGE_SIZE = 6;
export const ARCHIVE_ALL_TAG = null;

type ArchivePostSource = ArchivePost & Record<string, unknown>;

export function toArchivePost({
  title,
  publishedAt,
  summary,
  slug,
  thumbnail,
  tags,
}: ArchivePostSource): ArchivePost {
  return { title, publishedAt, summary, slug, thumbnail, tags };
}

export function sortPostsByPublishedAt<T extends ArchivePost>(
  posts: readonly T[]
): T[] {
  return [...posts].sort((left, right) => {
    const byDate =
      new Date(right.publishedAt).getTime() -
      new Date(left.publishedAt).getTime();
    return byDate || left.slug.localeCompare(right.slug);
  });
}

export function normalizeThumbnail(
  thumbnail: string | undefined
): string | undefined {
  const normalized = thumbnail?.trim();
  return normalized || undefined;
}

export function normalizePostTags(
  tags: readonly string[] | undefined
): string[] {
  const normalizedTags = new Set<string>();

  for (const tag of tags ?? []) {
    const normalized = tag.trim();

    if (normalized) {
      normalizedTags.add(normalized);
    }
  }

  return [...normalizedTags];
}

export function getArchiveTagCounts<T extends ArchivePost>(
  posts: readonly T[]
): { tag: string; count: number }[] {
  const counts = new Map<string, number>();

  for (const post of posts) {
    for (const tag of normalizePostTags(post.tags)) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return [...counts]
    .map(([tag, count]) => ({ tag, count }))
    .sort((left, right) =>
      left.tag < right.tag ? -1 : left.tag > right.tag ? 1 : 0
    );
}

export function filterArchivePosts<T extends ArchivePost>(
  posts: readonly T[],
  selectedTag: string | null
): T[] {
  if (selectedTag === null) {
    return [...posts];
  }

  const normalizedTag = selectedTag.trim();

  if (!normalizedTag) return [...posts];

  return posts.filter((post) =>
    normalizePostTags(post.tags).includes(normalizedTag)
  );
}

export function getArchiveStatusMessage(
  selectedTag: string | null,
  totalPosts: number,
  visiblePosts: number
): string {
  const label = selectedTag === null ? "전체" : `${selectedTag} ·`;
  return `${label} ${totalPosts}개의 글 · ${visiblePosts}개 표시`;
}

export function getInitialArchiveVisibleCount(totalPosts: number): number {
  return Math.min(ARCHIVE_PAGE_SIZE, Math.max(totalPosts, 0));
}

export function getNextArchiveVisibleCount(
  visibleCount: number,
  totalPosts: number
): number {
  const total = Math.max(totalPosts, 0);
  return Math.min(Math.max(visibleCount, 0) + ARCHIVE_PAGE_SIZE, total);
}

export function getVisibleArchivePosts<T extends ArchivePost>(
  posts: readonly T[],
  visibleCount: number
): T[] {
  return posts.slice(0, Math.max(visibleCount, 0));
}
