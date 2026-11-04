import { ArrowRight } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { closedTenders, openTenders } from '../../data/sample';
import { Eyebrow, HudFrame, Mono, OutlineButton, Reveal } from '../ui';

// Falling columns built from real tender reference numbers in the sample report.
const refs = [...openTenders, ...closedTenders].map((t) => t.ref.replace(/\s+/g, ''));

function RefRain() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const size = 13;
    let w = 0;
    let h = 0;
    let raf = 0;
    let cols: { y: number; speed: number; text: string; hot: boolean }[] = [];

    const pick = () => refs[Math.floor(Math.random() * refs.length)];
    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Array.from({ length: Math.ceil(w / (size * 1.4)) }, () => ({
        y: Math.random() * h,
        speed: 0.4 + Math.random() * 1.1,
        text: pick(),
        hot: Math.random() < 0.12,
      }));
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const frame = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.font = `${size}px "Space Mono", monospace`;
      cols.forEach((c, i) => {
        const x = i * size * 1.4;
        for (let j = 0; j < c.text.length; j++) {
          const yy = c.y - j * size;
          if (yy < -size || yy > h + size) continue;
          const head = j === 0;
          const fade = 1 - j / c.text.length;
          ctx.fillStyle = head ? (c.hot ? 'rgba(255,170,120,0.95)' : 'rgba(255,255,255,0.55)') : c.hot ? `rgba(255,106,43,${0.6 * fade})` : `rgba(255,255,255,${0.2 * fade})`;
          ctx.fillText(c.text[c.text.length - 1 - j], x, yy);
        }
        c.y += c.speed;
        if (c.y - c.text.length * size > h) {
          c.y = -Math.random() * 200;
          c.text = pick();
          c.hot = Math.random() < 0.12;
        }
      });
      if (!reduce) raf = requestAnimationFrame(frame);
    };
    frame();
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);
  return <canvas ref={ref} aria-hidden="true" className="absolute inset-0 h-full w-full" />;
}

export default function TenderRain() {
  return (
    <section id="tenders" className="relative w-full overflow-hidden bg-black px-4 py-24 sm:px-6 sm:py-32 md:px-10">
      <RefRain />
      {/* legibility mask + ember ground glow */}
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.88)_22%,rgba(0,0,0,0.4)_60%,rgba(0,0,0,0.05)_100%)]" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(ellipse_at_50%_120%,rgba(255,90,31,0.45),transparent_60%)]" />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black to-transparent" />
      <HudFrame inset="inset-3 sm:inset-6" />

      <div className="relative mx-auto max-w-5xl">
        <Reveal className="text-center">
          <Eyebrow>Tenders</Eyebrow>
          <h2 className="tight text-3xl font-light leading-[1.05] text-white [text-wrap:balance] sm:text-5xl">
            Thirteen security tenders since September. <span className="ember-text">Three still open.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[15px] font-light leading-relaxed text-white/65">
            We read every public tender in your province, keep the ones that fit your service and size, and grade them, so you only open the ones worth your time.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-3 md:grid-cols-3">
          {openTenders.map((t, i) => (
            <Reveal key={t.ref} delay={i * 0.08}>
              <article className="relative h-full rounded-2xl border border-white/10 bg-black/60 p-5 backdrop-blur-md">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-dot text-4xl font-black leading-none text-white">{t.date.split(' ')[0]}</p>
                    <Mono className="mt-1 block">{t.date.split(' ')[1]} · {t.time}</Mono>
                  </div>
                  <span className="rotate-[5deg] rounded-full border border-[#FF8A4C]/50 px-3 py-1 text-[11px] text-[#FF8A4C]">Matched</span>
                </div>
                <p className="mt-6 text-[15px] font-light text-white">{t.title}</p>
                <p className="mt-3 break-all font-mono text-[10px] text-white/40">{t.ref}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-6 flex flex-col items-center gap-6 text-center">
          <p className="max-w-2xl text-[13px] font-light leading-relaxed text-white/55">
            From the October sample report for Nelson Mandela Bay and the Sarah Baartman district. Short contracts like these come round again and again. With your papers in order, you can quote on every round instead of watching them close.
          </p>
          <OutlineButton to="/sample#tenders-list">
            see all thirteen <ArrowRight className="h-4 w-4" />
          </OutlineButton>
        </Reveal>
      </div>
    </section>
  );
}
