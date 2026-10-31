import { addSuggestion } from "@/lib/data";
import { body, clientKey, error, json } from "@/lib/http";
import { allow } from "@/lib/ratelimit";
import { cleanText } from "@/lib/sanitize";
import { LIMITS } from "@/lib/site";

export async function POST(req: Request) {
  const topic = cleanText((await body(req)).topic, { min: 2, max: LIMITS.topicMax });
  if (!topic) return error(`Topics need 2–${LIMITS.topicMax} characters.`, 400);
  if (!(await allow("sg", clientKey(req), 20, 600)))
    return error("Thanks! That's plenty of suggestions for now.", 429);
  await addSuggestion(topic);
  return json({ ok: true }, 201);
}
