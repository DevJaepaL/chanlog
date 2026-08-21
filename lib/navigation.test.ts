import { describe, expect, it } from "vitest";
import { contacts } from "@/lib/profile";
import {
  getActiveNavHref,
  getHeaderActionAttributes,
  getHeaderContacts,
  NAV_ITEMS,
} from "@/lib/navigation";

describe("navigation contracts", () => {
  it("exposes the exact page tabs in order", () => {
    expect(NAV_ITEMS).toEqual([
      { label: "아카이브", href: "/" },
      { label: "포트폴리오", href: "/portfolio" },
    ]);
  });

  it("maps only rendered archive/post/portfolio paths", () => {
    expect(getActiveNavHref("/")).toBe("/");
    expect(getActiveNavHref("/posts")).toBe("/");
    expect(getActiveNavHref("/posts/my-first-post")).toBe("/");
    expect(getActiveNavHref("/portfolio")).toBe("/portfolio");
    expect(getActiveNavHref("/pipeline")).toBeUndefined();
    expect(getActiveNavHref("/missing")).toBeUndefined();
  });

  it("selects Contact then GitHub from shared contacts only", () => {
    expect(getHeaderContacts(contacts)).toEqual([
      contacts.find((contact) => contact.label === "Contact"),
      contacts.find((contact) => contact.label === "GitHub"),
    ]);
  });

  it("gives Contact same-window mail and GitHub safe new-window semantics", () => {
    const [contact, github] = getHeaderContacts(contacts);
    expect(contact.href).toMatch(/^mailto:/);
    expect(getHeaderActionAttributes(contact)).toEqual({});
    expect(github.href).toMatch(/^https:\/\//);
    expect(getHeaderActionAttributes(github)).toEqual({
      target: "_blank",
      rel: "noopener noreferrer",
    });
  });
});
