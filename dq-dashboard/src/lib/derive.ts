import type { Rec } from './db';
import { POSITIVE } from './tones';
import { addDays, fmtDate, todayISO, workingDaysBetween } from './util';

export const CLOSED = ['No reply (do not message again)', 'Not interested (never contact again)', 'Client (signed)'];

export type Attention = {
  key: string;
  tone: 'bad' | 'warn' | 'info' | 'ok';
  title: string;
  detail?: string;
  go: { view: string; col?: string; id?: string };
  quick?: { label: string; col: string; id: string; patch: Record<string, any>; note: string };
};

export function attention(rows: Record<string, Rec[]>, today = todayISO()): Attention[] {
  const out: Attention[] = [];
  const soon = addDays(today, 2);

  for (const t of rows.tasks) {
    if (t.done || !t.due || t.due > soon) continue;
    out.push({
      key: 't' + t.id,
      tone: t.due < today ? 'bad' : 'warn',
      title: t.title,
      detail: t.due < today ? `Overdue since ${fmtDate(t.due)}` : t.due === today ? 'Due today' : `Due ${fmtDate(t.due)}`,
      go: { view: 'tasks', col: 'tasks', id: t.id },
      quick: { label: 'Done', col: 'tasks', id: t.id, patch: { done: true, doneAt: today }, note: 'Task done' },
    });
  }
  for (const f of rows.firms) {
    if (!f.due || CLOSED.includes(f.status) || f.due > soon) continue;
    out.push({
      key: 'c' + f.id,
      tone: f.due < today ? 'bad' : 'warn',
      title: `${f.business}: ${f.nextStep || 'callback'}`,
      detail: `${f.due < today ? 'Overdue since' : 'Due'} ${fmtDate(f.due)}${f.dueNote && f.dueNote !== f.due ? ` · ${f.dueNote}` : ''} · ${f.sendTo || f.phone || ''}`,
      go: { view: 'outreach', col: 'firms', id: f.id },
    });
  }
  for (const f of rows.firms) {
    if (f.status !== 'Sent (no reply yet)' || !f.contactDate || f.due) continue;
    const wd = workingDaysBetween(f.contactDate, today);
    if (wd < 5) continue;
    out.push({
      key: 'n' + f.id,
      tone: 'info',
      title: `${f.business}: no reply after ${wd} working days`,
      detail: 'Your rule: silent firms get no second message. Mark as no reply.',
      go: { view: 'outreach', col: 'firms', id: f.id },
      quick: {
        label: 'Mark no reply',
        col: 'firms',
        id: f.id,
        patch: { status: 'No reply (do not message again)', history: [...(f.history ?? []), { date: today, text: `Marked no reply after ${wd} working days.` }] },
        note: `${f.business} marked no reply`,
      },
    });
  }
  for (const f of rows.firms) {
    if (!POSITIVE.slice(0, 2).includes(f.status)) continue;
    out.push({ key: 'p' + f.id, tone: 'ok', title: `${f.business}: ${f.status.replace(/\s*\(.*\)/, '')}`, detail: f.nextStep, go: { view: 'outreach', col: 'firms', id: f.id } });
  }
  for (const p of rows.pipeline) {
    if (p.stage === 'Consented' || p.stage === 'Call booked' || p.stage === 'Scope agreed')
      out.push({ key: 'k' + p.id, tone: 'ok', title: `${p.business}: ${p.stage}`, detail: p.nextAction, go: { view: 'pipeline', col: 'pipeline', id: p.id } });
    if (p.stage === 'Pending send verification')
      out.push({ key: 'v' + p.id, tone: 'warn', title: `${p.business}: check the send went out`, detail: p.nextAction, go: { view: 'pipeline', col: 'pipeline', id: p.id } });
  }
  for (const i of rows.invoices) {
    if (i.status === 'Sent' && i.dueDate && i.dueDate < today)
      out.push({ key: 'i' + i.id, tone: 'bad', title: `Invoice ${i.number || ''} to ${i.client || 'client'} is overdue`, detail: `Due ${fmtDate(i.dueDate)}`, go: { view: 'finance', col: 'invoices', id: i.id } });
  }
  for (const t of rows.tenders) {
    if (t.kind === 'Outreach hook' && t.useUntil && t.useUntil < today && t.status !== 'Expired')
      out.push({
        key: 'h' + t.id,
        tone: 'warn',
        title: `Tender line ${t.code || ''} is past its use date`,
        detail: `Use window was "${t.useWindow}". Stop using it in messages.`,
        go: { view: 'tenders', col: 'tenders', id: t.id },
        quick: { label: 'Mark expired', col: 'tenders', id: t.id, patch: { status: 'Expired' }, note: 'Tender line marked expired' },
      });
    if (t.kind === 'Opportunity' && t.closing && t.closing >= today && t.closing <= addDays(today, 7) && !['Submitted', 'Won', 'Lost', 'Expired'].includes(t.status))
      out.push({ key: 'o' + t.id, tone: 'warn', title: `${t.title} closes ${fmtDate(t.closing)}`, detail: t.reference, go: { view: 'tenders', col: 'tenders', id: t.id } });
  }
  const month = today.slice(0, 7);
  for (const c of rows.clients) {
    if (c.status !== 'Active') continue;
    const d = rows.deliveries.find((x) => x.clientId === c.id && x.month === month);
    if (!d?.reportSent)
      out.push({ key: 'd' + c.id, tone: 'info', title: `${c.name}: ${month} report not sent yet`, go: { view: 'clients', col: 'clients', id: c.id } });
  }
  const order = { bad: 0, warn: 1, ok: 2, info: 3 };
  return out.sort((a, b) => order[a.tone] - order[b.tone]);
}

export function mrr(clients: Rec[]) {
  return clients.filter((c) => c.status === 'Active' || c.status === 'Onboarding').reduce((s, c) => s + (Number(c.monthlyFee) || 0), 0);
}
