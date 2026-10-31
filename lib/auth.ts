import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_COOKIE = "astro_admin";
const MAX_AGE = 60 * 60 * 12; // 12 hours

const password = () => process.env.ADMIN_PASSWORD ?? "";
export const adminEnabled = () => password().length > 0;

const digest = (s: string) => createHash("sha256").update(s).digest();

export function checkPassword(attempt: unknown) {
  if (!adminEnabled() || typeof attempt !== "string") return false;
  return timingSafeEqual(digest(attempt), digest(password()));
}

function sign(issued: string) {
  return createHmac("sha256", password()).update(`astro-admin:${issued}`).digest("base64url");
}

export function issueToken() {
  const issued = String(Math.floor(Date.now() / 1000));
  return { value: `${issued}.${sign(issued)}`, maxAge: MAX_AGE };
}

// Changing ADMIN_PASSWORD invalidates every issued cookie.
export function isAdmin(req: Request) {
  if (!adminEnabled()) return false;
  const cookie = req.headers.get("cookie") ?? "";
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${ADMIN_COOKIE}=([^;]+)`));
  if (!match) return false;
  const [issued, sig] = decodeURIComponent(match[1]).split(".");
  if (!issued || !sig) return false;
  const age = Date.now() / 1000 - parseInt(issued, 10);
  if (!(age >= 0 && age < MAX_AGE)) return false;
  const expected = Buffer.from(sign(issued));
  const given = Buffer.from(sig);
  return expected.length === given.length && timingSafeEqual(expected, given);
}
