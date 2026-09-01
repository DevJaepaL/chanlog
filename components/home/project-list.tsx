import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { ProjectGallery } from "@/components/home/project-gallery";
import { RpaPipelineDisclosure } from "@/components/home/rpa-pipeline-disclosure";
import { DocumentPreprocessorDetail } from "@/components/portfolio/document-preprocessor-section";
import { Section } from "@/components/ui/section";
import { projects } from "@/lib/profile";
import { projectSkillAccent } from "@/lib/accent";

export function ProjectList() {
  return (
    <Section id="projects" eyebrow="Projects" title="진행한 프로젝트">
      <div className="flex flex-col gap-4">
        {projects.map((project) => (
          <Card key={project.title}>
            <div className="flex min-w-0 items-start gap-3 sm:gap-4">
              {project.logo && (
                <div className="flex h-12 w-20 shrink-0 items-center justify-center p-2 sm:h-14 sm:w-24">
                  <img
                    src={project.logo.src}
                    alt={project.logo.alt}
                    width={project.logo.width}
                    height={project.logo.height}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h3 className="break-keep text-heading-3 text-ink">
                  {project.title}
                </h3>
                <p className="mt-1 text-caption text-ink-muted">
                  {project.org}
                  {project.client ? ` · ${project.client}` : ""} |{" "}
                  {project.period}
                </p>
              </div>
            </div>
            <h4 className="mt-3 text-eyebrow text-ink-muted">사용 기술</h4>
            <div className="mt-1 flex flex-wrap gap-1">
              {project.skills.map((skill) => (
                <Chip key={skill} accent={projectSkillAccent(skill)} compact>
                  {skill}
                </Chip>
              ))}
            </div>
            <h4 className="mt-3 text-eyebrow text-ink-muted">역할</h4>
            <p className="mt-1 break-keep text-body-sm text-ink-secondary">
              {project.role}
            </p>
            <h4 className="mt-3 text-eyebrow text-ink-muted">담당 업무</h4>
            <ul className="mt-1 list-outside list-disc space-y-1 pl-5 marker:text-ink-faint">
              {project.experience.map((item) => (
                <li
                  key={item}
                  className="break-keep text-body-sm text-ink-secondary"
                >
                  {item}
                </li>
              ))}
            </ul>
            {project.previews && <ProjectGallery previews={project.previews} />}
            {project.detail === "rpa-ocr-pipeline" && <RpaPipelineDisclosure />}
            {project.detail === "document-preprocessor-pipeline" && (
              <DocumentPreprocessorDetail />
            )}
          </Card>
        ))}
      </div>
    </Section>
  );
}
