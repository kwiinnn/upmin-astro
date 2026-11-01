"use client";

import { useEffect, useRef } from "react";
import { createSky } from "@/lib/sky";

type Meteor = { x: number; y: number; vx: number; vy: number; len: number; age: number; life: number };

// The background is the real sky (lib/sky.ts): a NASA star map drawn on the
// GPU, opening on the sky overhead at UP Mindanao right now, north up, and
// turning as a slow time-lapse. This canvas sets that view and draws the
// occasional shooting star on top.
const SITE = { lat: 7.08, lon: 125.48 };
const RAD = Math.PI / 180;
const FOV = 100; // degrees across the screen diagonal
const TIMELAPSE = 40; // × real sidereal rate
const PAN = 0.08; // px of sky movement per px scrolled

// Local sidereal time in degrees: the right ascension on the meridian.
function siderealDeg(lon: number) {
  const jd = Date.now() / 86400000 + 2440587.5;
  return (((280.46061837 + 360.98564736629 * (jd - 2451545) + lon) % 360) + 360) % 360;
}

const rand = (min: number, max: number) => min + Math.random() * (max - min);

function meteorSprite() {
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
  const skyRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d", { alpha: true })!;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sprite = meteorSprite();
    const skyCanvas = skyRef.current!;
    const sky = createSky(skyCanvas, { phone: window.innerWidth < 768, gain: cinematic ? 1.15 : 1 });
    const speed = cinematic ? 0.5 : 1;

    let w = 0;
    let h = 0;
    let scale = 0;
    let ra0 = siderealDeg(SITE.lon) * RAD;
    let meteor: Meteor | null = null;
    let nextMeteor = performance.now() + rand(6000, 15000);
    let raf = 0;
    let last = performance.now();
    let lastSky = 0;
    let lastY = -1;
    let dirty = false; // the meteor canvas has something on it

    // The canvases are 100lvh tall (globals.css), so a phone's address bar
    // sliding in and out doesn't resize them; only real changes (rotation,
    // window resizes) get here, and they don't make the sky jump.
    const resize = () => {
      w = skyCanvas.clientWidth;
      h = skyCanvas.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, w < 768 ? 1.5 : 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sky?.resize(w, h, dpr);
      // Stereographic projection: px per unit so the diagonal spans FOV.
      scale = Math.hypot(w, h) / 2 / (2 * Math.tan((FOV / 4) * RAD));
      draw(0, true);
    };

    // The sky drifts only ~1 px/s, so between scrolls ~24 fps is plenty;
    // scrolling redraws every frame so the pan stays in step.
    const draw = (dt: number, force = false) => {
      const now = performance.now();
      if (force || window.scrollY !== lastY || now - lastSky > 40) {
        lastSky = now;
        lastY = window.scrollY;
        renderSky();
      }
      if (dirty) ctx.clearRect(0, 0, w, h);
      dirty = !!meteor;
      if (meteor) drawMeteor(dt);
      ctx.globalAlpha = 1;
    };

    const renderSky = () => {
      // View centre: overhead at the site, panned south as the page scrolls.
      const dec0 = Math.max(-85 * RAD, SITE.lat * RAD - (window.scrollY * PAN) / scale);
      const [cr, sr, cd, sd] = [Math.cos(ra0), Math.sin(ra0), Math.cos(dec0), Math.sin(dec0)];
      sky?.render({
        east: [-sr, cr, 0],
        north: [-sd * cr, -sd * sr, cd],
        forward: [cd * cr, cd * sr, sd],
        scale,
      });
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
      ra0 += (360.98564736629 / 86400) * TIMELAPSE * speed * dt * RAD;
      if (!meteor && now > nextMeteor) {
        spawnMeteor();
        nextMeteor = now + rand(15000, 30000);
      }
      draw(dt);
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      if (motion.matches) {
        meteor = null;
        draw(0, true);
        window.addEventListener("scroll", onStaticScroll, { passive: true });
      } else {
        window.removeEventListener("scroll", onStaticScroll);
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    };

    // Reduced motion: the sky holds still, but still pans gently on scroll.
    let pending = false;
    const onStaticScroll = () => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => {
        pending = false;
        draw(0, true);
      });
    };

    let resizeTimer = 0;
    const sizer = new ResizeObserver(() => {
      if (skyCanvas.clientWidth === w && skyCanvas.clientHeight === h) return;
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 120);
    });

    let alive = true;
    resize();
    start();
    sky?.loaded.then(
      () => {
        if (!alive) return;
        draw(0, true);
        skyCanvas.classList.add("ready");
      },
      () => {},
    );
    sizer.observe(skyCanvas);
    motion.addEventListener("change", start);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      sizer.disconnect();
      window.removeEventListener("scroll", onStaticScroll);
      motion.removeEventListener("change", start);
    };
  }, [cinematic]);

  return (
    <>
      <canvas ref={skyRef} className="sky" aria-hidden="true" />
      <canvas ref={ref} className="starfield" aria-hidden="true" />
    </>
  );
}
