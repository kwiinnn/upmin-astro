"use client";

import { useHost } from "@/lib/client";
import { CLUB_NAME, NEXT_MEETING, SITE_TITLE } from "@/lib/site";
import { Logo } from "./Logo";

// Projector title screen: the club mark and a large QR code into the site.
export function PresentView() {
  const host = useHost();
  const [first, ...rest] = SITE_TITLE.split(" ");

  return (
    <main className="present relative z-10 flex min-h-svh flex-col items-center justify-center gap-10 p-6 text-center lg:flex-row lg:gap-24 lg:p-12 lg:text-left">
      <div className="flex flex-col items-center lg:items-start">
        <Logo animated className="size-28 text-ink lg:size-44" />
        <p className="eyebrow mt-6 text-sm lg:text-base">{CLUB_NAME}</p>
        <h1 className="display mt-3 text-6xl lg:text-8xl">
          {first} <em className="text-gold-soft">{rest.join(" ")}</em>
        </h1>
        <p className="mt-6 text-xl text-mute lg:text-2xl">
          General Assembly · <time dateTime={NEXT_MEETING.iso}>{NEXT_MEETING.label}</time>
        </p>
      </div>
      <div className="flex flex-col items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/qr.png" alt={`QR code for ${host}`} className="size-56 rounded-2xl bg-white p-2.5 lg:size-80" />
        <p className="mt-5 text-sm uppercase tracking-[0.16em] text-faint">Scan to follow along</p>
        <p className="mt-1 text-2xl font-bold lg:text-3xl">{host}</p>
      </div>
    </main>
  );
}
