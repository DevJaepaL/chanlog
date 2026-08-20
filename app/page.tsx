import { About } from "@/components/home/about";
import { CareerTimeline } from "@/components/home/career-timeline";
import { Contact } from "@/components/home/contact";
import { Hero } from "@/components/home/hero";
import { ProjectList } from "@/components/home/project-list";
import { RecentPosts } from "@/components/home/recent-posts";
import { SkillGroups } from "@/components/home/skill-groups";
import { PipelineSection } from "@/components/pipeline/pipeline-section";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <CareerTimeline />
      <ProjectList />
      <PipelineSection />
      <SkillGroups />
      <RecentPosts />
      <Contact />
    </>
  );
}
