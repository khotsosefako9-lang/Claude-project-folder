import { Link } from 'react-router-dom';
import { contact, whatsappLink } from '../data/site';
import { LogoMark } from './ui';

export default function Footer() {
  return (
    <footer className="w-full border-t border-ink/5 bg-paper px-4 py-12 sm:px-6 md:px-10">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div className="max-w-sm">
          <Link to="/" className="flex items-center gap-2.5">
            <LogoMark className="h-6 w-6" />
            <span className="text-base text-ink">duly qualified</span>
          </Link>
          <p className="mt-4 text-sm font-light leading-relaxed text-ink/50">
            Qualified leads. Qualified to bid. Monthly prospects, tender matches and compliance tracking for security and cleaning firms.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-x-12 gap-y-3 text-sm text-ink/60 sm:grid-cols-3">
          <Link to="/#how" className="hover:text-ink">How it works</Link>
          <Link to="/#pricing" className="hover:text-ink">Pricing</Link>
          <Link to="/sample" className="hover:text-ink">Sample report</Link>
          <Link to="/privacy" className="hover:text-ink">Privacy</Link>
          <a href={contact.phoneHref} className="hover:text-ink">{contact.phoneDisplay}</a>
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="hover:text-ink">WhatsApp</a>
          <a href={`mailto:${contact.email}`} className="col-span-2 hover:text-ink sm:col-span-1">{contact.email}</a>
        </div>
      </div>
      <p className="mx-auto mt-12 max-w-[1400px] text-xs text-ink/35">© 2026 Duly Qualified · {contact.location}</p>
    </footer>
  );
}
