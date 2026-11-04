import { BarChart3, FileCheck2, FolderCheck, Gavel, LayoutGrid, MessageSquareText, Search, Users } from 'lucide-react';
import { leads, openTenders } from '../../data/sample';

const nav = [
  { icon: LayoutGrid, label: 'Overview', active: true },
  { icon: Users, label: 'The twenty' },
  { icon: MessageSquareText, label: 'Briefs' },
  { icon: Gavel, label: 'Tenders' },
  { icon: FolderCheck, label: 'Compliance' },
  { icon: BarChart3, label: 'Scorecard' },
];

const tagStyle: Record<string, string> = {
  'Why now': 'bg-moss/15 text-moss',
  Renewal: 'bg-info/15 text-info',
  Fit: 'bg-ink/10 text-ink/70',
};

/** The monthly report as a product screen: real figures from the October sample report. */
export default function ReportMock() {
  return (
    <div className="overflow-hidden rounded-2xl border border-ink/10 bg-card text-left shadow-[0_-20px_60px_-30px_rgba(37,38,31,0.35)] backdrop-blur">
      {/* window bar */}
      <div className="flex items-center justify-between border-b border-ink/5 px-4 py-2.5">
        <div className="flex items-center gap-2 text-[11px] text-ink/60">
          <span className="grid h-5 w-5 place-items-center rounded-md bg-ink">
            <svg viewBox="0 0 32 32" className="h-3 w-3"><path d="M9 16.5l4.5 4.5L23 11.5" fill="none" stroke="#F4F3EE" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
          Duly Qualified <span className="text-ink/25">/</span> October report
        </div>
        <div className="hidden items-center gap-2 rounded-md bg-ink/5 px-2.5 py-1 text-[10px] text-ink/35 sm:flex">
          <Search className="h-3 w-3" /> Search prospects
        </div>
        <span className="rounded-full bg-ink/10 px-2 py-0.5 text-[10px] text-ink/60">Sample</span>
      </div>

      <div className="flex">
        {/* sidebar */}
        <aside className="hidden w-40 shrink-0 border-r border-ink/5 p-3 md:block">
          <p className="px-2 pb-2 font-mono text-[9px] uppercase tracking-[0.18em] text-ink/30">Report</p>
          {nav.map(({ icon: Icon, label, active }) => (
            <div key={label} className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-[11px] ${active ? 'bg-ink/10 text-ink' : 'text-ink/45'}`}>
              <Icon className="h-3.5 w-3.5" /> {label}
            </div>
          ))}
        </aside>

        <div className="min-w-0 flex-1 p-3 sm:p-4">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="text-sm text-ink sm:text-base">Security firm · Nelson Mandela Bay</p>
              <p className="text-[10px] text-ink/40">Checked by hand, October 2026</p>
            </div>
            <span className="rounded-md bg-ink/5 px-2 py-1 font-mono text-[9px] text-ink/50">1 SEP – 3 NOV</span>
          </div>

          {/* stat tiles */}
          <div className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-4">
            {[
              ['Sites mapped', '1,060', 'across the metro'],
              ['Checked by hand', '25', 'incl. 5 from the news'],
              ['Ready to contact', '20', 'with first messages'],
            ].map(([k, v, d]) => (
              <div key={k} className="rounded-lg border border-ink/5 bg-ink/[0.03] p-2.5">
                <p className="text-[10px] text-ink/45">{k}</p>
                <p className="tight mt-1 text-lg text-ink sm:text-xl" style={{ fontVariantNumeric: 'tabular-nums' }}>{v}</p>
                <p className="text-[9px] text-ink/35">{d}</p>
              </div>
            ))}
            <div className="rounded-lg bg-moss p-2.5 text-paper">
              <p className="text-[10px] text-paper/75">Tenders open now</p>
              <p className="tight mt-1 text-lg sm:text-xl">3</p>
              <p className="text-[9px] text-paper/70">of 13 since September</p>
            </div>
          </div>

          <div className="mt-2 grid gap-2 lg:grid-cols-[1.5fr_1fr]">
            {/* leads */}
            <div className="rounded-lg border border-ink/5 bg-ink/[0.02] p-2.5">
              <div className="mb-1.5 flex items-center justify-between">
                <p className="text-[11px] text-ink">The twenty</p>
                <p className="text-[9px] text-ink/35">strongest first</p>
              </div>
              {leads.slice(0, 4).map((l, i) => (
                <div key={l.type} className="flex items-center gap-2 border-t border-ink/5 py-1.5">
                  <span className="w-3 font-mono text-[9px] text-ink/30">{i + 1}</span>
                  <p className="min-w-0 flex-1 truncate text-[10px] text-ink/80">{l.type}</p>
                  <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] ${tagStyle[l.tag]}`}>{l.tag}</span>
                </div>
              ))}
            </div>
            {/* compliance + tenders */}
            <div className="hidden flex-col gap-2 sm:flex">
              <div className="rounded-lg border border-ink/5 bg-ink/[0.02] p-2.5">
                <div className="flex items-center justify-between">
                  <p className="flex items-center gap-1.5 text-[11px] text-ink"><FileCheck2 className="h-3 w-3 text-clay" /> Compliance folder</p>
                  <p className="font-mono text-[10px] text-ink/70">8/11</p>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink/10">
                  <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-moss to-sage" />
                </div>
                <p className="mt-2 text-[9px] text-clay">PSIRA letter: renew in 12 days</p>
              </div>
              <div className="rounded-lg border border-ink/5 bg-ink/[0.02] p-2.5">
                <p className="text-[11px] text-ink">Closing soon</p>
                {openTenders.slice(0, 2).map((t) => (
                  <div key={t.ref} className="mt-1.5 flex gap-2 text-[9px]">
                    <span className="w-9 shrink-0 font-mono text-ink/50">{t.date}</span>
                    <span className="min-w-0 truncate text-ink/70">{t.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
