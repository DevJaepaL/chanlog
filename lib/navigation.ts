import type { ContactLink } from "@/lib/profile";

export const NAV_ITEMS = [
  { label: "아카이브", href: "/" },
  { label: "About", href: "/portfolio" },
] as const;

const HEADER_CONTACT_LABELS = ["Contact", "GitHub"] as const;

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

export function getHeaderContacts(
  contacts: readonly ContactLink[]
): ContactLink[] {
  return HEADER_CONTACT_LABELS.flatMap((label) =>
    contacts.filter((contact) => contact.label === label)
  );
}

export function getHeaderActionAttributes(contact: Pick<ContactLink, "label">) {
  return contact.label === "GitHub"
    ? { target: "_blank" as const, rel: "noopener noreferrer" as const }
    : {};
}
