"use client";

import { useEffect, type RefObject } from "react";

/**
 * Opens a collapsible region when the URL hash points at it or at something
 * inside it (e.g. /pipeline → /portfolio#document-preprocessor), then scrolls
 * the target into view once the content is rendered.
 */
export function useHashReveal(rootRef: RefObject<HTMLElement>, reveal: () => void) {
  useEffect(() => {
    const onHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      const root = rootRef.current;
      const target = id ? document.getElementById(id) : null;
      if (!root || !target || !root.contains(target)) return;
      reveal();
      window.setTimeout(() => target.scrollIntoView({ block: "start" }), 60);
    };
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [rootRef, reveal]);
}
