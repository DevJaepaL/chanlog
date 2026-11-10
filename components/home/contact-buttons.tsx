import { getContactLinkAttributes, getProfileContacts } from "@/lib/navigation";
import { contacts } from "@/lib/profile";

const SIZE_CLASSES = {
  md: "h-10 px-4 text-body-sm",
  sm: "h-9 px-3 text-caption",
} as const;

export function ContactButtons({
  size = "md",
}: {
  size?: keyof typeof SIZE_CLASSES;
}) {
  return (
    <div className="-ml-0.5 flex flex-wrap gap-x-2">
      {getProfileContacts(contacts).map((contact) => (
        <a
          key={contact.label}
          href={contact.href}
          {...getContactLinkAttributes(contact)}
          className="group inline-flex min-h-11 items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
        >
          <span
            className={`inline-flex items-center rounded-lg font-semibold transition-colors ${SIZE_CLASSES[size]} ${
              contact.label === "Contact"
                ? "bg-primary text-surface group-hover:bg-primary-active"
                : "bg-canvas-muted text-ink-secondary group-hover:bg-hairline"
            }`}
          >
            {contact.label}
          </span>
        </a>
      ))}
    </div>
  );
}
