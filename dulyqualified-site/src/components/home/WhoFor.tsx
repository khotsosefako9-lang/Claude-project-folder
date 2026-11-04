import { MapPin, Shield, Sparkles } from 'lucide-react';
import { cities, sectors } from '../../data/site';
import { Blob, Eyebrow, OutlineButton, Reveal, SectionHeading } from '../ui';

const icons = [Shield, Sparkles];
const cardBlobs = [
  ['-top-24 -left-24 h-48 w-48 bg-navy opacity-40'],
  ['-top-24 -left-24 h-48 w-48 bg-ember opacity-30', '-bottom-24 -right-24 h-48 w-48 bg-[#F5D547] opacity-20'],
];

export default function WhoFor() {
  return (
    <section id="who" className="relative w-full bg-black px-4 py-20 sm:px-6 sm:py-28 md:px-10">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-8 md:grid-cols-2 md:items-end">
          <Reveal>
            <Eyebrow>Who it’s for</Eyebrow>
            <SectionHeading>Built for firms that sell on contract.</SectionHeading>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-md text-[15px] font-light leading-relaxed text-white/65 sm:text-[17px] md:ml-auto">
              Established firms, usually three years or more and twenty-odd staff, that win work through quotes, contracts and tenders.
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-3 sm:mt-16 sm:gap-4 md:grid-cols-2">
          {sectors.map((s, i) => {
            const Icon = icons[i];
            return (
              <Reveal key={s.title} delay={i * 0.1}>
                <article className="relative h-full overflow-hidden rounded-2xl bg-neutral-950 p-6 ring-1 ring-white/5 sm:p-10">
                  {cardBlobs[i].map((b) => (
                    <Blob key={b} className={b} />
                  ))}
                  <div className="relative">
                    <Icon className="h-8 w-8 text-white" strokeWidth={1.25} />
                    <h3 className="tight mt-8 text-2xl font-medium text-white sm:text-3xl">{s.title}</h3>
                    <p className="mt-2 text-[14px] font-light text-white/60">{s.body}</p>
                    <p className="mt-8 text-xs uppercase tracking-[0.18em] text-white/40">Who we find for you</p>
                    <ul className="mt-3 divide-y divide-white/5">
                      {s.buyers.map((b) => (
                        <li key={b} className="py-3 text-[14px] font-light text-white/85">{b}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3 sm:mt-4 sm:gap-4 md:grid-cols-4">
          {cities.map((c, i) => (
            <Reveal key={c.name} delay={i * 0.06}>
              <div className="relative flex h-24 items-center justify-center overflow-hidden rounded-2xl bg-neutral-950 ring-1 ring-white/5 sm:h-32">
                {c.status === 'now' && <Blob className="-bottom-20 -left-16 h-40 w-40 bg-ember opacity-30" />}
                <div className="relative text-center">
                  <p className="inline-flex items-center gap-2 text-lg font-medium text-white sm:text-2xl">
                    <MapPin className={`h-4 w-4 sm:h-5 sm:w-5 ${c.status === 'now' ? 'text-ember' : 'text-white/40'}`} />
                    {c.name}
                  </p>
                  <p className={`mt-1 text-[11px] uppercase tracking-[0.18em] ${c.status === 'now' ? 'text-ember' : 'text-white/40'}`}>
                    {c.status === 'now' ? 'Now · incl. Nelson Mandela Bay' : 'Next'}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-16 flex flex-col items-start justify-between gap-6 sm:mt-24 md:ml-auto md:w-[70%] md:flex-row md:items-center">
          <div className="max-w-md">
            <p className="text-lg text-white">One firm per service, per city.</p>
            <p className="mt-2 text-[14px] font-light leading-relaxed text-white/65 sm:text-[16px]">
              When we work with a security firm in Gqeberha, we don’t take on its competitor. Your leads and your tender pipeline stay yours.
            </p>
          </div>
          <OutlineButton to="/#call">claim your city</OutlineButton>
        </Reveal>
      </div>
    </section>
  );
}
