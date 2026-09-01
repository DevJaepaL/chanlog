import { DocumentPreprocessorDemo } from "@/components/portfolio/document-preprocessor-demo";
import { PipelineDiagram } from "@/components/portfolio/pipeline-diagram";
import { documentPreprocessorDemo } from "@/lib/document-preprocessor";

export function DocumentPreprocessorDetail() {
  return (
    <div
      id={documentPreprocessorDemo.sectionId}
      className="mt-4 border-t border-hairline pt-4"
    >
      <div className="flex flex-wrap items-start gap-4">
        <div className="min-w-0 flex-1">
          <h4 className="break-keep text-heading-3 text-ink">
            {documentPreprocessorDemo.title}
          </h4>
          <p className="mt-2 break-keep text-body-sm text-ink-secondary">
            {documentPreprocessorDemo.description}
          </p>
          <p className="mt-3 break-keep text-body-sm text-ink-secondary">
            {documentPreprocessorDemo.contribution}
          </p>
        </div>
        <DocumentPreprocessorDemo />
      </div>
      <PipelineDiagram />
    </div>
  );
}
