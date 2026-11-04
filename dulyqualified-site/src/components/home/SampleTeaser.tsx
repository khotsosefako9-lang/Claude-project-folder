import { ArrowRight } from 'lucide-react';
import { leads } from '../../data/sample';
import { Blob, EmberButton, Eyebrow, Reveal, SectionHeading } from '../ui';

const teaser = [leads[0], leads[1], leads[2], leads[10]];

export default function SampleTeaser() {
  return (
    <section className="relative w-full overflow-hidden bg-black px-4 py-20 sm:px-6 sm:py-28 md:px-10">
      <div className="relative mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
        <Reveal>
          <Eyebrow>Sample report</Eyebrow>
          <SectionHeading>See what lands in your inbox.</SectionHeading>
          <p className="mt-6 max-w-md text-[15px] font-light leading-relaxed text-white/65 sm:text-[17px]">
            A full October report for a Gqeberha security firm: 20 qualified prospects, the tenders open right now, and a compliance checklist. Business names are hidden in the sample.
          </p>
          <EmberButton to="/sample" className="mt-8">
            open the sample report <ArrowRight className="h-4 w-4" />
          </EmberButton>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative">
            <Blob className="-left-10 -top-10 h-64 w-64 bg-navy opacity-50" />
            <Blob className="-bottom-10 -right-10 h-56 w-56 bg-ember opacity-25" />
            <div className="relative rotate-[-1.5deg] rounded-3xl bg-neutral-950 p-5 shadow-2xl shadow-black ring-1 ring-white/10 transition-transform duration-500 hover:rotate-0 sm:p-7">
              <div className="flex items-center justify-between text-xs text-white/50">
                <span>October report · Security · Gqeberha</span>
                <span className="rounded-full bg-white/10 px-2.5 py-1 text-white/70">Sample</span>
              </div>
              <p className="tight mt-5 text-2xl font-light text-white sm:text-3xl">20 businesses ready to hear from you</p>
              <ol className="mt-6 space-y-2">
                {teaser.map((l, i) => (
                  <li key={l.type} className="flex items-center gap-4 rounded-xl bg-white/[0.03] p-3 sm:p-4">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/10 text-xs text-white">{i === 3 ? 11 : i + 1}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-white">{l.type}</p>
                      <p className="truncate text-xs font-light text-white/50">{l.angle}</p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] ${l.tag === 'Why now' ? 'ember-gradient text-black' : 'bg-white/10 text-white/80'}`}>{l.tag}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
