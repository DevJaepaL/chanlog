import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Footer from "@/components/footer";
import { NavbarView } from "@/components/navbar";
import { Section } from "@/components/ui/section";
import { contacts } from "@/lib/profile";

describe("global chrome", () => {
  it("keeps every contact available in the footer with visible keyboard focus", () => {
    const markup = renderToStaticMarkup(createElement(Footer));
    for (const contact of contacts) {
      expect(markup).toContain(contact.href);
      expect(markup).toContain(contact.label);
    }
    expect(markup).toContain("focus-visible:ring-primary");
    expect(markup.match(/min-h-11/g)).toHaveLength(contacts.length);
  });

  it.each(["/", "/posts/example", "/portfolio"])("marks the active navigation link for %s", (pathname) => {
    const markup = renderToStaticMarkup(createElement(NavbarView, { pathname }));
    expect(markup).toContain('aria-label="주 내비게이션"');
    expect(markup).toMatch(new RegExp(`aria-current="page"[^>]*href="${pathname === "/portfolio" ? "/portfolio" : "/"}"`));
    expect(markup).toContain("focus-visible:ring-primary");
    expect(markup).toContain("min-h-11");
    expect(markup).toContain("About");
    expect(markup).not.toContain("text-[0.6875rem]");
  });

  it("keeps the header to 아카이브, About and a plain Contact link", () => {
    const markup = renderToStaticMarkup(createElement(NavbarView, { pathname: "/" }));
    const contact = contacts.find(({ label }) => label === "Contact")!;
    const links = [...markup.matchAll(/<a[^>]*>([^<]+)<\/a>/g)].map(([, text]) => text);

    expect(links).toEqual(["CHANLOG", "아카이브", "About", "Contact"]);
    expect(markup).toMatch(
      new RegExp(`<a[^>]*href="${contact.href}"[^>]*class="[^"]*font-medium text-ink-tertiary`)
    );
    expect(markup).not.toContain("bg-primary");
    expect(markup).not.toContain("GitHub");
    expect(markup).not.toContain("Instagram");
  });

  it("renders section title, content, and anchor with the allowed fade-up entry", () => {
    const markup = renderToStaticMarkup(createElement(Section, {
      id: "test-section", eyebrow: "Test", title: "제목", children: "내용", wide: true,
    }));
    expect(markup).toContain('id="test-section"');
    expect(markup).toContain("제목");
    expect(markup).toContain("내용");
    expect(markup).toContain("opacity:0");
  });
});
