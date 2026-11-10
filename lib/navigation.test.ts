import { describe, expect, it } from "vitest";
import { contacts } from "@/lib/profile";
import {
  getActiveNavHref,
  getContactLinkAttributes,
  getProfileContacts,
  NAV_ITEMS,
} from "@/lib/navigation";

describe("navigation contracts", () => {
  it("exposes the exact page tabs in order", () => {
    expect(NAV_ITEMS).toEqual([
      { label: "아카이브", href: "/" },
      { label: "About", href: "/portfolio" },
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

  it("orders profile contacts GitHub, Instagram, then Contact from shared contacts only", () => {
    expect(getProfileContacts(contacts)).toEqual([
      contacts.find((contact) => contact.label === "GitHub"),
      contacts.find((contact) => contact.label === "Instagram"),
      contacts.find((contact) => contact.label === "Contact"),
    ]);
  });

  it("gives Contact same-window mail and external links safe new-window semantics", () => {
    const external = getProfileContacts(contacts).slice(0, 2);
    const contact = getProfileContacts(contacts)[2];
    expect(contact.href).toMatch(/^mailto:/);
    expect(getContactLinkAttributes(contact)).toEqual({});
    expect(external).toHaveLength(2);
    for (const link of external) {
      expect(link.href).toMatch(/^https:\/\//);
      expect(getContactLinkAttributes(link)).toEqual({
        target: "_blank",
        rel: "noopener noreferrer",
      });
    }
  });
});
