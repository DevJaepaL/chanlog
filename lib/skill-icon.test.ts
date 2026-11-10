import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ProjectList } from "@/components/home/project-list";
import { SkillGroups } from "@/components/home/skill-groups";
import { skillIcon } from "@/components/ui/skill-icon";
import { projects, skillGroups } from "@/lib/profile";

const allSkills = [
  ...new Set([
    ...projects.flatMap((project) => project.skills),
    ...skillGroups.flatMap((group) => group.items),
  ]),
];

describe("skill icons", () => {
  it("has a logo or icon for every skill listed in the profile", () => {
    expect(allSkills.filter((skill) => skillIcon(skill) === undefined)).toEqual(
      []
    );
  });

  it("renders a decorative icon in place of the colour dot on every chip", () => {
    const markup = renderToStaticMarkup(
      createElement("main", null, createElement(ProjectList), createElement(SkillGroups))
    );

    for (const skill of allSkills) {
      expect(markup).toContain(`data-skill-icon="${skill}"`);
    }
    expect(markup).not.toMatch(/<span class="h-2 w-2 rounded-full bg-accent-/);
    expect(markup).toMatch(/<svg[^>]*aria-hidden="true"[^>]*data-skill-icon=/);
  });
});
