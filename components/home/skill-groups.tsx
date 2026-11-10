import { Chip } from "@/components/ui/chip";
import { skillIcon } from "@/components/ui/skill-icon";
import { Section } from "@/components/ui/section";
import { skillGroups } from "@/lib/profile";

export function SkillGroups() {
  return (
    <Section id="skills" eyebrow="Skills" title="기술 스택" wide collapsible>
      <div className="flex flex-col">
        {skillGroups.map((group, index) => (
          <div
            key={group.category}
            className={`grid grid-cols-1 gap-x-4 gap-y-2 py-3.5 sm:grid-cols-[9rem_minmax(0,1fr)] sm:items-center ${
              index === 0 ? "pt-0" : "border-t border-hairline"
            }`}
          >
            <p className="text-caption font-semibold text-ink-faint">
              {group.category}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {group.items.map((item) => (
                <Chip
                  key={item}
                  accent={group.accent}
                  icon={skillIcon(item)}
                  tone="soft"
                >
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
