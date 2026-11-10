import { Section } from "@/components/ui/section";
import { careers } from "@/lib/profile";

export function CareerTimeline() {
  return (
    <Section id="career" eyebrow="Career" title="경력" wide collapsible>
      <ol className="flex flex-col">
        {careers.map((career, index) => (
          <li
            key={career.company}
            className={`grid grid-cols-1 gap-x-6 gap-y-1 py-6 sm:grid-cols-[11rem_minmax(0,1fr)] ${
              index === 0 ? "pt-0" : "border-t border-hairline"
            }`}
          >
            <p className="text-body-sm text-ink-faint sm:pt-1">{career.period}</p>
            <div className="min-w-0">
              <h3 className="text-heading-3 text-ink">{career.company}</h3>
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
                    className="break-keep text-body-md text-ink-tertiary"
                  >
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
