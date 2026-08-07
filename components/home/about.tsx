import { Section } from "@/components/ui/section";
import { profile } from "@/lib/profile";

export function About() {
  return (
    <Section id="about" eyebrow="About" title="소개">
      <div className="flex flex-col gap-4">
        {profile.about.map((paragraph) => (
          <p
            key={paragraph.slice(0, 16)}
            className="break-keep text-body-md text-ink-secondary"
          >
            {paragraph}
          </p>
        ))}
      </div>
    </Section>
  );
}
