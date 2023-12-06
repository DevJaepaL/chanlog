"use client";
import Link from "next/link";
import DarkModeBtn from "./darkModeBtn";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
interface NavItem {
  name: "홈" | "소개" | "일기" | "블로그";
  href: "/" | "/about" | "/diary" | "/post";
}

const NAV_ITEMS: NavItem[] = [
  {
    name: "홈",
    href: "/",
  },
  {
    name: "소개",
    href: "/about",
  },
  {
    name: "일기",
    href: "/diary"
  },
  {
    name: "블로그",
    href: "/post",
  },
];

function Navbar() {
  let pathname = usePathname();

  if (pathname?.includes("/post/")) pathname = "/post";

  return (
    <nav className="mt-10 h-14 w-full">
      <div className="mx-auto flex h-full w-full max-w-3xl items-center justify-between px-4 py-4">
        <h1 className="text-3xl font-bold">
          <Link href="/">Chanlog</Link>
        </h1>
        <ul className="flex items-center gap-3 md:gap-4">
          {NAV_ITEMS.map(({ name, href }) => (
            <li key={name} className="relative">
              <Link href={href}>{name}</Link>
              {pathname === href && (
                <motion.div
                  layoutId="active-link"
                  transition={{
                    type: "spring",
                    duration: 0.5,
                  }}
                  className="absolute h-[1px] w-full bg-black dark:bg-white"
                />
              )}
            </li>
          ))}

          <li>
            <DarkModeBtn />
          </li>
        </ul>
      </div>
    </nav>
  );
}
export default Navbar;
