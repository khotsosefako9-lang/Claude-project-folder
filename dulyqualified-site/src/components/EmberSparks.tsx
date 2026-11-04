import { useEffect, useRef } from 'react';

/** Sparks drifting up off the horizon line. Canvas, so it costs nothing to load. */
/** `top` is the arc's highest point as a fraction of the canvas height; the arc's radius matches .horizon. */
export default function EmberSparks({ top, className = '' }: { top: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let w = 0;
    let h = 0;
    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    type P = { x: number; y: number; vx: number; vy: number; life: number; max: number; r: number };
    let ps: P[] = [];

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const spawn = (): P => {
      const x = Math.random() * w;
      const R = (window.innerWidth >= 1024 ? 0.75 : 0.95) * window.innerWidth;
      const dx = x - w / 2;
      const y = h * top + R - Math.sqrt(Math.max(0, R * R - dx * dx));
      const max = 90 + Math.random() * 160;
      return { x, y, vx: (Math.random() - 0.5) * 0.35, vy: -(0.25 + Math.random() * 0.9), life: 0, max, r: 0.6 + Math.random() * 1.6 };
    };

    resize();
    ps = Array.from({ length: Math.round(w / 9) }, () => {
      const p = spawn();
      p.life = Math.random() * p.max;
      return p;
    });

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      for (const p of ps) {
        p.life++;
        p.x += p.vx + Math.sin((p.life + p.y) * 0.02) * 0.2;
        p.y += p.vy;
        const t = p.life / p.max;
        if (t >= 1) Object.assign(p, spawn());
        const a = Math.sin(Math.PI * Math.min(t, 1)) * 0.9;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        g.addColorStop(0, `rgba(255, 214, 180, ${a})`);
        g.addColorStop(0.35, `rgba(255, 122, 51, ${a * 0.7})`);
        g.addColorStop(1, 'rgba(255, 90, 31, 0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!reduce) raf = requestAnimationFrame(draw);
    };
    draw();

    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [top]);

  return <canvas ref={ref} aria-hidden="true" className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} />;
}
