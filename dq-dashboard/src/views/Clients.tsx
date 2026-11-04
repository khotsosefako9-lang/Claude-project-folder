import { FileText, Plus } from 'lucide-react';
import { useCallback, useState } from 'react';
import { mrr } from '../lib/derive';
import { useFocus, useNav } from '../lib/nav';
import { clientSections, deliveryFields } from '../lib/schema';
import { useStore } from '../lib/store';
import { addDays, addMonths, fmtDate, money, monthLabel, todayISO } from '../lib/util';
import { Button, Card, DateCell, Drawer, Empty, Kpi, MoneyCell, PageHead, Pill, RecordForm, Table } from '../ui/kit';

const statusTone = (s: string) => (s === 'Active' ? 'ok' : s === 'Onboarding' ? 'info' : s === 'Paused' ? 'warn' : 'faint') as any;

function Deliveries({ client }: { client: any }) {
  const { rows, save, readOnly } = useStore();
  const [openId, setOpenId] = useState<string | null>(null);
  const list = rows.deliveries.filter((d) => d.clientId === client.id).sort((a, b) => b.month.localeCompare(a.month));
  const month = todayISO().slice(0, 7);
  const rec = list.find((d) => d.id === openId);
  const bidLimit = client.plan === 'Growth' ? 2 : 0;

  return (
    <section className="mb-6">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-muted">Monthly delivery</h3>
        {!readOnly && !list.some((d) => d.month === month) && (
          <Button size="sm" onClick={async () => setOpenId(await save('deliveries', null, { clientId: client.id, client: client.name, month, prospects: 0, reportSent: false, tendersMatched: 0, bidsPrepared: 0, complianceChecked: false }, 'Month added'))}>
            <Plus className="h-3.5 w-3.5" /> Start {monthLabel(month)}
          </Button>
        )}
      </div>
      {list.length ? (
        <ul className="space-y-2">
          {list.map((d) => (
            <li key={d.id}>
              <button type="button" onClick={() => setOpenId(openId === d.id ? null : d.id)} className="grid w-full grid-cols-[70px_1fr] items-center gap-3 rounded-lg border border-line px-3 py-2.5 text-left hover:bg-well/60 sm:grid-cols-[70px_repeat(4,1fr)]">
                <span className="font-medium">{monthLabel(d.month)}</span>
                <span className="text-[12px]"><b className="num">{d.prospects || 0}</b>/20 prospects</span>
                <span className="hidden text-[12px] sm:block">{d.reportSent ? <Pill tone="ok">Report sent</Pill> : <Pill tone="warn">Report due</Pill>}</span>
                <span className="hidden text-[12px] sm:block"><b className="num">{d.tendersMatched || 0}</b> tenders</span>
                <span className="hidden text-[12px] sm:block"><b className="num">{d.bidsPrepared || 0}</b>{bidLimit ? `/${bidLimit}` : ''} bids</span>
              </button>
              {rec?.id === d.id && (
                <div className="mt-2 rounded-lg bg-well/50 px-4 pt-4">
                  <RecordForm formId={`del-${d.id}`} sections={[{ title: `${monthLabel(d.month)} checklist`, fields: deliveryFields }]} initial={d} onSave={(x) => save('deliveries', d.id, x, 'Saved')} />
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-[13px] text-muted">Track each month's 20 prospects, report, tender matches{bidLimit ? ' and bids' : ''} here.</p>
      )}
    </section>
  );
}

export default function Clients() {
  const { rows, meta, save, remove, readOnly, notify } = useStore();
  const { go } = useNav();
  const [openId, setOpenId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const open = useCallback((id: string) => setOpenId(id), []);
  useFocus('clients', open);
  const rec = rows.clients.find((c) => c.id === openId);
  const active = rows.clients.filter((c) => c.status === 'Active' || c.status === 'Onboarding');
  const today = todayISO();

  const invoice = async (c: any) => {
    const n = rows.invoices.length + 1;
    const id = await save('invoices', null, {
      number: `DQ-${today.slice(0, 4)}-${String(n).padStart(3, '0')}`, client: c.name, clientId: c.id,
      description: `${c.plan} plan, ${monthLabel(today.slice(0, 7))}`, amount: Number(c.monthlyFee) || 0, status: 'Draft',
      issueDate: today, dueDate: addDays(today, 7), paidDate: '',
    }, 'Draft invoice created');
    if (id) go('finance', 'invoices', id);
  };

  return (
    <>
      <PageHead title="Clients" sub="Paying subscribers, their plans and what you owe them each month." actions={!readOnly && <Button variant="primary" onClick={() => setAdding(true)}><Plus className="h-4 w-4" /> Add client</Button>} />
      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi label="Monthly recurring" value={money(mrr(rows.clients))} sub={meta.mrrTarget ? `target ${money(meta.mrrTarget)}` : 'set a target in Setup'} />
        <Kpi label="Active clients" value={active.length} sub={`${rows.clients.filter((c) => c.status === 'Onboarding').length} onboarding`} />
        <Kpi label="Average fee" value={money(active.length ? mrr(rows.clients) / active.length : 0)} sub="per client per month" />
        <Kpi label="Cities covered" value={new Set(active.map((c) => c.city).filter(Boolean)).size} sub="one firm per service, per city" />
      </div>
      <Card pad={false}>
        <Table
          rows={rows.clients}
          onOpen={(r) => setOpenId(r.id)}
          columns={[
            { key: 'name', label: 'Client', render: (r) => <span className="font-medium">{r.name}</span> },
            { key: 'status', label: 'Status', render: (r) => <Pill tone={statusTone(r.status)}>{r.status}</Pill> },
            { key: 'plan', label: 'Plan', render: (r) => <>{r.plan}{r.foundingRate && <span className="ml-1 text-[11px] text-muted">founding</span>}</> },
            { key: 'monthlyFee', label: 'Monthly', num: true, render: (r) => <MoneyCell n={r.monthlyFee} /> },
            { key: 'city', label: 'City · service', render: (r) => <span className="text-muted">{[r.city, r.sector].filter(Boolean).join(' · ')}</span> },
            { key: 'startDate', label: 'Started', render: (r) => <DateCell iso={r.startDate} /> },
            { key: 'minTermEnd', label: 'Min. term ends', render: (r) => <DateCell iso={r.minTermEnd} /> },
          ]}
          empty={
            <div className="p-4">
              <Empty title="No paying clients yet" action={<Button onClick={() => go('pipeline')}>Open the pipeline</Button>}>
                When a pipeline account pays, open it and choose Add as client, or add one here yourself.
              </Empty>
            </div>
          }
        />
      </Card>

      <Drawer open={!!rec} onClose={() => setOpenId(null)} wide title={rec?.name} sub={rec && <span className="flex flex-wrap items-center gap-2"><Pill tone={statusTone(rec.status)}>{rec.status}</Pill>{rec.plan} · {money(rec.monthlyFee)} a month{rec.startDate ? ` · since ${fmtDate(rec.startDate, true)}` : ''}</span>}>
        {rec && (
          <>
            {!readOnly && <div className="mb-5"><Button size="sm" onClick={() => invoice(rec)}><FileText className="h-4 w-4" /> Create this month's invoice</Button></div>}
            <Deliveries client={rec} />
            <RecordForm formId={`client-${rec.id}`} sections={clientSections} initial={rec} onSave={(d) => save('clients', rec.id, d, 'Saved')} onDelete={async () => (await remove('clients', rec.id)) && setOpenId(null)} />
          </>
        )}
      </Drawer>
      <Drawer open={adding} onClose={() => setAdding(false)} title="Add a client">
        <RecordForm
          formId="client-new"
          sections={clientSections}
          initial={{ status: 'Onboarding', plan: 'Launch month', monthlyFee: Number(meta.priceLaunch) || 2999, startDate: today, minTermEnd: addMonths(today, 4), foundingRate: true }}
          saveLabel="Add client"
          onSave={async (d) => {
            if (!d.name?.trim()) return notify('Give the client a name first.', 'bad');
            const id = await save('clients', null, d, `${d.name} added`);
            if (id) { setAdding(false); setOpenId(id); }
          }}
        />
      </Drawer>
    </>
  );
}
