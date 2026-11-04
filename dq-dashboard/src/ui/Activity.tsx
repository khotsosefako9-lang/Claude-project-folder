import { useState } from 'react';
import { useStore } from '../lib/store';
import { fmtDate, todayISO } from '../lib/util';
import { Button } from './kit';

type Entry = { date: string; text: string };

/** Dated log of what happened with a firm or account. Adding an entry writes once. */
export default function Activity({ col, rec, statuses, statusKey = 'status' }: { col: 'firms' | 'pipeline'; rec: any; statuses?: string[]; statusKey?: string }) {
  const { patch, readOnly } = useStore();
  const [text, setText] = useState('');
  const [date, setDate] = useState(todayISO());
  const [status, setStatus] = useState('');
  const history: Entry[] = [...(rec.history ?? [])].sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  const add = async () => {
    if (!text.trim() && !status) return;
    const entry = { date, text: [status && `${statusKey === 'stage' ? 'Stage' : 'Status'} set to ${status}.`, text.trim()].filter(Boolean).join(' ') };
    const changes: Record<string, any> = { history: [...(rec.history ?? []), entry] };
    if (status) changes[statusKey] = status;
    if (text.trim() && col === 'firms') changes.outcome = text.trim();
    if (col === 'firms' && !rec.contactDate && status && status !== 'To send' && status !== 'On hold') changes.contactDate = date;
    if (await patch(col, rec.id, changes, 'Logged')) {
      setText('');
      setStatus('');
    }
  };

  return (
    <section className="mb-6">
      <h3 className="mb-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-muted">Activity</h3>
      {!readOnly && (
        <div className="mb-4 rounded-xl border border-line bg-well/50 p-3">
          <label htmlFor={`act-${rec.id}`} className="sr-only">What happened</label>
          <textarea
            id={`act-${rec.id}`}
            rows={2}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What happened? e.g. Called, spoke to the owner, asked to send the sample by email."
            className="w-full resize-y rounded-lg border border-line bg-panel px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <input id={`act-date-${rec.id}`} aria-label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="rounded-lg border border-line bg-panel px-2 py-1.5 text-[13px]" />
            {statuses && (
              <select id={`act-status-${rec.id}`} aria-label="Change status" value={status} onChange={(e) => setStatus(e.target.value)} className="min-w-0 flex-1 rounded-lg border border-line bg-panel px-2 py-1.5 text-[13px]">
                <option value="">Keep status</option>
                {statuses.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            )}
            <Button size="sm" variant="primary" onClick={add} disabled={!text.trim() && !status}>
              Log it
            </Button>
          </div>
        </div>
      )}
      {history.length ? (
        <ol className="relative space-y-3 border-l border-line pl-4">
          {history.map((h, i) => (
            <li key={i} className="relative">
              <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-panel bg-accent" />
              <p className="num text-[11px] font-medium text-muted">{fmtDate(h.date, true)}</p>
              <p className="text-[13px] leading-relaxed">{h.text}</p>
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-[13px] text-muted">Nothing logged yet.</p>
      )}
    </section>
  );
}
