import type { ReactNode } from "react";
import { AboutTabs } from "@/components/portfolio/about-tabs";

// The tab bar lives here (not in the page) so it can stay sticky across every About section.
export default function PortfolioLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AboutTabs />
      {children}
    </>
  );
}
