import type { TocItem } from "@/lib/toc";

export function PostToc({ items, title }: { items: TocItem[]; title: string }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <aside className="fixed right-8 top-24 hidden max-h-[calc(100vh-7rem)] w-60 overflow-y-auto xl:block">
      <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-[0_18px_45px_-26px_rgba(5,150,105,0.65)] backdrop-blur">
        <p className="mb-3 line-clamp-2 text-xs font-semibold text-emerald-700/90">
          {title}
        </p>
        <ul className="space-y-1.5 text-sm">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`block rounded-md px-2 py-1.5 transition-colors hover:bg-emerald-100/70 hover:text-emerald-800 ${
                  item.level === 3
                    ? "ml-2 border-l border-emerald-200 pl-3 text-stone-500"
                    : "font-medium text-stone-700"
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
