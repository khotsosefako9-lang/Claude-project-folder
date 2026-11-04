import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import EmberSparks from '../EmberSparks';
import { EmberButton, GhostButton, HudFrame, Mono } from '../ui';
import ReportMock from './ReportMock';

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 24, filter: 'blur(10px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] as const },
});

const sideLinks = [
  ['Leads', '/#month'],
  ['Tenders', '/#tenders'],
  ['Compliance', '/#paperwork'],
  ['Pricing', '/#pricing'],
];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const mockY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const glow = useTransform(scrollYProgress, [0, 0.6], [1, 0.4]);

  return (
    <section ref={ref} className="relative w-full overflow-hidden bg-black pt-28 sm:pt-36" aria-labelledby="hero-title">
      <HudFrame inset="inset-x-3 top-3 bottom-0 sm:inset-x-6 sm:top-6" />

      {/* HUD side details, desktop only */}
      <div className="pointer-events-none absolute left-10 top-1/3 hidden flex-col gap-2 xl:flex">
        <Mono>DQ / 01</Mono>
        <Mono className="text-white/30">33.96° S</Mono>
        <Mono className="text-white/30">25.60° E</Mono>
        <Mono className="text-white/30">Gqeberha</Mono>
      </div>
      <nav aria-label="Sections" className="absolute right-10 top-1/3 hidden flex-col items-end gap-2 xl:flex">
        {sideLinks.map(([label, to]) => (
          <Link key={label} to={to} className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/45 transition-colors hover:text-white">
            {label}
          </Link>
        ))}
      </nav>

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-5 text-center">
        <motion.div {...rise(0.05)} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] text-white/70 sm:text-xs">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-fire opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-fire" />
          </span>
          For security and cleaning firms in Gqeberha
        </motion.div>

        <motion.h1 {...rise(0.15)} id="hero-title" className="tight mt-6 text-[44px] font-medium leading-[0.98] text-white [text-wrap:balance] sm:text-7xl md:text-[88px]">
          Qualified leads.
          <br />
          <span className="ember-text">Qualified to bid.</span>
        </motion.h1>

        <motion.p {...rise(0.3)} className="mt-6 max-w-xl text-[15px] font-light leading-relaxed text-white/65 sm:text-lg">
          Every month: twenty businesses ready to hear from you, the government tenders you can win, and your compliance papers kept in order.
        </motion.p>

        <motion.div {...rise(0.45)} className="mt-8 flex w-full flex-col items-center justify-center gap-2 sm:w-auto sm:flex-row">
          <EmberButton to="/#call" className="w-full sm:w-auto">
            book a 15-minute call <ArrowRight className="h-4 w-4" />
          </EmberButton>
          <GhostButton to="/sample" className="w-full border border-white/15 sm:w-auto">
            see a sample report
          </GhostButton>
        </motion.div>
      </div>

      {/* Stage: the horizon, sparks, and the report rising out of the glow */}
      <div className="relative mt-16 sm:mt-20">
        <motion.div style={{ opacity: glow }} className="absolute inset-x-0 top-0 h-full">
          <div className="horizon" style={{ top: 120 }} />
          <div className="absolute inset-x-0" style={{ top: -240, height: 360 }}>
            <EmberSparks top={1} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 90 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 mx-auto max-w-5xl px-4 pt-[170px] sm:px-8"
        >
          <motion.div style={{ y: mockY }}>
            <ReportMock />
          </motion.div>
        </motion.div>

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 h-40 bg-gradient-to-b from-transparent to-black" />
      </div>
    </section>
  );
}
