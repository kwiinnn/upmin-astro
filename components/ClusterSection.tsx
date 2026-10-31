"use client";

import { useRef } from "react";
import { CLUSTERS, type Cluster } from "@/lib/clusters";
import { useInView } from "@/lib/client";
import { CountUp } from "./CountUp";
import { ArrowOut, Book, Telescope } from "./Icons";
import { NextButton } from "./NextButton";
import { SignatureVisual } from "./visuals";

function Divider() {
  return (
    <svg viewBox="0 0 300 20" className="divider mb-10 h-5 w-full max-w-xs md:mb-6" aria-hidden="true">
      <path d="M4 14 L96 6 L190 12 L296 4" fill="none" stroke="#9db4e6" strokeOpacity="0.5" strokeWidth="0.8" pathLength={1} />
      {[
        [4, 14],
        [96, 6],
        [190, 12],
        [296, 4],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === 1 ? 2.4 : 1.6} fill={i === 1 ? "#f3c96b" : "#eaf0ff"} style={{ "--d": `${0.3 + i * 0.35}s` } as React.CSSProperties} />
      ))}
    </svg>
  );
}

function Resource({ kind, link }: { kind: "try" | "learn"; link: Cluster["tryIt"] }) {
  return (
    <a href={link.href} target="_blank" rel="noopener noreferrer" className={`res tap ${kind === "try" ? "try" : ""}`}>
      <span className={kind === "try" ? "text-gold" : "text-line"}>{kind === "try" ? <Telescope /> : <Book />}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-[0.7rem] font-bold uppercase tracking-[0.14em] text-faint">
          {kind === "try" ? "Try it yourself" : "Learn more"}
        </span>
        <span className="block font-semibold leading-snug">{link.label}</span>
        <span className="block text-sm leading-snug text-mute">{link.note}</span>
      </span>
      <ArrowOut className="size-5 flex-none text-mute" />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}

export function ClusterSection({ c, index }: { c: Cluster; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const { seen, visible } = useInView(ref, 0.12);
  const flip = index % 2 === 1;
  const next = CLUSTERS[index + 1];
  const d = (s: number) => ({ "--d": `${s}s` }) as React.CSSProperties;

  return (
    <section
      id={c.id}
      ref={ref}
      tabIndex={-1}
      aria-labelledby={`${c.id}-title`}
      className={`relative flex min-h-svh scroll-mt-4 flex-col pb-4 pt-16 outline-none md:pt-12 ${seen ? "in" : ""} ${visible ? "on" : ""}`}
    >
      <div className="wrap my-auto">
        <Divider />
        <div className={`grid items-start gap-10 md:grid-cols-2 md:gap-16 ${flip ? "md:[&>*:first-child]:order-2" : ""}`}>
          <div>
            <p className="eyebrow reveal" style={d(0)}>
              <span className="display mr-2 text-2xl normal-case italic tracking-normal">{c.numeral}</span>
              {c.name}
            </p>
            <h2 id={`${c.id}-title`} className="display reveal mt-3 text-[2.6rem] sm:text-5xl md:text-6xl" style={d(0.1)}>
              {c.question}
            </h2>
            <p className="reveal mt-2 text-sm font-semibold tracking-wide text-line" style={d(0.18)}>
              {c.disciplines}
            </p>
            <p className="reveal mt-4 max-w-prose text-mute" style={d(0.25)}>
              {c.description}
            </p>
          </div>
          <div className="reveal" style={d(0.3)}>
            <SignatureVisual id={c.id} active={visible} />
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-[1.1fr_1fr] md:gap-6">
          <figure className="fact reveal p-6" style={d(0.1)}>
            <p className="eyebrow mb-3 text-[0.68rem]">Wow</p>
            <p className="fact-num text-[3.4rem] sm:text-6xl">
              {c.fact.prefix}
              <CountUp value={c.fact.value} from={c.fact.from} decimals={c.fact.decimals} plain={c.fact.plain} start={seen} />
              {c.fact.suffix && <span className="text-[0.5em] italic">{c.fact.suffix}</span>}
            </p>
            <p className="mt-3 font-semibold">{c.fact.label}</p>
            <p className="mt-2 text-[0.95rem] text-mute">{c.fact.detail}</p>
          </figure>
          <div className="reveal flex flex-col gap-3" style={d(0.2)}>
            <Resource kind="try" link={c.tryIt} />
            <Resource kind="learn" link={c.learnMore} />
          </div>
        </div>
      </div>
      <div className="pt-12 md:pt-6">
        {next ? (
          <NextButton to={next.id} label={`${next.numeral} · ${next.name}`} cluster={next} />
        ) : (
          <NextButton to="contact" label="Stay in touch" />
        )}
      </div>
    </section>
  );
}
