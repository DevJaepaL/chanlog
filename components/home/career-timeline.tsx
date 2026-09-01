import { Section } from "@/components/ui/section";
import { careers } from "@/lib/profile";

export function CareerTimeline() {
  return (
    <Section id="career" eyebrow="Career" title="경력">
      <ol className="flex flex-col">
        {careers.map((career, index) => (
          <li
            key={career.company}
            className={`relative border-l border-hairline pl-5 ${
              index === careers.length - 1 ? "pb-0" : "pb-6"
            }`}
          >
            <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-ink-faint" />
            <h3 className="text-heading-3 text-ink">{career.company}</h3>
            <p className="text-caption text-ink-muted">{career.period}</p>
            <p className="mt-1 text-body-sm text-ink-muted">
              {career.team ? `${career.team}` : ""}
              {/* {career.team ? `${career.team} · ` : ""} */}
              {/* {career.role} */}
            </p>
            <p className="mt-0.5 break-keep text-body-sm text-ink-secondary">
              {career.summary}
              <br></br>
            </p>
            <ul className="mt-2 list-outside list-disc space-y-1 pl-5 marker:text-ink-faint">
              {career.highlights.map((highlight) => (
                <li
                  key={highlight}
                  className="break-keep text-body-sm text-ink-secondary"
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
