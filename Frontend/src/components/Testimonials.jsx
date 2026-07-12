import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { testimonials } from '../data/content';
import Reveal from './Reveal';
import './testimonials.css';

const PAGE_SIZE = 4;
const AVATAR_HUES = [24, 158, 265, 200, 340, 90];

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export default function Testimonials() {
  const pages = useMemo(() => chunk(testimonials, PAGE_SIZE), []);
  const pageCount = pages.length;

  const [page, setPage] = useState(0);
  const [dragX, setDragX] = useState(0);
  const dragging = useRef(false);
  const startX = useRef(0);
  const trackRef = useRef(null);

  const goTo = useCallback(
    (i) => setPage(Math.min(Math.max(i, 0), pageCount - 1)),
    [pageCount]
  );

  // --- keyboard nav when the slider has focus ---
  useEffect(() => {
    const onKey = (e) => {
      if (!trackRef.current) return;
      if (document.activeElement !== trackRef.current) return;
      if (e.key === 'ArrowRight') goTo(page + 1);
      if (e.key === 'ArrowLeft') goTo(page - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [page, goTo]);

  // --- drag handlers ---
  const onPointerDown = (e) => {
    dragging.current = true;
    startX.current = e.clientX;
    trackRef.current?.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!dragging.current) return;
    setDragX(e.clientX - startX.current);
  };

  const endDrag = () => {
    if (!dragging.current) return;
    dragging.current = false;
    const threshold = 60;
    if (dragX < -threshold) goTo(page + 1);
    else if (dragX > threshold) goTo(page - 1);
    setDragX(0);
  };

  return (
    <section id="testimonials" className="section testimonials">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">Early access</span>
          <h2>What students say the night after</h2>
        </Reveal>

        <Reveal delay={0.08} className="testimonials__stage">
          <button
            className="testimonials__arrow testimonials__arrow--left"
            onClick={() => goTo(page - 1)}
            disabled={page === 0}
            aria-label="Previous reviews"
          >
            ‹
          </button>

          <div
            className="testimonials__viewport"
            ref={trackRef}
            tabIndex={0}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerLeave={endDrag}
          >
            <motion.div
              className="testimonials__pages"
              animate={{ x: `calc(${-page * 100}% + ${dragging.current ? dragX : 0}px)` }}
              transition={
                dragging.current
                  ? { duration: 0 }
                  : { type: 'spring', stiffness: 300, damping: 32 }
              }
            >
              {pages.map((group, pi) => (
                <div className="testimonials__page" key={pi}>
                  <div className="inbox-panel">
                    <div className="inbox-panel__chrome">
                      <span className="inbox-panel__dot inbox-panel__dot--red" />
                      <span className="inbox-panel__dot inbox-panel__dot--yellow" />
                      <span className="inbox-panel__dot inbox-panel__dot--green" />
                      <div className="inbox-panel__search mono">
                        <svg viewBox="0 0 20 20" width="13" height="13" aria-hidden="true">
                          <circle cx="8.5" cy="8.5" r="6" fill="none" stroke="currentColor" strokeWidth="1.4" />
                          <line x1="13" y1="13" x2="18" y2="18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                        </svg>
                        search reviews
                      </div>
                      <div className="inbox-panel__tabs">
                        <span className="inbox-panel__tab is-active">Inbox</span>
                        <span className="inbox-panel__tab">Highlights</span>
                      </div>
                    </div>

                    <div className="inbox-panel__rows">
                      {group.map((t, i) => {
                        const hue = AVATAR_HUES[(pi * PAGE_SIZE + i) % AVATAR_HUES.length];
                        return (
                          <div className="inbox-row" key={t.name + i}>
                            <span className="inbox-row__star" aria-hidden="true">
                              <svg viewBox="0 0 20 20" width="15" height="15">
                                <path
                                  d="M10 1.5l2.47 5.44 5.98.63-4.5 4.05 1.24 5.88L10 14.6l-5.19 2.9 1.24-5.88-4.5-4.05 5.98-.63L10 1.5z"
                                  fill="currentColor"
                                />
                              </svg>
                            </span>

                            <span
                              className="inbox-row__avatar"
                              style={{
                                background: `hsla(${hue}, 70%, 55%, 0.16)`,
                                color: `hsl(${hue}, 70%, 62%)`,
                              }}
                            >
                              {t.name[0]}
                            </span>

                            <div className="inbox-row__main">
                              <div className="inbox-row__top">
                                <cite className="inbox-row__name">{t.name}</cite>
                                <span className="inbox-row__role mono">{t.role}</span>
                              </div>
                              <p className="inbox-row__snippet">{t.quote}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          <button
            className="testimonials__arrow testimonials__arrow--right"
            onClick={() => goTo(page + 1)}
            disabled={page === pageCount - 1}
            aria-label="Next reviews"
          >
            ›
          </button>
        </Reveal>

        <div className="testimonials__dots">
          {pages.map((_, i) => (
            <button
              key={i}
              className={`testimonials__dot ${i === page ? 'is-active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Go to page ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}