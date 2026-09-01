import type { TocItem } from "@/lib/toc";

export function PostToc({ items, title }: { items: TocItem[]; title: string }) {
  if (items.length === 0) return null;

  return (
    <aside className="fixed right-8 top-24 hidden max-h-[calc(100vh-8rem)] w-60 overflow-y-auto xl:block">
      <div className="rounded-xl border border-hairline bg-surface p-4 shadow-soft">
        <p className="mb-3 line-clamp-2 text-eyebrow uppercase text-ink-muted">
          {title}
        </p>
        <ul className="flex flex-col gap-1">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`block rounded-sm px-2 py-1.5 text-caption transition-colors hover:bg-canvas-soft hover:text-primary-active ${
                  item.level === 3
                    ? "ml-2 border-l border-hairline pl-3 text-ink-muted"
                    : "text-ink-secondary"
                }`}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
