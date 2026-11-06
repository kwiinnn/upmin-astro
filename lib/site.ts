// Club-wide settings. Edit these, not the components.

export const CLUB_NAME = "UP Mindanao Astro";
export const CLUB_FULL_NAME = "Astronomy and Space Science Technology and Research Organization";
export const SITE_TITLE = "Mission Briefing";

// 11/06/2026 read as MM/DD/YYYY (6 November 2026).
export const NEXT_MEETING = {
  iso: "2026-11-06",
  label: "6 November 2026",
};

export const SOCIAL_LINKS = [
  { kind: "facebook", label: "UP Mindanao ASTRO", href: "https://www.facebook.com/share/19mjChmPMk/" },
  { kind: "instagram", label: "@upminastro", href: "https://www.instagram.com/upminastro/" },
  { kind: "email", label: "upminastro@gmail.com", href: "mailto:upminastro@gmail.com" },
] as const;

export const LIMITS = {
  topicMax: 140,
  maxStoredSuggestions: 300,
};
