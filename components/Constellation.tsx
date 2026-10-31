import { CLUSTERS, SKY, bbox, type Cluster } from "@/lib/clusters";

export function GlowDefs({ id = "starGlow" }: { id?: string }) {
  return (
    <defs>
      <radialGradient id={id}>
        <stop offset="0%" stopColor="#fff6dd" stopOpacity="0.95" />
        <stop offset="22%" stopColor="#f3c96b" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#9db4e6" stopOpacity="0" />
      </radialGradient>
    </defs>
  );
}

// Lines and stars of one constellation. `delay` (seconds) staggers the intro
// draw; it is ignored unless an ancestor has the `intro` class.
export function ConstellationArt({
  c,
  delay = 0,
  glowId = "starGlow",
  glowR = 9,
  coreR = 2,
}: {
  c: Cluster;
  delay?: number;
  glowId?: string;
  glowR?: number;
  coreR?: number;
}) {
  const starsDone = delay + c.stars.length * 0.12;
  return (
    <>
      {c.lines.map(([a, b], k) => (
        <path
          key={`l${k}`}
          className="c-line"
          d={`M${c.stars[a][0]} ${c.stars[a][1]}L${c.stars[b][0]} ${c.stars[b][1]}`}
          pathLength={1}
          style={{ "--d": `${starsDone - 0.2 + k * 0.1}s` } as React.CSSProperties}
        />
      ))}
      {c.stars.map(([x, y], j) => (
        <g key={`s${j}`} className="c-star" style={{ "--d": `${delay + j * 0.12}s` } as React.CSSProperties}>
          <circle className="c-glow" cx={x} cy={y} r={glowR} fill={`url(#${glowId})`} />
          <circle className="c-core" cx={x} cy={y} r={j === 0 ? coreR * 1.3 : coreR} />
        </g>
      ))}
    </>
  );
}

// Tight viewBox around a single constellation, for icons.
export function ConstellationIcon({ c, size = 40, className = "" }: { c: Cluster; size?: number; className?: string }) {
  const b = bbox(c, 14);
  const side = Math.max(b.w, b.h);
  return (
    <svg
      viewBox={`${b.cx - side / 2} ${b.cy - side / 2} ${side} ${side}`}
      width={size}
      height={size}
      aria-hidden="true"
      className={className}
    >
      {c.lines.map(([a, bb], k) => (
        <path
          key={k}
          d={`M${c.stars[a][0]} ${c.stars[a][1]}L${c.stars[bb][0]} ${c.stars[bb][1]}`}
          stroke="currentColor"
          strokeOpacity={0.6}
          strokeWidth={side / 40}
          strokeLinecap="round"
        />
      ))}
      {c.stars.map(([x, y], j) => (
        <circle key={j} cx={x} cy={y} r={side / (j === 0 ? 16 : 22)} fill="currentColor" />
      ))}
    </svg>
  );
}

export { CLUSTERS, SKY };
