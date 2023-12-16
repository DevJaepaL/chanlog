"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

interface NavItem {
  name: "홈"  | "소개"   | "블로그";
  href: "/"  | "/info" | "/posts";
}

const NAV_ITEMS: NavItem[] = [
  {
    name: "홈",
    href: "/",
  },
  {
    name: "소개",
    href: "/info"
  },
  {
    name: "블로그",
    href: "/posts",
  },
];

function Navbar() {
  let pathName = usePathname();
  if (pathName?.includes("/posts/")) pathName = "/posts";

  return (
    <nav className="h-16 w-full bg-blue-950 text-white">
      <div className="mx-auto flex h-full w-full max-w-3xl items-center justify-between px-4 py-4">
        <h2 className="text-2xl font-bold">        
          <Link href="/">CHANLOG</Link>
        </h2>
        <ul className="flex items-center gap-3 md:gap-4">
          {NAV_ITEMS.map(({ name, href }) => (
            <li key={name} className="relative">
              <Link href={href} className={pathName === href ? 'font-bold' : ''}>{name}</Link>
              {pathName === href && (
                <motion.div
                  className="absolute w-full bg-black"
                />
              )}
            </li>
          ))}
          <li>
          <Link href={"https://github.com/DevJaepaL"} target="blank" className="">
              <svg viewBox="0 0 16 16" className="w-6 h-6 fill-white hover:fill-slate-300" aria-hidden="true">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                </svg>
          </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
export default Navbar;
