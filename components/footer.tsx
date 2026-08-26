import { contacts, profile } from "@/lib/profile";

function Footer() {
  return (
    <footer className="mt-auto w-full border-t border-white/15 bg-chrome">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-4 px-6 py-10">
        <div className="flex gap-5 text-caption">
          {contacts.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center text-white/75 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-chrome"
            >
              {label}
            </a>
          ))}
        </div>
        <p className="text-caption text-white/60">
          © {new Date().getFullYear()} {profile.name}. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
