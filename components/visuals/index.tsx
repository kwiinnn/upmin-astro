"use client";

import { useEffect, useRef } from "react";
import type { ClusterId } from "@/lib/clusters";
import { useReducedMotion } from "@/lib/client";

// Deterministic pseudo-random numbers so server and client render the same dots.
function seeded(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Math.sin/cos can differ in the last digit between the server and the
// browser, which breaks hydration; two decimals is plenty for a 320×200 SVG.
const r2 = (n: number) => Math.round(n * 100) / 100;

const VB = "0 0 320 200";

/* I. Expanding universe: Webb's First Deep Field (galaxy cluster SMACS 0723),
   thousands of real galaxies. A slow push-in reads as space growing. */
function Expanding() {
  return (
    <div className="v-deep-wrap">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/deep-field.webp" alt="" className="v-deep" loading="lazy" decoding="async" />
    </div>
  );
}

/* II. A small planetary system with a habitable zone. */
function Orbits() {
  const planets = [
    { r: 34, size: 3, dur: 7, color: "#c9b79c" },
    { r: 62, size: 4.5, dur: 13, color: "#8fc2ff", hz: true },
    { r: 92, size: 6, dur: 24, color: "#e9c88f" },
  ];
  return (
    <svg viewBox={VB} className="h-full w-full" aria-hidden="true">
      <defs>
        <radialGradient id="sun">
          <stop offset="0" stopColor="#fff3d1" />
          <stop offset="0.35" stopColor="#f3c96b" stopOpacity="0.6" />
          <stop offset="1" stopColor="#f3c96b" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="160" cy="100" r="62" fill="none" stroke="#8fc2ff" strokeOpacity="0.1" strokeWidth="22" />
      <text x="160" y="31" textAnchor="middle" fontSize="8" fill="#8fc2ff" fillOpacity="0.7" letterSpacing="1.5">
        HABITABLE ZONE
      </text>
      {planets.map((p) => (
        <circle key={p.r} cx="160" cy="100" r={p.r} fill="none" stroke="#9db4e6" strokeOpacity="0.28" strokeWidth="0.7" />
      ))}
      <circle cx="160" cy="100" r="26" fill="url(#sun)" />
      <circle cx="160" cy="100" r="6" fill="#fff3d1" />
      {planets.map((p, i) => (
        <g
          key={p.r}
          className="v-orbit"
          style={{ animationDuration: `${p.dur}s`, animationDelay: `${-i * 3.1}s` }}
        >
          <circle cx={160 + p.r} cy="100" r={p.size} fill={p.color} />
          {p.hz && <circle cx={160 + p.r} cy="100" r={p.size + 4} fill="none" stroke="#8fc2ff" strokeOpacity="0.5" strokeWidth="0.6" />}
        </g>
      ))}
    </svg>
  );
}

/* III. White light entering a prism and fanning into a spectrum. */
const SPECTRUM = ["#ff7a7a", "#ffae5c", "#ffe27a", "#8fe3a1", "#7cc4ff", "#a99bff"];

function Prism() {
  return (
    <svg viewBox={VB} className="h-full w-full" aria-hidden="true">
      <path d="M0 132 L141 112" stroke="#f4f7ff" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M0 132 L141 112" className="v-beam" stroke="#f4f7ff" strokeWidth="2" pathLength={1} />
      <path d="M141 112 L184 106" stroke="#f4f7ff" strokeOpacity="0.5" strokeWidth="1.6" />
      {SPECTRUM.map((c, i) => {
        const y = 58 + i * 21;
        return (
          <g key={c}>
            <path d={`M184 106 L320 ${y}`} stroke={c} strokeOpacity="0.18" strokeWidth="5" />
            <path
              d={`M184 106 L320 ${y}`}
              className="v-ray"
              stroke={c}
              strokeWidth="1.6"
              pathLength={1}
              style={{ animationDelay: `${0.9 + i * 0.07}s` }}
            />
          </g>
        );
      })}
      <path
        d="M160 52 L208 146 L112 146 Z"
        fill="rgb(157 180 230 / 0.08)"
        stroke="#cfdcff"
        strokeOpacity="0.8"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
      <path d="M160 52 L176 84" stroke="#fff" strokeOpacity="0.5" strokeWidth="1" />
    </svg>
  );
}

/* IV. A spacecraft riding a transfer arc from Earth toward the Moon. */
const ARC = "M74 150 C 130 104, 196 44, 258 54";

function Rocket() {
  const reduced = useReducedMotion();
  return (
    <svg viewBox={VB} className="h-full w-full" aria-hidden="true">
      <defs>
        <radialGradient id="earth" cx="0.35" cy="0.35">
          <stop offset="0" stopColor="#bfe0ff" />
          <stop offset="1" stopColor="#2f5fa8" />
        </radialGradient>
      </defs>
      <path d={ARC} fill="none" stroke="#9db4e6" strokeOpacity="0.3" strokeWidth="1" strokeDasharray="2 5" />
      <path
        d={ARC}
        fill="none"
        stroke="#f3c96b"
        strokeWidth="1.6"
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray="0.18 1"
        strokeDashoffset={reduced ? -0.45 : 0.18}
      >
        {!reduced && (
          <animate attributeName="stroke-dashoffset" values="0.18;-1" dur="6s" repeatCount="indefinite" />
        )}
      </path>
      <circle cx="56" cy="160" r="24" fill="url(#earth)" />
      <circle cx="56" cy="160" r="30" fill="none" stroke="#8fc2ff" strokeOpacity="0.25" />
      <circle cx="266" cy="50" r="10" fill="#d9dce6" />
      <circle cx="263" cy="47" r="2" fill="#b5bac8" />
      <g transform={reduced ? "translate(176 82) rotate(-38)" : undefined}>
        <path d="M7 0 L-5 -4 L-3 0 L-5 4 Z" fill="#f4f7ff" />
        <circle cx="-6" cy="0" r="2.4" fill="#f3c96b" opacity="0.8" />
        {!reduced && <animateMotion dur="6s" repeatCount="indefinite" rotate="auto" path={ARC} keyPoints="0;1" keyTimes="0;1" calcMode="linear" />}
      </g>
    </svg>
  );
}

/* V. The sky wheeling around the celestial pole, which from Mindanao
   (about 7° N) sits just above the northern horizon. */
const rnd2 = seeded(42);
const DOME_STARS = Array.from({ length: 34 }, () => ({
  d: 18 + rnd2() * 150,
  a: rnd2() * 360,
  r: 0.7 + rnd2() * 1.3,
}));

function SkyDome() {
  const pole = { x: 160, y: 158 };
  return (
    <svg viewBox={VB} className="h-full w-full" aria-hidden="true">
      <defs>
        <clipPath id="above">
          <rect x="0" y="0" width="320" height="170" />
        </clipPath>
        <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0b1430" />
          <stop offset="1" stopColor="#02040b" />
        </linearGradient>
      </defs>
      <g clipPath="url(#above)">
        <g className="v-dome" style={{ transformOrigin: `${pole.x}px ${pole.y}px` }}>
          {DOME_STARS.map((s, i) => {
            const rad = (s.a * Math.PI) / 180;
            const x = r2(pole.x + Math.cos(rad) * s.d);
            const y = r2(pole.y + Math.sin(rad) * s.d);
            return (
              <g key={i}>
                <path
                  d={`M${x} ${y} A ${s.d} ${s.d} 0 0 0 ${r2(pole.x + Math.cos(rad + 0.5) * s.d)} ${r2(pole.y + Math.sin(rad + 0.5) * s.d)}`}
                  fill="none"
                  stroke="#9db4e6"
                  strokeOpacity="0.16"
                  strokeWidth={s.r * 0.8}
                />
                <circle cx={x} cy={y} r={s.r} fill={i % 7 === 0 ? "#f3c96b" : "#eaf0ff"} />
              </g>
            );
          })}
        </g>
        <circle cx={pole.x} cy={pole.y} r="2" fill="#f3c96b" />
      </g>
      <path d="M0 170 Q 50 160 92 168 T 180 166 T 262 162 T 320 168 L320 200 L0 200 Z" fill="url(#ground)" />
      <path d="M0 170 Q 50 160 92 168 T 180 166 T 262 162 T 320 168" fill="none" stroke="#9db4e6" strokeOpacity="0.35" strokeWidth="0.8" />
      <text x="160" y="188" textAnchor="middle" fontSize="8" fill="#aab8d9" letterSpacing="2">
        NORTH
      </text>
    </svg>
  );
}

const VISUALS: Record<ClusterId, { el: () => React.JSX.Element; caption: string; credit?: string }> = {
  universe: {
    el: Expanding,
    caption: "Webb's First Deep Field: nearly every dot is a galaxy, and every one drifts away from every other.",
    credit: "NASA, ESA, CSA, and STScI",
  },
  worlds: { el: Orbits, caption: "Too close, too hot. Too far, too cold. Life likes the zone in between." },
  look: { el: Prism, caption: "Split starlight into a spectrum and you can read what the star is made of." },
  going: { el: Rocket, caption: "Spacecraft don't fly straight. They ride carefully planned arcs." },
  society: {
    el: SkyDome,
    caption: "From Mindanao the celestial pole sits only about 7° above the horizon, so the whole sky wheels around a point near the ground.",
  },
};

export function SignatureVisual({ id, active }: { id: ClusterId; active: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { el: Visual, caption, credit } = VISUALS[id];

  // SMIL animations (the rocket) ignore CSS play-state, so pause them directly.
  useEffect(() => {
    ref.current?.querySelectorAll("svg").forEach((svg) => {
      if (active) svg.unpauseAnimations();
      else svg.pauseAnimations();
    });
  }, [active]);

  return (
    <figure ref={ref}>
      <div className="visual aspect-[16/10] w-full">
        <Visual />
      </div>
      <figcaption className="mt-3 text-sm text-faint">
        {caption}
        {credit && <span className="mt-1 block text-xs text-faint/70">Image: {credit}</span>}
      </figcaption>
    </figure>
  );
}
