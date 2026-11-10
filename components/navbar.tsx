"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getActiveNavHref, NAV_ITEMS } from "@/lib/navigation";
import { contacts } from "@/lib/profile";

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface";

const NAV_LINK = `inline-flex min-h-11 items-center rounded-md px-3 text-body-sm transition-colors hover:bg-canvas-muted ${FOCUS_RING}`;

export function NavbarView({ pathname }: { pathname: string | null }) {
  const activeHref = getActiveNavHref(pathname);
  const contact = contacts.find(({ label }) => label === "Contact");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-hairline bg-surface/95 backdrop-blur">
      <nav
        aria-label="주 내비게이션"
        className="mx-auto flex h-[3.75rem] w-full max-w-5xl items-center gap-1 px-5 sm:px-6"
      >
        <Link
          href="/"
          className={`mr-auto inline-flex min-h-11 items-center rounded-md text-title font-bold text-ink ${FOCUS_RING}`}
        >
          CHANLOG
        </Link>
        <ul className="flex items-center gap-1">
          {NAV_ITEMS.map(({ label, href }) => (
            <li key={href}>
              <Link
                href={href}
                aria-current={activeHref === href ? "page" : undefined}
                className={`${NAV_LINK} ${
                  activeHref === href
                    ? "font-bold text-ink"
                    : "font-medium text-ink-tertiary"
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
          {contact && (
            <li>
              <a
                href={contact.href}
                className={`${NAV_LINK} font-medium text-ink-tertiary`}
              >
                {contact.label}
              </a>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}

function Navbar() {
  return <NavbarView pathname={usePathname()} />;
}

export default Navbar;
