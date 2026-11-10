import { DocumentPreprocessorDemo } from "@/components/portfolio/document-preprocessor-demo";
import { documentPreprocessorDemo } from "@/lib/document-preprocessor";

export function DocumentPreprocessorDetail() {
  return (
    <div
      id={documentPreprocessorDemo.sectionId}
      className="mt-6 scroll-mt-32 rounded-xl bg-surface p-4 sm:p-6"
    >
      <div className="flex flex-wrap items-start gap-4">
        <div className="min-w-0 flex-1">
          <h4 className="break-keep text-body-lg font-bold text-ink">
            {documentPreprocessorDemo.title}
          </h4>
          <p className="mt-1.5 break-keep text-body-sm text-ink-muted">
            {documentPreprocessorDemo.description}
          </p>
          <p className="mt-1 break-keep text-body-sm text-ink-muted">
            {documentPreprocessorDemo.contribution}
          </p>
        </div>
        <DocumentPreprocessorDemo />
      </div>
    </div>
  );
}
