import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Footer from "@/components/footer";
import { Hero } from "@/components/home/hero";
import { NavbarView } from "@/components/navbar";
import { Section } from "@/components/ui/section";

const tailwindConfig = require("../tailwind.config.js");

describe("global chrome", () => {
  it("uses the semantic navy chrome token and renders the footer with its inverted semantics", () => {
    const markup = renderToStaticMarkup(createElement(Footer));

    expect(tailwindConfig.theme.extend.colors.chrome).toBe("#172554");
    expect(markup).toContain("bg-chrome");
    expect(markup).toContain("border-white/15");
    expect(markup).toContain("text-white/75");
    expect(markup).toContain("text-white/60");
    expect(markup).toContain("gap-2");
    expect(markup).toContain("py-3");
    expect(markup).not.toContain("gap-4");
    expect(markup).not.toContain("py-10");
    expect(markup.match(/min-h-11/g)).toHaveLength(3);
  });

  it("renders navigation with chrome contrast, active state, and visible keyboard focus", () => {
    const markup = renderToStaticMarkup(
      createElement(NavbarView, { pathname: "/posts" })
    );

    expect(markup).toContain("bg-chrome");
    expect(markup).toContain("font-semibold text-white");
    expect(markup).toContain("text-white/75 hover:text-white");
    expect(markup).toContain(
      "focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-chrome"
    );
  });

  it("keeps the complete mobile navigation in one compact, non-wrapping row", () => {
    const markup = renderToStaticMarkup(
      createElement(NavbarView, { pathname: "/posts" })
    );

    expect(markup).toContain("h-14");
    expect(markup).toContain("flex-nowrap");
    expect(markup).toContain("px-3 sm:h-16 sm:px-6");
    expect(markup).toContain("whitespace-nowrap");
    expect(markup).toContain("text-[0.6875rem]");
    expect(markup).toContain("px-1");
    expect(markup).toContain("min-h-11");
    expect(markup).not.toContain("flex-wrap");
    expect(markup).not.toContain("basis-full");
    expect(markup).toMatch(
      /<ul class="(?=[^"]*ml-auto)(?=[^"]*flex)(?=[^"]*shrink-0)[^"]*">/
    );
    expect(markup).toMatch(
      /About<\/a><\/li><\/ul><span aria-hidden="true" class="(?=[^"]*block)(?=[^"]*mx-1)(?=[^"]*shrink-0)[^"]*"[^>]*><\/span><ul[^>]*>[\s\S]*?Contact/
    );
    expect(markup).not.toContain("hidden h-5");
    expect(markup).not.toMatch(/(?:^|[\s:])order-/);
  });

  it("uses compact shared section and hero vertical spacing", () => {
    const sectionMarkup = renderToStaticMarkup(
      createElement(Section, {
        eyebrow: "Test",
        title: "제목",
        children: "내용",
      })
    );
    const hero = Hero();

    expect(sectionMarkup).toContain("px-6 py-10 sm:py-12");
    expect(sectionMarkup).toContain("mb-6 text-heading-2");
    expect(sectionMarkup).not.toContain("py-16 sm:py-20");
    expect(hero.props.className).toContain("px-6 py-16 sm:py-20");
    expect(hero.props.className).not.toContain("py-20 sm:py-28");
  });
});
