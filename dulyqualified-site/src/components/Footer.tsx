import { Link } from 'react-router-dom';
import { contact, whatsappLink } from '../data/site';
import { LogoMark } from './ui';

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/5 bg-black px-4 py-12 sm:px-6 md:px-10">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div className="max-w-sm">
          <Link to="/" className="flex items-center gap-2.5">
            <LogoMark className="h-6 w-6" />
            <span className="text-base text-white">duly qualified</span>
          </Link>
          <p className="mt-4 text-sm font-light leading-relaxed text-white/50">
            Qualified leads. Qualified to bid. Monthly prospects, tender matches and compliance tracking for security and cleaning firms.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-x-12 gap-y-3 text-sm text-white/60 sm:grid-cols-3">
          <Link to="/#how" className="hover:text-white">How it works</Link>
          <Link to="/#pricing" className="hover:text-white">Pricing</Link>
          <Link to="/sample" className="hover:text-white">Sample report</Link>
          <Link to="/privacy" className="hover:text-white">Privacy</Link>
          <a href={contact.phoneHref} className="hover:text-white">{contact.phoneDisplay}</a>
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="hover:text-white">WhatsApp</a>
          <a href={`mailto:${contact.email}`} className="col-span-2 hover:text-white sm:col-span-1">{contact.email}</a>
        </div>
      </div>
      <p className="mx-auto mt-12 max-w-[1400px] text-xs text-white/35">© 2026 Duly Qualified · {contact.location}</p>
    </footer>
  );
}
