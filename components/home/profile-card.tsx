import Image from "next/image";
import Link from "next/link";
import avatar from "@/lib/images/profile_2-avatar.jpg";
import { ContactButtons } from "@/components/home/contact-buttons";
import { profile } from "@/lib/profile";

export function ProfileCard() {
  return (
    <section
      aria-label="프로필"
      className="mx-auto w-full max-w-5xl px-5 pt-6 sm:px-6 sm:pt-10"
    >
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 rounded-2xl bg-canvas-soft p-5 sm:gap-x-6 sm:p-7">
        <Image
          src={avatar}
          alt={profile.name}
          placeholder="blur"
          sizes="(min-width: 640px) 80px, 56px"
          quality={90}
          className="h-14 w-14 rounded-full object-cover sm:row-span-2 sm:h-20 sm:w-20"
        />
        <div className="min-w-0 sm:self-end">
          <p className="flex flex-wrap items-baseline gap-x-2">
            <span className="text-title font-bold text-ink sm:text-heading-3">
              {profile.name}
            </span>
            <span className="text-caption text-ink-faint sm:text-body-sm">
              {profile.nameEn}
            </span>
          </p>
          <p className="mt-0.5 break-keep text-caption text-ink-tertiary sm:text-body-md">
            {profile.role}
          </p>
        </div>
        <Link
          href="/portfolio"
          className="inline-flex min-h-11 items-center self-start whitespace-nowrap rounded-md text-body-sm font-semibold text-primary hover:text-primary-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas-soft sm:row-span-2 sm:self-center"
        >
          About →
        </Link>
        <div className="col-span-3 sm:col-span-1 sm:col-start-2 sm:self-start">
          <ContactButtons size="sm" />
        </div>
      </div>
    </section>
  );
}
