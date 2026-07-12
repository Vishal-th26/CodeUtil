import { stack } from '../data/content';
import { useInView } from '../hooks/useInView';
import { useCountUp } from '../hooks/useCountUp';
import Reveal from './Reveal';
import { motion } from 'framer-motion';
import './under-the-hood.css';

const counters = [
  { value: 7, label: 'REST endpoints' },
  { value: 2, label: 'Retrieval engines fused' },
  { value: 1, label: 'Codebase, fully yours' },
];

export default function UnderTheHood() {
  const [ref, inView] = useInView();
  const half = Math.ceil(stack.length / 2);
  const top = stack.slice(0, half);
  const bottom = stack.slice(half);

  return (
    <section className="section hood">
      <div className="hood__bg" aria-hidden="true" />

      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">Under the hood</span>
          <h2>No black box. Just a stack that works</h2>
          <p>CodeUtil is built on the same tools you already use — nothing proprietary hiding underneath.</p>
        </Reveal>

        {/* ================= CIRCUIT DIAGRAM ================= */}
        <div className="hood__circuit">
          <div className="hood__row hood__row--top">
            {top.map((s, i) => (
              <CircuitNode key={s} label={s} index={i} side="up" />
            ))}
          </div>

          <div className="hood__bus">
            <span className="hood__bus-line" />
            <motion.span
              className="hood__bus-pulse"
              animate={{ left: ['0%', '100%'] }}
              transition={{ duration: 3.4, repeat: Infinity, ease: 'linear' }}
              aria-hidden="true"
            />
            <div className="hood__core">
              <span className="hood__core-ring" />
              <span className="hood__core-label mono">CODEUTIL</span>
            </div>
          </div>

          <div className="hood__row hood__row--bottom">
            {bottom.map((s, i) => (
              <CircuitNode key={s} label={s} index={i} side="down" />
            ))}
          </div>
        </div>

        {/* ================= READOUT PANEL ================= */}
        <div className="hood__readout" ref={ref}>
          <div className="hood__readout-chrome">
            <span className="hood__chrome-dot" />
            <span className="hood__chrome-dot" />
            <span className="hood__chrome-dot" />
            <span className="hood__chrome-label mono">system_status.log</span>
            <span className="hood__chrome-live mono">
              <span className="hood__chrome-live-dot" /> LIVE
            </span>
          </div>

          <div className="hood__readout-scan" aria-hidden="true" />

          <div className="hood__stats">
            {counters.map((c, i) => (
              <CounterBlock key={c.label} c={c} inView={inView} delay={i * 0.1} isLast={i === counters.length - 1} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CircuitNode({ label, index, side }) {
  return (
    <motion.div
      className={`hood__node hood__node--${side}`}
      initial={{ opacity: 0, y: side === 'up' ? 14 : -14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      {side === 'up' && (
        <motion.span
          className="hood__stem"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.4, delay: index * 0.08 + 0.1 }}
        />
      )}
      <span className="hood__badge mono">{label}</span>
      {side === 'down' && (
        <motion.span
          className="hood__stem"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.4, delay: index * 0.08 + 0.1 }}
        />
      )}
    </motion.div>
  );
}

function CounterBlock({ c, inView, delay, isLast }) {
  const value = useCountUp(c.value, inView);
  return (
    <Reveal delay={delay} className={`hood__stat ${isLast ? '' : 'hood__stat--divided'}`}>
      <span className="hood__stat-value mono">{value}</span>
      <p className="hood__stat-label">{c.label}</p>
    </Reveal>
  );
}