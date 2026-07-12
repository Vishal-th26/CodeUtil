import { stack } from '../data/content';
import './logo-strip.css';

export default function LogoStrip() {
  const loop = [...stack, ...stack, ...stack];

  return (
    <div className="logo-strip">
      <div className="marquee-track logo-strip__track mono">
        {loop.map((s, i) => (
          <span key={i} className="logo-strip__item">{s}</span>
        ))}
      </div>
    </div>
  );
}
