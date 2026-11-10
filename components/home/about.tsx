import {
  ABOUT_CARD,
  ABOUT_CARD_PADDING,
  ABOUT_LIST,
  ITEM_BODY,
} from "@/components/home/about-styles";
import { Section } from "@/components/ui/section";
import { profile } from "@/lib/profile";

export function About() {
  const { greeting, summaries } = profile.about;

  return (
    <Section id="about" eyebrow="About" title="소개" wide collapsible>
      <p className="mb-6 break-keep text-title font-semibold leading-relaxed text-ink sm:text-heading-3 sm:font-semibold">
        안녕하세요.
        <br />
        {greeting}
      </p>
      <ol className={ABOUT_LIST}>
        {summaries.map(([firstLine, secondLine]) => (
          <li key={firstLine} className={`${ABOUT_CARD} ${ABOUT_CARD_PADDING}`}>
            <p className={ITEM_BODY}>
              <span className="sm:block">{firstLine}</span>{" "}
              <span className="sm:block">{secondLine}</span>
            </p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
