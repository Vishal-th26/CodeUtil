import { capabilities } from '../data/content';
import Reveal, { RevealGroup, revealItem } from './Reveal';
import { motion } from 'framer-motion';
import './capabilities.css';

export default function Capabilities() {
  return (
    <section id="capabilities" className="section capabilities">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">Capabilities</span>
          <h2>What CodeUtil actually does</h2>
          <p>Three tools, one index — built around the codebase you already wrote.</p>
        </Reveal>

        <RevealGroup className="capabilities__grid">
          {capabilities.map((c) => (
            <motion.article key={c.title} className="card capability" variants={revealItem}>
              <div className="capability__top">
                <span className="capability__tag mono">{c.tag}</span>
                <span className="capability__arrow" aria-hidden="true">↗</span>
              </div>
              <h3>{c.title}</h3>
              <p>{c.copy}</p>
              <div className="capability__chips">
                {c.tags.map((t) => (
                  <span key={t} className="capability__chip mono">{t}</span>
                ))}
              </div>
            </motion.article>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
