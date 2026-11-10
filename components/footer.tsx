import { contacts, profile } from "@/lib/profile";

function Footer() {
  return (
    <footer className="mt-auto w-full border-t border-hairline">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-1 px-5 pb-8 pt-5 sm:px-6">
        <p className="text-caption text-ink-faint">
          © {new Date().getFullYear()} {profile.name}. All Rights Reserved.
        </p>
        <div className="flex gap-5 text-caption">
          {contacts.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center rounded-sm text-ink-faint transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
