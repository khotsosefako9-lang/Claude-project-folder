import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { navLinks } from '../data/site';
import { LogoMark } from './ui';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname, hash } = useLocation();

  useEffect(() => setOpen(false), [pathname, hash]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 px-3 pt-4 sm:px-6 sm:pt-6 md:px-10">
      <nav className="mx-auto flex max-w-[1400px] items-center justify-between gap-3" aria-label="Main">
        <Link
          to="/"
          className={`flex items-center gap-2.5 rounded-full py-2.5 pl-3 pr-4 backdrop-blur transition-colors sm:py-3 sm:pl-4 sm:pr-6 ${
            scrolled ? 'bg-card/95' : 'bg-card/80'
          }`}
        >
          <LogoMark className="h-5 w-5" />
          <span className="text-xs text-ink sm:text-sm">duly qualified</span>
        </Link>

        <div className="hidden items-center rounded-full bg-card/80 px-2 py-1.5 backdrop-blur lg:flex">
          {navLinks.map((l) => (
            <Link key={l.href} to={l.href} className="rounded-full px-4 py-2 text-sm text-ink/70 transition-colors hover:bg-ink/5 hover:text-ink xl:px-5">
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/#call"
            className="rounded-full bg-ink px-4 py-2.5 text-xs text-paper transition-colors hover:bg-ink/85 sm:px-6 sm:py-3 sm:text-sm"
          >
            book a call
          </Link>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="grid h-10 w-10 place-items-center rounded-full bg-card/80 text-ink backdrop-blur sm:h-11 sm:w-11 lg:hidden"
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mx-auto mt-3 max-w-[1400px] rounded-3xl bg-card/95 p-3 backdrop-blur lg:hidden"
          >
            {navLinks.map((l) => (
              <Link key={l.href} to={l.href} className="block rounded-2xl px-4 py-3 text-base text-ink/70 hover:bg-ink/5">
                {l.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
