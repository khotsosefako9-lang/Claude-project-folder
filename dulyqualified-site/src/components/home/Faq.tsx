import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { faqs } from '../../data/site';
import { Eyebrow, Reveal, SectionHeading } from '../ui';

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="relative w-full bg-paper px-4 py-20 sm:px-6 sm:py-28 md:px-10">
      <div className="mx-auto grid max-w-[1400px] gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <Reveal>
          <Eyebrow>Questions</Eyebrow>
          <SectionHeading>Good to know.</SectionHeading>
        </Reveal>
        <div className="divide-y divide-white/10 border-y border-ink/10">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q}>
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-${i}`}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left text-base font-light text-ink transition-colors hover:text-moss sm:text-lg"
                  >
                    {f.q}
                    <Plus className={`h-5 w-5 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-45 text-moss' : 'text-ink/50'}`} />
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-2xl pb-6 text-[15px] font-light leading-relaxed text-ink/65">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
