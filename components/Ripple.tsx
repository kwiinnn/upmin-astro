"use client";

import { useEffect } from "react";

// One listener for the whole page: any `.tap` element gets a soft glow
// ripple from the point where it was pressed.
export function Ripple() {
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest?.(".tap") as HTMLElement | null;
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--rx", `${e.clientX - r.left}px`);
      el.style.setProperty("--ry", `${e.clientY - r.top}px`);
      el.classList.remove("rippling");
      void el.offsetWidth;
      el.classList.add("rippling");
    };
    const onEnd = (e: AnimationEvent) => {
      if (e.animationName === "ripple") (e.target as HTMLElement).classList.remove("rippling");
    };
    document.addEventListener("pointerdown", onDown, { passive: true });
    document.addEventListener("animationend", onEnd);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("animationend", onEnd);
    };
  }, []);
  return null;
}
