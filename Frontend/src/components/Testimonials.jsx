import { testimonials } from '../data/content';
import Reveal from './Reveal';
import './testimonials.css';

export default function Testimonials() {
  const loop = [...testimonials, ...testimonials];

  return (
    <section className="section testimonials">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">Early access</span>
          <h2>What students say the night after</h2>
        </Reveal>
      </div>

      <div className="testimonials__marquee">
        <div className="marquee-track testimonials__track">
          {loop.map((t, i) => (
            <blockquote key={i} className="testimonials__card card">
              <p>“{t.quote}”</p>
              <footer>
                <span className="testimonials__avatar mono">{t.name[0]}</span>
                <div>
                  <cite>{t.name}</cite>
                  <span className="mono">{t.role}</span>
                </div>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
