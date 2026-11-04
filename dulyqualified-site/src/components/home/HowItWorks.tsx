import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { steps } from '../../data/site';
import { HudFrame, Mono } from '../ui';

// Figures from the October sample report (security firm, Nelson Mandela Bay).
const TOTAL = 1060;
const LISTED = 605;
const CHECKED = 25;
const READY = 20;

const phases = [
  { count: '1,060', label: 'commercial sites mapped across the metro', step: 0 },
  { count: '605', label: 'with a website or listing to check', step: 1 },
  { count: '25', label: 'checked by hand, incl. five from the news', step: 1 },
  { count: '20', label: 'ready to contact, each with a first message', step: 2 },
  { count: '20', label: 'in your tracker: sent, replied or not interested', step: 3 },
];

// Deterministic RNG so the "map" is the same on every load.
function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

type Pt = { x: number; y: number; rank: number; gx: number; gy: number; tw: number };

function buildPoints(): Pt[] {
  const r = rng(42);
  // Loose clusters, like business districts and industrial zones around a bay.
  const clusters = [
    [0.3, 0.42, 0.09], [0.45, 0.3, 0.07], [0.62, 0.5, 0.1], [0.22, 0.68, 0.08],
    [0.75, 0.3, 0.06], [0.52, 0.72, 0.09], [0.85, 0.62, 0.07], [0.38, 0.55, 0.12],
  ];
  const order = Array.from({ length: TOTAL }, (_, i) => i).sort(() => r() - 0.5);
  return Array.from({ length: TOTAL }, (_, i) => {
    const c = clusters[Math.floor(r() * clusters.length)];
    const a = r() * Math.PI * 2;
    const d = Math.pow(r(), 0.7) * c[2];
    const rank = order[i];
    const gi = rank < READY ? rank : 0;
    return {
      x: Math.min(0.97, Math.max(0.03, c[0] + Math.cos(a) * d * 1.4)),
      y: Math.min(0.95, Math.max(0.05, c[1] + Math.sin(a) * d)),
      rank,
      gx: 0.2 + (gi % 5) * 0.15,
      gy: 0.22 + Math.floor(gi / 5) * 0.19,
      tw: r() * Math.PI * 2,
    };
  });
}

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const ease = (t: number) => t * t * (3 - 2 * t);
const band = (p: number, a: number, b: number) => ease(clamp((p - a) / (b - a)));

function PointCloud({ progress }: { progress: React.MutableRefObject<number> }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const pts = buildPoints();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let raf = 0;
    let shown = progress.current;
    let t = 0;

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const frame = () => {
      t += 0.016;
      shown += (progress.current - shown) * 0.12;
      const p = shown;
      const fadeUnlisted = band(p, 0.16, 0.28);
      const fadeUnchecked = band(p, 0.36, 0.48);
      const fadeLeftOut = band(p, 0.56, 0.66);
      const toGrid = band(p, 0.78, 0.92);
      const ringOn = band(p, 0.38, 0.5) * (1 - band(p, 0.6, 0.7));

      ctx.clearRect(0, 0, w, h);

      // faint map grid
      ctx.strokeStyle = 'rgba(255,255,255,0.04)';
      ctx.lineWidth = 1;
      for (let gx = 0; gx <= w; gx += 48) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, h);
        ctx.stroke();
      }
      for (let gy = 0; gy <= h; gy += 48) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(w, gy);
        ctx.stroke();
      }

      for (const pt of pts) {
        const ready = pt.rank < READY;
        const checked = pt.rank < CHECKED;
        const listed = pt.rank < LISTED;

        let a = 0.55 + Math.sin(t * 1.5 + pt.tw) * 0.15;
        if (!listed) a *= 1 - fadeUnlisted * 0.85;
        if (listed && !checked) a *= 1 - fadeUnchecked * 0.8;
        if (checked && !ready) a *= 1 - fadeLeftOut * 0.75;
        if (ready) a = Math.max(a, band(p, 0.56, 0.66));

        const g = ready ? toGrid : 0;
        const x = (pt.x * (1 - g) + pt.gx * g) * w;
        const y = (pt.y * (1 - g) + pt.gy * g) * h;
        const hot = ready ? band(p, 0.56, 0.66) : 0;
        const size = 1.4 + (checked ? band(p, 0.38, 0.5) * 1.2 : 0) + hot * 2.2 + g * 2;

        if (hot > 0) {
          const glow = ctx.createRadialGradient(x, y, 0, x, y, size * 6);
          glow.addColorStop(0, `rgba(255,122,51,${0.55 * hot})`);
          glow.addColorStop(1, 'rgba(255,90,31,0)');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(x, y, size * 6, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = hot > 0 ? `rgba(255,${Math.round(255 - 120 * hot)},${Math.round(255 - 190 * hot)},${a})` : `rgba(255,255,255,${a})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();

        if (checked && ringOn > 0) {
          ctx.strokeStyle = `rgba(255,255,255,${0.5 * ringOn})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(x, y, 7 + Math.sin(t * 3 + pt.tw) * 1.5, 0, Math.PI * 2);
          ctx.stroke();
        }
        if (ready && g > 0.6) {
          ctx.fillStyle = `rgba(255,255,255,${(g - 0.6) * 2})`;
          ctx.font = '10px "Space Mono", monospace';
          ctx.fillText(String(pt.rank + 1).padStart(2, '0'), x + 10, y + 4);
        }
      }
      raf = requestAnimationFrame(frame);
    };
    frame();
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [progress]);

  return <canvas ref={ref} aria-hidden="true" className="h-full w-full" />;
}

function Heading() {
  return (
    <>
      <p className="mb-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/50">
        <span className="ember-gradient h-1.5 w-1.5 rounded-full" />
        How it works
      </p>
      <h2 className="tight text-3xl font-light leading-[1.05] text-white [text-wrap:balance] sm:text-4xl md:text-5xl">
        From every business in your city to the <span className="ember-text">twenty</span> worth calling.
      </h2>
    </>
  );
}

export default function HowItWorks() {
  const ref = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const [phase, setPhase] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    progress.current = v;
    setPhase(Math.min(phases.length - 1, Math.floor(v * phases.length)));
  });

  const current = phases[phase];
  const step = steps[current.step];

  return (
    <section id="how" ref={ref} className="relative w-full bg-black" style={{ height: '480vh' }}>
      <div className="px-4 pt-20 sm:px-6 lg:hidden">
        <Heading />
      </div>
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden px-4 pb-6 pt-20 sm:px-6 sm:pt-24 md:px-10 lg:pt-28">
        <div className="mx-auto grid w-full max-w-[1400px] flex-1 grid-rows-[minmax(0,1fr)_auto] gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:grid-rows-1 lg:gap-12">
          <div className="order-2 flex flex-col justify-center lg:order-1">
            <div className="hidden lg:block">
              <Heading />
            </div>

            {/* counter */}
            <div className="flex items-end gap-4 lg:mt-10">
              <AnimatePresence mode="wait">
                <motion.span
                  key={current.count + phase}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                  className={`font-dot text-6xl font-black leading-none sm:text-8xl ${phase >= 3 ? 'text-[#FF8A4C]' : 'text-white'}`}
                  style={{ fontVariantNumeric: 'tabular-nums' }}
                >
                  {current.count}
                </motion.span>
              </AnimatePresence>
              <p className="max-w-[200px] pb-1 text-xs font-light leading-snug text-white/55 sm:text-sm">{current.label}</p>
            </div>

            {/* step copy */}
            <div className="relative mt-3 min-h-[150px] sm:mt-6 lg:mt-8">
              <AnimatePresence mode="wait">
                <motion.div key={step.n} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.3 }}>
                  <Mono className="text-[#FF8A4C]">Step {step.n} / 04</Mono>
                  <h3 className="mt-2 text-xl font-light text-white sm:text-2xl">{step.title}</h3>
                  <p className="mt-2 line-clamp-4 max-w-md text-[13px] font-light leading-relaxed text-white/60 sm:line-clamp-none sm:text-[15px]">{step.body}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-4 hidden gap-2 sm:flex" aria-hidden="true">
              {steps.map((s, i) => (
                <span key={s.n} className={`h-1 flex-1 rounded-full transition-colors duration-500 ${i <= current.step ? 'bg-gradient-to-r from-fire to-blush' : 'bg-white/10'}`} />
              ))}
            </div>
          </div>

          <div className="relative order-1 min-h-[34svh] overflow-hidden rounded-2xl bg-[#060505] lg:order-2">
            <HudFrame inset="inset-2" />
            <div className="absolute left-4 top-4 z-10 flex gap-3">
              <Mono>Nelson Mandela Bay</Mono>
              <Mono className="hidden text-white/30 sm:inline">Market map</Mono>
            </div>
            <div className="absolute bottom-4 right-4 z-10">
              <Mono className="text-white/30">Sample report · Oct 2026</Mono>
            </div>
            <div className="absolute inset-4 sm:inset-8">
              <PointCloud progress={progress} />
            </div>
          </div>
        </div>
        <p className="mx-auto mt-3 hidden w-full max-w-[1400px] text-[11px] font-light text-white/35 sm:block">
          Our first pilot, for a Gqeberha design studio in October 2026: 368 businesses found, 201 tested, 27 checked by hand, 12 ready to contact.
        </p>
      </div>
    </section>
  );
}
