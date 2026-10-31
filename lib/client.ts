"use client";

import { useEffect, useState, useSyncExternalStore, type RefObject } from "react";

const noop = () => () => {};

export function useHost() {
  return useSyncExternalStore(noop, () => window.location.host, () => "");
}

export async function post<T>(url: string, data: unknown, method = "POST"): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error ?? "Something went wrong. Try again.");
  return json as T;
}

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Starts true so the server render and first client render match; motion
// is switched on after mount only for people who haven't asked for less.
export function useReducedMotion() {
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

// `seen` latches once the element first enters view; `visible` tracks it live.
export function useInView(ref: RefObject<Element | null>, threshold = 0.2, rootMargin = "0px") {
  const [state, setState] = useState({ seen: false, visible: false });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) =>
        setState((s) => ({ seen: s.seen || entry.isIntersecting, visible: entry.isIntersecting })),
      { threshold, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold, rootMargin]);
  return state;
}

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// A slow, eased "camera move" to an element. Any user scroll input cancels it.
export function cameraScrollTo(el: HTMLElement, offset = 12) {
  const target = el.getBoundingClientRect().top + window.scrollY - offset;
  const done = () => el.focus({ preventScroll: true });
  if (prefersReducedMotion()) {
    window.scrollTo(0, target);
    done();
    return;
  }
  const start = window.scrollY;
  const dist = target - start;
  const duration = Math.min(1700, 750 + Math.abs(dist) * 0.22);
  const t0 = performance.now();
  let cancelled = false;
  const cancel = () => (cancelled = true);
  const opts = { passive: true, once: true } as const;
  window.addEventListener("wheel", cancel, opts);
  window.addEventListener("touchstart", cancel, opts);
  const step = (now: number) => {
    if (cancelled) return;
    const t = Math.min(1, (now - t0) / duration);
    window.scrollTo(0, start + dist * easeInOutCubic(t));
    if (t < 1) requestAnimationFrame(step);
    else {
      window.removeEventListener("wheel", cancel);
      window.removeEventListener("touchstart", cancel);
      done();
    }
  };
  requestAnimationFrame(step);
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) cameraScrollTo(el);
}
