"use client";

import { motion } from "framer-motion";
import { useCallback, useRef, useState, type ReactNode } from "react";
import { FiChevronDown } from "react-icons/fi";
import { useHashReveal } from "@/components/ui/use-hash-reveal";

export const SECTION_REVEAL_DURATION_SECONDS = 1.0;

interface SectionProps {
  id?: string;
  eyebrow?: string;
  title?: string;
  children: ReactNode;
  wide?: boolean;
  /** Turn the title into a button that folds the section content. */
  collapsible?: boolean;
}

export function Section({
  id,
  eyebrow,
  title,
  children,
  wide,
  collapsible = false,
}: SectionProps) {
  const [open, setOpen] = useState(true);
  const rootRef = useRef<HTMLElement>(null);
  const reveal = useCallback(() => setOpen(true), []);
  useHashReveal(rootRef, reveal);
  const contentId = id ? `${id}-content` : undefined;
  const canCollapse = collapsible && Boolean(title && contentId);

  return (
    <motion.section
      id={id}
      ref={rootRef}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: SECTION_REVEAL_DURATION_SECONDS,
        ease: "easeOut",
      }}
      className="scroll-mt-28 px-5 pb-8 pt-2 sm:px-6 sm:pb-10"
    >
      <div
        className={`mx-auto w-full border-t border-hairline pt-8 sm:pt-10 ${
          wide ? "max-w-5xl" : "max-w-3xl"
        }`}
      >
        {eyebrow && (
          <p className="mb-1 text-label uppercase text-ink-faint">{eyebrow}</p>
        )}
        {title && (
          <h2
            className={`text-section text-ink sm:text-heading-2 sm:font-bold ${
              open ? "mb-6" : ""
            }`}
          >
            {canCollapse ? (
              <button
                type="button"
                aria-expanded={open}
                aria-controls={contentId}
                onClick={() => setOpen((value) => !value)}
                className="-mx-1 flex w-[calc(100%+0.5rem)] items-center justify-between gap-3 rounded-md px-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {title}
                <FiChevronDown
                  aria-hidden="true"
                  className={`h-5 w-5 shrink-0 text-ink-faint transition-transform ${
                    open ? "" : "-rotate-90"
                  }`}
                />
              </button>
            ) : (
              title
            )}
          </h2>
        )}
        <div id={contentId} hidden={canCollapse && !open}>
          {children}
        </div>
      </div>
    </motion.section>
  );
}
