"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { name: "홈", href: "/" },
  { name: "아카이브", href: "/posts" },
] as const;

function Navbar() {
  let pathName = usePathname();
  if (pathName?.startsWith("/posts")) pathName = "/posts";

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-hairline bg-canvas/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-6">
        <Link href="/" className="text-title text-ink">
          CHANLOG
        </Link>
        <ul className="flex items-center gap-5 text-body-sm">
          {NAV_ITEMS.map(({ name, href }) => (
            <li key={href}>
              <Link
                href={href}
                className={
                  pathName === href
                    ? "font-semibold text-primary"
                    : "text-ink-secondary transition-colors hover:text-ink"
                }
              >
                {name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
