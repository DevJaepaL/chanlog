import { Section } from "@/components/ui/section";
import { careers } from "@/lib/profile";

export function CareerTimeline() {
  return (
    <Section id="career" eyebrow="Career" title="경력">
      <ol className="flex flex-col">
        {careers.map((career, index) => (
          <li
            key={index}
            className={`relative border-l border-hairline pl-6 ${
              index === careers.length - 1 ? "pb-0" : "pb-10"
            }`}
          >
            <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-ink-faint" />
            <p className="text-caption text-ink-muted">{career.period}</p>
            <h3 className="mt-1 text-heading-3 text-ink">{career.company}</h3>
            <p className="mt-1 text-body-sm text-ink-muted">
              {career.team ? `${career.team} · ` : ""}
              {career.role} · {career.summary}
            </p>
            <ul className="mt-3 flex flex-col gap-1.5">
              {career.highlights.map((highlight, highlightIndex) => (
                <li
                  key={highlightIndex}
                  className="break-keep text-body-sm text-ink-secondary before:mr-2 before:text-ink-faint before:content-['—']"
                >
                  {highlight}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </Section>
  );
}
