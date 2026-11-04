import { ArrowRight, CircleAlert, CircleCheck, Info, Sparkles } from 'lucide-react';
import { useMemo } from 'react';
import { attention, CLOSED, mrr } from '../lib/derive';
import { useNav } from '../lib/nav';
import { useStore } from '../lib/store';
import { CONTACTED_STAGES, POSITIVE } from '../lib/tones';
import { addDays, cx, daysBetween, fmtDate, money, todayISO } from '../lib/util';
import { Bars, Progress, SplitBar } from '../ui/charts';
import { Button, Card, Kpi, PageHead, Pill } from '../ui/kit';

const statusColors: Record<string, string> = {
  'To send': 'bg-muted/40',
  'Sent (no reply yet)': 'bg-info/70',
  'Said yes (sample sent)': 'bg-ok/60',
  'Interested (book a call)': 'bg-ok',
  'Client (signed)': 'bg-accent',
  'On hold': 'bg-warn/70',
  'No reply (do not message again)': 'bg-line',
  'Not interested (never contact again)': 'bg-bad/70',
};

export default function Today() {
  const { rows, meta, patch } = useStore();
  const { go } = useNav();
  const today = todayISO();
  const items = useMemo(() => attention(rows, today), [rows, today]);

  const firms = rows.firms;
  const contacted = firms.filter((f) => f.contactDate).length;
  const positive = firms.filter((f) => POSITIVE.includes(f.status)).length;
  const toSend = firms.filter((f) => f.status === 'To send').length;
  const activeClients = rows.clients.filter((c) => c.status === 'Active' || c.status === 'Onboarding');
  const monthly = mrr(rows.clients);
  const month = today.slice(0, 7);
  const cashMonth =
    rows.invoices.filter((i) => i.status === 'Paid' && (i.paidDate || '').startsWith(month)).reduce((s, i) => s + (Number(i.amount) || 0), 0);
  const outstanding = rows.invoices.filter((i) => i.status === 'Sent').reduce((s, i) => s + (Number(i.amount) || 0), 0);

  const goal = Number(meta.sprintGoalClients) || 5;
  const sprintStart = meta.sprintStart || today;
  const sprintEnd = meta.sprintEnd || today;
  const newClients = rows.clients.filter((c) => (c.startDate || '') >= sprintStart && (c.startDate || '') <= sprintEnd).length +
    rows.pipeline.filter((p) => p.stage === 'Paid subscriber' && !rows.clients.some((c) => c.pipelineId === p.id)).length;
  const daysLeft = Math.max(0, daysBetween(today, sprintEnd));
  const sprintDays = Math.max(1, daysBetween(sprintStart, sprintEnd));

  const target = Number(meta.dailyOutreachTarget) || 10;
  const perDay = Array.from({ length: 14 }, (_, i) => {
    const d = addDays(today, i - 13);
    const n = firms.filter((f) => f.contactDate === d).length + rows.pipeline.filter((p) => p.sentDate === d).length;
    return { label: fmtDate(d).replace(' ', ' '), value: n, hint: fmtDate(d, true) };
  });

  const statusParts = Object.keys(statusColors).map((s) => ({ label: s, value: firms.filter((f) => f.status === s).length, className: statusColors[s] }));
  const requests = rows.pipeline.filter((p) => CONTACTED_STAGES.includes(p.stage)).length;

  const upcoming = [
    ...rows.tasks.filter((t) => !t.done && t.due && t.due > addDays(today, 2) && t.due <= addDays(today, 14)).map((t) => ({ id: 't' + t.id, date: t.due, title: t.title, go: () => go('tasks', 'tasks', t.id) })),
    ...firms.filter((f) => f.due && !CLOSED.includes(f.status) && f.due > addDays(today, 2) && f.due <= addDays(today, 14)).map((f) => ({ id: 'f' + f.id, date: f.due, title: `${f.business}: ${f.nextStep}`, go: () => go('outreach', 'firms', f.id) })),
    ...rows.tenders.filter((t) => t.closing && t.closing >= today && t.closing <= addDays(today, 14)).map((t) => ({ id: 'x' + t.id, date: t.closing, title: `Tender closes: ${t.title}`, go: () => go('tenders', 'tenders', t.id) })),
  ].sort((a, b) => a.date.localeCompare(b.date));

  const hour = new Date().getHours();
  const hello = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const icon = { bad: CircleAlert, warn: CircleAlert, ok: Sparkles, info: Info };

  return (
    <>
      <PageHead
        title={`${hello}, ${(meta.ownerName || 'Khotso').split(' ')[0]}`}
        sub={new Date().toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi label="Monthly recurring" value={money(monthly)} sub={`${activeClients.length} active client${activeClients.length === 1 ? '' : 's'} · ${meta.mrrTarget ? `target ${money(meta.mrrTarget)}` : 'set a target in Setup'}`} />
        <Kpi label="Cash this month" value={money(cashMonth)} sub={outstanding ? `${money(outstanding)} invoiced, not yet paid` : 'Nothing outstanding'} />
        <Kpi label="Firms approached" value={contacted} sub={`${toSend} still to send · ${firms.length} on the list`} />
        <Kpi label="Positive replies" value={positive} sub={contacted ? `${Math.round((positive / contacted) * 100)}% of firms approached` : 'No approaches yet'} tone={positive ? 'ok' : undefined} />
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <Card title="Needs your attention" action={<span className="num text-[12px] text-muted">{items.length}</span>} pad={false}>
          {items.length === 0 ? (
            <p className="flex items-center gap-2 p-4 text-sm text-muted"><CircleCheck className="h-4 w-4 text-ok" /> All clear. Nothing overdue or waiting on you.</p>
          ) : (
            <ul className="max-h-[460px] divide-y divide-line overflow-y-auto">
              {items.map((a) => {
                const Icon = icon[a.tone];
                return (
                  <li key={a.key} className="flex items-start gap-3 px-4 py-3">
                    <Icon className={cx('mt-0.5 h-4 w-4 shrink-0', a.tone === 'bad' && 'text-bad', a.tone === 'warn' && 'text-warn', a.tone === 'ok' && 'text-ok', a.tone === 'info' && 'text-info')} />
                    <button type="button" onClick={() => go(a.go.view, a.go.col, a.go.id)} className="min-w-0 flex-1 text-left">
                      <p className="text-[13px] font-medium leading-snug hover:underline">{a.title}</p>
                      {a.detail && <p className="mt-0.5 line-clamp-2 text-[12px] text-muted">{a.detail}</p>}
                    </button>
                    {a.quick && (
                      <Button size="sm" variant="ghost" onClick={() => patch(a.quick!.col as any, a.quick!.id, a.quick!.patch, a.quick!.note)}>
                        {a.quick.label}
                      </Button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        <div className="flex min-w-0 flex-col gap-3">
          <Card title={meta.sprintName || 'Current sprint'} action={<Pill tone={daysLeft ? 'neutral' : 'warn'}>{daysLeft} days left</Pill>}>
            <div className="flex items-end justify-between gap-3">
              <p className="num font-display text-3xl font-semibold">{newClients}<span className="text-lg text-muted"> / {goal}</span></p>
              <p className="text-right text-[12px] text-muted">new paying clients<br />{fmtDate(sprintStart)} to {fmtDate(sprintEnd, true)}</p>
            </div>
            <Progress value={newClients} max={goal} className="mt-3" />
            <Progress value={sprintDays - daysLeft} max={sprintDays} className="mt-1.5 h-1 opacity-50" />
            <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
              {[
                ['Researched', rows.pipeline.length],
                ['Requests sent', requests],
                ['Consents', rows.pipeline.filter((p) => ['Consented', 'Call booked', 'Scope agreed', 'Paid subscriber'].includes(p.stage)).length],
              ].map(([k, v]) => (
                <div key={k as string} className="rounded-lg bg-well py-2">
                  <dt className="text-[11px] text-muted">{k}</dt>
                  <dd className="num font-display text-lg font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
            <Button variant="quiet" size="sm" className="mt-2 w-full" onClick={() => go('pipeline')}>Open the pipeline <ArrowRight className="h-3.5 w-3.5" /></Button>
          </Card>

          <Card title="Next two weeks" pad={false}>
            {upcoming.length ? (
              <ul className="divide-y divide-line">
                {upcoming.slice(0, 6).map((u) => (
                  <li key={u.id}>
                    <button type="button" onClick={u.go} className="flex w-full gap-3 px-4 py-2.5 text-left hover:bg-well/60">
                      <span className="num w-14 shrink-0 text-[12px] font-medium text-muted">{fmtDate(u.date)}</span>
                      <span className="min-w-0 flex-1 truncate text-[13px]">{u.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="p-4 text-[13px] text-muted">Nothing scheduled. Add due dates to tasks and callbacks to see them here.</p>
            )}
          </Card>
        </div>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <Card title="Approaches per day" action={<span className="text-[12px] text-muted">last 14 days</span>}>
          <Bars data={perDay} target={target} />
        </Card>
        <Card title="Where every firm stands" action={<Button size="sm" variant="quiet" onClick={() => go('outreach')}>Open list</Button>}>
          <SplitBar parts={statusParts} onPick={() => go('outreach')} />
        </Card>
      </div>
    </>
  );
}
