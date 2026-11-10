import type { ContactLink } from "@/lib/profile";

export const NAV_ITEMS = [
  { label: "아카이브", href: "/" },
  { label: "About", href: "/portfolio" },
] as const;

const PROFILE_CONTACT_LABELS = ["GitHub", "Instagram", "Contact"] as const;

export function getActiveNavHref(
  pathname: string | null
): "/" | "/portfolio" | undefined {
  if (
    pathname === "/" ||
    pathname === "/posts" ||
    pathname?.startsWith("/posts/")
  ) {
    return "/";
  }
  if (pathname === "/portfolio") return "/portfolio";
  return undefined;
}

export function getProfileContacts(
  contacts: readonly ContactLink[]
): ContactLink[] {
  return PROFILE_CONTACT_LABELS.flatMap((label) =>
    contacts.filter((contact) => contact.label === label)
  );
}

export function getContactLinkAttributes(contact: Pick<ContactLink, "label">) {
  return contact.label === "Contact"
    ? {}
    : { target: "_blank" as const, rel: "noopener noreferrer" as const };
}
