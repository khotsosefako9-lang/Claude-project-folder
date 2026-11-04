import type { DocStatus } from '../data/site';

const styles: Record<DocStatus, string> = {
  'In place': 'bg-ok/10 text-ok ring-ok/25',
  'Renew in 12 days': 'bg-moss/10 text-moss ring-moss/30',
  Missing: 'bg-bad/10 text-bad ring-bad/20',
  Check: 'bg-info/10 text-info ring-info/20',
};

export default function StatusPill({ status }: { status: DocStatus }) {
  return (
    <span className={`inline-flex shrink-0 items-center whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] ring-1 ${styles[status]}`}>
      {status}
    </span>
  );
}
