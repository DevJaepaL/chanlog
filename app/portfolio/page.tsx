import type { Metadata } from "next";
import { About } from "@/components/home/about";
import { CareerTimeline } from "@/components/home/career-timeline";
import { Hero } from "@/components/home/hero";
import { ProjectList } from "@/components/home/project-list";
import { SkillGroups } from "@/components/home/skill-groups";

export const metadata: Metadata = {
  title: "포트폴리오",
  description: "이재찬의 백엔드·AI 엔지니어 경력, 프로젝트, 기술 역량",
  alternates: {
    canonical: "https://chanlog.blog/portfolio",
  },
  openGraph: {
    url: "https://chanlog.blog/portfolio",
  },
};

export default function PortfolioPage() {
  return (
    <>
      <Hero />
      <About />
      <CareerTimeline />
      <ProjectList />
      <SkillGroups />
    </>
  );
}
