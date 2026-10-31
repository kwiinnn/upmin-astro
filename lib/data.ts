import "server-only";
import { kv, storage } from "./kv";
import { LIMITS } from "./site";
import type { AdminData, Suggestion } from "./types";

const K = { suggestions: "sg:list" };

export async function readAdmin(): Promise<AdminData> {
  const rawSuggestions = await kv.lrange(K.suggestions, 0, -1);
  const suggestions: Suggestion[] = [];
  for (const raw of rawSuggestions) {
    try {
      suggestions.push(JSON.parse(raw));
    } catch {}
  }
  return { suggestions, storage };
}

export async function addSuggestion(topic: string) {
  const s: Suggestion = { topic, createdAt: Date.now() };
  await kv.lpush(K.suggestions, JSON.stringify(s));
  await kv.ltrim(K.suggestions, 0, LIMITS.maxStoredSuggestions - 1);
}

export async function clearSuggestions() {
  await kv.del(K.suggestions);
}
