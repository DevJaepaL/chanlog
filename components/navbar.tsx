"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  getActiveNavHref,
  getHeaderActionAttributes,
  getHeaderContacts,
  NAV_ITEMS,
} from "@/lib/navigation";
import { contacts } from "@/lib/profile";

function Navbar() {
  const activeHref = getActiveNavHref(usePathname());

  return (
    <header className="sticky top-0 z-50 w-full border-b border-hairline bg-canvas/90 backdrop-blur">
      <nav
        aria-label="주 내비게이션"
        className="mx-auto flex w-full max-w-5xl flex-wrap items-center px-6 sm:h-16 sm:flex-nowrap"
      >
        <Link
          href="/"
          className="inline-flex min-h-11 items-center pr-3 text-title text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
        >
          CHANLOG
        </Link>
        <ul className="order-3 flex basis-full items-center gap-1 sm:order-2 sm:ml-auto sm:basis-auto">
          {NAV_ITEMS.map(({ label, href }) => (
            <li key={href}>
              <Link
                href={href}
                aria-current={activeHref === href ? "page" : undefined}
                className={`inline-flex min-h-11 items-center px-2 text-body-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas ${
                  activeHref === href
                    ? "font-semibold text-primary"
                    : "text-ink-secondary hover:text-ink"
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <span
          aria-hidden="true"
          className="order-3 hidden h-5 w-px bg-hairline sm:mx-3 sm:block"
        />
        <ul className="ml-auto flex min-h-11 items-center gap-1 sm:order-4 sm:ml-0">
          {getHeaderContacts(contacts).map((contact) => (
            <li key={contact.label}>
              <a
                href={contact.href}
                {...getHeaderActionAttributes(contact)}
                className="inline-flex min-h-11 items-center px-2 text-body-sm text-ink-secondary transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
              >
                {contact.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;
