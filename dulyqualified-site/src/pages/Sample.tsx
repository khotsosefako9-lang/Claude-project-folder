import { motion } from 'framer-motion';
import { ArrowRight, Check, Copy, Mail, MessageCircle } from 'lucide-react';
import { useMemo, useState } from 'react';
import ComplianceFolder from '../components/ComplianceFolder';
import { Blob, EmberButton, OutlineButton, Reveal } from '../components/ui';
import { contact } from '../data/site';
import { briefs, closedTenders, leads, nextMonth, openTenders, sampleStats, sources, tagMeaning, todos, type LeadTag } from '../data/sample';

const tabs = [
  { id: 'twenty', label: 'The twenty' },
  { id: 'briefs', label: 'Three briefs' },
  { id: 'tenders-list', label: 'Tenders' },
  { id: 'compliance', label: 'Compliance' },
];

const tagStyle: Record<LeadTag, string> = {
  'Why now': 'ember-gradient text-black',
  Renewal: 'bg-sky-400/15 text-sky-200',
  Fit: 'bg-white/10 text-white/80',
};

type Status = 'new' | 'sent' | 'replied' | 'no';
const statusLabel: Record<Status, string> = { new: 'To send', sent: 'Sent', replied: 'Replied', no: 'Not interested' };
const statusOrder: Status[] = ['new', 'sent', 'replied', 'no'];

function SectionTitle({ eyebrow, children }: { eyebrow: string; children: React.ReactNode }) {
  return (
    <Reveal className="mb-10">
      <p className="text-xs uppercase tracking-[0.2em] text-white/45">{eyebrow}</p>
      <h2 className="tight mt-3 text-3xl font-light leading-[1.05] text-white sm:text-5xl">{children}</h2>
    </Reveal>
  );
}

function Brief({ b }: { b: (typeof briefs)[number] }) {
  const [copied, setCopied] = useState(false);
  const text = [b.subject ? `Subject: ${b.subject}` : '', ...b.body].filter(Boolean).join('\n\n');
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };
  const Icon = b.channel === 'Email' ? Mail : MessageCircle;
  return (
    <article className="flex h-full flex-col rounded-2xl bg-neutral-950 p-6 ring-1 ring-white/5 sm:p-7">
      <div className="flex items-center justify-between text-xs">
        <span className="text-white/55">{b.label}</span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-white/80">
          <Icon className="h-3.5 w-3.5" /> {b.channel}
        </span>
      </div>
      <h3 className="mt-5 text-lg font-light text-white">{b.business}</h3>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
        <div>
          <dt className="text-white/40">Contact</dt>
          <dd className="mt-1 text-white/85">{b.contact}</dd>
        </div>
        <div>
          <dt className="text-white/40">{b.angleLabel}</dt>
          <dd className="mt-1 text-white/85">{b.angle}</dd>
        </div>
      </dl>
      <div className={`mt-6 flex-1 rounded-xl p-4 text-[13px] font-light leading-relaxed ${b.channel === 'WhatsApp' ? 'bg-emerald-900/30 text-emerald-50' : 'bg-white/[0.04] text-white/80'}`}>
        {b.subject && <p className="mb-3 text-white">Subject: {b.subject}</p>}
        {b.body.map((p) => (
          <p key={p} className="mb-3 whitespace-pre-line last:mb-0">
            {p.split(/(\[[^\]]+\])/g).map((part, i) =>
              part.startsWith('[') ? (
                <mark key={i} className="rounded bg-ember/20 px-1 text-ember">{part}</mark>
              ) : (
                part
              ),
            )}
          </p>
        ))}
      </div>
      <button type="button" onClick={copy} className="mt-4 inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-xs text-white/80 ring-1 ring-white/15 transition hover:text-white hover:ring-white/40">
        {copied ? <Check className="h-3.5 w-3.5 text-emerald-300" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? 'Copied' : 'Copy message'}
      </button>
    </article>
  );
}

export default function Sample() {
  const [filter, setFilter] = useState<LeadTag | 'All'>('All');
  const [status, setStatus] = useState<Record<number, Status>>({});
  const shown = useMemo(() => leads.map((l, i) => ({ ...l, n: i + 1 })).filter((l) => filter === 'All' || l.tag === filter), [filter]);
  const counts = statusOrder.map((s) => ({ s, n: leads.filter((_, i) => (status[i] ?? 'new') === s).length }));
  const cycle = (i: number) => setStatus((st) => ({ ...st, [i]: statusOrder[(statusOrder.indexOf(st[i] ?? 'new') + 1) % statusOrder.length] }));

  return (
    <div className="relative w-full overflow-hidden bg-black">
      {/* Header */}
      <header className="relative px-4 pb-16 pt-36 sm:px-6 sm:pt-44 md:px-10">
        <Blob className="-left-40 top-10 h-[480px] w-[480px] bg-navy opacity-40" />
        <Blob className="-right-32 top-60 h-80 w-80 bg-ember opacity-20" />
        <div className="relative mx-auto max-w-[1400px]">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="rounded-full bg-white/10 px-3 py-1 text-white/80">October 2026 report</span>
            <span className="text-white/50">Security firm · Nelson Mandela Bay</span>
            <span className="rotate-[-4deg] rounded-full border border-ember/50 px-3 py-1 text-ember">Sample</span>
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="tight mt-8 max-w-5xl text-4xl font-light leading-[1.02] text-white sm:text-6xl md:text-7xl"
          >
            20 businesses ready to hear from you, and <span className="ember-text">three tenders</span> open now.
          </motion.h1>
          <p className="mt-6 max-w-2xl text-[15px] font-light leading-relaxed text-white/65 sm:text-[17px]">
            Prepared for an example Gqeberha guarding and armed response firm. Business names are hidden in this sample. Your report shows them in full, with the contact details and a first message for each.
          </p>

          <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {sampleStats.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.06}>
                <div className={`h-full rounded-2xl p-5 ring-1 sm:p-6 ${i === 3 ? 'bg-ember/10 ring-ember/40' : 'bg-neutral-950 ring-white/5'}`}>
                  <p className={`tight text-3xl font-medium sm:text-5xl ${i === 3 ? 'ember-text' : 'text-white'}`}>{s.value}</p>
                  <p className="mt-2 text-xs font-light leading-snug text-white/55 sm:text-sm">{s.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </header>

      {/* Sticky tabs */}
      <nav aria-label="Report sections" className="sticky top-[76px] z-30 px-4 sm:top-[88px] sm:px-6 md:px-10">
        <div className="mx-auto flex max-w-[1400px] justify-center">
          <div className="flex max-w-full gap-1 overflow-x-auto rounded-full bg-neutral-900/90 p-1.5 backdrop-blur">
            {tabs.map((t) => (
              <a key={t.id} href={`#${t.id}`} className="whitespace-nowrap rounded-full px-4 py-2 text-xs text-neutral-300 transition-colors hover:bg-white/5 hover:text-white sm:text-sm">
                {t.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* The twenty */}
      <section id="twenty" className="relative px-4 py-20 sm:px-6 sm:py-28 md:px-10">
        <div className="mx-auto max-w-[1400px]">
          <SectionTitle eyebrow="The twenty">
            Who to contact this month, <span className="ember-text">strongest first.</span>
          </SectionTitle>

          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {(['All', 'Why now', 'Renewal', 'Fit'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFilter(t)}
                  aria-pressed={filter === t}
                  className={`rounded-full px-4 py-2 text-xs transition sm:text-sm ${filter === t ? 'bg-white text-black' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}
                >
                  {t}
                  {t !== 'All' && <span className="ml-2 hidden text-[11px] opacity-60 sm:inline">{tagMeaning[t]}</span>}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-white/55">
              <span className="text-white/40">Tracker (tap a status):</span>
              {counts.map((c) => (
                <span key={c.s} className="rounded-full bg-white/5 px-3 py-1">
                  {statusLabel[c.s]} · <span className="text-white">{c.n}</span>
                </span>
              ))}
            </div>
          </div>

          <ol className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {shown.map((l) => {
              const st = status[l.n - 1] ?? 'new';
              return (
                <motion.li
                  layout
                  key={l.n}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className={`flex gap-4 rounded-2xl bg-neutral-950 p-5 ring-1 transition sm:p-6 ${st === 'no' ? 'opacity-50 ring-white/5' : st === 'replied' ? 'ring-emerald-400/40' : 'ring-white/5'}`}
                >
                  <span className="tight w-8 shrink-0 text-2xl font-light text-white/30">{l.n}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h3 className="text-[15px] text-white">{l.type}</h3>
                      <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] ${tagStyle[l.tag]}`}>{l.tag}</span>
                    </div>
                    <p className="mt-2 text-[13px] font-light leading-relaxed text-white/65">{l.angle}</p>
                    {l.source && <p className="mt-2 text-[11px] italic text-white/35">{l.source}</p>}
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/5 pt-4 text-xs">
                      <span className="text-white/50">
                        <span className="text-white/85">{l.who}</span> · {l.how}
                      </span>
                      <button
                        type="button"
                        onClick={() => cycle(l.n - 1)}
                        className={`rounded-full px-3 py-1.5 transition ${
                          st === 'new' ? 'bg-white/5 text-white/70 hover:bg-white/10' : st === 'sent' ? 'bg-sky-400/15 text-sky-200' : st === 'replied' ? 'bg-emerald-400/15 text-emerald-200' : 'bg-white/5 text-white/40'
                        }`}
                      >
                        {statusLabel[st]}
                      </button>
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </ol>
          <p className="mt-6 max-w-3xl text-xs font-light leading-relaxed text-white/40">
            Every business was checked in October 2026 against its own website, public listings and the news. Five more were looked at and left out because we couldn’t confirm them.
          </p>
        </div>
      </section>

      {/* Briefs */}
      <section id="briefs" className="relative px-4 py-20 sm:px-6 sm:py-28 md:px-10">
        <Blob className="-right-40 top-20 h-[420px] w-[420px] bg-navy opacity-30" />
        <div className="relative mx-auto max-w-[1400px]">
          <SectionTitle eyebrow="Three briefs">Every lead comes with a first message.</SectionTitle>
          <p className="-mt-4 mb-10 max-w-2xl text-[15px] font-light leading-relaxed text-white/65">
            Each one asks permission before it pitches and makes it easy to say no. You add your name, change anything that doesn’t sound like you, and send it yourself.
          </p>
          <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-3">
            {briefs.map((b, i) => (
              <Reveal key={b.label} delay={i * 0.08} className="h-full">
                <Brief b={b} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Tenders */}
      <section id="tenders-list" className="relative px-4 py-20 sm:px-6 sm:py-28 md:px-10">
        <div className="mx-auto max-w-[1400px]">
          <SectionTitle eyebrow="Tenders">
            Thirteen security tenders since September, <span className="ember-text">three</span> still open.
          </SectionTitle>
          <p className="-mt-4 mb-10 max-w-2xl text-[15px] font-light leading-relaxed text-white/65">
            Security tenders for Nelson Mandela Bay and the Sarah Baartman district on the public tender bulletins, closing between 1 September and 3 November. These are real notices, so you can look them up.
          </p>

          <div className="grid gap-3 sm:gap-4 lg:grid-cols-[1.2fr_1fr]">
            <div className="rounded-2xl bg-neutral-950 p-5 ring-1 ring-ember/30 sm:p-7">
              <p className="flex items-center gap-2 text-sm text-white">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                Open now
              </p>
              <ul className="mt-5 space-y-3">
                {openTenders.map((t) => (
                  <li key={t.ref} className="flex gap-4 rounded-xl bg-white/[0.03] p-4">
                    <div className="w-16 shrink-0 text-center">
                      <p className="tight text-2xl font-medium text-white">{t.date.split(' ')[0]}</p>
                      <p className="text-xs uppercase text-white/50">{t.date.split(' ')[1]} · {t.time}</p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[14px] text-white">{t.title}</p>
                      <p className="mt-1 break-all font-mono text-[11px] text-white/40">{t.ref}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-neutral-950 p-5 ring-1 ring-white/5 sm:p-7">
              <p className="text-sm text-white/70">Closed since September</p>
              <ul className="mt-5 divide-y divide-white/5">
                {closedTenders.map((t) => (
                  <li key={t.ref} className="flex gap-4 py-3">
                    <span className="w-14 shrink-0 text-xs text-white/40">{t.date}</span>
                    <div className="min-w-0">
                      <p className="text-[13px] font-light text-white/80">{t.title}</p>
                      <p className="mt-0.5 break-all font-mono text-[10px] text-white/30">{t.ref}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-4 rounded-2xl bg-ember/10 p-5 text-[14px] font-light leading-relaxed text-white/80 ring-1 ring-ember/20 sm:p-7">
            The Department of Social Development advertised short guarding contracts for its Nelson Mandela Bay sites in August, September and again in October.{' '}
            <span className="text-white">Short contracts like these come round again and again. With your papers in order, you can quote on every round instead of watching them close.</span>
          </div>
        </div>
      </section>

      {/* Compliance */}
      <section id="compliance" className="relative px-4 py-20 sm:px-6 sm:py-28 md:px-10">
        <Blob className="-left-40 bottom-20 h-[420px] w-[420px] bg-navy opacity-30" />
        <div className="relative mx-auto max-w-[1400px]">
          <SectionTitle eyebrow="Compliance">
            What a security bid asks for, and where <span className="ember-text">you</span> stand.
          </SectionTitle>
          <p className="-mt-4 mb-10 max-w-2xl text-[15px] font-light leading-relaxed text-white/65">
            Based on what recent security tenders have asked for. Every certificate must be valid on the closing date. The status below is an example.
          </p>
          <div className="grid gap-3 sm:gap-4 lg:grid-cols-[1.3fr_1fr]">
            <ComplianceFolder title="Security firm · Nelson Mandela Bay" />
            <div className="rounded-2xl bg-neutral-950 p-5 ring-1 ring-white/5 sm:p-7">
              <p className="text-sm text-white">This month’s to-do</p>
              <ol className="mt-5 space-y-4">
                {todos.map((t, i) => (
                  <li key={t.title} className="flex gap-4">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/10 text-xs text-white">{i + 1}</span>
                    <div>
                      <p className="text-[14px] text-white">{t.title}</p>
                      <p className="mt-1 text-[13px] font-light leading-relaxed text-white/55">{t.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Next month */}
      <section className="relative px-4 py-20 sm:px-6 sm:py-28 md:px-10">
        <div className="mx-auto max-w-[1400px]">
          <SectionTitle eyebrow="Next month">What happens after this report.</SectionTitle>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
            {nextMonth.map((n, i) => (
              <Reveal key={n.title} delay={i * 0.06}>
                <div className="h-full rounded-2xl bg-neutral-950 p-6 ring-1 ring-white/5">
                  <p className="text-[15px] text-white">{n.title}</p>
                  <p className="mt-3 text-[13px] font-light leading-relaxed text-white/55">{n.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative px-4 pb-20 sm:px-6 md:px-10">
        <div className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[2rem] bg-neutral-950 p-8 text-center ring-1 ring-white/5 sm:p-16">
          <Blob className="-left-20 -top-20 h-72 w-72 bg-navy opacity-50" />
          <Blob className="-bottom-20 -right-20 h-72 w-72 bg-ember opacity-25" />
          <div className="relative">
            <h2 className="tight text-4xl font-light text-white sm:text-6xl">
              Want this for <span className="ember-text">your</span> firm?
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-[15px] font-light leading-relaxed text-white/65">
              Book a 15-minute call. We’ll show you who’s on your list this month and which tenders you could be bidding on.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <EmberButton to="/#call">book a call <ArrowRight className="h-4 w-4" /></EmberButton>
              <OutlineButton to="/#pricing">see pricing</OutlineButton>
            </div>
            <p className="mt-6 text-xs text-white/40">
              or email <a href={`mailto:${contact.email}`} className="text-white/70 hover:text-white">{contact.email}</a>
            </p>
          </div>
        </div>
      </section>

      {/* Sources */}
      <section className="px-4 pb-20 sm:px-6 md:px-10">
        <div className="mx-auto max-w-[1400px]">
          <p className="text-xs uppercase tracking-[0.2em] text-white/40">Sources</p>
          <ol className="mt-4 max-w-4xl list-decimal space-y-2 pl-5 text-xs font-light leading-relaxed text-white/45">
            {sources.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
