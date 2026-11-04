import { Ban, Plus } from 'lucide-react';
import { useState } from 'react';
import { useNav } from '../lib/nav';
import { exclusionFields, flagFields, seoFields, templateFields, type Field } from '../lib/schema';
import { useStore, type Col } from '../lib/store';
import { Button, Card, CopyButton, Drawer, Empty, PageHead, Pill, RecordForm, Table, Tabs } from '../ui/kit';

const TABS: { id: string; label: string; col: Col; fields: Field[] }[] = [
  { id: 'templates', label: 'Message templates', col: 'templates', fields: templateFields },
  { id: 'flags', label: 'Review flags', col: 'flags', fields: flagFields },
  { id: 'dnc', label: 'Do not contact', col: 'exclusions', fields: exclusionFields },
  { id: 'seo', label: 'Website and SEO', col: 'seo', fields: seoFields },
];

export default function Library() {
  const { rows, save, remove, readOnly } = useStore();
  const { go } = useNav();
  const [tab, setTab] = useState('templates');
  const [open, setOpen] = useState<{ col: Col; id: string | null } | null>(null);
  const t = TABS.find((x) => x.id === tab)!;
  const rec = open?.id ? rows[open.col].find((r) => r.id === open.id) : null;
  const optedOut = rows.firms.filter((f) => f.status === 'Not interested (never contact again)');
  const openFlags = rows.flags.filter((f) => !f.resolved).length;

  return (
    <>
      <PageHead
        title="Playbook"
        sub="The messages you send, the rules you follow and the firms you leave alone."
        actions={!readOnly && <Button variant="primary" onClick={() => setOpen({ col: t.col, id: null })}><Plus className="h-4 w-4" /> Add</Button>}
      />
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { id: 'templates', label: 'Message templates', count: rows.templates.length },
          { id: 'flags', label: 'Review flags', count: openFlags },
          { id: 'dnc', label: 'Do not contact', count: rows.exclusions.length + optedOut.length },
          { id: 'seo', label: 'Website and SEO', count: rows.seo.length },
        ]}
      />

      {tab === 'templates' && (
        <div className="grid gap-3 lg:grid-cols-2">
          {[...rows.templates].sort((a, b) => (a.name || '').localeCompare(b.name || '', undefined, { numeric: true })).map((m) => (
            <Card key={m.id} title={m.name} action={<Pill>{m.channel}</Pill>}>
              <p className="mb-3 text-[12px] text-muted">{m.whenToUse}</p>
              <p className="max-h-56 overflow-y-auto whitespace-pre-wrap rounded-lg bg-well/60 p-3 text-[13px] leading-relaxed">{m.text}</p>
              <div className="mt-3 flex gap-2">
                <CopyButton text={m.text} />
                <Button size="sm" variant="quiet" onClick={() => setOpen({ col: 'templates', id: m.id })}>Edit</Button>
              </div>
            </Card>
          ))}
          {!rows.templates.length && <Empty title="No templates yet" />}
        </div>
      )}

      {tab === 'flags' && (
        <Card pad={false}>
          <Table
            rows={[...rows.flags].sort((a, b) => Number(!!a.resolved) - Number(!!b.resolved) || a.id.localeCompare(b.id))}
            onOpen={(r) => setOpen({ col: 'flags', id: r.id })}
            columns={[
              { key: 'item', label: 'Item', render: (r) => <span className="font-medium">{r.item}</span> },
              { key: 'issue', label: 'Issue', render: (r) => <span className="line-clamp-2 max-w-[340px] text-muted">{r.issue}</span> },
              { key: 'handling', label: 'Handling', render: (r) => <span className="line-clamp-2 max-w-[320px]">{r.handling}</span> },
              { key: 'resolved', label: 'Status', render: (r) => <Pill tone={r.resolved ? 'ok' : 'warn'}>{r.resolved ? 'Resolved' : 'Open'}</Pill> },
            ]}
          />
        </Card>
      )}

      {tab === 'dnc' && (
        <>
          {optedOut.length > 0 && (
            <Card title={<span className="flex items-center gap-2"><Ban className="h-4 w-4 text-bad" /> Opted out: never contact again</span>} className="mb-3" pad={false}>
              <ul className="divide-y divide-line">
                {optedOut.map((f) => (
                  <li key={f.id}>
                    <button type="button" onClick={() => go('outreach', 'firms', f.id)} className="flex w-full flex-wrap items-center gap-3 px-4 py-2.5 text-left hover:bg-well/60">
                      <span className="text-[13px] font-medium">{f.business}</span>
                      <span className="font-mono text-[12px] text-muted">{f.sendTo}</span>
                      <span className="min-w-0 flex-1 truncate text-[12px] text-muted">{f.outcome}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </Card>
          )}
          <Card title="Left out on purpose" pad={false}>
            <Table
              rows={[...rows.exclusions].sort((a, b) => (a.list || '').localeCompare(b.list || '') || a.business.localeCompare(b.business))}
              onOpen={(r) => setOpen({ col: 'exclusions', id: r.id })}
              columns={[
                { key: 'business', label: 'Business', render: (r) => <span className="font-medium">{r.business}</span> },
                { key: 'type', label: 'Type' },
                { key: 'whatItIs', label: 'What it is', render: (r) => <span className="text-muted">{r.whatItIs}</span> },
                { key: 'reason', label: 'Why left out' },
                { key: 'list', label: 'List', render: (r) => <span className="text-[12px] text-muted">{r.list}</span> },
              ]}
            />
          </Card>
        </>
      )}

      {tab === 'seo' && (
        <Card pad={false}>
          <Table
            rows={[...rows.seo].sort((a, b) => (a.priority || '').localeCompare(b.priority || ''))}
            onOpen={(r) => setOpen({ col: 'seo', id: r.id })}
            columns={[
              { key: 'priority', label: 'Pri.', render: (r) => <span className="font-mono">{r.priority}</span> },
              { key: 'area', label: 'Area', render: (r) => <span className="font-medium">{r.area}</span> },
              { key: 'observed', label: 'Observed', render: (r) => <span className="line-clamp-2 max-w-[280px] text-muted">{r.observed}</span> },
              { key: 'action', label: 'Action', render: (r) => <span className="line-clamp-2 max-w-[300px]">{r.action}</span> },
              { key: 'status', label: 'Status', render: (r) => <Pill tone={/deployed|done|complete/i.test(r.status) && !/not/i.test(r.status) ? 'ok' : 'neutral'}>{r.status}</Pill> },
            ]}
          />
        </Card>
      )}

      <Drawer open={!!open} onClose={() => setOpen(null)} title={open?.id ? rec?.name || rec?.item || rec?.business || rec?.area : `Add to ${TABS.find((x) => x.col === open?.col)?.label.toLowerCase()}`}>
        {open && (
          <RecordForm
            formId={`${open.col}-${open.id ?? 'new'}`}
            sections={[{ title: TABS.find((x) => x.col === open.col)!.label, fields: TABS.find((x) => x.col === open.col)!.fields }]}
            initial={rec ?? (open.col === 'flags' ? { resolved: false } : open.col === 'exclusions' ? { list: 'Added by hand' } : {})}
            saveLabel={open.id ? 'Save changes' : 'Add'}
            onSave={async (d) => { const id = await save(open.col, open.id, d, 'Saved'); if (id && !open.id) setOpen(null); }}
            onDelete={open.id ? async () => (await remove(open.col, open.id!)) && setOpen(null) : undefined}
          />
        )}
      </Drawer>
    </>
  );
}
