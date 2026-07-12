import { useEffect, useRef, useState } from 'react';
import './index-grid.css';

const COLS = 10;
const ROWS = 7;

const STAGES = [
  'Reading',
  'Understanding',
  'Connecting',
  'Preparing',
];

const STAGE_COLOR = {
  idle: 'rgba(237,234,227,0.06)',
  reading: 'rgba(255,180,84,0.35)',
  understanding: 'rgba(255,180,84,0.55)',
  connecting: 'rgba(143,217,182,0.55)',
  preparing: 'rgba(255,180,84,0.9)',
};

export default function IndexGrid() {
  const total = COLS * ROWS;
  const [tick, setTick] = useState(0);
  const frame = useRef();

  useEffect(() => {
    let raf;
    let last = 0;

    function loop(t) {
      if (t - last > 90) {
        setTick((n) => n + 1);
        last = t;
      }
      raf = requestAnimationFrame(loop);
    }

    raf = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="index-grid" ref={frame}>
      <div className="index-grid__label mono">
        <span>Your Project</span>
        <span className="index-grid__stage">
          {STAGES[Math.floor(tick / 6) % STAGES.length]}
        </span>
      </div>

      <div className="index-grid__cells">
        {Array.from({ length: total }).map((_, i) => {
          const phase = (tick - i * 0.6) % 40;

          let state = 'idle';

          if (phase > 0 && phase < 10) state = 'reading';
          else if (phase >= 10 && phase < 20) state = 'understanding';
          else if (phase >= 20 && phase < 30) state = 'connecting';
          else if (phase >= 30 && phase < 40) state = 'preparing';

          return (
            <span
              key={i}
              className="index-grid__cell"
              style={{
                background: STAGE_COLOR[state],
              }}
            />
          );
        })}
      </div>

      <div className="index-grid__foot mono">
        <span>Building Confidence with Excellence</span>
        
      
      </div>
    </div>
  );
}