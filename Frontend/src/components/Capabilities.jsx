import { capabilities } from '../data/content';
import Reveal, { RevealGroup, revealItem } from './Reveal';
import { motion } from 'framer-motion';
import './capabilities.css';

export default function Capabilities() {
  return (
    <section id="capabilities" className="section capabilities">
      <div className="container">
        <Reveal className="section-head">
          <span className="capabilities__eyebrow">
            <span className="capabilities__dot" />
            Capabilities
          </span>
          <h2 className="capabilities__title">
            What it can do <span className="capabilities__title-accent">for you</span>
          </h2>
          <p className="capabilities__lead">
            A focused set of tools designed to speed up everyday development work.
          </p>
        </Reveal>

        <RevealGroup className="capabilities__grid" variants={revealItem}>
          {capabilities.map((c, i) => (
            <motion.article
              key={c.title}
              className="capability"
              style={{ '--i': i }}
              variants={revealItem}
              whileHover={{ y: -6 }}
              transition={{ type: 'spring', stiffness: 220, damping: 20 }}
            >
              <div className="capability__glow" aria-hidden="true" />
              <div className="capability__shine" aria-hidden="true" />
              <div className="capability__body">
                <div className="capability__top">
                  <span className="capability__tag">{c.tag}</span>
                  <svg
                    className="capability__arrow"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M7 17L17 7" />
                    <path d="M7 7h10v10" />
                  </svg>
                </div>
                <h3 className="capability__title">{c.title}</h3>
                <p>{c.copy}</p>
                <div className="capability__chips">
                  {c.tags.map((t, j) => (
                    <motion.span
                      key={t}
                      className="capability__chip"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.15 + j * 0.05, duration: 0.35 }}
                    >
                      {t}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
