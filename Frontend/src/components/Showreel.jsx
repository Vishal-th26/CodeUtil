import { useState } from 'react';
import Reveal from './Reveal';
import './showreel.css';

export default function Showreel() {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="section showreel">
      <div className="container">
        <Reveal className="section-head showreel__head">
          <span className="eyebrow">Walkthrough</span>
          <h2>Watch a 90-second session</h2>
        </Reveal>

        <Reveal delay={0.1} className={`showreel__frame ${playing ? 'showreel__frame--playing' : ''}`}>
          <div className="showreel__scanlines" aria-hidden="true" />
          <div className="showreel__mockrows">
            <div className="showreel__mockrow" style={{ width: '72%' }} />
            <div className="showreel__mockrow" style={{ width: '46%' }} />
            <div className="showreel__mockrow" style={{ width: '84%' }} />
          </div>

          {!playing && (
            <button className="showreel__play" onClick={() => setPlaying(true)} aria-label="Play walkthrough">
              <span className="showreel__play-icon">▶</span>
            </button>
          )}

          {playing && (
            <div className="showreel__playing mono">
              <span>Simulating an upload → ask → viva session…</span>
              <button onClick={() => setPlaying(false)}>Reset</button>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
