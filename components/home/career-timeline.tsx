import {
  ABOUT_CARD,
  ABOUT_CARD_PADDING,
  ABOUT_LIST,
  ITEM_BODY,
  ITEM_BULLETS,
  ITEM_META,
  ITEM_TITLE,
} from "@/components/home/about-styles";
import { Section } from "@/components/ui/section";
import { careers } from "@/lib/profile";

export function CareerTimeline() {
  return (
    <Section
      id="career"
      eyebrow="Career"
      title="경력"
      wide
      collapsible
      defaultOpen={false}
    >
      <ol className={ABOUT_LIST}>
        {careers.map((career) => (
          <li key={career.company} className={`${ABOUT_CARD} ${ABOUT_CARD_PADDING}`}>
            <h3 className={ITEM_TITLE}>{career.company}</h3>
            <p className={ITEM_META}>{career.period}</p>
            <p className="mt-4 text-body-sm font-semibold text-ink-secondary">
              {career.team ? `${career.team}` : ""}
              {/* {career.team ? `${career.team} · ` : ""} */}
              {/* {career.role} */}
            </p>
            <p className="mt-0.5 break-keep text-body-sm text-ink-tertiary">
              {career.summary}
              <br></br>
            </p>
            <ul className={`mt-3 ${ITEM_BULLETS}`}>
              {career.highlights.map((highlight) => (
                <li key={highlight} className={ITEM_BODY}>
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
