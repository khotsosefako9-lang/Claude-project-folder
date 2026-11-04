import { Plus } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useFocus } from '../lib/nav';
import { tenderFields } from '../lib/schema';
import { useStore } from '../lib/store';
import { daysBetween, todayISO } from '../lib/util';
import { Button, Card, CopyButton, DateCell, Drawer, Empty, PageHead, Pill, RecordForm, Table, Tabs } from '../ui/kit';

const tone = (s: string) =>
  (s === 'Approved' || s === 'Won' ? 'ok' : s?.startsWith('On hold') ? 'warn' : s === 'Lost' || s === 'Expired' ? 'faint' : s === 'Submitted' || s === 'Bid in progress' || s === 'Matched to client' ? 'info' : 'neutral') as any;

export default function Tenders() {
  const { rows, save, remove, readOnly } = useStore();
  const [tab, setTab] = useState('hooks');
  const [openId, setOpenId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const open = useCallback((id: string) => setOpenId(id), []);
  useFocus('tenders', open);
  const today = todayISO();
  const hooks = rows.tenders.filter((t) => t.kind === 'Outreach hook');
  const opps = rows.tenders.filter((t) => t.kind !== 'Outreach hook');
  const rec = rows.tenders.find((t) => t.id === openId);

  return (
    <>
      <PageHead
        title="Tenders"
        sub="Tender lines you use in outreach, and tenders you are tracking for clients."
        actions={!readOnly && <Button variant="primary" onClick={() => setAdding(true)}><Plus className="h-4 w-4" /> Add tender</Button>}
      />
      <Tabs value={tab} onChange={setTab} tabs={[{ id: 'hooks', label: 'Outreach tender lines', count: hooks.length }, { id: 'opps', label: 'Tracked tenders', count: opps.length }]} />
      {tab === 'hooks' ? (
        <div className="grid gap-3 lg:grid-cols-2">
          {hooks.sort((a, b) => (a.code || '').localeCompare(b.code || '')).map((t) => {
            const expired = t.useUntil && t.useUntil < today;
            return (
              <Card key={t.id} title={<span className="flex items-center gap-2"><span className="font-mono text-[13px] text-muted">{t.code}</span>{t.title}</span>}>
                <div className="mb-3 flex flex-wrap gap-2">
                  <Pill tone={expired ? 'faint' : tone(t.status)}>{expired && t.status !== 'Expired' ? 'Past use date' : t.status}</Pill>
                  <Pill tone={t.verified ? 'ok' : 'warn'}>{t.verified ? 'Facts verified' : 'Not verified'}</Pill>
                  <Pill>{t.forSector}</Pill>
                </div>
                <p className="text-[13px] leading-relaxed">{t.line}</p>
                <p className="mt-3 text-[12px] text-muted"><b className="font-medium text-ink">Use:</b> {t.useWindow}</p>
                <p className="mt-1 text-[12px] text-muted"><b className="font-medium text-ink">Source:</b> {t.source}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <CopyButton text={t.line} label="Copy email line" />
                  {t.shortLine && <CopyButton text={t.shortLine} label="Copy short line" />}
                  <Button size="sm" variant="quiet" onClick={() => setOpenId(t.id)}>Edit</Button>
                </div>
              </Card>
            );
          })}
          {!hooks.length && <Empty title="No tender lines" />}
        </div>
      ) : (
        <Card pad={false}>
          <Table
            rows={[...opps].sort((a, b) => (a.closing || '9').localeCompare(b.closing || '9'))}
            onOpen={(r) => setOpenId(r.id)}
            columns={[
              { key: 'closing', label: 'Closes', render: (r) => { const d = r.closing ? daysBetween(today, r.closing) : null; return <span><DateCell iso={r.closing} tone={d != null && d >= 0 && d <= 3 ? 'bad' : d != null && d >= 0 && d <= 7 ? 'warn' : undefined} />{d != null && d >= 0 && <span className="block text-[11px] text-muted">{d === 0 ? 'today' : `in ${d} days`}</span>}</span>; } },
              { key: 'title', label: 'Tender', render: (r) => <div className="min-w-[220px]"><p className="font-medium">{r.title}</p><p className="font-mono text-[11px] text-muted">{r.reference}</p></div> },
              { key: 'buyer', label: 'Buyer' },
              { key: 'forSector', label: 'For' },
              { key: 'status', label: 'Status', render: (r) => <Pill tone={tone(r.status)}>{r.status || 'Watching'}</Pill> },
            ]}
            empty={<div className="p-4"><Empty title="No tenders tracked yet">Add tenders you are matching or bidding on for clients, with closing dates, so they show up on Today.</Empty></div>}
          />
        </Card>
      )}
      <Drawer open={!!rec || adding} onClose={() => { setOpenId(null); setAdding(false); }} title={rec ? rec.title : 'Add a tender'}>
        <RecordForm
          formId={`tender-${rec?.id ?? 'new'}`}
          sections={[{ title: 'Tender', fields: tenderFields }]}
          initial={rec ?? { kind: tab === 'hooks' ? 'Outreach hook' : 'Opportunity', status: 'Watching', verified: false }}
          saveLabel={rec ? 'Save changes' : 'Add tender'}
          onSave={async (d) => { const id = await save('tenders', rec?.id ?? null, d, 'Saved'); if (id && !rec) setAdding(false); }}
          onDelete={rec ? async () => (await remove('tenders', rec.id)) && setOpenId(null) : undefined}
        />
      </Drawer>
    </>
  );
}
