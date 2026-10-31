import { ADMIN_COOKIE, adminEnabled, checkPassword, issueToken } from "@/lib/auth";
import { body, clientKey, error, json } from "@/lib/http";
import { allow } from "@/lib/ratelimit";

export async function POST(req: Request) {
  if (!adminEnabled()) return error("Admin is disabled: set ADMIN_PASSWORD.", 503);
  if (!(await allow("login", clientKey(req), 8, 600)))
    return error("Too many attempts. Wait ten minutes.", 429);
  if (!checkPassword((await body(req)).password)) return error("Wrong password.", 401);
  const { value, maxAge } = issueToken();
  const https =
    req.headers.get("x-forwarded-proto") === "https" || new URL(req.url).protocol === "https:";
  const secure = https ? "; Secure" : "";
  return json({ ok: true }, 200, {
    "Set-Cookie": `${ADMIN_COOKIE}=${value}; Path=/; Max-Age=${maxAge}; HttpOnly; SameSite=Strict${secure}`,
  });
}
