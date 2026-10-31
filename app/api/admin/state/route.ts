import { isAdmin } from "@/lib/auth";
import { readAdmin } from "@/lib/data";
import { error, json } from "@/lib/http";

export async function GET(req: Request) {
  if (!isAdmin(req)) return error("Unauthorized", 401);
  return json(await readAdmin());
}
