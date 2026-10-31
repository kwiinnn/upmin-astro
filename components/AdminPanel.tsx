"use client";

import { useCallback, useEffect, useState } from "react";
import { post } from "@/lib/client";
import type { AdminData } from "@/lib/types";

export function AdminPanel() {
  const [data, setData] = useState<AdminData | null>(null);
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(
    () =>
      fetch("/api/admin/state", { cache: "no-store" }).then(async (res) => {
        if (res.status === 401) setAuthed(false);
        else if (res.ok) {
          setData(await res.json());
          setAuthed(true);
        }
      }),
    [],
  );

  useEffect(() => {
    const t = setInterval(() => document.visibilityState === "visible" && load(), 3000);
    load();
    return () => clearInterval(t);
  }, [load]);

  const act = async (url: string, method: string, body: unknown = {}) => {
    setBusy(true);
    setError(null);
    try {
      setData(await post<AdminData>(url, body, method));
    } catch (e) {
      setError((e as Error).message);
      if ((e as Error).message === "Unauthorized") setAuthed(false);
    } finally {
      setBusy(false);
    }
  };

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await post("/api/admin/login", { password });
      setPassword("");
      await load();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  if (authed === null) return <p className="wrap py-20 text-faint">Loading…</p>;

  if (!authed)
    return (
      <form onSubmit={login} className="wrap max-w-md py-20">
        <p className="eyebrow">Admin</p>
        <h1 className="display mt-3 text-5xl">Mission control</h1>
        <label htmlFor="pw" className="mt-8 block text-sm text-mute">
          Password
        </label>
        <input
          id="pw"
          type="password"
          autoComplete="current-password"
          className="field mt-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="btn btn-gold tap mt-4 w-full">
          Sign in
        </button>
        {error && <p className="mt-4 text-gold" role="alert">{error}</p>}
      </form>
    );

  return (
    <div className="wrap flex flex-col gap-10 py-12">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Admin</p>
          <h1 className="display mt-2 text-5xl">Mission control</h1>
        </div>
        <button
          type="button"
          className="btn btn-ghost tap"
          onClick={async () => {
            await post("/api/admin/logout", {});
            setAuthed(false);
          }}
        >
          Sign out
        </button>
      </header>

      {data!.storage === "memory" && (
        <p className="panel border-gold/50 p-4 text-gold" role="alert">
          Running on in-memory storage. Data will not persist or sync between servers. Connect Upstash Redis (see README).
        </p>
      )}
      {error && <p className="text-gold" role="alert">{error}</p>}

      <section aria-labelledby="a-s">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="a-s" className="display text-3xl">
            Topic suggestions <span className="text-mute">· {data!.suggestions.length}</span>
          </h2>
          {data!.suggestions.length > 0 && (
            <button
              type="button"
              className="btn btn-ghost tap"
              disabled={busy}
              onClick={() => confirm("Clear all suggestions?") && act("/api/admin/suggestions", "DELETE")}
            >
              Clear
            </button>
          )}
        </div>
        <ul className="mt-5 flex flex-col gap-2">
          {data!.suggestions.map((s, i) => (
            <li key={i} className="panel p-4">
              {s.topic}
              <span className="ml-2 text-sm text-faint">{new Date(s.createdAt).toLocaleString()}</span>
            </li>
          ))}
          {data!.suggestions.length === 0 && <li className="text-faint">None yet.</li>}
        </ul>
      </section>
    </div>
  );
}
