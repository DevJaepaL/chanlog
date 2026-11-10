"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { FiChevronDown } from "react-icons/fi";
import { useHashReveal } from "@/components/ui/use-hash-reveal";

// `version` bumps on every "모두 펼치기/접기" click so items follow it once.
const ExpandAllContext = createContext({ version: 0, expanded: false });
const ExpandAllSetter = createContext<(expanded: boolean) => void>(() => {});

export function ProjectAccordionGroup({ children }: { children: ReactNode }) {
  const [state, setState] = useState({ version: 0, expanded: false });
  const setAll = useCallback(
    (expanded: boolean) =>
      setState(({ version }) => ({ version: version + 1, expanded })),
    []
  );

  return (
    <ExpandAllSetter.Provider value={setAll}>
      <ExpandAllContext.Provider value={state}>{children}</ExpandAllContext.Provider>
    </ExpandAllSetter.Provider>
  );
}

export function ExpandAllButton() {
  const { expanded } = useContext(ExpandAllContext);
  const setAll = useContext(ExpandAllSetter);

  return (
    <button
      type="button"
      onClick={() => setAll(!expanded)}
      className="inline-flex min-h-11 items-center rounded-md px-2 text-body-sm font-semibold text-primary hover:text-primary-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      {expanded ? "모두 접기" : "모두 펼치기"}
    </button>
  );
}

export function ProjectAccordionItem({
  index,
  summary,
  children,
}: {
  index: number;
  summary: ReactNode;
  children: ReactNode;
}) {
  const { version, expanded } = useContext(ExpandAllContext);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const reveal = useCallback(() => setOpen(true), []);
  useHashReveal(rootRef, reveal);

  useEffect(() => {
    if (version > 0) setOpen(expanded);
  }, [version, expanded]);

  const titleId = `project-${index}-title`;
  const detailId = `project-${index}-detail`;

  return (
    <div ref={rootRef} className="rounded-2xl bg-canvas-muted">
      <div className="group relative px-5 pb-3 pt-5 sm:px-8 sm:pt-8">
        {summary}
        {/* Visible cue that the whole card opens; the overlay button below carries the semantics. */}
        <div
          aria-hidden="true"
          className="mt-5 flex min-h-11 items-center justify-center gap-1 border-t border-hairline pt-3 text-body-sm font-semibold text-ink-tertiary transition-colors group-hover:text-primary"
        >
          {open ? "접기" : "자세히 보기"}
          <FiChevronDown
            className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </div>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={detailId}
          aria-labelledby={titleId}
          onClick={() => setOpen((value) => !value)}
          className="absolute inset-0 rounded-2xl transition-colors hover:bg-ink/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
      </div>
      <div id={detailId} hidden={!open} className="px-5 pb-5 sm:px-8 sm:pb-8">
        {children}
      </div>
    </div>
  );
}
