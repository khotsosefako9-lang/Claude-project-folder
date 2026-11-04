import { Check, X } from 'lucide-react';
import { plans, promises, terms } from '../../data/site';
import { Blob, EmberButton, Eyebrow, OutlineButton, Reveal, SectionHeading } from '../ui';

export default function Pricing() {
  return (
    <section id="pricing" className="relative w-full overflow-hidden bg-black px-4 py-20 sm:px-6 sm:py-32 md:px-10">
      <Blob className="left-1/2 top-40 h-[500px] w-[700px] -translate-x-1/2 bg-navy opacity-25" />
      <div className="relative mx-auto max-w-[1400px]">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow>Pricing</Eyebrow>
          <SectionHeading>
            Priced so <span className="ember-text">one contract</span> can pay for the year.
          </SectionHeading>
          <p className="mx-auto mt-5 max-w-md text-[15px] font-light leading-relaxed text-white/60">
            Simple monthly pricing. Start with a launch month, then choose Starter or Growth.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-3 sm:mt-20 sm:gap-4 lg:grid-cols-3">
          {plans.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.08}>
              <article
                className={`relative flex h-full flex-col overflow-hidden rounded-2xl p-6 sm:p-8 ${
                  p.featured ? 'bg-neutral-950 ring-1 ring-ember/50' : 'bg-neutral-950 ring-1 ring-white/5'
                }`}
              >
                {p.featured && <Blob className="-right-24 -top-24 h-64 w-64 bg-ember opacity-25" />}
                <div className="relative flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.18em] text-white/50">{p.badge}</span>
                  {p.id === 'launch' && <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] text-white/80">First 3 clients</span>}
                  {p.featured && <span className="ember-gradient rounded-full px-3 py-1 text-[11px] text-black">Includes bids</span>}
                </div>
                <h3 className="relative mt-6 text-2xl font-light text-white">{p.name}</h3>
                <p className="relative mt-4 flex items-baseline gap-2">
                  <span className="tight text-5xl font-medium text-white">{p.price}</span>
                  <span className="text-sm text-white/50">{p.per}</span>
                </p>
                <p className="relative mt-4 text-[14px] font-light leading-relaxed text-white/65">{p.blurb}</p>
                {p.founding && <p className="relative mt-4 rounded-xl bg-ember/10 px-4 py-3 text-[13px] text-ember">{p.founding}</p>}
                <ul className="relative mt-8 space-y-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-3 text-[14px] font-light text-white/85">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-ember" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="relative mt-auto pt-10">
                  {p.featured ? (
                    <EmberButton to="/#call" className="w-full">book a call</EmberButton>
                  ) : (
                    <OutlineButton to="/#call" className="w-full [&>span]:w-full [&>span]:justify-center">book a call</OutlineButton>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-4">
          <div className="grid gap-3 sm:gap-4 lg:grid-cols-3">
            <div className="rounded-2xl bg-neutral-950 p-6 ring-1 ring-white/5 sm:p-8">
              <h3 className="text-lg font-light text-white">The terms, in plain English</h3>
              <ul className="mt-5 space-y-4 text-[14px] font-light leading-relaxed text-white/65">
                {terms.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-neutral-950 p-6 ring-1 ring-white/5 sm:p-8">
              <h3 className="text-lg font-light text-white">What we promise</h3>
              <ul className="mt-5 space-y-3">
                {promises.yes.map((t) => (
                  <li key={t} className="flex gap-3 text-[14px] font-light text-white/85">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" /> {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-neutral-950 p-6 ring-1 ring-white/5 sm:p-8">
              <h3 className="text-lg font-light text-white">What we don’t promise</h3>
              <ul className="mt-5 space-y-3">
                {promises.no.map((t) => (
                  <li key={t} className="flex gap-3 text-[14px] font-light text-white/55">
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-white/35" /> {t}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-xs font-light leading-relaxed text-white/40">Those depend on you, your price and the buyer. We make sure you’re in front of the right ones, with your papers in order.</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
