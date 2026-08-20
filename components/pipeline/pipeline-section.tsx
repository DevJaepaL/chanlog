import { Section } from "@/components/ui/section";
import { ChunkingView } from "@/components/pipeline/chunking-view";
import { ExtractionCompare } from "@/components/pipeline/extraction-compare";
import { IndexView } from "@/components/pipeline/index-view";
import { PipelineFlow } from "@/components/pipeline/pipeline-flow";
import { demoDocuments, pipelineStages } from "@/lib/pipeline";

export function PipelineSection() {
  return (
    <Section
      id="pipeline"
      eyebrow="Document Pipeline"
      title="문서 전처리 파이프라인 — 이렇게 설계합니다"
      wide
    >
      <div className="flex flex-col gap-12">
        <div className="flex flex-col gap-4">
          <h3 className="text-heading-3 text-ink">파이프라인 개요</h3>
          <PipelineFlow stages={pipelineStages} />
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-heading-3 text-ink">계층 인식 청킹</h3>
          <ChunkingView documents={demoDocuments} />
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-heading-3 text-ink">이중 색인</h3>
          <IndexView />
        </div>

        <ExtractionCompare />
      </div>
    </Section>
  );
}
