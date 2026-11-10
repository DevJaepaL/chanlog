"use client";

import {
  Fragment,
  useEffect,
  useReducer,
  useRef,
  useState,
  type FocusEvent,
  type ReactNode,
} from "react";
import type { IconType } from "react-icons";
import {
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiCircle,
  FiLoader,
  FiPause,
  FiPlay,
} from "react-icons/fi";
import {
  getConnectorStatus,
  getPipelineRunState,
  getStepStatus,
  reducePipelineRun,
  type ConnectorStatus,
  type StepStatus,
} from "@/lib/pipeline-run";

const STEP_MS = 1600;

export interface PipelineRunTarget {
  id: string;
  label: string;
  title: string;
  description: string;
  icon?: IconType;
  iconClassName?: string;
}

export interface PipelineRunStep extends PipelineRunTarget {
  step: string;
  group: "external" | "owned" | "integrated";
  icon: IconType;
  children?: {
    label: string;
    items: readonly PipelineRunTarget[];
  };
}

export interface PipelineRunSelection {
  activeId: string | null;
  hover: (id: string) => void;
  clearHover: () => void;
  focus: (id: string) => void;
  clearFocus: () => void;
  close: () => void;
}

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface";

const CARD_STATUS_CLASSES: Record<StepStatus, string> = {
  waiting: "border-hairline bg-surface",
  running: "border-primary bg-primary-soft shadow-soft",
  done: "border-primary/40 bg-surface",
};

const STATUS_TEXT: Record<StepStatus, string> = {
  waiting: "대기",
  running: "처리 중",
  done: "완료",
};

function StatusIcon({ status }: { status: StepStatus }) {
  if (status === "done") {
    return <FiCheckCircle aria-hidden="true" className="h-4 w-4 shrink-0 text-primary" />;
  }
  if (status === "running") {
    return (
      <FiLoader
        aria-hidden="true"
        className="h-4 w-4 shrink-0 text-primary motion-safe:animate-spin"
      />
    );
  }
  return <FiCircle aria-hidden="true" className="h-4 w-4 shrink-0 text-ink-faint" />;
}

function selectionHandlers(id: string, selection: PipelineRunSelection) {
  return {
    onPointerEnter: () => selection.hover(id),
    onPointerLeave: () => selection.clearHover(),
    onClick: () => selection.focus(id),
    onFocus: (event: FocusEvent<HTMLButtonElement>) => {
      if (event.currentTarget.matches(":focus-visible")) selection.focus(id);
    },
    onBlur: () => selection.clearFocus(),
  };
}

function Connector({
  status,
  runIndex,
  bidirectional,
  vertical,
}: {
  status: ConnectorStatus;
  runIndex: number;
  bidirectional: boolean;
  vertical: boolean;
}) {
  const reached = status !== "idle";
  const grow = status === "entering" ? "duration-700 ease-out" : "duration-0";

  return (
    <div
      aria-hidden="true"
      data-connector={status}
      className={`relative flex h-7 w-full shrink-0 justify-center ${
        vertical ? "" : "md:h-auto md:w-8 md:items-center md:self-center lg:w-12"
      }`}
    >
      {/* vertical (mobile, or between stacked groups) */}
      <div className={`relative h-full w-0.5 rounded-full bg-hairline ${vertical ? "" : "md:hidden"}`}>
        <div
          className={`absolute inset-x-0 top-0 rounded-full bg-primary transition-[height] ${grow}`}
          style={{ height: reached ? "100%" : "0%" }}
        />
        {status === "entering" && (
          <span
            key={runIndex}
            className="pipeline-run-packet-y absolute -left-[3px] h-2 w-2 rounded-full bg-primary motion-reduce:hidden"
          />
        )}
        <svg
          viewBox="0 0 10 8"
          className={`absolute -bottom-1 -left-1 h-2 w-2.5 ${reached ? "text-primary" : "text-hairline"}`}
          fill="currentColor"
        >
          <path d="M0 0h10L5 8z" />
        </svg>
      </div>
      {/* horizontal (md+) */}
      <div className={`relative hidden h-0.5 w-full rounded-full bg-hairline ${vertical ? "" : "md:block"}`}>
        <div
          className={`absolute inset-y-0 left-0 rounded-full bg-primary transition-[width] ${grow}`}
          style={{ width: reached ? "100%" : "0%" }}
        />
        {status === "entering" && (
          <span
            key={runIndex}
            className="pipeline-run-packet-x absolute -top-[3px] h-2 w-2 rounded-full bg-primary motion-reduce:hidden"
          />
        )}
        <svg
          viewBox="0 0 8 10"
          className={`absolute -right-1 -top-1 h-2.5 w-2 ${reached ? "text-primary" : "text-hairline"}`}
          fill="currentColor"
        >
          <path d="M0 0 8 5 0 10z" />
        </svg>
        {bidirectional && (
          <svg
            viewBox="0 0 8 10"
            className={`absolute -left-1 -top-1 h-2.5 w-2 ${reached ? "text-primary" : "text-hairline"}`}
            fill="currentColor"
          >
            <path d="M8 0 0 5 8 10z" />
          </svg>
        )}
      </div>
    </div>
  );
}

function StepCard({
  step,
  status,
  selection,
}: {
  step: PipelineRunStep;
  status: StepStatus;
  selection: PipelineRunSelection;
}) {
  const Icon = step.icon;
  const selected = selection.activeId === step.id;

  return (
    <div
      data-step-status={status}
      className={`flex min-w-0 flex-1 flex-col rounded-xl border transition-colors duration-300 ${
        CARD_STATUS_CLASSES[status]
      } ${selected ? "ring-2 ring-primary" : ""}`}
    >
      <button
        type="button"
        {...selectionHandlers(step.id, selection)}
        className={`flex w-full min-w-0 flex-col items-start gap-1 rounded-xl p-3 text-left ${FOCUS_RING}`}
      >
        <span className="flex w-full items-center justify-between gap-2">
          <span className="text-label text-ink-faint">{step.step}</span>
          <StatusIcon status={status} />
          <span className="sr-only">{STATUS_TEXT[status]}</span>
        </span>
        <span className="flex min-w-0 items-center gap-1.5">
          <Icon aria-hidden="true" className="h-4 w-4 shrink-0 text-ink-secondary" />
          <span className="break-keep text-body-sm font-bold text-ink">{step.label}</span>
        </span>
        <span className="break-keep text-caption text-ink-muted">{step.title}</span>
      </button>
      {step.children && (
        <div
          role="group"
          aria-label={step.children.label}
          className="flex flex-wrap gap-1 px-2.5 pb-2.5"
        >
          {step.children.items.map((child) => {
            const ChildIcon = child.icon;
            return (
              <button
                key={child.id}
                type="button"
                {...selectionHandlers(child.id, selection)}
                className={`inline-flex min-h-8 items-center ${FOCUS_RING} rounded-md`}
              >
                <span
                  className={`inline-flex h-7 items-center gap-1 rounded-md px-1.5 text-label transition-colors ${
                    selection.activeId === child.id
                      ? "bg-primary text-surface"
                      : "bg-canvas-muted text-ink-secondary hover:bg-hairline"
                  }`}
                >
                  {ChildIcon && (
                    <ChildIcon
                      aria-hidden="true"
                      className={`h-3.5 w-3.5 shrink-0 ${
                        selection.activeId === child.id ? "" : child.iconClassName ?? ""
                      }`}
                    />
                  )}
                  <span>{child.label}</span>
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function findTarget(steps: readonly PipelineRunStep[], id: string) {
  for (const step of steps) {
    if (step.id === id) return { step, target: step as PipelineRunTarget };
    const child = step.children?.items.find((item) => item.id === id);
    if (child) return { step, target: child };
  }
  return null;
}

export function PipelineRun({
  steps,
  ariaLabel,
  ownedLegendId,
  bidirectionalConnectors = [],
  stackGroups = false,
  selection,
}: {
  steps: readonly PipelineRunStep[];
  ariaLabel: string;
  ownedLegendId: string;
  bidirectionalConnectors?: readonly number[];
  /** Put each group on its own row on wide screens (for steps with chips). */
  stackGroups?: boolean;
  selection: PipelineRunSelection;
}) {
  const count = steps.length;
  const [run, dispatchRun] = useReducer(reducePipelineRun, undefined, getPipelineRunState);
  const [visible, setVisible] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const seenRef = useRef(false);
  const holding = selection.activeId !== null;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting && !seenRef.current) {
          seenRef.current = true;
          dispatchRun({ type: "restart" });
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!run.playing || !visible || holding) return;
    const timer = window.setInterval(() => dispatchRun({ type: "tick", count }), STEP_MS);
    return () => window.clearInterval(timer);
  }, [run.playing, visible, holding, count]);

  const { close } = selection;
  useEffect(() => {
    if (!holding) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [holding, close]);

  const groups: { group: PipelineRunStep["group"]; items: { step: PipelineRunStep; index: number }[] }[] = [];
  steps.forEach((step, index) => {
    const last = groups[groups.length - 1];
    if (last?.group === step.group) last.items.push({ step, index });
    else groups.push({ group: step.group, items: [{ step, index }] });
  });

  const connector = (index: number, vertical = false) => (
    <Connector
      status={getConnectorStatus(run.index, index)}
      runIndex={run.index}
      bidirectional={bidirectionalConnectors.includes(index)}
      vertical={vertical}
    />
  );

  const renderItems = (items: { step: PipelineRunStep; index: number }[]) =>
    items.map(({ step, index }, position) => (
      <Fragment key={step.id}>
        {position > 0 && connector(index - 1)}
        <StepCard step={step} status={getStepStatus(run.index, index)} selection={selection} />
      </Fragment>
    ));

  const selected = selection.activeId ? findTarget(steps, selection.activeId) : null;
  const current = run.index < count ? steps[run.index] : null;
  let board: ReactNode;
  if (selected) {
    board = (
      <>
        <p className="text-label text-ink-faint">
          {selected.step.step}/{String(count).padStart(2, "0")} · 선택한 항목
        </p>
        <p className="mt-0.5 break-keep text-body-sm font-semibold text-surface">
          {selected.target.label} · {selected.target.title}
        </p>
        <p className="mt-0.5 break-keep text-caption text-hairline">{selected.target.description}</p>
      </>
    );
  } else if (current) {
    board = (
      <>
        <p className="text-label text-ink-faint">
          {current.step}/{String(count).padStart(2, "0")} · {STATUS_TEXT.running}
        </p>
        <p className="mt-0.5 break-keep text-body-sm font-semibold text-surface">
          {current.label} · {current.title}
        </p>
        <p className="mt-0.5 break-keep text-caption text-hairline">{current.description}</p>
      </>
    );
  } else {
    board = (
      <>
        <p className="text-label text-ink-faint">
          {String(count).padStart(2, "0")}/{String(count).padStart(2, "0")} · {STATUS_TEXT.done}
        </p>
        <p className="mt-0.5 text-body-sm font-semibold text-surface">모든 단계 완료</p>
      </>
    );
  }

  const controlClass = `inline-flex h-11 w-11 items-center justify-center rounded-lg text-hairline transition-colors hover:bg-ink-secondary hover:text-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-soft`;

  return (
    <div ref={rootRef} aria-label={ariaLabel} role="group" className="mt-4">
      <div className={`flex flex-col ${stackGroups ? "" : "md:flex-row md:items-stretch"}`}>
        {groups.map(({ group, items }, groupIndex) => (
          <Fragment key={`${group}-${items[0].index}`}>
            {groupIndex > 0 && connector(items[0].index - 1, stackGroups)}
            {group === "owned" ? (
              <fieldset
                aria-labelledby={ownedLegendId}
                className={`flex min-w-0 flex-col rounded-2xl border-2 border-dashed border-primary/50 px-2 pb-2 pt-1 md:flex-row md:items-stretch ${
                  stackGroups ? "" : "md:flex-[3]"
                }`}
              >
                <legend
                  id={ownedLegendId}
                  className="px-1.5 text-label text-primary"
                >
                  개발 영역
                </legend>
                {renderItems(items)}
              </fieldset>
            ) : (
              <div
                className={`flex min-w-0 flex-col md:flex-row md:items-stretch ${
                  stackGroups
                    ? "md:mx-auto md:w-2/3"
                    : `md:pt-4 ${items.length > 1 ? "md:flex-[2]" : "md:flex-1"}`
                }`}
              >
                {renderItems(items)}
              </div>
            )}
          </Fragment>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-2 rounded-xl bg-ink px-4 py-3 sm:flex-row sm:items-center sm:gap-4">
        <div
          aria-live={selected ? "polite" : "off"}
          className="min-h-[4.25rem] min-w-0 flex-1"
        >
          {board}
        </div>
        <div className="-mx-2 flex shrink-0 items-center sm:mx-0">
          <button
            type="button"
            aria-label="이전 단계"
            onClick={() => dispatchRun({ type: "prev", count })}
            className={controlClass}
          >
            <FiChevronLeft aria-hidden="true" className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label={run.playing ? "일시정지" : "재생"}
            onClick={() => dispatchRun({ type: "toggle" })}
            className={controlClass}
          >
            {run.playing ? (
              <FiPause aria-hidden="true" className="h-5 w-5" />
            ) : (
              <FiPlay aria-hidden="true" className="h-5 w-5" />
            )}
          </button>
          <button
            type="button"
            aria-label="다음 단계"
            onClick={() => dispatchRun({ type: "next", count })}
            className={controlClass}
          >
            <FiChevronRight aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
