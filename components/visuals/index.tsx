"use client";

import { useEffect, useRef } from "react";
import type { ClusterId } from "@/lib/clusters";
import { useReducedMotion } from "@/lib/client";

/* I. Expanding universe: Webb's First Deep Field (galaxy cluster SMACS 0723),
   thousands of real galaxies. Kept still: a zoom read as the image resizing. */
function Expanding() {
  return (
    <div className="v-deep-wrap">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/deep-field.webp" alt="" className="v-deep" loading="lazy" decoding="async" />
    </div>
  );
}

/* II. The habitable zone: too hot, just right, too cold. */
function Habitable() {
  return (
    <div className="v-deep-wrap">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/habitable-zone.webp"
        alt="A star with three planets: too hot close in, just right in the green habitable zone, too cold farther out."
        className="v-deep"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

/* III. White light entering a prism and fanning into a spectrum. */
function Prism() {
  return (
    <div className="v-deep-wrap">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/prism-spectrum.webp"
        alt="A beam of white light enters a glass prism and fans out into a rainbow spectrum."
        className="v-deep"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

/* IV. Artemis II's real trajectory, 2–11 April 2026 (NASA animation, 33 s).
   Muted and silent; SignatureVisual plays it only while the section is on
   screen, and never under reduced motion (the poster shows the full path). */
function FreeReturn() {
  return (
    <div className="v-deep-wrap">
      <video
        className="v-deep"
        poster="/artemis-ii-trajectory.webp"
        muted
        loop
        playsInline
        preload="none"
        aria-label="Animation of Artemis II's path: out from Earth, around the Moon, and back."
      >
        <source src="/artemis-ii-trajectory.webm" type="video/webm" />
        <source src="/artemis-ii-trajectory.mp4" type="video/mp4" />
      </video>
    </div>
  );
}

/* V. A real long exposure from Phu Kradueng, Thailand (about 17° N): the
   stars trail in circles around the celestial pole, low over the trees. */
function StarTrails() {
  return (
    <div className="v-deep-wrap">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/star-trails.webp"
        alt="Long-exposure photo of a campsite at night: the stars have traced circles around one point just above the trees."
        className="v-deep"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

const VISUALS: Record<ClusterId, { el: () => React.JSX.Element; caption: string; credit?: string; video?: boolean }> = {
  universe: {
    el: Expanding,
    caption: "Webb's First Deep Field: nearly every dot is a galaxy, and every one drifts away from every other.",
    credit: "NASA, ESA, CSA, and STScI",
  },
  worlds: { el: Habitable, caption: "Too close, too hot. Too far, too cold. Life likes the zone in between." },
  look: { el: Prism, caption: "Split starlight into a spectrum and you can read what the star is made of." },
  going: {
    el: FreeReturn,
    caption:
      "Spacecraft don't fly straight. Artemis II, April 2026: out from Earth, around the far side of the Moon, and home on a figure-eight path shaped by gravity.",
    credit: "NASA",
    video: true,
  },
  society: {
    el: StarTrails,
    caption:
      "Hours of starlight in one photo, taken in Thailand: the sky wheels around a point just above the trees. From Mindanao, at 7° N, that point sits even lower, only about 7° above the horizon.",
    credit: "NittlestX, CC BY-SA 4.0, via Wikimedia Commons",
  },
};

export function SignatureVisual({ id, active }: { id: ClusterId; active: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { el: Visual, caption, credit, video } = VISUALS[id];
  const reduced = useReducedMotion();

  // Videos ignore CSS play-state, so play and pause them directly: only while
  // the section is on screen, and never under reduced motion.
  useEffect(() => {
    ref.current?.querySelectorAll("video").forEach((v) => {
      if (active && !reduced) v.play().catch(() => {});
      else v.pause();
    });
  }, [active, reduced]);

  return (
    <figure ref={ref}>
      <div className="visual aspect-[16/10] w-full">
        <Visual />
      </div>
      <figcaption className="mt-3 text-sm text-faint">
        {caption}
        {credit && (
          <span className="mt-1 block text-xs text-faint/70">
            {video ? "Animation" : "Image"}: {credit}
          </span>
        )}
      </figcaption>
    </figure>
  );
}
