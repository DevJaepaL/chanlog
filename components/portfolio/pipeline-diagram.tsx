"use client";

import {
  useEffect,
  useReducer,
  type CSSProperties,
  type Dispatch,
} from "react";
import {
  FiCalendar,
  FiCpu,
  FiDatabase,
  FiFileText,
  FiLayers,
} from "react-icons/fi";
import { SiElasticsearch, SiMongodb } from "react-icons/si";
import type { IconType } from "react-icons";
import {
  getActivePipelineItemId,
  getPipelineDetailPosition,
  getPipelineState,
  pipelineStageGroups,
  reducePipelineState,
  type PipelineEvent,
  type PipelineItemId,
  type PipelineState,
  type PipelineStage,
  type PipelineTarget,
  type PipelineTone,
} from "@/lib/pipeline";

const TONE_DOT_CLASSES: Record<PipelineTone, string> = {
  orange: "bg-accent-orange",
  teal: "bg-accent-teal",
  purple: "bg-accent-purple",
  sky: "bg-accent-sky",
  pink: "bg-accent-pink",
};

const STAGE_ICONS: Partial<Record<PipelineItemId, IconType>> = {
  nifi: FiCalendar,
  "document-extractor": FiFileText,
  preprocessor: FiLayers,
  "index-store": FiDatabase,
  "llm-response": FiCpu,
};

const STORE_ICONS: Partial<Record<PipelineItemId, IconType>> = {
  bm25: SiElasticsearch,
  "chroma-db": FiDatabase,
  mongodb: SiMongodb,
};

const STORE_ICON_CLASSES: Partial<Record<PipelineItemId, string>> = {
  bm25: "text-accent-orange",
  "chroma-db": "text-accent-purple",
  mongodb: "text-accent-teal",
};

const DOCUMENT_TARGET_TONE_CLASSES: Partial<Record<PipelineItemId, string>> = {
  hwp: "border border-accent-teal/60 bg-accent-teal/10 hover:bg-accent-teal/20",
  pdf: "border border-accent-pink/60 bg-accent-pink/10 hover:bg-accent-pink/20",
  docx: "border border-accent-sky/60 bg-accent-sky/10 hover:bg-accent-sky/20",
};

const DETAIL_POSITION_CLASSES = {
  left: "left-0",
  center: "left-1/2 -translate-x-1/2",
  right: "right-0",
} as const;

type DetailPosition = keyof typeof DETAIL_POSITION_CLASSES;

function PipelineConnector({
  bidirectional,
  flowStep,
}: {
  bidirectional: boolean;
  flowStep: number;
}) {
  const arrowStart = bidirectional ? "M10 3 4 8l6 5" : undefined;
  const flowDelay = `${flowStep * 120}ms`;
  const flowStyle = { "--flow-delay": flowDelay } as CSSProperties;

  return (
    <div
      aria-hidden="true"
      data-flow-step={flowStep}
      data-flow-delay={flowDelay}
      className="flex h-7 items-center justify-center md:mt-9 md:h-4 md:w-6 md:shrink-0"
    >
      <svg
        viewBox="0 0 16 32"
        className="h-7 w-4 text-ink-secondary md:hidden"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M8 2v24" />
        <path
          d="M8 2v24"
          className="pipeline-flow-path stroke-primary"
          style={flowStyle}
        />
        {bidirectional && <path d="m3 8 5-6 5 6" />}
        <path d="m3 21 5 6 5-6" />
      </svg>
      <svg
        viewBox="0 0 32 16"
        className="hidden h-4 w-6 text-ink-secondary md:block"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 8h24" />
        <path
          d="M2 8h24"
          className="pipeline-flow-path stroke-primary"
          style={flowStyle}
        />
        {arrowStart && <path d={arrowStart} />}
        <path d="m21 3 6 5-6 5" />
      </svg>
    </div>
  );
}

function PipelineDownConnector() {
  const flowDelay = "240ms";
  const flowStyle = { "--flow-delay": flowDelay } as CSSProperties;

  return (
    <div
      aria-hidden="true"
      data-flow-step="2"
      data-flow-delay={flowDelay}
      className="flex h-8 items-center justify-center"
    >
      <svg
        viewBox="0 0 16 32"
        className="h-7 w-4 text-ink-secondary"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M8 2v24" />
        <path
          d="M8 2v24"
          className="pipeline-flow-path stroke-primary"
          style={flowStyle}
        />
        <path d="m3 21 5 6 5-6" />
      </svg>
    </div>
  );
}

function PipelineTargetButton({
  target,
  state,
  dispatch,
  documentTarget = false,
  compact = false,
  detailPosition = "left",
}: {
  target: PipelineTarget;
  state: PipelineState;
  dispatch: Dispatch<PipelineEvent>;
  documentTarget?: boolean;
  compact?: boolean;
  detailPosition?: DetailPosition;
}) {
  const activeId = getActivePipelineItemId(state);
  const isActive = activeId === target.id;
  const detailId = `pipeline-detail-${target.id}`;
  const TargetIcon = documentTarget
    ? FiFileText
    : STAGE_ICONS[target.id] ?? STORE_ICONS[target.id];

  return (
    <div
      className="relative min-w-0"
      onPointerEnter={() => dispatch({ type: "hover", id: target.id })}
      onPointerLeave={() => dispatch({ type: "clear-hover" })}
    >
      <button
        type="button"
        aria-describedby={isActive ? detailId : undefined}
        onFocus={(event) => {
          if (event.currentTarget.matches(":focus-visible")) {
            dispatch({ type: "focus", id: target.id });
          }
        }}
        onBlur={() => dispatch({ type: "clear-focus" })}
        className={
          documentTarget
            ? `flex min-h-11 w-full flex-col items-center justify-center gap-0.5 rounded-md px-1 py-1 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas-soft motion-reduce:transition-none ${
                DOCUMENT_TARGET_TONE_CLASSES[target.id] ?? ""
              } ${isActive ? "bg-surface" : ""}`
            : compact
            ? `inline-flex min-h-11 items-center justify-center rounded-full border border-hairline bg-canvas-soft px-1.5 text-[0.6875rem] text-ink-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas-soft`
            : `relative flex h-12 w-full items-center justify-center gap-2 rounded-md border border-hairline bg-surface px-2.5 py-2 text-center transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas-soft motion-reduce:transition-none ${
                isActive ? "shadow-soft" : ""
              }`
        }
      >
        {TargetIcon ? (
          <TargetIcon
            aria-hidden="true"
            className={
              documentTarget
                ? "h-5 w-5 shrink-0 text-ink-secondary"
                : `h-4 w-4 shrink-0 ${
                    compact
                      ? STORE_ICON_CLASSES[target.id] ?? "text-ink-secondary"
                      : "text-ink-secondary"
                  }`
            }
          />
        ) : null}
        {!documentTarget && !compact && (
          <span
            aria-hidden="true"
            className={`absolute right-2 top-2 h-1.5 w-1.5 rounded-full ${
              TONE_DOT_CLASSES[target.tone]
            }`}
          />
        )}
        <span
          className={`min-w-0 whitespace-nowrap font-medium text-ink ${
            compact ? "text-[0.6875rem]" : "text-caption"
          }`}
        >
          {target.label}
        </span>
      </button>
      {isActive && (
        <div
          className={`absolute top-full z-20 w-56 max-w-[calc(100vw-4rem)] pt-2 ${DETAIL_POSITION_CLASSES[detailPosition]}`}
        >
          <div
            id={detailId}
            role="tooltip"
            className="rounded-md border border-hairline bg-surface p-3 text-center shadow-soft"
          >
            <p className="text-caption font-semibold text-ink">
              {target.title}
            </p>
            <p className="mt-1 break-keep text-caption text-ink-secondary">
              {target.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function PipelineStageNode({
  stage,
  state,
  dispatch,
  detailPosition,
}: {
  stage: PipelineStage;
  state: PipelineState;
  dispatch: Dispatch<PipelineEvent>;
  detailPosition: DetailPosition;
}) {
  const extractorPositions: DetailPosition[] = ["left", "center", "right"];

  return (
    <div className="min-w-0">
      <p className="mb-1 h-4 text-center text-eyebrow text-ink-muted">
        {stage.step}
      </p>
      <PipelineTargetButton
        target={stage}
        state={state}
        dispatch={dispatch}
        detailPosition={detailPosition}
      />
      {stage.extractors && (
        <div className="mt-2" aria-label="문서 형식별 Extractor" role="group">
          <div className="grid grid-cols-3 gap-1.5">
            {stage.extractors.map((extractor, index) => (
              <PipelineTargetButton
                key={extractor.id}
                target={extractor}
                state={state}
                dispatch={dispatch}
                documentTarget
                detailPosition={extractorPositions[index]}
              />
            ))}
          </div>
        </div>
      )}
      {stage.stores && (
        <div
          className="mt-2 flex flex-wrap justify-center gap-1"
          aria-label="연동 저장소"
        >
          {stage.stores.map((store, index) => (
            <PipelineTargetButton
              key={store.id}
              target={store}
              state={state}
              dispatch={dispatch}
              compact
              detailPosition={getPipelineDetailPosition(
                index,
                stage.stores!.length
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function PipelineStageRow({
  stages,
  owned = false,
  flowOffset = 0,
  state,
  dispatch,
}: {
  stages: readonly PipelineStage[];
  owned?: boolean;
  flowOffset?: number;
  state: PipelineState;
  dispatch: Dispatch<PipelineEvent>;
}) {
  return (
    <div
      aria-label={owned ? "직접 담당한 단계" : "연동 단계"}
      className={
        owned
          ? "flex flex-col md:grid md:grid-cols-[minmax(0,1fr)_1.5rem_minmax(0,1fr)_1.5rem_minmax(0,1fr)] md:items-start"
          : "mx-auto flex w-full max-w-md flex-col md:grid md:grid-cols-[minmax(0,1fr)_1.5rem_minmax(0,1fr)] md:items-start"
      }
      role="list"
    >
      {stages.map((stage, index) => (
        <div className="contents" key={stage.id}>
          <div className="min-w-0" role="listitem">
            <PipelineStageNode
              stage={stage}
              state={state}
              dispatch={dispatch}
              detailPosition={
                index === stages.length - 1
                  ? "right"
                  : index === 1
                  ? "center"
                  : "left"
              }
            />
          </div>
          {index < stages.length - 1 && (
            <PipelineConnector
              bidirectional={owned && index === 1}
              flowStep={flowOffset + index}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export function PipelineDiagram() {
  const [state, dispatch] = useReducer(
    reducePipelineState,
    undefined,
    getPipelineState
  );
  const activeId = getActivePipelineItemId(state);

  useEffect(() => {
    if (!activeId) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") dispatch({ type: "close" });
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [activeId]);

  useEffect(() => {
    if (!state.hoveredId) return;

    const clearTransientHover = () => dispatch({ type: "clear-hover" });

    window.addEventListener("scroll", clearTransientHover, true);
    return () =>
      window.removeEventListener("scroll", clearTransientHover, true);
  }, [state.hoveredId]);

  return (
    <section
      aria-labelledby="pipeline-heading"
      onPointerLeave={() => dispatch({ type: "clear-hover" })}
      className="mt-5 rounded-md border border-hairline bg-canvas-soft p-3 sm:p-4"
    >
      <div>
        <h4
          id="pipeline-heading"
          className="w-full text-center text-title text-ink"
        >
          문서 전처리 파이프라인
        </h4>
      </div>
      <div aria-label="문서 전처리 단계" className="mt-4">
        <fieldset
          className="min-w-0 rounded-md border-2 border-dashed
        border-primary px-4 pb-3 pt-2 text-center sm:px-4
        "
        >
          <legend className="px-1 text-eyebrow font-semibold text-ink-secondary">
            개발 영역
          </legend>
          <PipelineStageRow
            stages={pipelineStageGroups.owned}
            owned
            flowOffset={0}
            state={state}
            dispatch={dispatch}
          />
        </fieldset>
        <PipelineDownConnector />
        <PipelineStageRow
          stages={pipelineStageGroups.integrated}
          flowOffset={3}
          state={state}
          dispatch={dispatch}
        />
      </div>
    </section>
  );
}
