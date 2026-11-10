import {
  ABOUT_LIST,
  ITEM_BODY,
  ITEM_BULLETS,
  ITEM_LABEL,
  ITEM_META,
  ITEM_TITLE,
} from "@/components/home/about-styles";
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

const LABEL = `mb-2 mt-5 ${ITEM_LABEL}`;

export function ProjectList() {
  return (
    <Section
      id="projects"
      eyebrow="Projects"
      title="진행한 프로젝트"
      wide
      collapsible
      defaultOpen={false}
    >
      <ProjectAccordionGroup>
        <div className="-mt-3 mb-2 flex justify-end">
          <ExpandAllButton />
        </div>
        <div className={ABOUT_LIST}>
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
                        className={ITEM_TITLE}
                      >
                        {project.title}
                      </h3>
                      <p className={ITEM_META}>
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
              <h4 className={`mb-2 ${ITEM_LABEL}`}>역할</h4>
              <p className={ITEM_BODY}>
                {project.role}
              </p>
              <h4 className={LABEL}>담당 업무</h4>
              <ul className={ITEM_BULLETS}>
                {project.experience.map((item) => (
                  <li key={item} className={ITEM_BODY}>
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
