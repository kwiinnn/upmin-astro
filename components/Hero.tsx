"use client";

import { useEffect, useState } from "react";
import { CLUSTERS, SKY, bbox, type ClusterId } from "@/lib/clusters";
import { CLUB_NAME, NEXT_MEETING } from "@/lib/site";
import { ConstellationArt, GlowDefs } from "./Constellation";
import { Logo } from "./Logo";
import { NextButton } from "./NextButton";
import { useSky } from "./Sky";

const INTRO_START = 0.5;
const INTRO_STEP = 0.55;

export function Hero() {
  const { go } = useSky();
  const [tapped, setTapped] = useState<ClusterId | null>(null);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const [phase, setPhase] = useState<"intro" | "idle">("intro");

  useEffect(() => {
    const total = (INTRO_START + CLUSTERS.length * INTRO_STEP + 1.6) * 1000;
    const t = setTimeout(() => setPhase("idle"), total);
    return () => clearTimeout(t);
  }, []);

  const open = (id: ClusterId, e: React.MouseEvent) => {
    e.preventDefault();
    const c = CLUSTERS.find((x) => x.id === id)!;
    const b = bbox(c);
    setTapped(id);
    setZoom({ x: (b.cx / SKY.w) * 100, y: (b.cy / SKY.h) * 100 });
    // A beat to see the constellation light up, then the camera move.
    setTimeout(() => go(id), 280);
    setTimeout(() => {
      setZoom(null);
      setTapped(null);
    }, 2200);
  };

  return (
    <section
      id="hero"
      tabIndex={-1}
      className="relative flex h-svh min-h-[34rem] flex-col pt-[max(1.5rem,env(safe-area-inset-top))] outline-none short:pt-[max(0.75rem,env(safe-area-inset-top))]"
    >
      <div className="wrap flex min-h-0 flex-1 flex-col md:grid md:grid-cols-[1.15fr_1fr] md:grid-rows-[1fr_auto_auto_1fr] md:gap-x-10">
        <div className="md:row-start-2">
          <div className="flex items-center gap-3">
            <Logo animated className="-ml-1 size-14 text-ink short:size-10 sm:size-20" />
            <p className="eyebrow fade-up" style={{ "--d": "0.1s" } as React.CSSProperties}>
              {CLUB_NAME}
            </p>
          </div>
          <h1
            className="display fade-up mt-3 text-[3.6rem] short:mt-1 short:text-[2.75rem] sm:text-7xl md:text-8xl"
            style={{ "--d": "0.25s" } as React.CSSProperties}
          >
            Mission <em className="text-gold-soft">Briefing</em>
          </h1>
          <p className="fade-up mt-4 max-w-md text-mute short:mt-2 short:text-[0.95rem] short:leading-snug" style={{ "--d": "0.45s" } as React.CSSProperties}>
            Space science, mapped as five constellations. Tap one to fly there, or press Next to travel through them in
            order.
          </p>
        </div>

        <div className="relative mt-2 min-h-0 flex-1 short:mt-0 md:col-start-2 md:row-span-4 md:row-start-1 md:mt-0 md:py-4">
          <svg
            viewBox={`0 0 ${SKY.w} ${SKY.h + 10}`}
            className={`hero-sky mx-auto block h-full w-auto max-w-full ${phase} ${phase === "idle" ? "labels-ready" : ""} ${zoom ? "zoom" : ""}`}
            style={zoom ? ({ "--zx": `${zoom.x}%`, "--zy": `${zoom.y}%` } as React.CSSProperties) : undefined}
            role="group"
            aria-label="Constellation map of the five clusters"
          >
            <GlowDefs />
            {CLUSTERS.map((c, i) => {
              const b = bbox(c, 14);
              return (
                <a
                  key={c.id}
                  href={`#${c.id}`}
                  className={`const ${tapped === c.id ? "is-on" : ""}`}
                  aria-label={`${c.numeral}. ${c.name}: ${c.question}`}
                  onClick={(e) => open(c.id, e)}
                  style={{ "--p": `${i * 0.9}s` } as React.CSSProperties}
                >
                  <rect className="c-hit" x={b.x} y={b.y} width={b.w} height={b.h} rx={18} fill="transparent" />
                  <ConstellationArt c={c} delay={INTRO_START + i * INTRO_STEP} real />
                  <text className="c-label" x={c.labelAt[0]} y={c.labelAt[1]} textAnchor={c.labelAnchor}>
                    <tspan className="num">{c.numeral}</tspan> {c.name}
                  </text>
                </a>
              );
            })}
          </svg>
        </div>

        <div className="flex items-center gap-4 pt-3 short:pt-1 md:row-start-3 md:pt-8">
          <p className="text-sm leading-snug text-mute [text-shadow:0_1px_8px_rgb(0_0_0/0.8)]">
            General Assembly · <time dateTime={NEXT_MEETING.iso}>{NEXT_MEETING.label}</time>
          </p>
        </div>
      </div>
      <div className="pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 short:pt-2">
        <NextButton to={CLUSTERS[0].id} label={`${CLUSTERS[0].numeral} · ${CLUSTERS[0].name}`} cluster={CLUSTERS[0]} />
      </div>
    </section>
  );
}
