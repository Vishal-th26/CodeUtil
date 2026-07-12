import { useEffect, useState } from 'react';
import './nav.css';

const LINKS = [
  { href: '#capabilities', label: 'Capabilities' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#testimonials', label: 'Reviews' },
  { href: '#faq', label: 'FAQ' },
  { href: '#contact', label: 'Contact' },
];

function scrollToAnchor(href, onNavigate) {
  const target = String(href || '');
  const isHash = target.startsWith('#');

  if (onNavigate) {
    onNavigate(target);
    return;
  }

  if (!isHash) {
    window.location.assign(target);
    return;
  }

  const id = target.replace('#', '');
  if (!id) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    try { window.history.replaceState(window.history.state, '', target); } catch (e) {}
  } else {
    window.location.hash = target;
  }
}

export default function Nav({ onStart, variant, onNavigate }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function handleLinkClick(e, href) {
    e.preventDefault();
    if (open) setOpen(false);
    scrollToAnchor(href, onNavigate);
  }

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''} ${variant === 'compact' ? 'nav--compact' : ''}`}>
      <div className="container nav__inner">
        <a href="#top" className="nav__logo mono" onClick={(e) => handleLinkClick(e, '#top')}>
          <span className="nav__logo-mark">&gt;_</span>CodeUtil
        </a>

        <nav className="nav__links">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => handleLinkClick(e, l.href)}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="nav__right">
          {variant !== 'compact' && (
            <span className="pill nav__pill">
              <span className="dot" />
              Early access(BETA 0.0.1)
            </span>
          )}
          <button type="button" className={`btn ${variant === 'compact' ? 'ghost' : 'btn-primary'}`} onClick={() => onStart?.()}>{variant === 'compact' ? 'Sign in' : 'Get started'}</button>
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
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => handleLinkClick(e, l.href)}
            >
              {l.label}
            </a>
          ))}
          <button type="button" className="btn btn-primary" onClick={() => { setOpen(false); onStart?.(); }}>Get started</button>
        </div>
      )}
    </header>
  );
}
