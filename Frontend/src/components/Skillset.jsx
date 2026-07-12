import { useEffect, useRef, useState, useCallback } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { skillset } from '../data/content';
import './skillset.css';

const HEADLINE_WORDS = [
  { t: 'Four' },
  { t: 'stages,' },
  { t: 'every' },
  { t: 'time' },
  { t: 'you' },
  { t: 'upload', hl: true },
];

export default function Skillset() {
  const [active, setActive] = useState(0);
  const [smoothPct, setSmoothPct] = useState(0);
  const scrollerRef = useRef(null);
  const railRef = useRef(null);
  const targetPctRef = useRef(0);
  const rafRef = useRef(null);
  const count = skillset.length;
  const item = skillset[active];
  const reduceMotion = useReducedMotion();

  // --- scroll -> continuous target progress (not stepped) ---
  useEffect(() => {
    const onScroll = () => {
      const el = scrollerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const progress = total > 0 ? clamp(-rect.top / total, 0, 1) : 0;
      targetPctRef.current = progress * 100;

      const idx = clamp(Math.floor(progress * count), 0, count - 1);
      setActive((prev) => (prev === idx ? prev : idx));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [count]);

  // --- lerp loop: eases the rail fill + ghost toward the real scroll
  //     position every frame instead of snapping, so it always feels
  //     like it's "catching up" smoothly rather than teleporting ---
  useEffect(() => {
    if (reduceMotion) {
      setSmoothPct(targetPctRef.current);
      return;
    }
    const tick = () => {
      setSmoothPct((prev) => {
        const next = prev + (targetPctRef.current - prev) * 0.12;
        return Math.abs(next - targetPctRef.current) < 0.05 ? targetPctRef.current : next;
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [reduceMotion]);

  const goTo = useCallback(
    (i) => {
      const idx = clamp(i, 0, count - 1);
      const el = scrollerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const progress = (idx + 0.5) / count;
      const absoluteTop = rect.top + window.scrollY;
      const targetY = total > 0 ? absoluteTop + progress * total : absoluteTop;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    },
    [count]
  );

  useEffect(() => {
    const onKey = (e) => {
      if (!railRef.current) return;
      if (!railRef.current.contains(document.activeElement)) return;
      if (e.key === 'ArrowDown') goTo(active + 1);
      if (e.key === 'ArrowUp') goTo(active - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, goTo]);

  return (
    <section id="how-it-works" className="section skillset">
      <div className="container">
        <div className="skillset__head">
          <motion.span
            className="skillset__eyebrow mono"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="skillset__eyebrow-dot" />
            How it works
          </motion.span>

          <h2 className="skillset__headline">
            {HEADLINE_WORDS.map((w, i) => (
              <span className="skillset__word-mask" key={i}>
                <motion.span
                  className={`skillset__word ${w.hl ? 'skillset__word--hl' : ''}`}
                  initial={{ y: '110%' }}
                  animate={{ y: '0%' }}
                  transition={{
                    duration: 0.75,
                    delay: 0.1 + i * 0.06,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {w.t}
                </motion.span>
              </span>
            ))}
          </h2>

          <motion.p
            className="skillset__subhead"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            Just log in, upload your codebase, then ask a question or generate viva-style questions with answers.
            <span className="skillset__subhead-accent"> Scroll down to see the exact user flow</span>,
            from upload to the answers that help you prepare.
          </motion.p>
        </div>

        <div className="skillset__scroller" ref={scrollerRef} style={{ '--stage-count': count }}>
          <div className="skillset__sticky">
            <div className="skillset__grid">
              <div className="skillset__rail" ref={railRef}>
                <div className="skillset__line">
                  <div className="skillset__line-fill" style={{ height: `${smoothPct}%` }} />
                  <span className="skillset__pulse" aria-hidden="true" />
                </div>

                {skillset.map((s, i) => {
                  const isActive = active === i;
                  const isPast = i < active;
                  return (
                    <button
                      key={s.n}
                      className={`skillset__node ${isActive ? 'is-active' : ''} ${isPast ? 'is-past' : ''}`}
                      onClick={() => goTo(i)}
                      aria-pressed={isActive}
                    >
                      <span className="skillset__dot">
                        {isActive && <span className="skillset__ping" />}
                        <span className="skillset__dot-core mono">{String(s.n).padStart(2, '0')}</span>
                      </span>
                      <span className="skillset__node-title">{s.title}</span>
                    </button>
                  );
                })}
              </div>

              <div className="skillset__stage">
                <span
                  className="skillset__ghost mono"
                  style={{ transform: `translateY(${(smoothPct % (100 / count)) * -0.6}px)` }}
                  aria-hidden="true"
                >
                  {String(item.n).padStart(2, '0')}
                </span>

                <div className="skillset__stage-chrome">
                  <span className="skillset__chrome-dot" />
                  <span className="skillset__chrome-dot" />
                  <span className="skillset__chrome-dot" />
                  <span className="skillset__chrome-label mono">stage_{String(item.n).padStart(2, '0')}.log</span>
                  <span className="skillset__chrome-live mono">
                    <span className="skillset__chrome-live-dot" /> LIVE
                  </span>
                </div>

                <div className="skillset__stage-body">
                  <span className="skillset__vertical-index mono" aria-hidden="true">
                    PIPELINE — {String(active + 1).padStart(2, '0')}/{String(count).padStart(2, '0')}
                  </span>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={item.n}
                      initial={{ opacity: 0, y: 28, filter: 'blur(6px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: -20, filter: 'blur(4px)' }}
                      transition={{ type: 'spring', stiffness: 260, damping: 28, mass: 0.9 }}
                    >
                      <motion.span
                        className="skillset__stage-eyebrow mono"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                      >
                        STAGE {String(item.n).padStart(2, '0')} / {String(count).padStart(2, '0')}
                      </motion.span>
                      <h3 className="skillset__stage-title">{item.title}</h3>
                      <p className="skillset__stage-desc">{item.desc}</p>

                      <div className="skillset__stage-result mono">
                        <span className="skillset__prompt">&gt;_</span> {item.result}
                        <span className="skillset__cursor" />
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="skillset__stage-footer">
                  <div className="skillset__scrollhint mono">
                    {active < count - 1 ? '↓ keep scrolling' : 'end of pipeline'}
                  </div>
                  <div className="skillset__progress-text mono">
                    {String(active + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}