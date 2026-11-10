"use client";

import { useMemo, useReducer } from "react";
import type { IconType } from "react-icons";
import {
  FiClock,
  FiDownload,
  FiServer,
  FiType,
  FiUploadCloud,
} from "react-icons/fi";
import {
  PipelineRun,
  type PipelineRunSelection,
  type PipelineRunStep,
} from "@/components/portfolio/pipeline-run";
import {
  getActiveRpaPipelineItemId,
  getRpaPipelineState,
  reduceRpaPipelineState,
  rpaPipelineStages,
  type RpaPipelineItemId,
} from "@/lib/rpa-pipeline";

const STAGE_ICONS: Record<RpaPipelineItemId, IconType> = {
  "bpr-server": FiServer,
  "java-scheduler": FiClock,
  "image-download": FiDownload,
  "rpa-cloud": FiUploadCloud,
  "ocr-msa": FiType,
};

const RUN_STEPS: PipelineRunStep[] = rpaPipelineStages.map((stage) => ({
  id: stage.id,
  step: stage.step,
  group: stage.group,
  label: stage.label,
  title: stage.title,
  description: stage.description,
  icon: STAGE_ICONS[stage.id],
}));

export function RpaPipelineFlow() {
  const [state, dispatch] = useReducer(
    reduceRpaPipelineState,
    getRpaPipelineState()
  );

  const selection = useMemo<PipelineRunSelection>(
    () => ({
      activeId: getActiveRpaPipelineItemId(state),
      hover: (id) => dispatch({ type: "hover", id: id as RpaPipelineItemId }),
      clearHover: () => dispatch({ type: "clear-hover" }),
      focus: (id) => dispatch({ type: "focus", id: id as RpaPipelineItemId }),
      clearFocus: () => dispatch({ type: "clear-focus" }),
      close: () => dispatch({ type: "close" }),
    }),
    [state]
  );

  return (
    <PipelineRun
      steps={RUN_STEPS}
      ariaLabel="RPA 이미지 처리 흐름"
      ownedLegendId="rpa-development-area"
      selection={selection}
    />
  );
}

export function RpaPipelineDisclosure() {
  return (
    <section
      id="rpa-pipeline-panel"
      className="mt-6 scroll-mt-32 rounded-xl bg-surface p-4 sm:p-6"
      aria-labelledby="rpa-pipeline-heading"
    >
      <h4
        id="rpa-pipeline-heading"
        className="text-body-lg font-bold text-ink"
      >
        RPA 이미지 처리 파이프라인
      </h4>
      <RpaPipelineFlow />
    </section>
  );
}
