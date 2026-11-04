import { Ban, Download, Plus } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { saveCSV } from '../lib/download';
import { useFocus } from '../lib/nav';
import { CHANNELS, firmSections, OUTREACH_STATUSES, SECTORS } from '../lib/schema';
import { useStore } from '../lib/store';
import { shortStatus, statusTone } from '../lib/tones';
import { cx, todayISO, toCSV, workingDaysBetween } from '../lib/util';
import Activity from '../ui/Activity';
import { Button, Card, CopyButton, DateCell, Drawer, Empty, FilterSelect, PageHead, Pill, RecordForm, SearchBox, Table, type Column } from '../ui/kit';
import type { Rec } from '../lib/db';

const CSV_COLS = [
  'business', 'sector', 'batch', 'tier', 'channel', 'sendTo', 'status', 'contactDate', 'nextStep', 'due', 'dueNote', 'outcome',
  'linkedinContact', 'linkedinState', 'linkedinProfile', 'fitCheck', 'services', 'area', 'phone', 'email', 'firstLine', 'notes', 'source', 'history',
].map((key) => ({ key, label: firmSections.flatMap((s) => s.fields).find((f) => f.key === key)?.label ?? (key === 'history' ? 'Activity' : key) }));

export default function Outreach() {
  const { rows, save, remove, readOnly, notify } = useStore();
  const [q, setQ] = useState('');
  const [f, setF] = useState({ status: '', sector: '', tier: '', channel: '', batch: '' });
  const [openId, setOpenId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const open = useCallback((id: string) => setOpenId(id), []);
  useFocus('firms', open);
  const today = todayISO();

  const batches = useMemo(() => [...new Set(rows.firms.map((r) => r.batch).filter(Boolean))].sort(), [rows.firms]);
  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    return rows.firms
      .filter((r) => (!f.status || r.status === f.status) && (!f.sector || r.sector === f.sector) && (!f.tier || r.tier === f.tier) && (!f.channel || r.channel === f.channel) && (!f.batch || r.batch === f.batch))
      .filter((r) => !term || [r.business, r.area, r.services, r.sendTo, r.phone, r.email, r.notes, r.whoToContact].join(' ').toLowerCase().includes(term))
      .sort((a, b) => (a.tier || 'Z').localeCompare(b.tier || 'Z') || a.business.localeCompare(b.business));
  }, [rows.firms, q, f]);
  const counts = useMemo(() => Object.fromEntries(OUTREACH_STATUSES.map((s) => [s, rows.firms.filter((r) => r.status === s).length])), [rows.firms]);
  const rec = rows.firms.find((r) => r.id === openId);

  const columns: Column<Rec>[] = [
    {
      key: 'business',
      label: 'Firm',
      render: (r) => (
        <div className="min-w-[200px]">
          <p className="font-medium">{r.business}</p>
          <p className="line-clamp-1 text-[12px] text-muted">{[r.area, r.services].filter(Boolean).join(' · ')}</p>
        </div>
      ),
    },
    { key: 'sector', label: 'Sector', render: (r) => <span className="text-muted">{r.sector}</span> },
    { key: 'tier', label: 'Tier', render: (r) => <span className="font-mono text-[12px]">{r.tier}</span> },
    { key: 'channel', label: 'Channel', render: (r) => <span className="whitespace-nowrap">{r.channel}<br /><span className="font-mono text-[11px] text-muted">{r.sendTo}</span></span> },
    { key: 'status', label: 'Status', render: (r) => <Pill tone={statusTone(r.status)}>{shortStatus(r.status)}</Pill> },
    {
      key: 'contactDate',
      label: 'Contacted',
      render: (r) => {
        const silent = r.status === 'Sent (no reply yet)' && r.contactDate && !r.due && workingDaysBetween(r.contactDate, today) >= 5;
        return <DateCell iso={r.contactDate} tone={silent ? 'warn' : undefined} />;
      },
    },
    {
      key: 'next',
      label: 'Next step',
      render: (r) => (
        <div className="min-w-[200px] max-w-[320px]">
          {r.due && <DateCell iso={r.due} tone={r.due < today ? 'bad' : r.due <= today ? 'warn' : undefined} />}
          <p className="line-clamp-2 text-[12px] text-muted">{r.nextStep}</p>
        </div>
      ),
    },
  ];

  const blank = { business: '', sector: 'Security', tier: 'B', batch: `Batch ${batches.length + 1}`, channel: 'Call', status: 'To send', history: [] };

  return (
    <>
      <PageHead
        title="Outreach"
        sub={`${rows.firms.length} firms across ${batches.length} batches. Every firm, every approach and every reply in one list.`}
        actions={
          <>
            <Button
              onClick={async () => {
                const r = await saveCSV(`dulyqualified-outreach-${today}.csv`, toCSV(list, CSV_COLS));
                notify(r.text, r.ok ? 'ok' : 'bad');
              }}
            >
              <Download className="h-4 w-4" /> Export
            </Button>
            {!readOnly && (
              <Button variant="primary" onClick={() => setAdding(true)}>
                <Plus className="h-4 w-4" /> Add firm
              </Button>
            )}
          </>
        }
      />

      <div className="scroll-x mb-3 flex gap-1.5 pb-1">
        <button type="button" onClick={() => setF({ ...f, status: '' })} className={cx('whitespace-nowrap rounded-full border px-3 py-1 text-[13px]', !f.status ? 'border-ink bg-ink text-panel' : 'border-line bg-panel hover:bg-well')}>
          All <span className="num opacity-70">{rows.firms.length}</span>
        </button>
        {OUTREACH_STATUSES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setF({ ...f, status: f.status === s ? '' : s })}
            className={cx('whitespace-nowrap rounded-full border px-3 py-1 text-[13px]', f.status === s ? 'border-ink bg-ink text-panel' : 'border-line bg-panel hover:bg-well')}
          >
            {shortStatus(s)} <span className="num opacity-70">{counts[s]}</span>
          </button>
        ))}
      </div>

      <Card pad={false}>
        <div className="flex flex-wrap items-center gap-2 border-b border-line p-3">
          <SearchBox value={q} onChange={setQ} placeholder="Search name, area, phone, notes" />
          <FilterSelect id="f-sector" label="Sector" value={f.sector} options={SECTORS.filter((s) => rows.firms.some((r) => r.sector === s))} onChange={(v) => setF({ ...f, sector: v })} />
          <FilterSelect id="f-tier" label="Tier" value={f.tier} options={['A', 'B', 'C']} onChange={(v) => setF({ ...f, tier: v })} />
          <FilterSelect id="f-channel" label="Channel" value={f.channel} options={CHANNELS} onChange={(v) => setF({ ...f, channel: v })} />
          <FilterSelect id="f-batch" label="Batch" value={f.batch} options={batches} onChange={(v) => setF({ ...f, batch: v })} />
          <span className="num ml-auto text-[12px] text-muted">{list.length} shown</span>
        </div>
        <Table rows={list} columns={columns} onOpen={(r) => setOpenId(r.id)} empty={<div className="p-4"><Empty title="No firms match">Clear a filter or search for something else.</Empty></div>} />
      </Card>

      <Drawer
        open={!!rec}
        onClose={() => setOpenId(null)}
        title={rec?.business}
        sub={rec && <span className="flex flex-wrap items-center gap-2"><Pill tone={statusTone(rec.status)}>{rec.status}</Pill>{rec.sector} · Tier {rec.tier} · {rec.batch}</span>}
      >
        {rec && (
          <>
            {rec.status === 'Not interested (never contact again)' && (
              <p className="mb-4 flex items-center gap-2 rounded-lg bg-bad/10 px-3 py-2 text-[13px] font-medium text-bad"><Ban className="h-4 w-4" /> Opted out. Never contact again, on any channel.</p>
            )}
            {rec.status === 'No reply (do not message again)' && (
              <p className="mb-4 rounded-lg bg-well px-3 py-2 text-[13px] text-muted">Silent after the first approach. Do not message again.</p>
            )}
            <div className="mb-5 flex flex-wrap gap-2">
              {rec.sendTo && <CopyButton text={rec.sendTo} label={`Copy ${rec.channel === 'Email' ? 'email' : 'number'}`} />}
              {rec.firstLine && <CopyButton text={rec.firstLine} label="Copy first line" />}
            </div>
            <Activity col="firms" rec={rec} statuses={OUTREACH_STATUSES} />
            <RecordForm
              formId={`firm-${rec.id}`}
              sections={firmSections}
              initial={rec}
              onSave={(d) => save('firms', rec.id, d, 'Saved')}
              onDelete={async () => (await remove('firms', rec.id, `${rec.business} deleted`)) && setOpenId(null)}
            />
          </>
        )}
      </Drawer>

      <Drawer open={adding} onClose={() => setAdding(false)} title="Add a firm" sub="Fill in what you know. You can add the rest later.">
        <RecordForm
          formId="firm-new"
          sections={firmSections.slice(1, 3)}
          initial={blank}
          saveLabel="Add firm"
          onSave={async (d) => {
            if (!d.business?.trim()) return notify('Give the firm a name first.', 'bad');
            const id = await save('firms', null, d, `${d.business} added`);
            if (id) {
              setAdding(false);
              setOpenId(id);
            }
          }}
        />
      </Drawer>
    </>
  );
}
