import { accentDotClass } from "@/lib/accent";
import { indexTargets, pipelineStack } from "@/lib/pipeline";

export function IndexView() {
  const owned = indexTargets.filter((target) => target.owned);
  const external = indexTargets.filter((target) => !target.owned);

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg border border-hairline bg-surface p-6 shadow-soft">
        <p className="mb-4 text-eyebrow uppercase text-ink-muted">담당 범위</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {owned.map((target) => (
            <div key={target.id} className="rounded-md bg-canvas-soft p-4">
              <div className="mb-2 flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${accentDotClass(
                    target.accent
                  )}`}
                />
                <span className="text-body-sm font-semibold text-ink">
                  {target.label}
                </span>
              </div>
              <p className="break-keep text-caption text-ink-muted">
                {target.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {external.map((target) => (
        <div
          key={target.id}
          className="rounded-lg border border-dashed border-hairline bg-surface p-5 opacity-75"
        >
          <p className="mb-2 text-eyebrow uppercase text-ink-muted">연동 범위</p>
          <p className="break-keep text-body-sm text-ink-muted">
            {target.description}
          </p>
        </div>
      ))}

      <div className="flex flex-wrap gap-2">
        {pipelineStack.map((item) => (
          <span
            key={item}
            className="rounded-full border border-hairline bg-surface px-3 py-1 text-eyebrow text-primary"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
