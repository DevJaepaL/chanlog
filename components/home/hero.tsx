import Image from "next/image";
import avatar from "@/app/avatar.jpg";
import { contacts, profile } from "@/lib/profile";

export function Hero() {
  return (
    <section className="w-full bg-secondary px-6 py-20 sm:py-28">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 text-center">
        <Image
          src={avatar}
          alt={profile.name}
          placeholder="blur"
          priority
          className="h-32 w-32 rounded-full object-cover sm:h-40 sm:w-40"
        />
        <div className="flex flex-col gap-2">
          <h1 className="text-heading-1 text-surface sm:text-display-2">
            {profile.name}
          </h1>
          <p className="text-body-md text-accent-sky">{profile.role}</p>
        </div>
        <p className="max-w-xl break-keep text-body-md text-surface/85">
          {profile.tagline}
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-3">
          {contacts.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-surface px-5 py-2 text-button text-ink shadow-soft transition-transform active:scale-95"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
