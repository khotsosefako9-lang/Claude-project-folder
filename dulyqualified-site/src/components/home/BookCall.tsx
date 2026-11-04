import { Mail, MessageCircle, Phone, Send } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { contact, whatsappLink } from '../../data/site';
import { Blob, Eyebrow, Reveal } from '../ui';

const services = ['Security', 'Cleaning and hygiene', 'Something else'];
const plans = ['Not sure yet', 'Launch month', 'Starter', 'Growth'];

const field =
  'w-full rounded-xl bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/30 ring-1 ring-white/10 outline-none transition focus:bg-white/[0.06] focus:ring-ember/60';

export default function BookCall() {
  const [form, setForm] = useState({ name: '', firm: '', service: services[0], city: 'Gqeberha', plan: plans[0], when: '' });
  const set = (k: keyof typeof form) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const message = () =>
    [
      `Hi Duly Qualified, I'd like to book a 15-minute call.`,
      `Name: ${form.name}`,
      `Firm: ${form.firm}`,
      `Service: ${form.service}`,
      `City: ${form.city}`,
      `Interested in: ${form.plan}`,
      form.when && `Best time to call: ${form.when}`,
    ]
      .filter(Boolean)
      .join('\n');

  const ready = form.name.trim() !== '' && form.firm.trim() !== '' && form.city.trim() !== '';
  const onSubmit = (e: FormEvent) => e.preventDefault();
  const mailto = () => `mailto:${contact.email}?subject=${encodeURIComponent(`Book a call: ${form.firm || 'my firm'}`)}&body=${encodeURIComponent(message())}`;

  return (
    <section id="call" className="relative w-full overflow-hidden bg-black px-4 py-20 sm:px-6 sm:py-32 md:px-10">
      <div className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[2rem] bg-neutral-950 p-6 ring-1 ring-white/5 sm:p-12 lg:p-16">
        <Blob className="-left-40 -top-40 h-[420px] w-[420px] bg-navy opacity-50" />
        <Blob className="-bottom-40 -right-20 h-[380px] w-[380px] bg-ember opacity-25" />

        <div className="relative grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <Eyebrow>15 minutes</Eyebrow>
            <h2 className="tight text-4xl font-light leading-[1.02] text-white sm:text-6xl">
              Book a <span className="ember-text">15-minute</span> call.
            </h2>
            <p className="mt-6 max-w-md text-[15px] font-light leading-relaxed text-white/65 sm:text-[17px]">
              We’ll show you who’s on your list this month and which tenders you could be bidding on.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-3">
              <a href={contact.phoneHref} className="group rounded-2xl bg-white/[0.04] p-5 ring-1 ring-white/10 transition hover:ring-white/30">
                <Phone className="h-5 w-5 text-ember" />
                <p className="mt-4 text-xs text-white/50">Call now</p>
                <p className="mt-1 text-sm text-white">{contact.phoneDisplay}</p>
              </a>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="group rounded-2xl bg-white/[0.04] p-5 ring-1 ring-white/10 transition hover:ring-white/30">
                <MessageCircle className="h-5 w-5 text-ember" />
                <p className="mt-4 text-xs text-white/50">WhatsApp</p>
                <p className="mt-1 text-sm text-white">Message us</p>
              </a>
              <a href={`mailto:${contact.email}`} className="group col-span-2 rounded-2xl bg-white/[0.04] p-5 ring-1 ring-white/10 transition hover:ring-white/30">
                <Mail className="h-5 w-5 text-ember" />
                <p className="mt-4 text-xs text-white/50">Email</p>
                <p className="mt-1 text-sm text-white">{contact.email}</p>
              </a>
            </div>
            <p className="mt-6 text-xs text-white/40">Based in Gqeberha.</p>
          </Reveal>

          <Reveal delay={0.1}>
            <form onSubmit={onSubmit} className="rounded-2xl bg-black/40 p-5 ring-1 ring-white/10 backdrop-blur sm:p-8">
              <p className="text-lg font-light text-white">Tell us about your firm</p>
              <p className="mt-1 text-xs text-white/45">Fill in your name, firm and city, then send. It opens WhatsApp with your details filled in. Nothing is stored on this site.</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-xs text-white/60">Your name</span>
                  <input required value={form.name} onChange={set('name')} className={field} placeholder="Thandi Mokoena" autoComplete="name" />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs text-white/60">Firm</span>
                  <input required value={form.firm} onChange={set('firm')} className={field} placeholder="Your company" autoComplete="organization" />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs text-white/60">Service</span>
                  <select value={form.service} onChange={set('service')} className={field}>
                    {services.map((s) => (
                      <option key={s} className="bg-neutral-900">{s}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs text-white/60">City</span>
                  <input required value={form.city} onChange={set('city')} className={field} />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs text-white/60">Interested in</span>
                  <select value={form.plan} onChange={set('plan')} className={field}>
                    {plans.map((s) => (
                      <option key={s} className="bg-neutral-900">{s}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs text-white/60">Best time to call (optional)</span>
                  <input value={form.when} onChange={set('when')} className={field} placeholder="e.g. Tuesday morning" />
                </label>
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href={ready ? whatsappLink(message()) : undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-disabled={!ready}
                  className={`ember-gradient inline-flex flex-1 items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm text-black transition ${ready ? 'hover:brightness-110' : 'pointer-events-none opacity-50'}`}
                >
                  <Send className="h-4 w-4" /> send on WhatsApp
                </a>
                <a href={mailto()} className="inline-flex items-center justify-center rounded-full px-6 py-3.5 text-sm text-white/80 ring-1 ring-white/15 transition hover:text-white hover:ring-white/40">
                  or send by email
                </a>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
