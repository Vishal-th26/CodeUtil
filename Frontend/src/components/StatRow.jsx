import { useInView } from '../hooks/useInView';
import { useCountUp } from '../hooks/useCountUp';
import { stats } from '../data/content';
import Reveal from './Reveal';
import './stat-row.css';

function Stat({ s, index }) {
  const [ref, inView] = useInView();
  const value = useCountUp(s.value, inView);

  return (
    <Reveal delay={index * 0.08} className="stat" as="div">
      <div ref={ref} className="stat__value mono">
        {s.prefix}{value}{s.suffix}
      </div>
      <p className="stat__label">{s.label}</p>
    </Reveal>
  );
}

export default function StatRow() {
  return (
    <section className="section stat-row">
      <div className="container stat-row__grid">
        {stats.map((s, i) => (
          <Stat key={s.label} s={s} index={i} />
        ))}
      </div>
    </section>
  );
}
