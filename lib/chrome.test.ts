import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Footer from "@/components/footer";
import { NavbarView } from "@/components/navbar";

const tailwindConfig = require("../tailwind.config.js");

describe("global chrome", () => {
  it("uses the semantic navy chrome token and renders the footer with its inverted semantics", () => {
    const markup = renderToStaticMarkup(createElement(Footer));

    expect(tailwindConfig.theme.extend.colors.chrome).toBe("#172554");
    expect(markup).toContain("bg-chrome");
    expect(markup).toContain("border-white/15");
    expect(markup).toContain("text-white/75");
    expect(markup).toContain("text-white/60");
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
});
