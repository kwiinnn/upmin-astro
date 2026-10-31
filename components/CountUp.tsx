"use client";

import { useEffect, useState } from "react";
import { prefersReducedMotion } from "@/lib/client";

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

export function format(n: number, decimals = 0, plain = false) {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: !plain,
  });
}

// Counts from `from` to `value` once `start` turns true.
export function CountUp({
  value,
  from = 0,
  start,
  decimals = 0,
  plain = false,
  duration = 1800,
}: {
  value: number;
  from?: number;
  start: boolean;
  decimals?: number;
  plain?: boolean;
  duration?: number;
}) {
  const [n, setN] = useState(from);
  useEffect(() => {
    if (!start) return;
    const ms = prefersReducedMotion() ? 0 : duration;
    const t0 = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const t = ms ? Math.min(1, (now - t0) / ms) : 1;
      setN(from + (value - from) * easeOutExpo(t));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [start, value, from, duration]);
  return <>{format(n, decimals, plain)}</>;
}
