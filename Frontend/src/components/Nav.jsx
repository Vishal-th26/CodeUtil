import { useEffect, useState } from 'react';
import './nav.css';

const LINKS = [
  { href: '#capabilities', label: 'Capabilities' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#pricing', label: 'Reviews' },
  { href: '#faq', label: 'FAQ' },
];

export default function Nav({ onStart }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <div className="container nav__inner">
        <a href="#top" className="nav__logo mono">
          <span className="nav__logo-mark">&gt;_</span>CodeUtil
        </a>

        <nav className="nav__links">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href}>{l.label}</a>
          ))}
        </nav>

        <div className="nav__right">
          <span className="pill nav__pill">
            <span className="dot" />
            Early access(BETA 0.0.1)
          </span>
          <button type="button" className="btn btn-primary" onClick={() => onStart?.()}>Get started</button>
        </div>

        <button
          className={`nav__burger ${open ? 'nav__burger--open' : ''}`}
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span /><span /><span />
        </button>
      </div>

      {open && (
        <div className="nav__mobile">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</a>
          ))}
          <button type="button" className="btn btn-primary" onClick={() => { setOpen(false); onStart?.(); }}>Get started</button>
        </div>
      )}
    </header>
  );
}
