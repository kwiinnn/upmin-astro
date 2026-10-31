"use client";

import { scrollToId } from "@/lib/client";
import type { Cluster } from "@/lib/clusters";
import { ConstellationIcon } from "./Constellation";
import { ChevronDown } from "./Icons";

type Props = {
  to: string;
  label: string;
  /** Shows that constellation beside the label. */
  cluster?: Cluster;
  /** Points back up, for the last section. */
  up?: boolean;
};

// The "next slide" control at the foot of each section. It glides the page to
// the target section; plain scrolling still works, and any wheel or touch
// input cancels the glide.
export function NextButton({ to, label, cluster, up = false }: Props) {
  return (
    <div className="flex justify-center">
      <a
        href={`#${to}`}
        className="next tap"
        onClick={(e) => {
          e.preventDefault();
          scrollToId(to);
        }}
      >
        {cluster && <ConstellationIcon c={cluster} size={28} className="flex-none text-line" />}
        <span className="next-text">
          <span className="next-kicker">{up ? "Back to" : "Next"}</span>
          <span className="next-label">{label}</span>
        </span>
        <span className="next-arrow">
          <ChevronDown className={`size-5 ${up ? "rotate-180" : ""}`} />
        </span>
      </a>
    </div>
  );
}
