import { extractionComparison } from "@/lib/pipeline";

export function ExtractionCompare() {
  const { naive, structured, caption } = extractionComparison;

  return (
    <div className="rounded-lg border border-hairline bg-surface p-6">
      <p className="mb-4 text-eyebrow uppercase text-ink-muted">
        왜 필요한가 — {caption}
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-caption font-semibold text-ink-secondary">
            <span aria-hidden="true" className="text-accent-orange">
              ✕
            </span>{" "}
            {naive.label}
          </p>
          <pre className="overflow-x-auto rounded-md bg-canvas-soft p-3 text-caption text-ink-muted">
            {naive.output}
          </pre>
          <p className="mt-2 break-keep text-caption text-ink-muted">
            {naive.note}
          </p>
        </div>
        <div>
          <p className="mb-2 text-caption font-semibold text-ink-secondary">
            <span aria-hidden="true" className="text-accent-green">
              ✓
            </span>{" "}
            {structured.label}
          </p>
          <pre className="overflow-x-auto rounded-md bg-canvas-soft p-3 text-caption text-ink-secondary">
            {structured.output}
          </pre>
          <p className="mt-2 break-keep text-caption text-ink-muted">
            {structured.note}
          </p>
        </div>
      </div>
    </div>
  );
}
