import { Check } from 'lucide-react';
import { deliverables } from '../../data/site';
import { Blob, Eyebrow, HudFrame, Reveal, SectionHeading } from '../ui';

const blobs = [
  'top-1/2 -translate-y-1/2 -left-[380px] h-[460px] w-[460px] bg-navy opacity-40',
  '',
  '-top-28 -right-28 h-56 w-56 bg-navy opacity-40',
  '-bottom-24 -left-24 h-56 w-56 bg-ember opacity-25',
];

export default function EveryMonth() {
  return (
    <section id="month" className="relative w-full bg-black px-4 py-20 sm:px-6 sm:py-32 md:px-10">
      <div className="mx-auto max-w-[1400px]">
        <Reveal className="mx-auto mb-12 max-w-2xl text-center sm:mb-20">
          <Eyebrow>Every month</Eyebrow>
          <SectionHeading>
            One folder. <span className="ember-text">Four things</span> in it.
          </SectionHeading>
          <p className="mx-auto mt-5 max-w-md text-[15px] font-light leading-relaxed text-white/60">
            Delivered as a private report you open on your phone, with a tracker that saves as you go.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-4">
          {deliverables.map((d, i) => (
            <Reveal key={d.n} delay={i * 0.08}>
              <article className="relative flex h-full min-h-[440px] flex-col overflow-hidden rounded-2xl bg-neutral-950 ring-1 ring-white/5">
                <Blob className={blobs[i] || '-bottom-24 -right-24 h-56 w-56 bg-fire opacity-20'} />
                <HudFrame inset="inset-2" className="opacity-60" />
                <div className="relative flex flex-1 flex-col p-6 sm:p-8">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/45">{d.n}</span>
                    <span
                      className="rounded-full border border-ember/40 px-3 py-1 text-[11px] text-ember"
                      style={{ transform: `rotate(${[-6, 5, -4, 6][i]}deg)` }}
                    >
                      {d.tag}
                    </span>
                  </div>
                  <h3 className={`mt-14 text-xl font-light leading-tight text-white sm:text-2xl`}>{d.title}</h3>
                  {i === 0 ? (
                    <p className="mt-6 flex items-baseline gap-3">
                      <span className="tight ember-text text-7xl font-medium">20</span>
                      <span className="text-[13px] font-light text-white/60">qualified prospects,<br />every month</span>
                    </p>
                  ) : (
                    <p className="mt-4 text-[13px] font-light leading-relaxed text-white/60 sm:text-[14px]">{d.body}</p>
                  )}
                  <ul className="mt-auto space-y-2.5 pt-8">
                    {d.points.map((p) => (
                      <li key={p} className="flex gap-2.5 text-[13px] font-light text-white/80">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-ember" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
