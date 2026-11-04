import { BookOpen, Briefcase, CalendarCheck, CircleDollarSign, Gavel, LayoutDashboard, Menu, Send, Settings2, Users, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { attention } from './lib/derive';
import { NavProvider, useNav, type View } from './lib/nav';
import { StoreProvider, useStore } from './lib/store';
import { cx, todayISO } from './lib/util';
import { Toasts } from './ui/kit';
import Clients from './views/Clients';
import Finance from './views/Finance';
import Library from './views/Library';
import Outreach from './views/Outreach';
import Pipeline from './views/Pipeline';
import Setup from './views/Setup';
import Tasks from './views/Tasks';
import Tenders from './views/Tenders';
import Today from './views/Today';

const NAV: { id: View; label: string; icon: typeof Send }[] = [
  { id: 'today', label: 'Today', icon: LayoutDashboard },
  { id: 'outreach', label: 'Outreach', icon: Send },
  { id: 'pipeline', label: 'Pipeline', icon: Briefcase },
  { id: 'clients', label: 'Clients', icon: Users },
  { id: 'finance', label: 'Money', icon: CircleDollarSign },
  { id: 'tasks', label: 'Tasks', icon: CalendarCheck },
  { id: 'tenders', label: 'Tenders', icon: Gavel },
  { id: 'library', label: 'Playbook', icon: BookOpen },
  { id: 'setup', label: 'Setup', icon: Settings2 },
];

function Mark() {
  return (
    <svg viewBox="0 0 32 32" className="h-7 w-7 shrink-0" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="rgb(var(--accent))" />
      <path d="M9 16.5l4.5 4.5L23 11.5" fill="none" stroke="rgb(var(--accent-ink))" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Shell() {
  const { view, go } = useNav();
  const { rows, status, mode, readOnly } = useStore();
  const [menu, setMenu] = useState(false);
  const today = todayISO();
  const badges = useMemo(() => {
    const a = attention(rows, today);
    return {
      today: a.filter((x) => x.tone === 'bad' || x.tone === 'warn').length,
      tasks: rows.tasks.filter((t) => !t.done && t.due && t.due < today).length + rows.firms.filter((f) => f.due && f.due < today && !['No reply (do not message again)', 'Not interested (never contact again)', 'Client (signed)'].includes(f.status)).length,
    } as Partial<Record<View, number>>;
  }, [rows, today]);

  const Page = { today: Today, outreach: Outreach, pipeline: Pipeline, clients: Clients, finance: Finance, tasks: Tasks, tenders: Tenders, library: Library, setup: Setup }[view];

  const nav = (
    <nav aria-label="Sections" className="flex flex-col gap-0.5">
      {NAV.map(({ id, label, icon: Icon }) => (
        <a
          key={id}
          href={`#${id}`}
          onClick={(e) => { e.preventDefault(); go(id); setMenu(false); }}
          aria-current={view === id ? 'page' : undefined}
          className={cx('flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors', view === id ? 'bg-accent-soft text-ink' : 'text-muted hover:bg-well hover:text-ink')}
        >
          <Icon className={cx('h-4 w-4', view === id && 'text-accent')} />
          <span className="flex-1">{label}</span>
          {!!badges[id] && <span className="num rounded-full bg-bad/15 px-1.5 text-[11px] font-semibold text-bad">{badges[id]}</span>}
        </a>
      ))}
    </nav>
  );

  return (
    <div className="min-h-full lg:grid lg:grid-cols-[232px_minmax(0,1fr)]">
      <aside className="sticky top-0 hidden h-screen flex-col border-r border-line bg-panel px-3 py-5 lg:flex" style={{ paddingLeft: 'max(12px, env(safe-area-inset-left, 0px))' }}>
        <div className="mb-6 flex items-center gap-2.5 px-2">
          <Mark />
          <div>
            <p className="font-display text-[15px] font-semibold leading-tight">Duly Qualified</p>
            <p className="text-[11px] text-muted">Business dashboard</p>
          </div>
        </div>
        {nav}
        <p className="mt-auto px-3 text-[11px] leading-snug text-muted">
          {mode === 'live' ? (status === 'ready' ? 'Saved changes sync to every device.' : status === 'slow' ? 'Still connecting to your data…' : 'Connecting…') : mode === 'local' ? 'Local preview. Changes are not kept.' : ''}
        </p>
      </aside>

      <header className="gutter sticky top-0 z-40 flex items-center justify-between border-b border-line bg-panel py-2.5 lg:hidden" style={{ top: 'env(safe-area-inset-top, 0px)' }}>
        <div className="flex items-center gap-2"><Mark /><span className="font-display text-[15px] font-semibold">{NAV.find((n) => n.id === view)?.label}</span></div>
        <button type="button" onClick={() => setMenu(!menu)} aria-expanded={menu} aria-label={menu ? 'Close menu' : 'Open menu'} className="relative grid h-9 w-9 place-items-center rounded-lg border border-line">
          {menu ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          {!menu && !!badges.today && <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-bad" />}
        </button>
      </header>
      {menu && <div className="gutter fixed inset-x-0 z-30 border-b border-line bg-panel py-3 shadow-lg lg:hidden" style={{ top: 'calc(env(safe-area-inset-top, 0px) + 57px)' }}>{nav}</div>}

      <main className="gutter min-w-0 py-5 sm:py-7 lg:px-8">
        <div className="mx-auto max-w-[1280px]">
          {status === 'unavailable' && (
            <div className="mb-4 rounded-xl border border-warn/40 bg-warn/10 px-4 py-3 text-[13px]">
              Your saved data can't be reached from this view. Open the dashboard on claude.ai while signed in to see and edit it.
            </div>
          )}
          {status === 'error' && <div className="mb-4 rounded-xl border border-bad/40 bg-bad/10 px-4 py-3 text-[13px]">Lost the connection to your data. Reload the page to reconnect.</div>}
          {status === 'slow' && <div className="mb-4 rounded-xl border border-line bg-well px-4 py-3 text-[13px]">Your data is taking longer than usual to load. It may be out of date until it connects.</div>}
          {readOnly && mode === 'live' && <div className="mb-4 rounded-xl border border-line bg-well px-4 py-3 text-[13px]">You can view this dashboard but not change it.</div>}
          {status === 'connecting' ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-busy="true">
              {Array.from({ length: 8 }, (_, i) => <div key={i} className="h-24 animate-pulse rounded-xl bg-well" />)}
            </div>
          ) : (
            <Page />
          )}
        </div>
      </main>
      <Toasts />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <NavProvider>
        <Shell />
      </NavProvider>
    </StoreProvider>
  );
}
