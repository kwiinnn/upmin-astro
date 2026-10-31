"use client";

import { CLUSTERS, SKY, bbox } from "@/lib/clusters";
import { ConstellationArt, GlowDefs } from "./Constellation";
import { useSky } from "./Sky";

// Fixed corner map: lights each constellation as its section is reached,
// so scrolling the page slowly completes the sky.
export function MiniMap() {
  const { active, visited, go } = useSky();
  const complete = visited.size === CLUSTERS.length;
  return (
    <nav
      className={`minimap ${active ? "show" : ""} ${complete ? "complete" : ""}`}
      aria-label="Sections"
      aria-hidden={!active}
    >
      <svg viewBox={`0 0 ${SKY.w} ${SKY.h}`} className="block w-full">
        <GlowDefs id="miniGlow" />
        {CLUSTERS.map((c) => {
          const b = bbox(c, 18);
          return (
            <a
              key={c.id}
              href={`#${c.id}`}
              tabIndex={active ? 0 : -1}
              className={`${visited.has(c.id) ? "visited" : ""} ${active === c.id ? "active" : ""}`}
              aria-label={c.name}
              aria-current={active === c.id ? "location" : undefined}
              onClick={(e) => {
                e.preventDefault();
                go(c.id);
              }}
            >
              <rect x={b.x} y={b.y} width={b.w} height={b.h} fill="transparent" />
              <ConstellationArt c={c} glowId="miniGlow" glowR={22} coreR={6} />
            </a>
          );
        })}
      </svg>
    </nav>
  );
}
