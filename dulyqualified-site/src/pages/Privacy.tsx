import { Link } from 'react-router-dom';
import { contact } from '../data/site';
import { Blob } from '../components/ui';

const Mail = () => (
  <a href={`mailto:${contact.email}`} className="text-ember underline-offset-4 hover:underline">
    {contact.email}
  </a>
);

export default function Privacy() {
  return (
    <section className="relative w-full overflow-hidden bg-black px-4 pb-24 pt-36 sm:px-6 sm:pt-44 md:px-10">
      <Blob className="-left-40 top-20 h-[420px] w-[420px] bg-navy opacity-30" />
      <article className="relative mx-auto max-w-2xl">
        <Link to="/" className="text-sm text-white/50 hover:text-white">← Back to the site</Link>
        <h1 className="tight mt-8 text-5xl font-light text-white sm:text-6xl">Privacy</h1>
        <p className="mt-3 text-sm text-white/45">Last updated 24 October 2026</p>

        <div className="mt-10 rounded-2xl bg-neutral-950 p-6 ring-1 ring-ember/30 sm:p-8">
          <h2 className="text-lg text-white">Don’t want to hear from us or our clients?</h2>
          <p className="mt-3 text-[15px] font-light leading-relaxed text-white/70">
            Email <Mail /> with “remove me” and the business name. We’ll remove your details and add you to our do-not-contact list, so no client of ours contacts you through us again.
          </p>
        </div>

        <div className="mt-12 space-y-10 text-[15px] font-light leading-relaxed text-white/70 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-light [&_h2]:text-white">
          <div>
            <h2>Who we are</h2>
            <p>
              Duly Qualified is based in Gqeberha, South Africa. We help businesses find new customers and government tenders. You can reach us at <Mail />, or call or WhatsApp{' '}
              <a href={contact.phoneHref} className="text-white hover:text-ember">{contact.phoneDisplay}</a>.
            </p>
          </div>
          <div>
            <h2>This website</h2>
            <p>
              This site doesn’t use cookies or advertising trackers, and it doesn’t load anything from other websites. To see whether the site is working, we count page visits and clicks on the call, WhatsApp, email and sample report links. We only record the date, the page and which link was clicked. We don’t record your IP address or anything else that identifies you.
            </p>
            <p className="mt-4">If you email, call or WhatsApp us, we use your message and contact details only to reply to you and, if you become a client, to provide our service.</p>
          </div>
          <div>
            <h2>Business information we use for clients</h2>
            <p>
              To build our clients’ lead lists, we use business information that is already public: business names, addresses, business phone numbers and email addresses, websites and social media pages, public tender notices and news reports. We prefer general business contacts, and we only note a person’s name where they publish it in a business role.
            </p>
            <p className="mt-4">We don’t buy contact lists, and we don’t collect information about people’s private lives.</p>
          </div>
          <div>
            <h2>How first contact works</h2>
            <ul className="list-disc space-y-2 pl-5 marker:text-ember">
              <li>Every first message asks permission before it pitches, says who it’s from and makes it easy to say no.</li>
              <li>Anyone who says no, or doesn’t want to be contacted, goes on a do-not-contact list and is never contacted again through us.</li>
              <li>Messages are sent by our clients, from their own email or phone, after they approve them.</li>
            </ul>
          </div>
          <div>
            <h2>How long we keep it</h2>
            <p>
              We keep lead information while it’s useful for a client’s monthly report, and delete it when it’s no longer needed. We keep the do-not-contact list for as long as we operate, because that’s how we make sure a “no” is respected.
            </p>
          </div>
          <div>
            <h2>Your rights</h2>
            <p>
              Under the Protection of Personal Information Act (POPIA), you can ask what information we hold about you or your business, ask us to correct or delete it, and object to it being used for direct marketing. Email <Mail /> and we’ll respond as soon as we can, and within 30 days.
            </p>
            <p className="mt-4">
              If you’re not happy with how we’ve handled your information, you can complain to the Information Regulator at{' '}
              <a href="https://inforegulator.org.za" target="_blank" rel="noopener noreferrer" className="text-white hover:text-ember">inforegulator.org.za</a>.
            </p>
          </div>
        </div>
      </article>
    </section>
  );
}
