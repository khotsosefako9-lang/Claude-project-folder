import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export function LogoMark({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect x="1" y="1" width="30" height="30" rx="9" fill="#fff" />
      <path d="M9 16.5l4.5 4.5L23 11.5" fill="none" stroke="#000" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function BgVideo({ src, className = '' }: { src: string; className?: string }) {
  return (
    <video
      className={`absolute inset-0 h-full w-full object-cover ${className}`}
      src={src}
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      aria-hidden="true"
    />
  );
}

export function Blob({ className }: { className: string }) {
  return <div aria-hidden="true" className={`pointer-events-none absolute rounded-full blur-3xl ${className}`} />;
}

export function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

type BtnProps = { to: string; children: ReactNode; className?: string };

const isExternal = (to: string) => /^(https?:|tel:|mailto:)/.test(to);

function Smart({ to, className, children }: BtnProps) {
  if (isExternal(to)) {
    const ext = to.startsWith('http');
    return (
      <a href={to} className={className} {...(ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        {children}
      </a>
    );
  }
  return (
    <Link to={to} className={className}>
      {children}
    </Link>
  );
}

/** Solid ember gradient pill (Guardnet "run demo"). */
export function EmberButton({ to, children, className = '' }: BtnProps) {
  return (
    <Smart
      to={to}
      className={`ember-gradient inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full px-6 py-3 text-sm font-normal text-black transition-[filter,transform] hover:brightness-110 active:scale-[0.98] ${className}`}
    >
      {children}
    </Smart>
  );
}

/** Gradient-border pill (Guardnet "Run Demo" outline). */
export function OutlineButton({ to, children, className = '' }: BtnProps) {
  return (
    <Smart to={to} className={`ember-gradient group relative inline-flex rounded-full p-[1.5px] ${className}`}>
      <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-black px-8 py-2.5 text-sm text-white transition-colors group-hover:bg-neutral-900 sm:px-10 sm:py-3">
        {children}
      </span>
    </Smart>
  );
}

export function GhostButton({ to, children, className = '' }: BtnProps) {
  return (
    <Smart
      to={to}
      className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full px-6 py-3 text-sm text-white/90 transition-colors hover:text-white ${className}`}
    >
      {children}
    </Smart>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="mb-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/50">
      <span className="h-1.5 w-1.5 rounded-full ember-gradient" />
      {children}
    </p>
  );
}

export function SectionHeading({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <h2 className={`tight text-3xl font-light leading-[1.05] text-white sm:text-4xl md:text-5xl ${className}`}>{children}</h2>;
}
