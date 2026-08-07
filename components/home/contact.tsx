import { Section } from "@/components/ui/section";
import { contacts } from "@/lib/profile";

export function Contact() {
  return (
    <Section id="contact" eyebrow="Contact" title="연락처">
      <div className="flex flex-wrap gap-3">
        {contacts.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-hairline bg-surface px-5 py-2 text-button text-ink transition-colors hover:border-primary hover:text-primary"
          >
            {label}
          </a>
        ))}
      </div>
    </Section>
  );
}
