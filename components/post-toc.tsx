import type { TocItem } from "@/lib/toc";

const LINK_FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary";

function TocLinks({ items, compact = false }: { items: TocItem[]; compact?: boolean }) {
  return (
    <ul className="flex flex-col">
      {items.map((item) => (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            className={`block break-keep rounded-md transition-colors ${LINK_FOCUS} ${
              compact
                ? `px-2.5 py-1.5 text-caption hover:bg-canvas-muted hover:text-ink ${
                    item.level === 3 ? "pl-6 text-ink-faint" : "text-ink-muted"
                  }`
                : `py-2 text-body-sm ${
                    item.level === 3 ? "pl-4 text-ink-muted" : "text-ink-tertiary"
                  }`
            }`}
          >
            {item.text}
          </a>
        </li>
      ))}
    </ul>
  );
}

export function PostToc({ items }: { items: TocItem[] }) {
  if (items.length === 0) return null;

  return (
    <>
      <details open className="group mb-8 rounded-xl bg-canvas-soft px-4 xl:hidden">
        <summary
          className={`flex min-h-12 cursor-pointer list-none items-center justify-between rounded-md text-body-sm font-semibold text-ink after:text-ink-faint after:content-['▾'] group-open:after:content-['▴'] [&::-webkit-details-marker]:hidden ${LINK_FOCUS}`}
        >
          목차
        </summary>
        <nav aria-label="목차" className="pb-3">
          <TocLinks items={items} />
        </nav>
      </details>
      <aside className="hidden xl:sticky xl:top-24 xl:col-start-2 xl:row-start-1 xl:block xl:max-h-[calc(100vh-8rem)] xl:self-start xl:overflow-y-auto">
        <p className="mb-2 px-2.5 text-label text-ink-faint">목차</p>
        <nav aria-label="목차">
          <TocLinks items={items} compact />
        </nav>
      </aside>
    </>
  );
}
