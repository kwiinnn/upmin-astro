import { useId } from "react";

// The ASTRO mark, traced from the club's logo. Coordinates are in the
// original 810×810 artwork; the viewBox crops to the mark. The swoosh is a
// filled taper, TRACE is its centre line (used to draw it in and to fly the
// comet along it).
const VIEWBOX = "150 157 510 510";

const SWOOSH =
  "M648.0 231.5L639.0 231.5L629.8 231.5L620.3 231.7L610.6 231.9L600.7 232.2L590.7 232.6L580.4 233.1L570.1 233.7L559.6 234.4L549.0 235.2L538.4 236.1L527.8 237.1L517.1 238.2L506.5 239.4L495.9 240.7L485.4 242.2L475.0 243.7L464.6 245.4L454.4 247.2L444.4 249.2L434.6 251.3L424.9 253.5L415.5 255.8L406.3 258.3L397.4 260.9L388.8 263.7L380.5 266.7L372.6 269.8L365.0 273.1L357.7 276.6L350.9 280.3L344.5 284.2L338.5 288.3L332.9 292.7L327.9 297.5L323.4 302.5L319.4 308.0L316.2 313.8L313.7 320.0L312.0 326.5L311.5 330.6L311.5 334.6L311.9 338.4L312.7 342.2L313.8 345.8L315.2 349.2L316.8 352.5L318.7 355.6L320.8 358.5L323.0 361.2L325.3 363.9L327.8 366.4L330.4 368.8L333.1 371.1L335.8 373.3L338.6 375.5L341.5 377.6L344.3 379.6L347.3 381.6L350.2 383.6L353.2 385.5L356.1 387.4L359.0 389.2L361.9 391.1L364.8 392.9L367.6 394.7L370.3 396.5L373.0 398.3L375.5 400.1L378.0 401.8L380.3 403.5L382.5 405.3L384.5 407.0L386.4 408.6L388.1 410.3L389.5 411.8L390.8 413.4L391.9 414.9L392.8 416.2L393.6 417.6L395.2 420.7L397.1 423.7L399.2 426.5L401.4 429.1L403.8 431.6L406.2 434.0L408.8 436.3L411.4 438.5L414.2 440.7L417.0 442.8L419.8 444.8L422.7 446.8L425.6 448.8L428.5 450.7L431.4 452.6L434.4 454.4L437.3 456.3L440.2 458.1L443.0 459.9L445.8 461.7L448.5 463.6L451.1 465.4L453.7 467.1L456.1 468.9L458.4 470.7L460.6 472.5L462.6 474.2L464.4 475.9L466.1 477.6L467.6 479.3L468.9 480.9L470.0 482.5L470.9 484.0L471.7 485.4L472.2 486.8L472.6 488.1L472.9 489.4L473.0 490.7L473.0 492.1L473.0 493.5L472.5 496.9L471.4 500.2L469.9 503.6L467.7 507.1L464.9 510.7L461.6 514.4L457.6 518.1L453.0 521.8L447.8 525.5L442.1 529.1L435.9 532.6L429.2 536.1L422.1 539.5L414.6 542.7L406.6 545.9L398.3 549.0L389.7 552.0L380.8 554.8L371.6 557.6L362.2 560.2L352.5 562.7L342.6 565.1L332.6 567.4L322.5 569.5L312.2 571.5L301.8 573.5L291.4 575.3L281.0 576.9L270.5 578.5L260.0 579.9L249.6 581.2L239.3 582.4L229.0 583.5L218.9 584.4L208.9 585.2L199.1 585.9L189.4 586.5L180.0 587.0L170.9 587.3L162.0 587.5L162.0 587.5A2.5 2.5 0 0 1 162.0 592.5L162.0 592.5L171.0 592.5L180.2 592.5L189.7 592.3L199.4 592.1L209.3 591.8L219.3 591.4L229.6 590.9L239.9 590.3L250.4 589.6L261.0 588.8L271.6 587.9L282.2 586.9L292.9 585.8L303.5 584.6L314.1 583.3L324.6 581.8L335.0 580.3L345.4 578.6L355.6 576.8L365.6 574.8L375.4 572.7L385.1 570.5L394.5 568.2L403.7 565.7L412.6 563.1L421.2 560.3L429.5 557.3L437.4 554.2L445.0 550.9L452.3 547.4L459.1 543.7L465.5 539.8L471.5 535.7L477.1 531.3L482.1 526.5L486.6 521.5L490.6 516.0L493.8 510.2L496.3 504.0L498.0 497.5L498.5 493.4L498.5 489.4L498.1 485.6L497.3 481.8L496.2 478.2L494.8 474.8L493.2 471.5L491.3 468.4L489.2 465.5L487.0 462.8L484.7 460.1L482.2 457.6L479.6 455.2L476.9 452.9L474.2 450.7L471.4 448.5L468.5 446.4L465.7 444.4L462.7 442.4L459.8 440.4L456.8 438.5L453.9 436.6L451.0 434.8L448.1 432.9L445.2 431.1L442.4 429.3L439.7 427.5L437.0 425.7L434.5 423.9L432.0 422.2L429.7 420.5L427.5 418.7L425.5 417.0L423.6 415.4L421.9 413.7L420.5 412.2L419.2 410.6L418.1 409.1L417.2 407.8L416.4 406.4L414.8 403.3L412.9 400.3L410.8 397.5L408.6 394.9L406.2 392.4L403.8 390.0L401.2 387.7L398.6 385.5L395.8 383.3L393.0 381.2L390.2 379.2L387.3 377.2L384.4 375.2L381.5 373.3L378.6 371.4L375.6 369.6L372.7 367.7L369.8 365.9L367.0 364.1L364.2 362.3L361.5 360.4L358.9 358.6L356.3 356.9L353.9 355.1L351.6 353.3L349.4 351.5L347.4 349.8L345.6 348.1L343.9 346.4L342.4 344.7L341.1 343.1L340.0 341.5L339.1 340.0L338.3 338.6L337.8 337.2L337.4 335.9L337.1 334.6L337.0 333.3L337.0 331.9L337.0 330.5L337.5 327.1L338.6 323.8L340.1 320.4L342.3 316.9L345.1 313.3L348.4 309.6L352.4 305.9L357.0 302.2L362.2 298.5L367.9 294.9L374.1 291.4L380.8 287.9L387.9 284.5L395.4 281.3L403.4 278.1L411.7 275.0L420.3 272.0L429.2 269.2L438.4 266.4L447.8 263.8L457.5 261.3L467.4 258.9L477.4 256.6L487.5 254.5L497.8 252.5L508.2 250.5L518.6 248.7L529.0 247.1L539.5 245.5L550.0 244.1L560.4 242.8L570.7 241.6L581.0 240.5L591.1 239.6L601.1 238.8L610.9 238.1L620.6 237.5L630.0 237.0L639.1 236.7L648.0 236.5A2.5 2.5 0 0 1 648.0 231.5Z";

const TRACE = "M648.0 234.0C531.0 234.5 334.5 262.0 324.5 328.5C318.9 365.6 390.5 382.0 405.0 412.0C419.5 442.0 491.1 458.4 485.5 495.5C475.5 562.0 279.0 589.5 162.0 590.0";

const STAR = "M393.9 311.2Q405.0 278.5 416.1 311.2L438.5 377.5L504.8 399.9Q537.5 411.0 504.8 422.1L438.5 444.5L416.1 510.8Q405.0 543.5 393.9 510.8L371.5 444.5L305.2 422.1Q272.5 411.0 305.2 399.9L371.5 377.5Z";

type Props = {
  className?: string;
  /** Draw-in, star flare, glow and a comet looping along the swoosh. */
  animated?: boolean;
  /** Accessible name. Omit when the club name is already next to the mark. */
  title?: string;
};

export function Logo({ className = "size-10", animated = false, title }: Props) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const ids = { glow: `${uid}-glow`, flare: `${uid}-flare`, mask: `${uid}-mask` };
  const a11y = title ? { role: "img", "aria-label": title } : { "aria-hidden": true };

  if (!animated) {
    return (
      <svg viewBox={VIEWBOX} className={`logo ${className}`} fill="currentColor" {...a11y}>
        <path d={SWOOSH} />
        <path d={STAR} />
      </svg>
    );
  }

  return (
    <svg viewBox={VIEWBOX} className={`logo logo-anim ${className}`} fill="currentColor" overflow="visible" {...a11y}>
      <defs>
        <radialGradient id={ids.glow}>
          <stop offset="0" stopColor="#f1ecff" stopOpacity="0.85" />
          <stop offset="0.3" stopColor="#b9a6ff" stopOpacity="0.4" />
          <stop offset="1" stopColor="#6f55d9" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={ids.flare}>
          <stop offset="0" stopColor="#fff" />
          <stop offset="0.4" stopColor="#d9ceff" stopOpacity="0.6" />
          <stop offset="1" stopColor="#b9a6ff" stopOpacity="0" />
        </radialGradient>
        {/* Explicit bounds: the default mask region is measured from 0,0, not
            from the cropped viewBox, and would cut off both tails. */}
        <mask id={ids.mask} maskUnits="userSpaceOnUse" x={0} y={0} width={810} height={810}>
          <path
            className="logo-trace"
            d={TRACE}
            pathLength={1}
            fill="none"
            stroke="#fff"
            strokeWidth={64}
            strokeLinecap="round"
          />
        </mask>
      </defs>

      <circle className="logo-glow" cx={405} cy={411} r={300} fill={`url(#${ids.glow})`} />
      <path className="logo-swoosh" d={SWOOSH} mask={`url(#${ids.mask})`} />
      <g className="logo-spin">
        <path className="logo-star" d={STAR} />
      </g>
      <g className="logo-flare" fill={`url(#${ids.flare})`}>
        <ellipse cx={405} cy={411} rx={300} ry={5} />
        <ellipse cx={405} cy={411} rx={4} ry={250} />
        <circle cx={405} cy={411} r={22} />
      </g>

      {/* Comet: rests, then runs the swoosh tail to tail every 9 s. */}
      <g className="logo-comet" opacity={0}>
        <circle r={30} fill={`url(#${ids.flare})`} />
        <circle r={9} fill="#fff" />
        <animateMotion
          path={TRACE}
          begin="2.4s"
          dur="9s"
          repeatCount="indefinite"
          keyPoints="0;0;1;1"
          keyTimes="0;0.55;0.85;1"
          calcMode="linear"
        />
        <animate
          attributeName="opacity"
          begin="2.4s"
          dur="9s"
          repeatCount="indefinite"
          values="0;0;1;1;0;0"
          keyTimes="0;0.55;0.6;0.8;0.85;1"
        />
      </g>
    </svg>
  );
}
