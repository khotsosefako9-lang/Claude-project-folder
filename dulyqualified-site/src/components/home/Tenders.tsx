import { CalendarClock, FileText } from 'lucide-react';
import { videos } from '../../data/site';
import ComplianceFolder from '../ComplianceFolder';
import { BgVideo, Blob, EmberButton, Eyebrow, GhostButton, Reveal, SectionHeading } from '../ui';

export default function Tenders() {
  return (
    <>
      {/* Cinematic statement block (Guardnet SecuritySection) */}
      <section id="tenders" className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-black">
        <BgVideo src={videos.paperwork} />
        <div className="absolute inset-0 bg-black/35" aria-hidden="true" />
        <div className="pointer-events-none absolute left-0 right-0 top-0 z-10 h-48 bg-gradient-to-b from-black to-transparent" />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-48 bg-gradient-to-b from-transparent to-black" />

        <div className="relative z-20 mx-auto h-full w-full max-w-[1100px]">
          <div className="absolute left-1/2 top-8 flex w-max max-w-[95vw] -translate-x-1/2 items-center gap-1 rounded-full bg-neutral-900/80 p-2 backdrop-blur sm:top-12 sm:p-3">
            <GhostButton to="/sample#compliance" className="px-4 py-2 text-xs sm:px-7 sm:py-3 sm:text-sm">check a folder</GhostButton>
            <EmberButton to="/#call" className="px-4 py-2 text-xs sm:px-7 sm:py-3 sm:text-sm">get tender-ready</EmberButton>
          </div>

          <Reveal className="absolute right-4 top-[22%] max-w-[300px] sm:right-6 sm:top-[28%] sm:max-w-[520px] md:right-16">
            <p className="text-xs uppercase tracking-[0.2em] text-white/60">Tenders and compliance</p>
            <h2 className="tight mt-4 text-3xl font-light leading-[1.05] text-white sm:text-5xl">
              Most firms lose tenders on <span className="ember-text">paperwork</span>, not price.
            </h2>
          </Reveal>

          <Reveal delay={0.15} className="absolute bottom-[14%] left-4 max-w-[300px] sm:left-6 sm:max-w-[440px] md:left-16">
            <p className="text-[14px] font-light leading-relaxed text-white/85 sm:text-[18px]">
              A missing letter of good standing gets a bid thrown out before anyone looks at your rate.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Detail + folder */}
      <section className="relative w-full overflow-hidden bg-black px-4 py-20 sm:px-6 sm:py-28 md:px-10">
        <Blob className="-right-40 top-40 h-[420px] w-[420px] bg-navy opacity-30" />
        <div className="relative mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <Reveal>
              <Eyebrow>Ready on the day it opens</Eyebrow>
              <SectionHeading>Your papers, kept current. Your bids, ready to sign.</SectionHeading>
            </Reveal>
            <Reveal delay={0.1} className="mt-8 space-y-5 text-[15px] font-light leading-relaxed text-white/70 sm:text-[17px]">
              <p>
                Government tenders come with a long list of returnable documents, and every certificate has to be valid on the closing date. One lapsed letter and the bid is non-responsive.
              </p>
              <p>
                We keep your folder current, tell you what’s about to expire, and help you get what’s missing, starting with the free ones: a CSD number, a tax compliance PIN and a B-BBEE affidavit.
              </p>
              <p className="text-white">Then, when a tender fits, you’re ready to bid on the day it opens, not scrambling the week it closes.</p>
            </Reveal>

            <Reveal delay={0.2} className="mt-10">
              <div className="relative overflow-hidden rounded-2xl bg-neutral-950 p-6 ring-1 ring-white/5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs text-white/50">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                    </span>
                    Tender · open now
                  </div>
                  <span className="rotate-[5deg] rounded-full border border-ember/40 px-3 py-1 text-[11px] text-ember">Matched</span>
                </div>
                <p className="mt-4 text-lg font-light text-white">Guarding services for a regional office, 24 months</p>
                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-white/55">
                  <span className="inline-flex items-center gap-1.5"><CalendarClock className="h-3.5 w-3.5" /> Closing date and briefing</span>
                  <span className="inline-flex items-center gap-1.5"><FileText className="h-3.5 w-3.5" /> Returnable documents, listed for you</span>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <ComplianceFolder compact />
          </Reveal>
        </div>
      </section>
    </>
  );
}
