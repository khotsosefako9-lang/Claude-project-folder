import { motion } from 'framer-motion';
import { FolderCheck } from 'lucide-react';
import { complianceFolder } from '../data/site';
import StatusPill from './StatusPill';

/** Compliance checklist card with an animated score ring. */
export default function ComplianceFolder({ compact = false, title = 'Example: a security firm' }: { compact?: boolean; title?: string }) {
  const items = compact ? complianceFolder.slice(0, 8) : complianceFolder;
  // A document that is still valid but due for renewal counts as in place.
  const inPlace = complianceFolder.filter((d) => d.status === 'In place' || d.status.startsWith('Renew')).length;
  const total = complianceFolder.length;
  const r = 26;
  const c = 2 * Math.PI * r;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-neutral-950 p-5 ring-1 ring-white/5 sm:p-7">
      <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-navy opacity-40 blur-3xl" />
      <div className="relative flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/5">
            <FolderCheck className="h-5 w-5 text-ember" />
          </span>
          <div>
            <p className="text-sm text-white">Compliance folder</p>
            <p className="text-xs text-white/50">{title}</p>
          </div>
        </div>
        <div className="relative h-16 w-16 shrink-0">
          <svg viewBox="0 0 64 64" className="h-16 w-16 -rotate-90">
            <circle cx="32" cy="32" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5" />
            <motion.circle
              cx="32"
              cy="32"
              r={r}
              fill="none"
              stroke="url(#ember)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={c}
              initial={{ strokeDashoffset: c }}
              whileInView={{ strokeDashoffset: c * (1 - inPlace / total) }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: 'easeOut' }}
            />
            <defs>
              <linearGradient id="ember" x1="0" x2="1">
                <stop offset="0%" stopColor="#FA8453" />
                <stop offset="100%" stopColor="#F8C9B2" />
              </linearGradient>
            </defs>
          </svg>
          <span className="absolute inset-0 grid place-items-center text-xs text-white">
            {inPlace}/{total}
          </span>
        </div>
      </div>

      <ul className="relative mt-6 divide-y divide-white/5">
        {items.map((d, i) => (
          <motion.li
            key={d.name}
            className="flex items-center justify-between gap-3 py-3"
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 * i, duration: 0.4 }}
          >
            <div className="min-w-0">
              <p className="truncate text-[13px] text-white sm:text-sm">{d.name}</p>
              <p className="truncate text-[11px] text-white/45 sm:text-xs">{d.detail}</p>
            </div>
            <StatusPill status={d.status} />
          </motion.li>
        ))}
      </ul>
      {compact && (
        <p className="relative mt-3 text-xs text-white/50">
          + {complianceFolder.length - items.length} more items in the full folder · <span className="text-ember">{total - inPlace} to go</span>
        </p>
      )}
    </div>
  );
}
