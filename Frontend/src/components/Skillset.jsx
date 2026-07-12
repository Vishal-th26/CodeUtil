import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { skillset } from '../data/content';
import Reveal from './Reveal';
import './skillset.css';

export default function Skillset() {
  const [active, setActive] = useState(0);

  return (
    <section id="how-it-works" className="section skillset">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">How it works</span>
          <h2>Four stages, every time you upload</h2>
          <p>This is the actual pipeline — not marketing copy. Each stage runs in this order, on every file.</p>
        </Reveal>

        <div className="skillset__list">
          {skillset.map((item, i) => {
            const isOpen = active === i;
            return (
              <Reveal key={item.n} delay={i * 0.05} as="div" className="skillset__item">
                <button
                  className="skillset__row"
                  onClick={() => setActive(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                >
                  <span className="skillset__n mono">{item.n}</span>
                  <span className="skillset__title">{item.title}</span>
                  <span className={`skillset__plus ${isOpen ? 'skillset__plus--open' : ''}`}>+</span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      className="skillset__body"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="skillset__body-inner">
                        <p>{item.desc}</p>
                        <p className="skillset__result mono">→ {item.result}</p>
                      </div>
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
