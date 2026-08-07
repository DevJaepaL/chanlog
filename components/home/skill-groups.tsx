import { Chip } from "@/components/ui/chip";
import { Section } from "@/components/ui/section";
import { skillGroups } from "@/lib/profile";

export function SkillGroups() {
  return (
    <Section id="skills" eyebrow="Skills" title="기술 스택">
      <div className="flex flex-col gap-6">
        {skillGroups.map((group) => (
          <div key={group.category} className="flex flex-col gap-2">
            <p className="text-eyebrow uppercase text-ink-faint">
              {group.category}
            </p>
            <div className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <Chip key={item} accent={group.accent}>
                  {item}
                </Chip>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
