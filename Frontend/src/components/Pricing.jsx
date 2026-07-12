import { useState } from 'react';
import { pricingTiers } from '../data/content';
import Reveal, { RevealGroup, revealItem } from './Reveal';
import { motion } from 'framer-motion';
import './pricing.css';

export default function Pricing() {
  const [annual, setAnnual] = useState(false);

  return (
    <section id="pricing" className="section pricing">
      <div className="container">
        <Reveal className="section-head pricing__head">
          <span className="eyebrow">Pricing</span>
          <h2>Free for your first project</h2>
          <p>Pay only once you're running CodeUtil across every project this semester.</p>
        </Reveal>

        <Reveal delay={0.05} className="pricing__toggle">
          <span className={!annual ? 'active' : ''}>Monthly</span>
          <button
            className={`toggle ${annual ? 'toggle--on' : ''}`}
            onClick={() => setAnnual((a) => !a)}
            role="switch"
            aria-checked={annual}
            aria-label="Toggle annual pricing"
          >
            <span className="toggle__knob" />
          </button>
          <span className={annual ? 'active' : ''}>Annual <em className="mono">(save ~20%)</em></span>
        </Reveal>

        <RevealGroup className="pricing__grid">
          {pricingTiers.map((tier) => (
            <motion.div
              key={tier.name}
              variants={revealItem}
              className={`card pricing__card ${tier.featured ? 'pricing__card--featured' : ''}`}
            >
              {tier.featured && <span className="pricing__badge mono">Most used</span>}
              <h3>{tier.name}</h3>
              <p className="pricing__tagline">{tier.tagline}</p>
              <div className="pricing__price">
                <span className="mono">${annual ? tier.annual : tier.monthly}</span>
                <span className="pricing__period">/mo</span>
              </div>
              <ul className="pricing__features">
                {tier.features.map((f) => <li key={f}>{f}</li>)}
              </ul>
              <a href="#contact" className={`btn ${tier.featured ? 'btn-primary' : 'btn-ghost'} pricing__cta`}>
                {tier.cta}
              </a>
            </motion.div>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
