import { stack } from '../data/content';
import { useInView } from '../hooks/useInView';
import { useCountUp } from '../hooks/useCountUp';
import Reveal, { RevealGroup, revealItem } from './Reveal';
import { motion } from 'framer-motion';
import './under-the-hood.css';

const counters = [
  { value: 7, label: 'REST endpoints' },
  { value: 2, label: 'Retrieval engines fused' },
  { value: 1, label: 'Codebase, fully yours' },
];

export default function UnderTheHood() {
  const [ref, inView] = useInView();

  return (
    <section className="section hood">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">Under the hood</span>
          <h2>No black box. Just a stack that works</h2>
          <p>CodeUtil is built on the same tools you already use — nothing proprietary hiding underneath.</p>
        </Reveal>

        <RevealGroup className="hood__cluster">
          {stack.map((s) => (
            <motion.span key={s} className="hood__badge mono" variants={revealItem}>{s}</motion.span>
          ))}
        </RevealGroup>

        <div className="hood__counters" ref={ref}>
          {counters.map((c, i) => (
            <CounterBlock key={c.label} c={c} inView={inView} delay={i * 0.08} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CounterBlock({ c, inView, delay }) {
  const value = useCountUp(c.value, inView);
  return (
    <Reveal delay={delay} className="hood__counter">
      <span className="mono">{value}</span>
      <p>{c.label}</p>
    </Reveal>
  );
}
