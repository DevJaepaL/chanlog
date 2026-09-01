import type { ReactNode } from "react";
import type { AccentColor } from "@/lib/accent";
import { accentDotClass } from "@/lib/accent";

export function Chip({
  children,
  accent,
  compact = false,
}: {
  children: ReactNode;
  accent?: AccentColor;
  compact?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-hairline bg-surface text-caption text-ink-secondary ${
        compact ? "gap-1.5 px-2 py-0.5" : "gap-2 px-3 py-1"
      }`}
    >
      {accent && (
        <span className={`h-2 w-2 rounded-full ${accentDotClass(accent)}`} />
      )}
      {children}
    </span>
  );
}
