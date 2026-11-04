import { Download, Plus } from 'lucide-react';
import { useCallback, useState } from 'react';
import { saveCSV } from '../lib/download';
import { mrr } from '../lib/derive';
import { useFocus } from '../lib/nav';
import { expenseFields, invoiceFields } from '../lib/schema';
import { useStore } from '../lib/store';
import { addDays, lastMonths, money, monthLabel, todayISO, toCSV } from '../lib/util';
import { PairBars } from '../ui/charts';
import { Button, Card, DateCell, Drawer, Empty, Kpi, MoneyCell, PageHead, Pill, RecordForm, Table, Tabs } from '../ui/kit';

const sum = (a: any[], k = 'amount') => a.reduce((s, x) => s + (Number(x[k]) || 0), 0);

export default function Finance() {
  const { rows, save, remove, readOnly, notify } = useStore();
  const [tab, setTab] = useState('invoices');
  const [open, setOpen] = useState<{ col: 'invoices' | 'expenses'; id: string | null } | null>(null);
  const openInv = useCallback((id: string) => { setTab('invoices'); setOpen({ col: 'invoices', id }); }, []);
  useFocus('invoices', openInv);
  const today = todayISO();
  const month = today.slice(0, 7);

  const invStatus = (i: any) => (i.status === 'Sent' && i.dueDate && i.dueDate < today ? 'Overdue' : i.status || 'Draft');
  const paidIn = (m: string) => rows.invoices.filter((i) => i.status === 'Paid' && (i.paidDate || '').startsWith(m));
  const spentIn = (m: string) => rows.expenses.filter((e) => (e.date || '').startsWith(m));
  const revenue = sum(paidIn(month));
  const expenses = sum(spentIn(month));
  const outstanding = rows.invoices.filter((i) => i.status === 'Sent');
  const overdue = outstanding.filter((i) => i.dueDate && i.dueDate < today);
  const running = sum(rows.expenses.filter((e) => e.recurring));
  const chart = lastMonths(6).map((m) => ({ label: monthLabel(m), a: sum(paidIn(m)), b: sum(spentIn(m)) }));
  const yearRevenue = sum(rows.invoices.filter((i) => i.status === 'Paid' && (i.paidDate || '').startsWith(today.slice(0, 4))));

  const rec = open?.id ? rows[open.col].find((r) => r.id === open.id) : null;
  const tone = (s: string) => (s === 'Paid' ? 'ok' : s === 'Overdue' ? 'bad' : s === 'Sent' ? 'info' : s === 'Cancelled' ? 'faint' : 'neutral') as any;

  return (
    <>
      <PageHead
        title="Money"
        sub="Invoices, payments and running costs."
        actions={
          <>
            <Button onClick={async () => {
              const r = tab === 'invoices'
                ? await saveCSV(`dulyqualified-invoices-${today}.csv`, toCSV(rows.invoices, invoiceFields))
                : await saveCSV(`dulyqualified-expenses-${today}.csv`, toCSV(rows.expenses, expenseFields));
              notify(r.text, r.ok ? 'ok' : 'bad');
            }}><Download className="h-4 w-4" /> Export</Button>
            {!readOnly && <Button variant="primary" onClick={() => setOpen({ col: tab === 'expenses' ? 'expenses' : 'invoices', id: null })}><Plus className="h-4 w-4" /> {tab === 'expenses' ? 'Add expense' : 'New invoice'}</Button>}
          </>
        }
      />
      <div className="mb-3 grid grid-cols-2 gap-3 lg:grid-cols-5">
        <Kpi label="Paid this month" value={money(revenue)} sub={`${paidIn(month).length} invoice${paidIn(month).length === 1 ? '' : 's'}`} />
        <Kpi label="Waiting to be paid" value={money(sum(outstanding))} sub={overdue.length ? `${overdue.length} overdue · ${money(sum(overdue))}` : 'None overdue'} tone={overdue.length ? 'bad' : undefined} />
        <Kpi label="Spent this month" value={money(expenses)} sub={`${money(running)} a month in running costs`} />
        <Kpi label="Profit this month" value={money(revenue - expenses)} tone={revenue - expenses < 0 ? 'bad' : revenue > 0 ? 'ok' : undefined} sub="paid in minus spent" />
        <Kpi label="Recurring revenue" value={money(mrr(rows.clients))} sub={`${money(yearRevenue)} paid in ${today.slice(0, 4)}`} />
      </div>
      <Card title="Last six months" className="mb-4"><PairBars data={chart} a="Paid in" b="Spent" /></Card>

      <Tabs value={tab} onChange={setTab} tabs={[{ id: 'invoices', label: 'Invoices', count: rows.invoices.length }, { id: 'expenses', label: 'Expenses', count: rows.expenses.length }]} />
      <Card pad={false}>
        {tab === 'invoices' ? (
          <Table
            rows={[...rows.invoices].sort((a, b) => (b.issueDate || '').localeCompare(a.issueDate || ''))}
            onOpen={(r) => setOpen({ col: 'invoices', id: r.id })}
            columns={[
              { key: 'number', label: 'Invoice', render: (r) => <span className="font-mono text-[12px]">{r.number}</span> },
              { key: 'client', label: 'Client', render: (r) => <span className="font-medium">{r.client}</span> },
              { key: 'description', label: 'For', render: (r) => <span className="text-muted">{r.description}</span> },
              { key: 'issueDate', label: 'Issued', render: (r) => <DateCell iso={r.issueDate} /> },
              { key: 'dueDate', label: 'Due', render: (r) => <DateCell iso={r.dueDate} tone={invStatus(r) === 'Overdue' ? 'bad' : undefined} /> },
              { key: 'status', label: 'Status', render: (r) => <Pill tone={tone(invStatus(r))}>{invStatus(r)}</Pill> },
              { key: 'amount', label: 'Amount', num: true, render: (r) => <MoneyCell n={r.amount} /> },
            ]}
            empty={<div className="p-4"><Empty title="No invoices yet">Open a client and choose Create this month's invoice, or make one here.</Empty></div>}
          />
        ) : (
          <Table
            rows={[...rows.expenses].sort((a, b) => (b.date || '').localeCompare(a.date || ''))}
            onOpen={(r) => setOpen({ col: 'expenses', id: r.id })}
            columns={[
              { key: 'date', label: 'Date', render: (r) => <DateCell iso={r.date} /> },
              { key: 'category', label: 'Category' },
              { key: 'description', label: 'What for', render: (r) => <span className="text-muted">{r.description}{r.recurring && <span className="ml-2 text-[11px]">monthly</span>}</span> },
              { key: 'amount', label: 'Amount', num: true, render: (r) => <MoneyCell n={r.amount} /> },
            ]}
            empty={<div className="p-4"><Empty title="No expenses recorded">Add software, data, phone and travel costs to see your real profit.</Empty></div>}
          />
        )}
      </Card>

      <Drawer open={!!open} onClose={() => setOpen(null)} title={open?.id ? (open.col === 'invoices' ? `Invoice ${rec?.number ?? ''}` : 'Expense') : open?.col === 'invoices' ? 'New invoice' : 'Add expense'}>
        {open && (
          <RecordForm
            formId={`${open.col}-${open.id ?? 'new'}`}
            sections={[{ title: open.col === 'invoices' ? 'Invoice' : 'Expense', fields: open.col === 'invoices' ? invoiceFields : expenseFields }]}
            initial={rec ?? (open.col === 'invoices'
              ? { number: `DQ-${today.slice(0, 4)}-${String(rows.invoices.length + 1).padStart(3, '0')}`, status: 'Draft', issueDate: today, dueDate: addDays(today, 7) }
              : { date: today, category: 'Software and tools' })}
            saveLabel={open.id ? 'Save changes' : 'Add'}
            onSave={async (d) => {
              if (d.status === 'Paid' && !d.paidDate) d = { ...d, paidDate: today };
              const id = await save(open.col, open.id, d, 'Saved');
              if (id && !open.id) setOpen(null);
            }}
            onDelete={open.id ? async () => (await remove(open.col, open.id!)) && setOpen(null) : undefined}
          />
        )}
      </Drawer>
    </>
  );
}
