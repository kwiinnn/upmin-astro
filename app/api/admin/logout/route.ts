import { ADMIN_COOKIE } from "@/lib/auth";
import { json } from "@/lib/http";

export async function POST() {
  return json({ ok: true }, 200, {
    "Set-Cookie": `${ADMIN_COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Strict`,
  });
}
