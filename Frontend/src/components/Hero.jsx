import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import IndexGrid from './IndexGrid';
import './hero.css';

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section id="top" className="hero" ref={ref}>
      <div className="hero__bg" aria-hidden="true">
        <div className="hero__glow" />
        <div className="hero__marquee mono">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i}>CODEUTIL&nbsp;&nbsp;&middot;&nbsp;&nbsp;</span>
          ))}
        </div>
      </div>

      <div className="container hero__inner">
        <motion.div className="hero__pill pill" style={{ opacity }}>
          <span className="dot" />
        Now understanding Python codebases
        </motion.div>

        <h1 className="hero__headline">
          <span>Know your own</span>
          <span className="hero__headline-accent">code</span>
          <span>before they ask.</span>
        </h1>

        <p className="hero__sub">
          Everything you need to know about your own project in one place.
          <br/>
         With questions your examiner is actually going to ask ,
          answered  backed by your own code.
        </p>

        <div className="hero__ctas">
          <a href="#contact" className="btn btn-primary">Upload your project</a>
          <a href="#how-it-works" className="btn btn-ghost">See how it works</a>
        </div>

        <div className="hero__meta mono">
          <span>Est. 2026</span>
          <span className="hero__meta-sep">/</span>
          <span>Early access</span>
        </div>
      </div>

      <motion.div className="hero__float hero__float--left" style={{ y: y1 }}>
        <IndexGrid />
      </motion.div>

  <motion.div className="hero__float hero__float--right" style={{ y: y2 }}>
  <div className="hero__snippet">
    <div className="hero__snippet-dot" />

    <p className="hero__snippet-title">
      <span className="hero__snippet-q">Q:</span> Why <code>CodeUtil</code>?
    </p>

    <p className="hero__snippet-a">
      Because memorizing code isn't enough.
    </p>

    <p className="hero__snippet-body">
      CodeUtil helps you understand your project,
      anticipate viva questions, and explain your
      implementation with confidence.
    </p>

    <div className="hero__snippet-footer">
      <span>✓ Every answer is backed by your own code.</span>
    </div>
  </div>
</motion.div>
    </section>
  );
}
