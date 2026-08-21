import { DocumentPreprocessorDemo } from "@/components/portfolio/document-preprocessor-demo";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { documentPreprocessorDemo } from "@/lib/document-preprocessor";

export function DocumentPreprocessorSection() {
  return (
    <Section
      id={documentPreprocessorDemo.sectionId}
      eyebrow="Document Parsing"
      wide
    >
      <Card>
        <div className="flex flex-wrap items-start gap-4">
          <div className="min-w-0 flex-1">
            <h2 className="break-keep text-heading-3 text-ink">
              {documentPreprocessorDemo.title}
            </h2>
            <p className="mt-2 break-keep text-body-sm text-ink-secondary">
              {documentPreprocessorDemo.description}
            </p>
          </div>
          <DocumentPreprocessorDemo />
        </div>
      </Card>
    </Section>
  );
}
