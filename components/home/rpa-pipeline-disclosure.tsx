"use client";

import {
  useEffect,
  useReducer,
  type CSSProperties,
  type Dispatch,
} from "react";
import {
  getActiveRpaPipelineItemId,
  getRpaPipelineState,
  reduceRpaPipelineState,
  rpaPipelineGroups,
  type RpaPipelineEvent,
  type RpaPipelineStage,
  type RpaPipelineState,
} from "@/lib/rpa-pipeline";

const TONE_CLASSES = {
  orange: "bg-accent-orange",
  teal: "bg-accent-teal",
  sky: "bg-accent-sky",
  purple: "bg-accent-purple",
  pink: "bg-accent-pink",
} as const;

const DETAIL_POSITION_CLASSES = {
  left: "left-0",
  center: "left-1/2 -translate-x-1/2",
  right: "right-0",
} as const;

function Connector({
  outer = false,
  flowStep,
}: {
  outer?: boolean;
  flowStep: number;
}) {
  const flowDelay = `${flowStep * 120}ms`;
  const flowStyle = { "--flow-delay": flowDelay } as CSSProperties;

  return (
    <div
      aria-hidden="true"
      data-flow-step={flowStep}
      data-flow-delay={flowDelay}
      className={`flex h-7 items-center justify-center text-ink-secondary md:h-4 md:w-6 md:shrink-0 ${
        outer ? "md:mt-[58px]" : "md:mt-9"
      }`}
    >
      <svg
        viewBox="0 0 16 32"
        className="h-7 w-4 md:hidden"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M8 2v22m-5-5 5 5 5-5" />
        <path
          d="M8 2v22"
          className="pipeline-flow-path stroke-primary"
          style={flowStyle}
        />
      </svg>
      <svg
        viewBox="0 0 32 16"
        className="hidden h-4 w-6 md:block"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 8h22m-5-5 5 5-5 5" />
        <path
          d="M2 8h22"
          className="pipeline-flow-path stroke-primary"
          style={flowStyle}
        />
      </svg>
    </div>
  );
}

function RpaPipelineNode({
  stage,
  state,
  dispatch,
  detailPosition,
}: {
  stage: RpaPipelineStage;
  state: RpaPipelineState;
  dispatch: Dispatch<RpaPipelineEvent>;
  detailPosition: keyof typeof DETAIL_POSITION_CLASSES;
}) {
  const activeId = getActiveRpaPipelineItemId(state);
  const isActive = activeId === stage.id;
  const detailId = `rpa-pipeline-detail-${stage.id}`;

  return (
    <div
      className="relative min-w-0"
      onPointerEnter={() => dispatch({ type: "hover", id: stage.id })}
      onPointerLeave={() => dispatch({ type: "clear-hover" })}
    >
      <p className="mb-1 h-4 text-center text-eyebrow text-ink-muted">
        {stage.step}
      </p>
      <button
        type="button"
        aria-describedby={isActive ? detailId : undefined}
        onFocus={(event) => {
          if (event.currentTarget.matches(":focus-visible")) {
            dispatch({ type: "focus", id: stage.id });
          }
        }}
        onBlur={() => dispatch({ type: "clear-focus" })}
        className="relative flex h-12 w-full items-center justify-center whitespace-nowrap rounded-md border border-hairline bg-surface px-2 py-2 text-center text-caption font-medium text-ink transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas-soft motion-reduce:transition-none"
      >
        <span
          aria-hidden="true"
          className={`absolute right-2 top-2 h-1.5 w-1.5 rounded-full ${
            TONE_CLASSES[stage.tone]
          }`}
        />
        {stage.label}
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
            <p className="text-caption font-semibold text-ink">{stage.title}</p>
            <p className="mt-1 break-keep text-caption text-ink-secondary">
              {stage.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export function RpaPipelineFlow() {
  const [state, dispatch] = useReducer(
    reduceRpaPipelineState,
    getRpaPipelineState()
  );
  const activeId = getActiveRpaPipelineItemId(state);

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

  const external = rpaPipelineGroups.external[0];
  const integrated = rpaPipelineGroups.integrated[0];

  return (
    <div
      aria-label="RPA 이미지 처리 흐름"
      className="mt-3"
      onPointerLeave={() => dispatch({ type: "clear-hover" })}
    >
      <div className="grid w-full grid-cols-1 items-start md:grid-cols-[minmax(0,0.9fr)_1.5rem_minmax(0,3.4fr)_1.5rem_minmax(0,0.9fr)] md:gap-x-1">
        <div className="min-w-0 md:pt-[22px]">
          <RpaPipelineNode
            stage={external}
            state={state}
            dispatch={dispatch}
            detailPosition="left"
          />
        </div>
        <Connector outer flowStep={0} />
        <fieldset
          aria-labelledby="rpa-development-area"
          className="relative min-w-0 rounded-md border-2 border-dashed border-indigo-500 px-1 pb-2 pt-6 md:pt-5"
        >
          <legend id="rpa-development-area" className="sr-only">
            개발 영역
          </legend>
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-1 -translate-x-1/2 bg-surface px-1 text-center text-caption font-semibold leading-4 text-ink-secondary"
          >
            개발 영역
          </span>
          <div className="grid grid-cols-1 items-start md:grid-cols-[minmax(0,1fr)_1.5rem_minmax(0,1fr)_1.5rem_minmax(0,1fr)] md:gap-x-1">
            {rpaPipelineGroups.owned.map((stage, index) => (
              <div key={stage.id} className="contents">
                {index > 0 && <Connector flowStep={index} />}
                <div className="min-w-0">
                  <RpaPipelineNode
                    stage={stage}
                    state={state}
                    dispatch={dispatch}
                    detailPosition={
                      index === 0 ? "left" : index === 2 ? "right" : "center"
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </fieldset>
        <Connector outer flowStep={3} />
        <div className="min-w-0 md:pt-[22px]">
          <RpaPipelineNode
            stage={integrated}
            state={state}
            dispatch={dispatch}
            detailPosition="right"
          />
        </div>
      </div>
    </div>
  );
}

export function RpaPipelineDisclosure() {
  return (
    <section
      id="rpa-pipeline-panel"
      className="mt-3 border-t border-hairline pt-3"
      aria-labelledby="rpa-pipeline-heading"
    >
      <h4
        id="rpa-pipeline-heading"
        className="text-center text-body-sm font-semibold text-ink"
      >
        RPA 이미지 처리 파이프라인
      </h4>
      <RpaPipelineFlow />
    </section>
  );
}
