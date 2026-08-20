"use client";

import { useState } from "react";
import { accentDotClass } from "@/lib/accent";
import type { PipelineStage } from "@/lib/pipeline";

export function PipelineFlow({ stages }: { stages: PipelineStage[] }) {
  const [activeId, setActiveId] = useState(stages[0]?.id ?? "");
  const active = stages.find((stage) => stage.id === activeId) ?? stages[0];

  return (
    <div className="flex flex-col gap-4">
      <ol className="flex flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-0 sm:overflow-x-auto sm:pb-1">
        {stages.map((stage, index) => {
          const isActive = stage.id === active?.id;
          return (
            <li key={stage.id} className="flex items-center sm:flex-shrink-0">
              <button
                type="button"
                onClick={() => setActiveId(stage.id)}
                aria-current={isActive ? "step" : undefined}
                aria-controls="pipeline-stage-detail"
                className={`w-full rounded-lg border bg-surface p-4 text-left sm:w-[9.5rem] ${
                  isActive
                    ? "border-primary shadow-soft"
                    : "border-hairline"
                }`}
              >
                <span
                  className={`mb-2 block h-6 w-6 rounded-full ${accentDotClass(
                    stage.accent
                  )}`}
                />
                <span className="block text-body-sm font-semibold text-ink">
                  {stage.label}
                </span>
                <span className="mt-1 block text-caption text-ink-muted">
                  {stage.caption}
                </span>
              </button>
              {index < stages.length - 1 && (
                <span
                  aria-hidden
                  className="hidden px-2 text-ink-faint sm:inline"
                >
                  →
                </span>
              )}
            </li>
          );
        })}
      </ol>

      {active && (
        <div
          id="pipeline-stage-detail"
          aria-live="polite"
          className="rounded-lg border border-hairline bg-surface p-6"
        >
          <p className="mb-2 text-eyebrow uppercase text-ink-muted">
            {active.label}
          </p>
          <p className="break-keep text-body-sm text-ink-secondary">
            {active.detail}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {active.stack.map((item) => (
              <span
                key={item}
                className="rounded-full border border-hairline px-3 py-1 text-eyebrow text-primary"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
