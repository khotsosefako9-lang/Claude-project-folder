import { Phone, Plus } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { CLOSED } from '../lib/derive';
import { useFocus, useNav } from '../lib/nav';
import { TASK_TYPES, taskFields } from '../lib/schema';
import { useStore } from '../lib/store';
import { addDays, cx, fmtDate, todayISO } from '../lib/util';
import { Button, Card, Drawer, Empty, PageHead, Pill, RecordForm } from '../ui/kit';

type Item = { key: string; title: string; due?: string; type?: string; related?: string; done?: boolean; notes?: string; taskId?: string; firmId?: string };

export default function Tasks() {
  const { rows, save, patch, remove, readOnly, notify } = useStore();
  const { go } = useNav();
  const [openId, setOpenId] = useState<string | null>(null);
  const [showDone, setShowDone] = useState(false);
  const [draft, setDraft] = useState({ title: '', due: '', type: 'Follow-up' });
  const open = useCallback((id: string) => setOpenId(id), []);
  useFocus('tasks', open);
  const today = todayISO();
  const week = addDays(today, 7);

  const items: Item[] = useMemo(
    () => [
      ...rows.tasks.map((t) => ({ key: 't' + t.id, title: t.title, due: t.due, type: t.type, related: t.related, done: !!t.done, notes: t.notes, taskId: t.id })),
      ...rows.firms
        .filter((f) => f.due && !CLOSED.includes(f.status))
        .map((f) => ({ key: 'f' + f.id, title: `${f.business}: ${f.nextStep || 'callback'}`, due: f.due, type: 'Callback', related: f.sendTo || f.phone, notes: f.dueNote, firmId: f.id })),
    ],
    [rows.tasks, rows.firms],
  );
  const pending = items.filter((i) => !i.done);
  const groups: [string, Item[]][] = [
    ['Overdue', pending.filter((i) => i.due && i.due < today)],
    ['Today', pending.filter((i) => i.due === today)],
    ['This week', pending.filter((i) => i.due && i.due > today && i.due <= week)],
    ['Later', pending.filter((i) => i.due && i.due > week)],
    ['No date', pending.filter((i) => !i.due)],
  ];
  const done = items.filter((i) => i.done);
  const rec = rows.tasks.find((t) => t.id === openId);

  const add = async () => {
    if (!draft.title.trim()) return notify('Write the task first.', 'bad');
    if (await save('tasks', null, { ...draft, title: draft.title.trim(), done: false, related: '', notes: '' }, 'Task added')) setDraft({ title: '', due: '', type: draft.type });
  };

  const Row = ({ i }: { i: Item }) => (
    <li className="flex items-start gap-3 px-4 py-3">
      {i.taskId ? (
        <input
          id={`done-${i.taskId}`}
          aria-label={`Mark "${i.title}" done`}
          type="checkbox"
          checked={!!i.done}
          disabled={readOnly}
          onChange={(e) => patch('tasks', i.taskId!, { done: e.target.checked, doneAt: e.target.checked ? today : '' }, e.target.checked ? 'Task done' : 'Task reopened')}
          className="mt-0.5 h-4 w-4 shrink-0 accent-[rgb(var(--accent))]"
        />
      ) : (
        <Phone className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
      )}
      <button type="button" onClick={() => (i.taskId ? setOpenId(i.taskId) : go('outreach', 'firms', i.firmId))} className="min-w-0 flex-1 text-left">
        <p className={cx('text-[13px] font-medium leading-snug', i.done && 'text-muted line-through')}>{i.title}</p>
        <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-[12px] text-muted">
          {i.type && <span>{i.type}</span>}
          {i.related && <span className="font-mono">{i.related}</span>}
          {i.notes && <span className="line-clamp-1">{i.notes}</span>}
        </p>
      </button>
      {i.due && <span className={cx('num shrink-0 text-[12px] font-medium', !i.done && i.due < today ? 'text-bad' : 'text-muted')}>{fmtDate(i.due)}</span>}
    </li>
  );

  return (
    <>
      <PageHead title="Tasks and callbacks" sub="Your to-dos, plus every callback set on a firm in Outreach." />
      {!readOnly && (
        <Card className="mb-4">
          <form onSubmit={(e) => { e.preventDefault(); add(); }} className="flex flex-col gap-2 sm:flex-row">
            <label htmlFor="new-task" className="sr-only">New task</label>
            <input id="new-task" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="Add a task, e.g. Send PureClean the follow-up (message 4)" className="min-w-0 flex-1 rounded-lg border border-line bg-panel px-3 py-2 text-sm outline-none focus:border-accent" />
            <div className="flex gap-2">
              <input id="new-task-due" aria-label="Due date" type="date" value={draft.due} onChange={(e) => setDraft({ ...draft, due: e.target.value })} className="min-w-0 flex-1 rounded-lg border border-line bg-panel px-2 py-2 text-sm" />
              <select id="new-task-type" aria-label="Type" value={draft.type} onChange={(e) => setDraft({ ...draft, type: e.target.value })} className="rounded-lg border border-line bg-panel px-2 py-2 text-sm">
                {TASK_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
              <Button type="submit" variant="primary"><Plus className="h-4 w-4" /> Add</Button>
            </div>
          </form>
        </Card>
      )}
      <div className="grid gap-3 lg:grid-cols-2">
        {groups.filter(([, l]) => l.length).map(([name, list]) => (
          <Card key={name} title={<span className="flex items-center gap-2">{name}{name === 'Overdue' && <Pill tone="bad">{list.length}</Pill>}</span>} action={name !== 'Overdue' && <span className="num text-[12px] text-muted">{list.length}</span>} pad={false}>
            <ul className="divide-y divide-line">{list.sort((a, b) => (a.due || '').localeCompare(b.due || '')).map((i) => <Row key={i.key} i={i} />)}</ul>
          </Card>
        ))}
      </div>
      {!pending.length && <Empty title="Nothing to do">Add a task above or set a callback on a firm.</Empty>}
      {done.length > 0 && (
        <div className="mt-4">
          <Button variant="quiet" size="sm" onClick={() => setShowDone(!showDone)}>{showDone ? 'Hide' : 'Show'} {done.length} done</Button>
          {showDone && <Card className="mt-2" pad={false}><ul className="divide-y divide-line">{done.map((i) => <Row key={i.key} i={i} />)}</ul></Card>}
        </div>
      )}
      <Drawer open={!!rec} onClose={() => setOpenId(null)} title="Task">
        {rec && <RecordForm formId={`task-${rec.id}`} sections={[{ title: 'Task', fields: taskFields }]} initial={rec} onSave={(d) => save('tasks', rec.id, d, 'Saved')} onDelete={async () => (await remove('tasks', rec.id)) && setOpenId(null)} />}
      </Drawer>
    </>
  );
}
