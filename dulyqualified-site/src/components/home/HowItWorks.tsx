import { motion } from 'framer-motion';
import { pilotFunnel, steps } from '../../data/site';
import { Blob, Eyebrow, Reveal, SectionHeading } from '../ui';

export default function HowItWorks() {
  const max = pilotFunnel[0].value;
  return (
    <section id="how" className="relative w-full overflow-hidden bg-black px-4 py-20 sm:px-6 sm:py-32 md:px-10">
      <Blob className="-left-60 top-20 h-[460px] w-[460px] bg-navy opacity-30" />
      <div className="relative mx-auto max-w-[1400px]">
        <div className="grid gap-10 md:grid-cols-[1.1fr_1fr] md:items-end">
          <Reveal>
            <Eyebrow>How it works</Eyebrow>
            <SectionHeading>
              From every business in your city to the <span className="ember-text">twenty</span> worth calling.
            </SectionHeading>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-md text-[15px] font-light leading-relaxed text-white/70 sm:text-[17px]">
              Most lead lists are a spreadsheet of names. Ours is a short list a person has checked, with a reason to call now and the first message already written.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-3 sm:mt-20 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.08}>
              <div className="group relative h-full overflow-hidden rounded-2xl bg-neutral-950 p-6 ring-1 ring-white/5 transition-colors hover:ring-white/15 sm:p-8">
                <span className="tight text-5xl font-light text-white/15 transition-colors group-hover:text-ember/60">{s.n}</span>
                <h3 className="mt-10 text-xl font-light leading-tight text-white sm:text-2xl">{s.title}</h3>
                <p className="mt-4 text-[13px] font-light leading-relaxed text-white/60 sm:text-[14px]">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-4">
          <div className="relative overflow-hidden rounded-2xl bg-neutral-950 p-6 ring-1 ring-white/5 sm:p-10">
            <Blob className="-bottom-32 -right-24 h-72 w-72 bg-ember opacity-20" />
            <div className="relative grid gap-8 lg:grid-cols-[260px_1fr] lg:items-center">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/45">Pilot · October 2026</p>
                <p className="mt-3 text-lg font-light leading-snug text-white">From our first pilot, for a Gqeberha design studio.</p>
              </div>
              <div className="space-y-3">
                {pilotFunnel.map((f, i) => (
                  <div key={f.label} className="flex items-center gap-4">
                    <div className="relative h-11 flex-1 overflow-hidden rounded-full bg-white/[0.04]">
                      <motion.div
                        className={`absolute inset-y-0 left-0 rounded-full ${i === pilotFunnel.length - 1 ? 'ember-gradient' : 'bg-white/15'}`}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${Math.max((f.value / max) * 100, 9)}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.1, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                      />
                      <span className={`absolute inset-y-0 left-4 flex items-center text-sm ${i === pilotFunnel.length - 1 ? 'text-black' : 'text-white'}`}>
                        {f.value}
                      </span>
                    </div>
                    <span className="w-32 shrink-0 text-xs font-light text-white/60 sm:w-40 sm:text-sm">{f.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
