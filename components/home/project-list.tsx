import { Chip } from "@/components/ui/chip";
import {
  ExpandAllButton,
  ProjectAccordionGroup,
  ProjectAccordionItem,
} from "@/components/home/project-accordion";
import { skillIcon } from "@/components/ui/skill-icon";
import { ProjectGallery } from "@/components/home/project-gallery";
import { RpaPipelineDisclosure } from "@/components/home/rpa-pipeline-disclosure";
import { DocumentPreprocessorDetail } from "@/components/portfolio/document-preprocessor-section";
import { PipelineDiagram } from "@/components/portfolio/pipeline-diagram";
import { Section } from "@/components/ui/section";
import { projects } from "@/lib/profile";
import { projectSkillAccent } from "@/lib/accent";

const LABEL = "mb-2 mt-5 text-caption font-semibold text-ink-faint";

export function ProjectList() {
  return (
    <Section
      id="projects"
      eyebrow="Projects"
      title="진행한 프로젝트"
      wide
      collapsible
    >
      <ProjectAccordionGroup>
        <div className="-mt-3 mb-2 flex justify-end">
          <ExpandAllButton />
        </div>
        <div className="flex flex-col gap-4">
          {projects.map((project, index) => (
            <ProjectAccordionItem
              key={project.title}
              index={index}
              summary={
                <>
                  <div className="flex min-w-0 flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-5">
                    {project.logo && (
                      <div className="flex h-16 w-24 shrink-0 items-center justify-center rounded-xl bg-surface p-2.5 sm:w-28">
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
                      <h3
                        id={`project-${index}-title`}
                        className="break-keep text-title font-bold text-ink sm:text-section"
                      >
                        {project.title}
                      </h3>
                      <p className="mt-1 text-body-sm text-ink-muted">
                        {project.org}
                        {project.client ? ` · ${project.client}` : ""} |{" "}
                        {project.period}
                      </p>
                    </div>
                  </div>
                  <h4 className={LABEL}>사용 기술</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {project.skills.map((skill) => (
                      <Chip
                        key={skill}
                        accent={projectSkillAccent(skill)}
                        icon={skillIcon(skill)}
                        compact
                      >
                        {skill}
                      </Chip>
                    ))}
                  </div>
                </>
              }
            >
              <h4 className="mb-2 text-caption font-semibold text-ink-faint">역할</h4>
              <p className="break-keep text-body-md text-ink-secondary sm:text-body-lg">
                {project.role}
              </p>
              <h4 className={LABEL}>담당 업무</h4>
              <ul className="list-outside list-disc space-y-1 pl-5 marker:text-ink-faint">
                {project.experience.map((item) => (
                  <li
                    key={item}
                    className="break-keep text-body-md text-ink-tertiary"
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
              {project.detail === "document-pipeline" && <PipelineDiagram />}
            </ProjectAccordionItem>
          ))}
        </div>
      </ProjectAccordionGroup>
    </Section>
  );
}
