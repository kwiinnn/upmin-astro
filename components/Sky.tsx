"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { CLUSTER_IDS, type ClusterId } from "@/lib/clusters";
import { scrollToId } from "@/lib/client";

type SkyState = {
  active: ClusterId | null;
  visited: Set<ClusterId>;
  go: (id: string) => void;
};

const SkyContext = createContext<SkyState>({ active: null, visited: new Set(), go: scrollToId });

export const useSky = () => useContext(SkyContext);

// Tracks which cluster section crosses the middle of the screen, and which
// ones the reader has already passed through.
export function SkyProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState<ClusterId | null>(null);
  const [visited, setVisited] = useState<Set<ClusterId>>(new Set());

  useEffect(() => {
    const els = CLUSTER_IDS.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const showing = new Set<ClusterId>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const id = e.target.id as ClusterId;
          if (e.isIntersecting) showing.add(id);
          else showing.delete(id);
        }
        const current = CLUSTER_IDS.find((id) => showing.has(id)) ?? null;
        setActive(current);
        if (current) setVisited((v) => (v.has(current) ? v : new Set(v).add(current)));
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return <SkyContext.Provider value={{ active, visited, go: scrollToId }}>{children}</SkyContext.Provider>;
}
