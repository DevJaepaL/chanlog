import type { ReactNode } from "react";
import type { AccentColor } from "@/lib/accent";
import { accentDotClass } from "@/lib/accent";

export function Chip({
  children,
  accent,
  icon,
  compact = false,
}: {
  children: ReactNode;
  accent?: AccentColor;
  icon?: ReactNode;
  compact?: boolean;
}) {
  return (
    <span
      className={`inline-flex h-8 items-center gap-1.5 rounded-md text-caption font-medium text-ink-secondary ${
        compact ? "px-2.5" : "px-3"
      } bg-surface`}
    >
      {icon ? (
        <span className="flex h-4 w-4 shrink-0">{icon}</span>
      ) : (
        accent && (
          <span className={`h-2 w-2 rounded-full ${accentDotClass(accent)}`} />
        )
      )}
      {children}
    </span>
  );
}
