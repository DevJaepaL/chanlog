import { Section } from "@/components/ui/section";
import { profile } from "@/lib/profile";

export function About() {
  const { greeting, summaries } = profile.about;

  return (
    <Section id="about" eyebrow="About" title="소개" wide collapsible>
      <p className="mb-5 break-keep text-title font-semibold leading-relaxed text-ink sm:text-heading-3 sm:font-semibold">
        안녕하세요.
        <br />
        {greeting}
      </p>
      <ol className="flex w-full flex-col gap-3">
        {summaries.map(([firstLine, secondLine]) => (
          <li
            key={firstLine}
            className="rounded-xl bg-canvas-soft px-5 py-4 sm:px-6 sm:py-5"
          >
            <p className="break-keep text-body-md text-ink-secondary sm:text-body-lg">
              <span className="sm:block">{firstLine}</span>{" "}
              <span className="sm:block">{secondLine}</span>
            </p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
