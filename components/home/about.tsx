import { Section } from "@/components/ui/section";
import { profile } from "@/lib/profile";

export function About() {
  const { greeting, summaries } = profile.about;

  return (
    <Section id="about" eyebrow="About" title="소개">
      <p className="mb-4 break-keep text-body-md text-ink-secondary">
        안녕하세요.
        <br />
        {greeting}
      </p>
      <ol className="mx-auto flex w-full max-w-2xl flex-col gap-2">
        {summaries.map(([firstLine, secondLine], index) => (
          <li
            key={firstLine}
            className="flex items-stretch rounded-md border border-hairline bg-surface px-4 py-3"
          >
            <span
              aria-hidden="true"
              className="flex w-9 shrink-0 items-center text-eyebrow text-ink-muted"
            >
              {(index + 1).toString().padStart(2, "0")}
            </span>
            <span
              aria-hidden="true"
              className="mr-4 w-px shrink-0 bg-hairline"
            />
            <p className="flex min-h-11 min-w-0 items-center break-keep text-body-md text-ink-secondary">
              <span>
                <span className="block">{firstLine}</span>
                <span className="block">{secondLine}</span>
              </span>
            </p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
