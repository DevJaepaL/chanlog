import GithubSlugger from "github-slugger";

export type TocItem = {
  id: string;
  text: string;
  level: 2 | 3;
};

const stripMarkdown = (value: string) =>
  value
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/\{[^}]*\}/g, "")
    .replace(/[*_~]/g, "")
    .trim();

export const extractToc = (raw: string): TocItem[] => {
  const lines = raw.split(/\r?\n/);
  const slugger = new GithubSlugger();
  const toc: TocItem[] = [];
  let isInCodeBlock = false;

  for (const line of lines) {
    if (/^\s*```/.test(line)) {
      isInCodeBlock = !isInCodeBlock;
      continue;
    }

    if (isInCodeBlock) {
      continue;
    }

    const headingMatch = line.match(/^\s*(#{2,3})\s+(.+?)\s*#*\s*$/);
    if (!headingMatch) {
      continue;
    }

    const level = headingMatch[1].length as 2 | 3;
    const text = stripMarkdown(headingMatch[2]);
    if (!text) {
      continue;
    }

    toc.push({
      id: slugger.slug(text),
      text,
      level,
    });
  }

  return toc;
};
