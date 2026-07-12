import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { faqs } from '../data/content';
import Reveal from './Reveal';
import './faq.css';

export default function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="section faq">
      <div className="container faq__inner">
        <Reveal className="section-head">
          <span className="eyebrow">FAQ</span>
          <h2>Before you upload anything</h2>
        </Reveal>

        <div className="faq__list">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} delay={i * 0.04} className="faq__item">
                <button className="faq__q" onClick={() => setOpen(isOpen ? -1 : i)} aria-expanded={isOpen}>
                  <span>{f.q}</span>
                  <span className={`faq__plus ${isOpen ? 'faq__plus--open' : ''}`}>+</span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="faq__a-wrap"
                    >
                      <p className="faq__a">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
