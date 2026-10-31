"use client";

import { useState } from "react";
import { post } from "@/lib/client";
import { CLUB_FULL_NAME, CLUB_NAME, FOUNDED, LIMITS, NEXT_MEETING, SOCIAL_LINKS } from "@/lib/site";
import { Facebook, Instagram, Mail } from "./Icons";
import { Logo } from "./Logo";
import { NextButton } from "./NextButton";

const SOCIAL_ICONS = { facebook: Facebook, instagram: Instagram, email: Mail };

export function Footer() {
  const [topic, setTopic] = useState("");
  const [state, setState] = useState<{ status: "idle" | "sending" | "done" | "error"; msg?: string }>({ status: "idle" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim().length < 2) return;
    setState({ status: "sending" });
    try {
      await post("/api/suggest", { topic: topic.trim() });
      setTopic("");
      setState({ status: "done", msg: "Got it. We'll add it to the list." });
    } catch (err) {
      setState({ status: "error", msg: (err as Error).message });
    }
  };

  return (
    <footer
      id="contact"
      tabIndex={-1}
      className="relative scroll-mt-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-10 outline-none"
    >
      <div className="wrap">
        <div className="panel grid gap-10 p-6 sm:p-10 md:grid-cols-2">
          <div>
            <p className="eyebrow">General Assembly</p>
            <p className="display mt-3 text-5xl">
              <time dateTime={NEXT_MEETING.iso}>{NEXT_MEETING.label}</time>
            </p>
            <p className="mt-3 text-mute">Bring a friend, and bring your questions. Clear skies until then.</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {SOCIAL_LINKS.map((s) => {
                const Icon = SOCIAL_ICONS[s.kind];
                const external = s.href.startsWith("http");
                return (
                  <li key={s.kind}>
                    <a
                      href={s.href}
                      className="btn btn-ghost tap min-h-12 px-5 text-sm"
                      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
                    >
                      <Icon className="size-4.5 text-gold" />
                      {s.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
          <form onSubmit={submit}>
            <label htmlFor="topic" className="eyebrow block">
              Suggest a topic
            </label>
            <p className="mt-3 text-mute">Something you want a future session on? Tell us.</p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input
                id="topic"
                className="field"
                maxLength={LIMITS.topicMax}
                placeholder="e.g. Astrophotography with a phone"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
              <button type="submit" className="btn btn-gold tap flex-none" disabled={state.status === "sending" || topic.trim().length < 2}>
                {state.status === "sending" ? "Sending…" : "Suggest"}
              </button>
            </div>
            <p className={`mt-3 min-h-6 text-sm ${state.status === "error" ? "text-gold" : "text-mute"}`} aria-live="polite">
              {state.msg}
            </p>
          </form>
        </div>
        <div className="mt-10 flex flex-col items-center gap-3 text-center">
          <Logo className="size-10 text-ink" />
          <p className="text-sm text-mute">{CLUB_NAME} · University of the Philippines Mindanao</p>
          <p className="max-w-xs text-xs text-faint">
            {CLUB_FULL_NAME} · Est. <time dateTime={FOUNDED.iso}>{FOUNDED.label}</time>
          </p>
        </div>
        <div className="mt-8">
          <NextButton to="hero" label="The beginning" up />
        </div>
      </div>
    </footer>
  );
}
