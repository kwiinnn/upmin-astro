import "server-only";
import { Redis } from "@upstash/redis";

// The handful of Redis commands the app uses. Backed by Upstash when its env
// vars are present, otherwise by an in-memory store for local development.
export interface KV {
  get(key: string): Promise<string | null>;
  incr(key: string): Promise<number>;
  expire(key: string, seconds: number): Promise<unknown>;
  del(...keys: string[]): Promise<unknown>;
  hget(key: string, field: string): Promise<string | null>;
  hset(key: string, values: Record<string, string>): Promise<unknown>;
  hdel(key: string, ...fields: string[]): Promise<unknown>;
  hincrby(key: string, field: string, by: number): Promise<number>;
  hgetall(key: string): Promise<Record<string, string>>;
  hlen(key: string): Promise<number>;
  sadd(key: string, member: string): Promise<number>;
  lpush(key: string, value: string): Promise<unknown>;
  ltrim(key: string, start: number, stop: number): Promise<unknown>;
  lrange(key: string, start: number, stop: number): Promise<string[]>;
}

function upstash(url: string, token: string): KV {
  const r = new Redis({ url, token, automaticDeserialization: false });
  return {
    get: (k) => r.get<string>(k),
    incr: (k) => r.incr(k),
    expire: (k, s) => r.expire(k, s),
    del: (...k) => r.del(...k),
    hget: (k, f) => r.hget<string>(k, f),
    hset: (k, v) => r.hset(k, v),
    hdel: (k, ...f) => r.hdel(k, ...f),
    hincrby: (k, f, by) => r.hincrby(k, f, by),
    hgetall: async (k) => (await r.hgetall<Record<string, string>>(k)) ?? {},
    hlen: (k) => r.hlen(k),
    sadd: (k, m) => r.sadd(k, m),
    lpush: (k, v) => r.lpush(k, v),
    ltrim: (k, a, b) => r.ltrim(k, a, b),
    lrange: (k, a, b) => r.lrange<string>(k, a, b),
  };
}

type Entry = { v: string | Map<string, string> | Set<string> | string[]; exp?: number };

function memory(): KV {
  const g = globalThis as unknown as { __astroMem?: Map<string, Entry> };
  const db = (g.__astroMem ??= new Map());

  const live = (k: string) => {
    const e = db.get(k);
    if (e?.exp && e.exp < Date.now()) {
      db.delete(k);
      return undefined;
    }
    return e;
  };
  const hash = (k: string) => {
    let e = live(k);
    if (!e) db.set(k, (e = { v: new Map() }));
    return e.v as Map<string, string>;
  };
  const list = (k: string) => {
    let e = live(k);
    if (!e) db.set(k, (e = { v: [] }));
    return e.v as string[];
  };

  return {
    async get(k) {
      const e = live(k);
      return typeof e?.v === "string" ? e.v : null;
    },
    async incr(k) {
      const e = live(k);
      const n = (typeof e?.v === "string" ? parseInt(e.v, 10) : 0) + 1;
      db.set(k, { v: String(n), exp: e?.exp });
      return n;
    },
    async expire(k, s) {
      const e = live(k);
      if (e) e.exp = Date.now() + s * 1000;
      return e ? 1 : 0;
    },
    async del(...ks) {
      ks.forEach((k) => db.delete(k));
      return ks.length;
    },
    async hget(k, f) {
      return hash(k).get(f) ?? null;
    },
    async hset(k, v) {
      const h = hash(k);
      Object.entries(v).forEach(([f, val]) => h.set(f, val));
      return 1;
    },
    async hdel(k, ...fs) {
      const h = hash(k);
      fs.forEach((f) => h.delete(f));
      return fs.length;
    },
    async hincrby(k, f, by) {
      const h = hash(k);
      const n = parseInt(h.get(f) ?? "0", 10) + by;
      h.set(f, String(n));
      return n;
    },
    async hgetall(k) {
      return Object.fromEntries(hash(k));
    },
    async hlen(k) {
      return hash(k).size;
    },
    async sadd(k, m) {
      let e = live(k);
      if (!e) db.set(k, (e = { v: new Set() }));
      const s = e.v as Set<string>;
      if (s.has(m)) return 0;
      s.add(m);
      return 1;
    },
    async lpush(k, v) {
      return list(k).unshift(v);
    },
    async ltrim(k, a, b) {
      const l = list(k);
      l.splice(0, l.length, ...l.slice(a, b + 1));
      return "OK";
    },
    async lrange(k, a, b) {
      return list(k).slice(a, b === -1 ? undefined : b + 1);
    },
  };
}

// The Vercel Marketplace integration sets KV_REST_API_*; a direct Upstash
// connection uses UPSTASH_REDIS_REST_*. Accept either.
const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

export const storage: "redis" | "memory" = url && token ? "redis" : "memory";

if (
  storage === "memory" &&
  process.env.NODE_ENV === "production" &&
  process.env.NEXT_PHASE !== "phase-production-build"
) {
  console.warn(
    "[astro] No Upstash Redis env vars found: using in-memory storage. Data will not persist or sync between server instances.",
  );
}

export const kv: KV = url && token ? upstash(url, token) : memory();
