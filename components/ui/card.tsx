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
      className={`rounded-2xl bg-canvas-soft p-5 sm:p-9 ${
        elevated ? "shadow-soft" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
