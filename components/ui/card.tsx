import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
  elevated = false,
}: {
  children: ReactNode;
  className?: string;
  elevated?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border border-hairline bg-surface p-6 ${
        elevated ? "shadow-soft" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
