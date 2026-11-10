"use client";

import { useMemo, useReducer } from "react";
import type { IconType } from "react-icons";
import {
  FiCalendar,
  FiCpu,
  FiDatabase,
  FiFileText,
  FiLayers,
} from "react-icons/fi";
import { SiElasticsearch, SiMongodb } from "react-icons/si";
import {
  PipelineRun,
  type PipelineRunSelection,
  type PipelineRunStep,
  type PipelineRunTarget,
} from "@/components/portfolio/pipeline-run";
import {
  getActivePipelineItemId,
  getPipelineState,
  pipelineStages,
  reducePipelineState,
  type PipelineItemId,
  type PipelineTarget,
} from "@/lib/pipeline";

const STAGE_ICONS: Partial<Record<PipelineItemId, IconType>> = {
  nifi: FiCalendar,
  "document-extractor": FiFileText,
  preprocessor: FiLayers,
  "index-store": FiDatabase,
  "llm-response": FiCpu,
};

const STORE_ICONS: Partial<Record<PipelineItemId, IconType>> = {
  bm25: SiElasticsearch,
  mongodb: SiMongodb,
};

const STORE_ICON_CLASSES: Partial<Record<PipelineItemId, string>> = {
  bm25: "text-accent-orange",
  mongodb: "text-accent-teal",
};

function toTarget(
  target: PipelineTarget,
  icon: IconType | undefined,
  iconClassName?: string
): PipelineRunTarget {
  return {
    id: target.id,
    label: target.label,
    title: target.title,
    description: target.description,
    icon,
    iconClassName,
  };
}

const RUN_STEPS: PipelineRunStep[] = pipelineStages.map((stage) => {
  const extractors = "extractors" in stage ? stage.extractors : undefined;
  const stores = "stores" in stage ? stage.stores : undefined;

  return {
    ...toTarget(stage, undefined),
    step: stage.step,
    group: stage.group,
    icon: STAGE_ICONS[stage.id] ?? FiFileText,
    children: extractors
      ? {
          label: "문서 형식별 Extractor",
          items: extractors.map((item) => toTarget(item, undefined)),
        }
      : stores
      ? {
          label: "연동 저장소",
          items: stores.map((item) =>
            toTarget(item, STORE_ICONS[item.id], STORE_ICON_CLASSES[item.id])
          ),
        }
      : undefined,
  };
});

// 문서 데이터 추출(02) ↔ 전처리기(03) exchange data in both directions.
const BIDIRECTIONAL_CONNECTORS = [1];

export function PipelineDiagram() {
  const [state, dispatch] = useReducer(
    reducePipelineState,
    undefined,
    getPipelineState
  );

  const selection = useMemo<PipelineRunSelection>(
    () => ({
      activeId: getActivePipelineItemId(state),
      hover: (id) => dispatch({ type: "hover", id: id as PipelineItemId }),
      clearHover: () => dispatch({ type: "clear-hover" }),
      focus: (id) => dispatch({ type: "focus", id: id as PipelineItemId }),
      clearFocus: () => dispatch({ type: "clear-focus" }),
      close: () => dispatch({ type: "close" }),
    }),
    [state]
  );

  return (
    <section aria-labelledby="pipeline-heading" className="mt-6 rounded-xl bg-surface p-4 sm:p-6">
      <h4 id="pipeline-heading" className="text-body-lg font-bold text-ink">
        문서 전처리 파이프라인
      </h4>
      <PipelineRun
        steps={RUN_STEPS}
        ariaLabel="문서 전처리 단계"
        ownedLegendId="document-development-area"
        bidirectionalConnectors={BIDIRECTIONAL_CONNECTORS}
        stackGroups
        selection={selection}
      />
    </section>
  );
}
