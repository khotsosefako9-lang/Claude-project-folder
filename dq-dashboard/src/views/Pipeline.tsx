import { Plus, UserPlus } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { useFocus, useNav } from '../lib/nav';
import { buyerFields, PIPELINE_STAGES, pipelineMessages, pipelineSections } from '../lib/schema';
import { useStore } from '../lib/store';
import { CONTACTED_STAGES, stageTone } from '../lib/tones';
import { addMonths, cx, fmtDate, money, todayISO } from '../lib/util';
import Activity from '../ui/Activity';
import { Button, Card, CopyButton, Drawer, Empty, Kpi, PageHead, Pill, RecordForm, Table, Tabs } from '../ui/kit';

const BOARD = ['Researched', 'Pending send verification', 'Permission requested', 'Consented', 'Call booked', 'Scope agreed', 'Paid subscriber'];

export default function Pipeline() {
  const { rows, meta, save, remove, readOnly, notify } = useStore();
  const { go } = useNav();
  const [tab, setTab] = useState('board');
  const [openId, setOpenId] = useState<string | null>(null);
  const [buyerId, setBuyerId] = useState<string | null>(null);
  const [adding, setAdding] = useState<'account' | 'buyer' | null>(null);
  const open = useCallback((id: string) => setOpenId(id), []);
  const openBuyer = useCallback((id: string) => setBuyerId(id), []);
  useFocus('pipeline', open);
  useFocus('buyers', openBuyer);

  const p = rows.pipeline;
  const rec = p.find((r) => r.id === openId);
  const buyer = rows.buyers.find((r) => r.id === buyerId);
  const goal = Number(meta.sprintGoalClients) || 5;
  const paid = p.filter((r) => r.stage === 'Paid subscriber').length;
  const cash = p.reduce((s, r) => s + (Number(r.cashReceived) || 0), 0);
  const byStage = useMemo(() => Object.fromEntries(PIPELINE_STAGES.map((s) => [s, p.filter((r) => r.stage === s).sort((a, b) => (a.priority || 'Z').localeCompare(b.priority || 'Z'))])), [p]);
  const parked = [...byStage['Email bounced'], ...byStage['Closed (not a fit)']];

  const convert = async () => {
    if (!rec) return;
    const plan = 'Starter';
    const id = await save('clients', null, {
      name: rec.business, status: 'Onboarding', plan, monthlyFee: Number(meta.priceStarterFounding) || 4500, foundingRate: true,
      startDate: todayISO(), minTermEnd: addMonths(todayISO(), 4), sector: rec.service, city: rec.city,
      contactName: (rec.contactRoute || '').split(',')[0], contactRole: (rec.contactRoute || '').split(',').slice(1).join(',').trim(),
      email: rec.email, phone: rec.phone, territory: rec.lane, pipelineId: rec.id, notes: '',
    }, `${rec.business} added as a client`);
    if (id) go('clients', 'clients', id);
  };

  return (
    <>
      <PageHead
        title="New client pipeline"
        sub={`${meta.sprintName || 'Sprint'} · goal ${goal} new paying recurring clients by ${fmtDate(meta.sprintEnd, true)}`}
        actions={!readOnly && <Button variant="primary" onClick={() => setAdding(tab === 'buyers' ? 'buyer' : 'account')}><Plus className="h-4 w-4" /> {tab === 'buyers' ? 'Add buyer' : 'Add account'}</Button>}
      />
      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-5">
        <Kpi label="Researched" value={p.length} sub={`${p.filter((r) => r.priority === 'A').length} priority A`} />
        <Kpi label="Requests sent" value={p.filter((r) => CONTACTED_STAGES.includes(r.stage)).length} sub={`${byStage['Email bounced'].length} bounced`} />
        <Kpi label="Consents" value={p.filter((r) => ['Consented', 'Call booked', 'Scope agreed', 'Paid subscriber'].includes(r.stage)).length} sub={`${p.filter((r) => r.callConfirmed).length} calls confirmed`} />
        <Kpi label="Paid subscribers" value={`${paid} / ${goal}`} sub={`${Math.max(0, goal - paid)} to go`} tone={paid >= goal ? 'ok' : undefined} />
        <Kpi label="Cash received" value={money(cash)} sub="from pipeline accounts" />
      </div>

      <Tabs value={tab} onChange={setTab} tabs={[{ id: 'board', label: 'Board' }, { id: 'list', label: 'List', count: p.length }, { id: 'buyers', label: 'Buyer previews', count: rows.buyers.length }]} />

      {tab === 'board' && (
        <>
          <div className="scroll-x -mx-1 pb-2">
            <div className="flex min-w-max gap-3 px-1">
              {BOARD.map((s) => (
                <div key={s} className="w-[248px] shrink-0 rounded-xl bg-well/60 p-2">
                  <div className="flex items-center justify-between px-1.5 pb-2 pt-1">
                    <h3 className="text-[12px] font-semibold uppercase tracking-[0.06em] text-muted">{s}</h3>
                    <span className="num text-[12px] text-muted">{byStage[s].length}</span>
                  </div>
                  <div className="space-y-2">
                    {byStage[s].map((r) => (
                      <button key={r.id} type="button" onClick={() => setOpenId(r.id)} className="block w-full rounded-lg border border-line bg-panel p-3 text-left shadow-sm transition hover:border-accent/60">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-[13px] font-semibold leading-snug">{r.business}</p>
                          <span className="font-mono text-[11px] text-muted">{r.priority}</span>
                        </div>
                        <p className="mt-0.5 text-[12px] text-muted">{r.city} · {r.service}</p>
                        {r.nextAction && <p className="mt-2 line-clamp-2 text-[12px] leading-snug text-ink/80">{r.nextAction}</p>}
                      </button>
                    ))}
                    {!byStage[s].length && <p className="px-1.5 py-3 text-[12px] text-muted">None</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {parked.length > 0 && (
            <Card title="Bounced or closed" className="mt-3" pad={false}>
              <ul className="divide-y divide-line">
                {parked.map((r) => (
                  <li key={r.id}>
                    <button type="button" onClick={() => setOpenId(r.id)} className="flex w-full flex-wrap items-center gap-3 px-4 py-2.5 text-left hover:bg-well/60">
                      <span className="text-[13px] font-medium">{r.business}</span>
                      <Pill tone={stageTone(r.stage)}>{r.stage}</Pill>
                      <span className="min-w-0 flex-1 truncate text-[12px] text-muted">{r.nextAction}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </>
      )}

      {tab === 'list' && (
        <Card pad={false}>
          <Table
            rows={[...p].sort((a, b) => (a.code || '').localeCompare(b.code || ''))}
            onOpen={(r) => setOpenId(r.id)}
            columns={[
              { key: 'code', label: 'ID', render: (r) => <span className="font-mono text-[12px] text-muted">{r.code}</span> },
              { key: 'business', label: 'Account', render: (r) => <span className="font-medium">{r.business}</span> },
              { key: 'city', label: 'City' },
              { key: 'service', label: 'Service' },
              { key: 'priority', label: 'Pri.', render: (r) => <span className="font-mono">{r.priority}</span> },
              { key: 'stage', label: 'Stage', render: (r) => <Pill tone={stageTone(r.stage)}>{r.stage}</Pill> },
              { key: 'checks', label: 'Call · Scope · Recurring', render: (r) => <span className="font-mono text-[12px]">{[r.callConfirmed, r.scopeAgreed, r.recurringAgreed].map((x) => (x ? '✓' : '·')).join('  ')}</span> },
              { key: 'cash', label: 'Cash', num: true, render: (r) => money(r.cashReceived) },
            ]}
          />
        </Card>
      )}

      {tab === 'buyers' && (
        <Card pad={false}>
          <p className="border-b border-line px-4 py-3 text-[13px] text-muted">Research candidates used in account previews. No buyer has been contacted and no active need is established.</p>
          <Table
            rows={rows.buyers.sort((a, b) => (a.code || '').localeCompare(b.code || ''))}
            onOpen={(r) => setBuyerId(r.id)}
            columns={[
              { key: 'code', label: 'ID', render: (r) => <span className="font-mono text-[12px] text-muted">{r.code}</span> },
              { key: 'organisation', label: 'Organisation / site', render: (r) => <span className="font-medium">{r.organisation}</span> },
              { key: 'city', label: 'City' },
              { key: 'serviceFit', label: 'Possible fit', render: (r) => <span className="line-clamp-2 max-w-[280px] text-muted">{r.serviceFit}</span> },
              { key: 'contactStatus', label: 'Status', render: (r) => <Pill tone={r.contactStatus === 'Not contacted' ? 'neutral' : 'info'}>{r.contactStatus}</Pill> },
            ]}
            empty={<div className="p-4"><Empty title="No buyer previews yet" /></div>}
          />
        </Card>
      )}

      <Drawer open={!!rec} onClose={() => setOpenId(null)} wide title={rec?.business} sub={rec && <span className="flex flex-wrap items-center gap-2"><Pill tone={stageTone(rec.stage)}>{rec.stage}</Pill>{rec.code} · {rec.city} · {rec.service} · Priority {rec.priority}</span>}>
        {rec && (
          <>
            {!readOnly && (rec.stage === 'Paid subscriber' || rec.stage === 'Scope agreed') && !rows.clients.some((c) => c.pipelineId === rec.id) && (
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-accent-soft px-4 py-3">
                <p className="text-[13px]">Paid subscriber means written scope, a recurring agreement and cash received.</p>
                <Button variant="primary" size="sm" onClick={convert}><UserPlus className="h-4 w-4" /> Add as client</Button>
              </div>
            )}
            <Activity col="pipeline" rec={rec} statuses={PIPELINE_STAGES} statusKey="stage" />
            <section className="mb-6">
              <h3 className="mb-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-muted">Messages for this account</h3>
              <div className="space-y-3">
                {pipelineMessages.filter((m) => rec[m.key]).map((m) => (
                  <details key={m.key} className="group rounded-xl border border-line">
                    <summary className="flex cursor-pointer items-center justify-between gap-2 px-3 py-2.5 text-[13px] font-medium">
                      {m.label}
                      <span className="text-[12px] text-muted group-open:hidden">Show</span>
                    </summary>
                    <div className="border-t border-line px-3 py-3">
                      <p className="whitespace-pre-wrap text-[13px] leading-relaxed">{rec[m.key]}</p>
                      <div className="mt-2"><CopyButton text={rec[m.key]} /></div>
                    </div>
                  </details>
                ))}
              </div>
            </section>
            <RecordForm formId={`acc-${rec.id}`} sections={pipelineSections} initial={rec} onSave={(d) => save('pipeline', rec.id, d, 'Saved')} onDelete={async () => (await remove('pipeline', rec.id)) && setOpenId(null)} />
          </>
        )}
      </Drawer>

      <Drawer open={!!buyer} onClose={() => setBuyerId(null)} title={buyer?.organisation} sub={buyer && `${buyer.code} · ${buyer.city}`}>
        {buyer && <RecordForm formId={`buyer-${buyer.id}`} sections={[{ title: 'Buyer preview', fields: buyerFields }]} initial={buyer} onSave={(d) => save('buyers', buyer.id, d, 'Saved')} onDelete={async () => (await remove('buyers', buyer.id)) && setBuyerId(null)} />}
      </Drawer>

      <Drawer open={!!adding} onClose={() => setAdding(null)} title={adding === 'buyer' ? 'Add a buyer preview' : 'Add an account'}>
        {adding === 'account' && (
          <RecordForm
            formId="acc-new"
            sections={pipelineSections.slice(0, 2)}
            initial={{ stage: 'Researched', priority: 'B', code: `N${String(p.length + 1).padStart(2, '0')}`, consent: 'Not requested', cashReceived: 0, history: [] }}
            saveLabel="Add account"
            onSave={async (d) => {
              if (!d.business?.trim()) return notify('Give the account a name first.', 'bad');
              const id = await save('pipeline', null, d, `${d.business} added`);
              if (id) { setAdding(null); setOpenId(id); }
            }}
          />
        )}
        {adding === 'buyer' && (
          <RecordForm
            formId="buyer-new"
            sections={[{ title: 'Buyer preview', fields: buyerFields }]}
            initial={{ code: `B${String(rows.buyers.length + 1).padStart(2, '0')}`, contactStatus: 'Not contacted' }}
            saveLabel="Add buyer"
            onSave={async (d) => {
              if (!d.organisation?.trim()) return notify('Give the organisation a name first.', 'bad');
              if (await save('buyers', null, d, 'Buyer added')) setAdding(null);
            }}
          />
        )}
      </Drawer>
      <p className={cx('mt-4 text-[12px] text-muted', tab !== 'board' && 'hidden')}>Tap a card to log what happened, move it to the next stage or copy its messages.</p>
    </>
  );
}
