import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { ProfileCard } from "@/components/home/profile-card";
import { contacts, profile } from "@/lib/profile";

vi.mock("@/lib/images/profile_2-avatar.jpg", () => ({
  default: { src: "/avatar.jpg", width: 80, height: 80, blurDataURL: "data:image/jpeg;base64,AA==" },
}));

describe("home profile card", () => {
  it("shows the About profile identity, every header contact, and a link to About", () => {
    const markup = renderToStaticMarkup(createElement(ProfileCard));

    expect(markup).toContain(profile.name);
    expect(markup).toContain(profile.nameEn);
    expect(markup).toContain(profile.role.replace("&", "&amp;"));
    const hrefs = ["GitHub", "Instagram", "Contact"].map(
      (label) => contacts.find((item) => item.label === label)!.href
    );
    const positions = hrefs.map((href) => markup.indexOf(`href="${href}"`));
    expect(positions.every((position) => position >= 0)).toBe(true);
    expect([...positions].sort((a, b) => a - b)).toEqual(positions);
    expect(markup).toMatch(/<a[^>]*href="\/portfolio"[^>]*>About →<\/a>/);
  });
});
