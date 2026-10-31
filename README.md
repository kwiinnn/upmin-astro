# Mission Briefing · UP Mindanao Astro

Companion site for the club's General Assembly. Members scan a QR code, follow the talk through five "constellations" of space science one "slide" at a time, and can suggest topics for future sessions. Two extra routes: `/present`, a title screen with the QR code for the projector, and `/admin`, where you read the topic suggestions.

Next.js 16 (App Router), TypeScript, Tailwind v4, Upstash Redis. No animation libraries: the star field is one `<canvas>`, everything else is SVG and CSS.

## Run locally

```bash
npm install
cp .env.example .env.local   # then set ADMIN_PASSWORD
npm run dev                  # http://localhost:3000
```

Without Redis credentials the app falls back to an **in-memory store**. That's fine for local testing; data resets when the server restarts. `/admin` shows a warning banner while it is active.

To test on your phone on the same Wi-Fi: `npm run dev -- -H 0.0.0.0`, then open `http://<your-computer-ip>:3000`.

## Environment variables

| Variable | Required | What it is |
| --- | --- | --- |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN` | in production | Upstash Redis REST credentials. The Vercel Marketplace integration creates these automatically. |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | alternative | Same thing, under the names a direct Upstash connection uses. Either pair works. |
| `ADMIN_PASSWORD` | yes | Password for `/admin`. If it's empty, admin is disabled. Changing it signs out every admin session. |
| `NEXT_PUBLIC_SITE_URL` | optional | URL encoded by `/qr.png`. Defaults to whatever host the request came in on. |

Secrets only live in env vars. `.env*` files are git-ignored, except `.env.example`.

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. On [vercel.com/new](https://vercel.com/new), import the repo. The framework is detected as Next.js, and the defaults are fine.
3. Add Redis: in the project, go to **Storage → Create Database → Upstash for Redis** (Marketplace), pick the free plan and a region close to the Philippines (e.g. Singapore), and connect it to the project. This adds the `KV_REST_API_*` variables for you.
4. Under **Settings → Environment Variables**, add `ADMIN_PASSWORD` (Production and Preview).
5. **Redeploy** (Deployments → ⋯ → Redeploy) so the new variables take effect.
6. Open `https://<your-project>.vercel.app/admin`. Sign in and check that there is **no** "in-memory storage" warning.

Prefer the CLI? `npm i -g vercel`, then `vercel` to link and deploy. Add Redis in the dashboard (step 3), then run `vercel env add ADMIN_PASSWORD` and `vercel --prod`.

## QR code for slides

Once deployed, either:

- open `https://<your-project>.vercel.app/qr.png` and save the image (1200×1200 PNG; add `?format=svg` for a vector version), or
- run `npm run qr -- https://<your-project>.vercel.app`, which writes `qr-code.png` and `qr-code.svg` here.

If you add a custom domain, set `NEXT_PUBLIC_SITE_URL` to it, or just regenerate with the script. `/present` shows the same QR, large.

## On the day

- **Projector:** open `/present` full-screen (F11) while people come in, so they can scan the code.
- **Afterwards:** read the topic suggestions in `/admin`, then clear them.

## Security notes

- **Topic suggestions:** 2–140 characters. Markup, control characters and bidi-override characters are stripped and whitespace is collapsed; React escapes everything on render. Rate limit: 20 per 10 min per IP, kept loose because the whole room may share one campus Wi-Fi address.
- **Admin:** the password is checked in constant time and login attempts are rate-limited (8 per 10 min). The session is an HMAC-signed, HttpOnly, SameSite=Strict cookie that lasts 12 h.

## Editing content

- Cluster copy, facts, links and constellation shapes: `lib/clusters.ts`
- Club name, founding date, next meeting date, social links, length limits: `lib/site.ts` (the Facebook link is a `#` placeholder)
- Logo: `components/Logo.tsx` (vector trace of the club mark; `animated` adds the draw-in, flare and comet). Favicons are `app/favicon.ico`, `app/icon.svg` and `app/apple-icon.png`
- Colors and animation: `app/globals.css`

All animation respects `prefers-reduced-motion`. In that mode the stars don't drift or twinkle, there are no shooting stars, and the constellations show without the draw-in.

## Project layout

```
app/
  page.tsx               hero → five clusters → footer
  present/page.tsx       projector title screen with QR
  admin/page.tsx         topic suggestions
  qr.png/route.ts        QR code of the site
  api/suggest            POST
  api/admin/*            login, logout, state, suggestions
components/              Logo, StarField (canvas), Hero, MiniMap, ClusterSection, NextButton, visuals/, PresentView, AdminPanel
lib/                     clusters, site config, kv (Upstash or memory), data, sanitize, ratelimit, auth
scripts/qr.mjs           offline QR generator
```
