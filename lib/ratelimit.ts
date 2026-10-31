import "server-only";
import { kv } from "./kv";

// Fixed-window counter. Returns true when the request is allowed.
export async function allow(bucket: string, id: string, limit: number, windowSec: number) {
  const slot = Math.floor(Date.now() / 1000 / windowSec);
  const key = `rl:${bucket}:${id}:${slot}`;
  const n = await kv.incr(key);
  if (n === 1) await kv.expire(key, windowSec + 5);
  return n <= limit;
}
