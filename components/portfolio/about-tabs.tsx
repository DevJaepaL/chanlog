"use client";

import { useEffect, useState, type MouseEvent } from "react";

const TABS = [
  { id: "about", label: "소개" },
  { id: "projects", label: "프로젝트" },
  { id: "career", label: "경력" },
  { id: "skills", label: "기술 스택" },
] as const;

// Sticky header (3.75rem) + this bar; a section counts as current once its top passes here.
const ACTIVE_OFFSET = 130;

export function AboutTabs() {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      let current: string | null = null;
      for (const { id } of TABS) {
        const section = document.getElementById(id);
        if (section && section.getBoundingClientRect().top <= ACTIVE_OFFSET) current = id;
      }
      setActiveId(current);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  // Re-dispatch hashchange even when the hash is unchanged so a folded section reopens.
  function jump(event: MouseEvent<HTMLAnchorElement>, id: string) {
    event.preventDefault();
    window.history.pushState(null, "", `#${id}`);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  }

  return (
    <nav
      aria-label="About 섹션 바로가기"
      className="sticky top-[3.75rem] z-40 border-b border-hairline bg-surface/95 backdrop-blur"
    >
      <ul className="mx-auto flex w-full max-w-5xl gap-1 overflow-x-auto px-3 sm:px-4">
        {TABS.map(({ id, label }) => {
          const active = activeId === id;
          return (
            <li key={id} className="shrink-0">
              <a
                href={`#${id}`}
                aria-current={active ? "location" : undefined}
                onClick={(event) => jump(event, id)}
                className={`relative inline-flex min-h-11 items-center rounded-md px-2 text-body-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary ${
                  active
                    ? "font-bold text-ink after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:rounded-full after:bg-ink"
                    : "font-medium text-ink-muted hover:text-ink"
                }`}
              >
                {label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
