"use client";

import { useEffect, useRef } from "react";

type Star = { x: number; y: number; r: number; a: number; tw: number; ph: number; flare: number; color: string };
type Layer = { stars: Star[]; parallax: number; drift: number; glow: boolean };
type Meteor = { x: number; y: number; vx: number; vy: number; len: number; age: number; life: number };

// Three depth layers: many faint stars, fewer medium ones, a handful of bright ones.
// `density` is stars per 10,000 px²; `cap` is [phone, desktop].
const LAYERS = [
  { density: 4, cap: [110, 260], r: [0.35, 0.8], a: [0.22, 0.5], parallax: 0.03, drift: 1.1, glow: false },
  { density: 1.2, cap: [38, 90], r: [0.7, 1.15], a: [0.45, 0.8], parallax: 0.08, drift: 2.2, glow: false },
  { density: 0.25, cap: [8, 18], r: [1.1, 1.6], a: [0.8, 1], parallax: 0.16, drift: 3.4, glow: true },
];

const COLORS = ["#e8efff", "#e8efff", "#e8efff", "#cddcff", "#ffe6b8"];

const rand = (min: number, max: number) => min + Math.random() * (max - min);

function glowSprite() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, "rgba(255,244,220,0.9)");
  grad.addColorStop(0.18, "rgba(243,214,150,0.35)");
  grad.addColorStop(1, "rgba(160,190,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  return c;
}

export function StarField({ cinematic = false }: { cinematic?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d", { alpha: true })!;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sprite = glowSprite();
    const sizeBoost = cinematic ? 1.35 : 1;
    const speed = cinematic ? 0.5 : 1;

    let w = 0;
    let h = 0;
    let layers: Layer[] = [];
    let meteor: Meteor | null = null;
    let nextMeteor = performance.now() + rand(6000, 15000);
    let raf = 0;
    let last = performance.now();
    let t = 0;

    const build = () => {
      const phone = w < 768;
      layers = LAYERS.map((L) => {
        const n = Math.min(L.cap[phone ? 0 : 1], Math.round(((w * h) / 10000) * L.density));
        return {
          parallax: L.parallax,
          drift: L.drift,
          glow: L.glow,
          stars: Array.from({ length: n }, () => ({
            x: Math.random() * w,
            y: Math.random() * h,
            r: rand(L.r[0], L.r[1]) * sizeBoost,
            a: rand(L.a[0], L.a[1]),
            tw: rand(0.4, 1.6),
            ph: Math.random() * Math.PI * 2,
            flare: 0,
            color: COLORS[(Math.random() * COLORS.length) | 0],
          })),
        };
      });
    };

    const resize = () => {
      const nw = window.innerWidth;
      const nh = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, nw < 768 ? 1.5 : 2);
      canvas.width = Math.round(nw * dpr);
      canvas.height = Math.round(nh * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Mobile URL bars change only the height; keep the sky stable then.
      const rebuild = nw !== w || layers.length === 0;
      w = nw;
      h = nh;
      if (rebuild) build();
      if (motion.matches) draw(0, false);
    };

    const draw = (dt: number, animate: boolean) => {
      ctx.clearRect(0, 0, w, h);
      const sy = window.scrollY;
      const decay = Math.pow(0.08, dt);
      for (const L of layers) {
        const off = sy * L.parallax;
        for (const s of L.stars) {
          let a = s.a;
          let r = s.r;
          if (animate) {
            s.x += L.drift * speed * dt;
            if (s.x > w + 4) s.x -= w + 8;
            if (Math.random() < dt * 0.02) s.flare = 1;
            s.flare *= decay;
            a = s.a * (0.68 + 0.32 * Math.sin(t * s.tw + s.ph)) + s.flare * 0.5;
            r = s.r * (1 + s.flare * 0.6);
          }
          const y = (((s.y - off) % h) + h) % h;
          ctx.globalAlpha = Math.min(1, a);
          if (L.glow) {
            const g = r * 9;
            ctx.drawImage(sprite, s.x - g / 2, y - g / 2, g, g);
          }
          ctx.fillStyle = s.color;
          if (r < 0.9) ctx.fillRect(s.x - r, y - r, r * 2, r * 2);
          else {
            ctx.beginPath();
            ctx.arc(s.x, y, r, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      if (meteor) drawMeteor(dt);
      ctx.globalAlpha = 1;
    };

    const spawnMeteor = () => {
      const angle = rand(0.25, 0.55) * (Math.random() < 0.5 ? 1 : -1);
      const v = (w < 768 ? 620 : 900) * (cinematic ? 0.65 : 1);
      const fromLeft = angle > 0;
      meteor = {
        x: fromLeft ? rand(-0.1, 0.5) * w : rand(0.5, 1.1) * w,
        y: rand(0, 0.35) * h,
        vx: Math.cos(Math.abs(angle)) * v * (fromLeft ? 1 : -1),
        vy: Math.sin(Math.abs(angle)) * v,
        len: rand(120, 220) * (cinematic ? 1.4 : 1),
        age: 0,
        life: rand(0.9, 1.3) * (cinematic ? 1.5 : 1),
      };
    };

    const drawMeteor = (dt: number) => {
      const m = meteor!;
      m.age += dt;
      m.x += m.vx * dt;
      m.y += m.vy * dt;
      const p = m.age / m.life;
      if (p >= 1) {
        meteor = null;
        return;
      }
      const fade = Math.sin(Math.PI * p);
      const sp = Math.hypot(m.vx, m.vy);
      const tx = m.x - (m.vx / sp) * m.len;
      const ty = m.y - (m.vy / sp) * m.len;
      const grad = ctx.createLinearGradient(m.x, m.y, tx, ty);
      grad.addColorStop(0, `rgba(255,240,210,${0.95 * fade})`);
      grad.addColorStop(1, "rgba(160,190,255,0)");
      ctx.globalAlpha = 1;
      ctx.strokeStyle = grad;
      ctx.lineWidth = cinematic ? 1.8 : 1.3;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(tx, ty);
      ctx.stroke();
      ctx.globalAlpha = fade;
      ctx.drawImage(sprite, m.x - 8, m.y - 8, 16, 16);
    };

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      t += dt * speed;
      if (!meteor && now > nextMeteor) {
        spawnMeteor();
        nextMeteor = now + rand(15000, 30000);
      }
      draw(dt, true);
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      if (motion.matches) {
        meteor = null;
        draw(0, false);
        window.addEventListener("scroll", onStaticScroll, { passive: true });
      } else {
        window.removeEventListener("scroll", onStaticScroll);
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    };

    // Reduced motion: no drift or twinkle, but keep gentle parallax on scroll.
    let pending = false;
    const onStaticScroll = () => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => {
        pending = false;
        draw(0, false);
      });
    };

    let resizeTimer = 0;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 120);
    };

    resize();
    start();
    window.addEventListener("resize", onResize);
    motion.addEventListener("change", start);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onStaticScroll);
      motion.removeEventListener("change", start);
    };
  }, [cinematic]);

  return (
    <>
      <div className="nebula" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <canvas ref={ref} className="starfield" aria-hidden="true" />
    </>
  );
}
