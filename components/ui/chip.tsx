import type { ReactNode } from "react";
import type { AccentColor } from "@/lib/accent";
import { accentDotClass } from "@/lib/accent";

export function Chip({
  children,
  accent,
}: {
  children: ReactNode;
  accent?: AccentColor;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-hairline bg-surface px-3 py-1 text-caption text-ink-secondary">
      {accent && (
        <span className={`h-2 w-2 rounded-full ${accentDotClass(accent)}`} />
      )}
      {children}
    </span>
  );
}
