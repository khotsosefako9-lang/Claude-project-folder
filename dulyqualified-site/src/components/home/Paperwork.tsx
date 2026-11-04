import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useRef } from 'react';
import ComplianceFolder from '../ComplianceFolder';
import { Eyebrow, Reveal, SectionHeading } from '../ui';

type Doc = {
  title: string;
  detail: string;
  status: 'In place' | 'Renew in 12 days' | 'Missing';
  pos: string;
  rot: number;
  speed: number;
  front: boolean;
};

// Certificates drift past the giant word: some in front of the letters, some behind.
const docs: Doc[] = [
  { title: 'CSD supplier number', detail: 'National Treasury Central Supplier Database', status: 'In place', pos: 'left-[2%] top-[6%] sm:left-[6%]', rot: -9, speed: -120, front: false },
  { title: 'Tax compliance PIN', detail: 'SARS eFiling', status: 'In place', pos: 'left-[30%] top-[52%] sm:left-[24%]', rot: 6, speed: -220, front: true },
  { title: 'PSIRA letter of good standing', detail: 'Must be valid at closing', status: 'Renew in 12 days', pos: 'right-[4%] top-[2%] sm:right-[14%]', rot: 8, speed: -160, front: true },
  { title: 'COIDA letter of good standing', detail: 'Compensation Fund', status: 'Missing', pos: 'right-[2%] top-[58%] sm:right-[6%]', rot: -6, speed: -260, front: false },
  { title: 'B-BBEE certificate or affidavit', detail: 'Level of contributor', status: 'In place', pos: 'hidden sm:block left-[50%] top-[0%]', rot: -3, speed: -90, front: false },
  { title: 'PSSPF letter of good standing', detail: 'Private Security Sector Provident Fund', status: 'Missing', pos: 'hidden md:block left-[4%] top-[64%]', rot: 4, speed: -200, front: true },
];

const stamp: Record<Doc['status'], string> = {
  'In place': 'border-ok text-ok',
  'Renew in 12 days': 'border-warn text-warn',
  Missing: 'border-bad text-bad',
};

function Certificate({ d, progress }: { d: Doc; progress: MotionValue<number> }) {
  const y = useTransform(progress, [0, 1], [0, d.speed]);
  const missing = d.status === 'Missing';
  return (
    <motion.div style={{ y, rotate: d.rot }} className={`absolute ${d.pos} ${d.front ? 'z-20' : 'z-0'} w-[150px] sm:w-[210px]`}>
      {missing ? (
        <div className="rounded-lg border-2 border-dashed border-ink/25 bg-paper/70 p-3 backdrop-blur-sm sm:p-4">
          <p className="text-[11px] text-ink/80 sm:text-sm">{d.title}</p>
          <p className="mt-1 text-[9px] text-ink/40 sm:text-[11px]">{d.detail}</p>
          <div className="mt-6 h-10 sm:mt-10" />
          <span className={`inline-block -rotate-6 rounded border-2 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest sm:text-[11px] ${stamp[d.status]}`}>{d.status}</span>
        </div>
      ) : (
        <div className="rounded-lg bg-card p-3 text-ink ring-1 ring-ink/10 shadow-[0_24px_50px_-20px_rgba(37,38,31,0.35)] sm:p-4">
          <p className="text-[11px] font-medium sm:text-sm">{d.title}</p>
          <p className="mt-1 text-[9px] text-ink/50 sm:text-[11px]">{d.detail}</p>
          <div className="mt-3 space-y-1.5" aria-hidden="true">
            <div className="h-1 w-full rounded bg-ink/10" />
            <div className="h-1 w-4/5 rounded bg-ink/10" />
            <div className="h-1 w-3/5 rounded bg-ink/10" />
          </div>
          <span className={`mt-4 inline-block -rotate-6 rounded border-2 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest sm:text-[11px] ${stamp[d.status]}`}>{d.status}</span>
        </div>
      )}
    </motion.div>
  );
}

export default function Paperwork() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const wordX = useTransform(scrollYProgress, [0, 1], ['2%', '-2%']);

  return (
    <section id="paperwork" className="relative w-full overflow-hidden bg-paper py-20 sm:py-28">
      <Reveal className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <Eyebrow>Tenders and compliance</Eyebrow>
        <SectionHeading className="[text-wrap:balance]">
          Most firms lose tenders on paperwork, <span className="ember-text">not price.</span>
        </SectionHeading>
        <p className="mx-auto mt-5 max-w-lg text-[15px] font-light leading-relaxed text-ink/60">
          A missing letter of good standing gets a bid thrown out before anyone looks at your rate.
        </p>
      </Reveal>

      <div ref={ref} className="relative mx-auto mt-10 h-[380px] max-w-[1500px] sm:mt-16 sm:h-[560px]">
        {docs.map((d) => (
          <Certificate key={d.title} d={d} progress={scrollYProgress} />
        ))}
        <motion.p
          style={{ x: wordX }}
          aria-hidden="true"
          className="hero-title pointer-events-none absolute inset-x-0 top-1/2 z-10 -translate-y-1/2 select-none whitespace-nowrap text-center text-[14.5vw] font-medium uppercase text-transparent [-webkit-background-clip:text] [background-clip:text] [background-image:linear-gradient(180deg,#25261f_10%,rgba(37,38,31,0.12)_95%)] 2xl:text-[290px]"
        >
          Paperwork
        </motion.p>
      </div>

      <div className="relative mx-auto mt-10 grid max-w-[1400px] gap-12 px-4 sm:mt-16 sm:px-6 md:px-10 lg:grid-cols-2 lg:gap-20">
        <div>
          <Reveal>
            <Eyebrow>Ready on the day it opens</Eyebrow>
            <SectionHeading>Your papers, kept current. Your bids, ready to sign.</SectionHeading>
          </Reveal>
          <Reveal delay={0.1} className="mt-8 space-y-5 text-[15px] font-light leading-relaxed text-ink/70 sm:text-[17px]">
            <p>
              Government tenders come with a long list of returnable documents, and every certificate has to be valid on the closing date. One lapsed letter and the bid is non-responsive.
            </p>
            <p>
              We keep your folder current, tell you what’s about to expire, and help you get what’s missing, starting with the free ones: a CSD number, a tax compliance PIN and a B-BBEE affidavit.
            </p>
            <p className="text-ink">Then, when a tender fits, you’re ready to bid on the day it opens, not scrambling the week it closes.</p>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <ComplianceFolder compact />
        </Reveal>
      </div>
    </section>
  );
}
