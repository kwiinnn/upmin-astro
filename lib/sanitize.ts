// Normalise user text before it is stored. React escapes on render, so this is
// about keeping stored data clean: no markup, no control or bidi-override
// characters, no runaway whitespace, bounded length.
const TAGS = /<\/?[a-z!][^>]*>/gi;
const CONTROL = /[\u0000-\u001F\u007F-\u009F\u00AD\u200B-\u200F\u2028-\u202E\u2060-\u2069\uFEFF]/g;

export function cleanText(input: unknown, { min = 1, max }: { min?: number; max: number }) {
  if (typeof input !== "string" || input.length > max * 4) return null;
  const s = input
    .normalize("NFKC")
    .replace(TAGS, "")
    .replace(CONTROL, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (s.length < min || s.length > max) return null;
  return s;
}
