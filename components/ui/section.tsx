"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface SectionProps {
  id?: string;
  eyebrow?: string;
  title?: string;
  children: ReactNode;
  wide?: boolean;
}

export function Section({ id, eyebrow, title, children, wide }: SectionProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="px-6 py-16 sm:py-20"
    >
      <div className={`mx-auto w-full ${wide ? "max-w-5xl" : "max-w-3xl"}`}>
        {eyebrow && (
          <p className="mb-2 text-eyebrow uppercase text-ink-muted">{eyebrow}</p>
        )}
        {title && (
          <h2 className="mb-8 text-heading-2 text-ink sm:text-heading-1">
            {title}
          </h2>
        )}
        {children}
      </div>
    </motion.section>
  );
}
