import Image from "next/image";
import avatar from "@/lib/images/profile_2-avatar.jpg";
import { ContactButtons } from "@/components/home/contact-buttons";
import { profile } from "@/lib/profile";

export function Hero() {
  return (
    <section className="px-5 pb-8 pt-10 sm:px-6 sm:pt-14">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-7">
        <Image
          src={avatar}
          alt={profile.name}
          placeholder="blur"
          priority
          sizes="(min-width: 640px) 112px, 80px"
          quality={90}
          className="h-20 w-20 shrink-0 rounded-full object-cover sm:h-28 sm:w-28"
        />
        <div className="min-w-0">
          <h1 className="text-headline text-ink sm:text-heading-1">
            {profile.name}
          </h1>
          <p className="text-body-sm text-ink-faint">{profile.nameEn}</p>
          <p className="mt-1 text-body-md text-ink-tertiary sm:text-body-lg">
            {profile.role}
          </p>
          {profile.tagline && (
            <p className="mt-2 max-w-xl break-keep text-body-md text-ink-secondary">
              {profile.tagline}
            </p>
          )}
          <div className="mt-3">
            <ContactButtons />
          </div>
        </div>
      </div>
    </section>
  );
}
