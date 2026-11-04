import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { videos } from '../../data/site';
import { BgVideo, EmberButton, GhostButton } from '../ui';

const word = (delay: number) => ({
  initial: { opacity: 0, y: 60, filter: 'blur(12px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  transition: { duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] as const },
});

function Stat({ value, caption, side, rotate, className }: { value: string; caption: string; side: 'left' | 'right'; rotate: number; className: string }) {
  return (
    <motion.div {...word(0.9)} className={`absolute flex items-center gap-4 ${className}`}>
      {side === 'left' && <span className="hidden h-px w-24 bg-white/40 md:block" style={{ transform: `rotate(${rotate}deg)` }} />}
      <div>
        <p className="tight text-2xl font-medium sm:text-4xl md:text-5xl">{value}</p>
        <p className="mt-1 text-[10px] font-light text-white/70 sm:text-xs md:text-sm">{caption}</p>
      </div>
      {side === 'right' && <span className="hidden h-px w-24 bg-white/40 md:block" style={{ transform: `rotate(${rotate}deg)` }} />}
    </motion.div>
  );
}

export default function Hero() {
  return (
    <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-black" aria-labelledby="hero-title">
      <BgVideo src={videos.hero} />
      <div className="absolute inset-0 bg-black/30" aria-hidden="true" />

      <div className="relative z-10 mx-auto h-full w-full max-w-[1320px]">
        <h1 id="hero-title" className="sr-only">
          Duly Qualified: qualified leads, qualified to bid.
        </h1>
        {/* Phones and tablets: stacked layout */}
        <div className="flex h-full flex-col justify-end px-4 pb-10 pt-28 sm:px-6 lg:hidden">
          <div aria-hidden="true" className="hero-title text-[19vw] font-medium text-white sm:text-[16vw]">
            <motion.p {...word(0.1)}>qualified</motion.p>
            <motion.p {...word(0.25)} className="text-right">
              leads<span className="ember-text">.</span>
            </motion.p>
            <motion.p {...word(0.4)} className="pl-[8%]">
              to bid<span className="ember-text">.</span>
            </motion.p>
          </div>
          <motion.p {...word(0.6)} className="mt-6 max-w-md text-[15px] font-light leading-relaxed text-white/90 sm:text-[17px]">
            Every month: twenty businesses ready to hear from you, the government tenders you can win, and your compliance papers kept in order.
          </motion.p>
          <motion.dl {...word(0.8)} className="mt-6 grid grid-cols-3 gap-3 border-t border-white/15 pt-5">
            {[
              ['20', 'checked prospects a month'],
              ['11', 'tender documents tracked'],
              ['1 firm', 'per service, per city'],
            ].map(([v, c]) => (
              <div key={c}>
                <dt className="tight text-2xl font-medium sm:text-3xl">{v}</dt>
                <dd className="mt-1 text-[11px] font-light leading-snug text-white/70 sm:text-xs">{c}</dd>
              </div>
            ))}
          </motion.dl>
          <motion.div {...word(1)} className="mt-7 flex flex-col gap-2 sm:flex-row">
            <EmberButton to="/#call" className="w-full sm:w-auto">
              book a 15-minute call <ArrowRight className="h-4 w-4" />
            </EmberButton>
            <GhostButton to="/sample" className="w-full bg-neutral-900/80 backdrop-blur sm:w-auto">see a sample report</GhostButton>
          </motion.div>
        </div>

        {/* Desktop: Guardnet scattered layout */}
        <div className="hidden lg:block">
          <motion.p {...word(0.1)} aria-hidden="true" className="hero-title absolute left-10 top-[16%] text-[15vw] font-medium text-white 2xl:text-[220px]">
            qualified
          </motion.p>
          <motion.p {...word(0.25)} aria-hidden="true" className="hero-title absolute right-10 top-[37%] text-[15vw] font-medium text-white 2xl:text-[220px]">
            leads<span className="ember-text">.</span>
          </motion.p>
          <motion.p {...word(0.4)} aria-hidden="true" className="hero-title absolute left-[30%] top-[57%] text-[15vw] font-medium text-white 2xl:text-[220px]">
            to bid<span className="ember-text">.</span>
          </motion.p>

          <motion.div {...word(0.6)} className="absolute left-10 top-[46%] max-w-[320px]">
            <p className="text-[17px] font-light leading-relaxed text-white/90">
              Every month: twenty businesses ready to hear from you, the government tenders you can win, and your compliance papers kept in order.
            </p>
          </motion.div>

          <Stat value="20" caption="checked prospects, every month" side="right" rotate={-20} className="bottom-32 left-10" />
          <Stat value="11" caption="tender documents tracked" side="left" rotate={20} className="right-10 top-[24%]" />
          <Stat value="1 firm" caption="per service, per city" side="left" rotate={-20} className="bottom-32 right-10 text-right" />

          {/* Static wrapper does the centring; framer-motion owns the inner transform. */}
          <div className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2">
            <motion.div {...word(1.1)} className="flex w-max items-center gap-1 rounded-full bg-neutral-900/80 p-2 backdrop-blur">
              <GhostButton to="/sample">see a sample report</GhostButton>
              <EmberButton to="/#call">
                book a 15-minute call <ArrowRight className="h-3.5 w-3.5" />
              </EmberButton>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent to-black" />
    </section>
  );
}
