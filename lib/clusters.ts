// The five clusters: copy, links, and constellation geometry.
// Star coordinates live in a shared 360 x 480 "sky" so the hero and the
// mini-map draw the same constellations.

export type ClusterId = "universe" | "worlds" | "look" | "going" | "society";

export type Fact = {
  value: number;
  decimals?: number;
  from?: number;
  prefix?: string;
  suffix?: string;
  plain?: boolean; // no thousands separator (years)
  label: string;
  detail: string;
};

export type Cluster = {
  id: ClusterId;
  numeral: string;
  name: string;
  disciplines: string;
  question: string;
  description: string;
  fact: Fact;
  tryIt: { label: string; href: string; note: string };
  learnMore: { label: string; href: string; note: string };
  stars: [number, number][];
  lines: [number, number][];
  labelAt: [number, number];
  labelAnchor: "start" | "middle" | "end";
};

export const SKY = { w: 360, h: 480 };

export const CLUSTERS: Cluster[] = [
  {
    id: "universe",
    numeral: "I",
    name: "The Universe Itself",
    disciplines: "Cosmology · Astrophysics",
    question: "Where did everything come from?",
    description:
      "Cosmology and astrophysics trace the universe from the Big Bang to the physics that powers every star and shapes every galaxy.",
    fact: {
      value: 13.8,
      decimals: 1,
      suffix: " billion years",
      label: "The age of the universe",
      detail:
        "The oldest light we can detect, the cosmic microwave background, was released when the universe was only about 380,000 years old.",
    },
    tryIt: {
      label: "WorldWide Telescope",
      href: "https://worldwidetelescope.org/webclient/",
      note: "Fly through real sky surveys, from nearby stars to distant galaxies.",
    },
    learnMore: {
      label: "ESA · Planck mission",
      href: "https://www.esa.int/Science_Exploration/Space_Science/Planck",
      note: "The mission that mapped the universe's oldest light.",
    },
    stars: [
      [92, 128],
      [44, 82],
      [86, 46],
      [140, 62],
      [156, 112],
    ],
    lines: [
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
      [1, 2],
      [2, 3],
    ],
    labelAt: [100, 156],
    labelAnchor: "middle",
  },
  {
    id: "worlds",
    numeral: "II",
    name: "Worlds and Life",
    disciplines: "Planetary Science · Astrobiology",
    question: "Where else could life exist?",
    description:
      "Planetary science and astrobiology ask how worlds are built, and which of them might be able to host life.",
    fact: {
      value: 6000,
      suffix: "+",
      label: "Confirmed planets beyond our Solar System",
      detail:
        "NASA's count of confirmed exoplanets passed 6,000 in 2025, and thousands more candidates are still waiting to be checked.",
    },
    tryIt: {
      label: "NASA Eyes on Exoplanets",
      href: "https://eyes.nasa.gov/apps/exo/",
      note: "Visit thousands of known exoplanets in 3D.",
    },
    learnMore: {
      label: "NASA Astrobiology",
      href: "https://astrobiology.nasa.gov/",
      note: "How scientists search for life beyond Earth.",
    },
    stars: [
      [222, 150],
      [246, 116],
      [292, 112],
      [318, 146],
      [292, 184],
      [244, 186],
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 0],
    ],
    labelAt: [270, 92],
    labelAnchor: "middle",
  },
  {
    id: "look",
    numeral: "III",
    name: "How We Look",
    disciplines: "Observational Astronomy · Optics",
    question: "How do we know what we can't touch?",
    description:
      "Observational astronomy and optics turn faint light into knowledge, with telescopes that see far beyond what our eyes can.",
    fact: {
      value: 2.5,
      decimals: 1,
      suffix: " million years",
      label: "Age of the light you see from Andromeda",
      detail:
        "From a dark site the Andromeda Galaxy is visible to the naked eye. The light reaching you left it about 2.5 million years ago: you are seeing the past.",
    },
    tryIt: {
      label: "Stellarium Web",
      href: "https://stellarium-web.org/",
      note: "A free planetarium in your browser. See tonight's sky over Davao.",
    },
    learnMore: {
      label: "ESASky",
      href: "https://sky.esa.int/",
      note: "Compare the same patch of sky in X-ray, visible, infrared and radio light.",
    },
    stars: [
      [38, 300],
      [96, 266],
      [152, 232],
      [76, 336],
      [124, 338],
    ],
    lines: [
      [0, 1],
      [1, 2],
      [1, 3],
      [1, 4],
    ],
    labelAt: [30, 218],
    labelAnchor: "start",
  },
  {
    id: "going",
    numeral: "IV",
    name: "Going There",
    disciplines: "Exploration · Engineering & Technology · Architecture",
    question: "How do we get there, and how do we stay?",
    description:
      "The missions, spacecraft and habitats that carry people and machines off Earth, and keep them alive out there.",
    fact: {
      value: 24,
      prefix: "~",
      suffix: " hours",
      label: "For a radio signal to reach Voyager 1",
      detail:
        "Launched in 1977, Voyager 1 is the most distant human-made object. It is now close to one light-day from Earth: a command sent today arrives tomorrow.",
    },
    tryIt: {
      label: "NASA Eyes on the Solar System",
      href: "https://eyes.nasa.gov/apps/solar-system/",
      note: "Follow real spacecraft, including Voyager, in real time.",
    },
    learnMore: {
      label: "ESA · Space Engineering & Technology",
      href: "https://www.esa.int/Enabling_Support/Space_Engineering_Technology",
      note: "How spacecraft and space systems get designed and built.",
    },
    stars: [
      [318, 246],
      [288, 262],
      [304, 286],
      [258, 318],
      [236, 298],
      [276, 340],
      [224, 362],
    ],
    lines: [
      [0, 1],
      [0, 2],
      [1, 3],
      [2, 3],
      [3, 4],
      [3, 5],
      [3, 6],
    ],
    labelAt: [330, 380],
    labelAnchor: "end",
  },
  {
    id: "society",
    numeral: "V",
    name: "Space and Society",
    disciplines: "Ethnoastronomy · Policy & Law · Science Communication",
    question: "Whose sky is it?",
    description:
      "How cultures read the sky, who governs space, and how discoveries reach everyone, not only scientists.",
    fact: {
      value: 1967,
      from: 1900,
      plain: true,
      label: "The year the Outer Space Treaty opened for signature",
      detail:
        "Under it, no country can claim the Moon or any other celestial body as national territory. Exploring space is “the province of all mankind.”",
    },
    tryIt: {
      label: "Globe at Night",
      href: "https://globeatnight.org/",
      note: "Citizen science: measure light pollution from where you stand.",
    },
    learnMore: {
      label: "UNOOSA · The Outer Space Treaty",
      href: "https://www.unoosa.org/oosa/en/ourwork/spacelaw/treaties/introouterspacetreaty.html",
      note: "The founding document of international space law.",
    },
    stars: [
      [112, 452],
      [128, 414],
      [180, 394],
      [232, 414],
      [248, 452],
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 0],
    ],
    labelAt: [180, 474],
    labelAnchor: "middle",
  },
];

export const CLUSTER_IDS = CLUSTERS.map((c) => c.id);

export function bbox(c: Cluster, pad = 0) {
  const xs = c.stars.map((s) => s[0]);
  const ys = c.stars.map((s) => s[1]);
  const x0 = Math.min(...xs) - pad;
  const y0 = Math.min(...ys) - pad;
  const x1 = Math.max(...xs) + pad;
  const y1 = Math.max(...ys) + pad;
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2 };
}
