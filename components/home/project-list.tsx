import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { projects } from "@/lib/profile";

export function ProjectList() {
  return (
    <Section id="projects" eyebrow="Projects" title="주요 프로젝트">
      <div className="flex flex-col gap-4">
        {projects.map((project) => (
          <Card key={project.title}>
            <div className="flex flex-col gap-1">
              <h3 className="break-keep text-heading-3 text-ink">
                {project.title}
              </h3>
              <p className="text-caption text-ink-muted">
                {project.org}
                {project.client ? ` · ${project.client}` : ""} | {project.period}
              </p>
            </div>
            <p className="mt-3 break-keep text-body-sm text-ink-secondary">
              <span className="text-ink-muted">주요 역할</span> {project.role}
            </p>
            <ul className="mt-2 flex flex-col gap-1">
              {project.experience.map((item) => (
                <li
                  key={item}
                  className="break-keep text-body-sm text-ink-secondary before:mr-2 before:text-ink-faint before:content-['—']"
                >
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </Section>
  );
}
