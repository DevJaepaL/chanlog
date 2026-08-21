export interface ArchivePost {
  title: string;
  publishedAt: string;
  summary: string;
  slug: string;
  thumbnail?: string;
}

export function sortPostsByPublishedAt<T extends ArchivePost>(posts: readonly T[]): T[] {
  return [...posts].sort((left, right) => {
    const byDate = new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime();
    return byDate || left.slug.localeCompare(right.slug);
  });
}

export function normalizeThumbnail(thumbnail: string | undefined): string | undefined {
  const normalized = thumbnail?.trim();
  return normalized || undefined;
}
