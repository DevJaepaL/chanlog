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

export function NavbarView({ pathname }: { pathname: string | null }) {
  const activeHref = getActiveNavHref(pathname);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/15 bg-chrome">
      <nav
        aria-label="주 내비게이션"
        className="mx-auto flex h-14 w-full max-w-5xl flex-nowrap items-center px-3 sm:h-16 sm:px-6"
      >
        <Link
          href="/"
          className="inline-flex min-h-11 shrink-0 items-center pr-1 text-[0.6875rem] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-chrome sm:pr-3 sm:text-title"
        >
          CHANLOG
        </Link>
        <ul className="ml-auto flex shrink-0 items-center gap-0 sm:gap-1">
          {NAV_ITEMS.map(({ label, href }) => (
            <li key={href} className="shrink-0">
              <Link
                href={href}
                aria-current={activeHref === href ? "page" : undefined}
                className={`inline-flex min-h-11 items-center whitespace-nowrap px-1 text-[0.6875rem] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-chrome sm:px-2 sm:text-body-sm ${
                  activeHref === href
                    ? "font-semibold text-white"
                    : "text-white/75 hover:text-white"
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <span
          aria-hidden="true"
          className="mx-1 block h-5 w-px shrink-0 bg-white/15 sm:mx-3"
        />
        <ul className="flex min-h-11 shrink-0 items-center gap-0 sm:gap-1">
          {getHeaderContacts(contacts).map((contact) => (
            <li key={contact.label} className="shrink-0">
              <a
                href={contact.href}
                {...getHeaderActionAttributes(contact)}
                className="inline-flex min-h-11 items-center whitespace-nowrap px-1 text-[0.6875rem] text-white/75 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-chrome sm:px-2 sm:text-body-sm"
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

function Navbar() {
  return <NavbarView pathname={usePathname()} />;
}

export default Navbar;
