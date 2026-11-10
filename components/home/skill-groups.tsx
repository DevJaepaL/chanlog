import {
  ABOUT_CARD,
  ABOUT_CARD_PADDING,
  ITEM_LABEL,
} from "@/components/home/about-styles";
import { Chip } from "@/components/ui/chip";
import { skillIcon } from "@/components/ui/skill-icon";
import { Section } from "@/components/ui/section";
import { skillGroups } from "@/lib/profile";

export function SkillGroups() {
  return (
    <Section
      id="skills"
      eyebrow="Skills"
      title="기술 스택"
      wide
      collapsible
      defaultOpen={false}
    >
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
        {skillGroups.map((group) => (
          <div key={group.category} className={`${ABOUT_CARD} ${ABOUT_CARD_PADDING}`}>
            <p className={`mb-3 ${ITEM_LABEL}`}>{group.category}</p>
            <div className="flex flex-wrap gap-1.5">
              {group.items.map((item) => (
                <Chip key={item} accent={group.accent} icon={skillIcon(item)} compact>
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
