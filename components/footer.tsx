import { contacts, profile } from "@/lib/profile";

function Footer() {
  return (
    <footer className="mt-auto w-full border-t border-hairline bg-canvas-soft">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-4 px-6 py-10">
        <div className="flex gap-5 text-caption">
          {contacts.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink-secondary transition-colors hover:text-primary"
            >
              {label}
            </a>
          ))}
        </div>
        <p className="text-caption text-ink-faint">
          © {new Date().getFullYear()} {profile.name}. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
