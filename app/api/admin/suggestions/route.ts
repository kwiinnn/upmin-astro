import { isAdmin } from "@/lib/auth";
import { clearSuggestions, readAdmin } from "@/lib/data";
import { error, json } from "@/lib/http";

export async function DELETE(req: Request) {
  if (!isAdmin(req)) return error("Unauthorized", 401);
  await clearSuggestions();
  return json(await readAdmin());
}
