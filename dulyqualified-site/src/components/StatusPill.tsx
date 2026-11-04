import type { DocStatus } from '../data/site';

const styles: Record<DocStatus, string> = {
  'In place': 'bg-emerald-400/10 text-emerald-300 ring-emerald-400/20',
  'Renew in 12 days': 'bg-ember/10 text-ember ring-ember/30',
  Missing: 'bg-rose-500/10 text-rose-300 ring-rose-400/20',
  Check: 'bg-sky-400/10 text-sky-300 ring-sky-400/20',
};

export default function StatusPill({ status }: { status: DocStatus }) {
  return (
    <span className={`inline-flex shrink-0 items-center whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] ring-1 ${styles[status]}`}>
      {status}
    </span>
  );
}
