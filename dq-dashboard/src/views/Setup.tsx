import { Download } from 'lucide-react';
import { saveCSV } from '../lib/download';
import { metaSections } from '../lib/schema';
import { COLLECTIONS, useStore } from '../lib/store';
import { todayISO, toCSV } from '../lib/util';
import { Button, Card, PageHead, RecordForm } from '../ui/kit';

const NAMES: Record<string, string> = {
  firms: 'Outreach firms', pipeline: 'Pipeline accounts', buyers: 'Buyer previews', clients: 'Clients', deliveries: 'Monthly deliveries',
  invoices: 'Invoices', expenses: 'Expenses', tasks: 'Tasks', tenders: 'Tenders', templates: 'Message templates',
  exclusions: 'Left-out firms', flags: 'Review flags', seo: 'Website and SEO actions',
};

export default function Setup() {
  const { rows, meta, save, notify, mode } = useStore();
  const exportCol = async (col: string) => {
    const list = rows[col as keyof typeof rows];
    const keys = [...new Set(list.flatMap((r) => Object.keys(r)))].filter((k) => !['createdAt', 'updatedAt'].includes(k));
    const r = await saveCSV(`dulyqualified-${col}-${todayISO()}.csv`, toCSV(list, keys.map((k) => ({ key: k, label: k }))));
    notify(r.text, r.ok ? 'ok' : 'bad');
  };
  return (
    <>
      <PageHead title="Business setup" sub="Goals, prices and the rules the dashboard checks your work against." />
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <Card>
          <RecordForm formId="meta" sections={metaSections} initial={meta} onSave={(d) => save('meta', 'business', d, 'Settings saved')} />
        </Card>
        <div className="flex flex-col gap-3">
          <Card title="Your data" pad={false}>
            <ul className="divide-y divide-line">
              {COLLECTIONS.filter((c) => c !== 'meta').map((c) => (
                <li key={c} className="flex items-center justify-between gap-3 px-4 py-2">
                  <span className="text-[13px]">{NAMES[c]}</span>
                  <span className="flex items-center gap-2">
                    <span className="num text-[13px] text-muted">{rows[c].length}</span>
                    <Button size="sm" variant="quiet" onClick={() => exportCol(c)} disabled={!rows[c].length} aria-label={`Export ${NAMES[c]}`}>
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                  </span>
                </li>
              ))}
            </ul>
          </Card>
          <Card title="Where this data lives">
            <p className="text-[13px] leading-relaxed text-muted">
              {mode === 'live'
                ? 'Everything is saved to this page’s own database the moment you press Save. It is the same on your phone and computer. Only you, and anyone you share the page with as an editor, can see or change it.'
                : 'This copy is running without its database, so changes are not saved.'}
            </p>
            <p className="mt-3 text-[13px] leading-relaxed text-muted">
              Imported from <b className="font-medium text-ink">DulyQualified Outreach Master (28 Oct 2026)</b> and <b className="font-medium text-ink">DulyQualified New Client Campaign (2 Nov to 2 Dec 2026)</b> on 4 Nov 2026. Update records here from now on; the spreadsheets are not changed.
            </p>
          </Card>
        </div>
      </div>
    </>
  );
}
