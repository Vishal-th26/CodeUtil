import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AppProvider, useApp } from './context/AppContext';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Intro from './components/Intro';
import StatRow from './components/StatRow';
import Capabilities from './components/Capabilities';
import CaseStudy from './components/CaseStudy';
import Skillset from './components/Skillset';
import Showreel from './components/Showreel';
import UnderTheHood from './components/UnderTheHood';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import TransitionOverlay from './components/TransitionOverlay';
import AuthView from './views/AuthView';
import DashboardView from './views/DashboardView';
import './App.css';

function Shell() {
  const [view, setView] = useState('landing');
  const [sessionActive, setSessionActive] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [transitionTitle, setTransitionTitle] = useState('');
  const [transitionMessage, setTransitionMessage] = useState('');
  const [activeView, setActiveView] = useState('landing');
  const [pendingAnchor, setPendingAnchor] = useState(null);

  // ref keeps the popstate handler in sync with latest view,
  // avoiding the stale-closure bug from an empty-deps effect
  const viewRef = useRef(view);
  useEffect(() => { viewRef.current = view; }, [view]);

  function scrollToHash(hash) {
    const id = String(hash || '').replace(/^#/, '');
    if (!id) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    window.setTimeout(() => {
      try {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          try { window.history.replaceState(window.history.state || { view }, '', `#${id}`); } catch (e) {}
        }
      } catch (e) {}
    }, 60);
  }

  function goTo(next, opts = { push: true }) {
    if (next === viewRef.current) return;
    setTransitioning(true);
    setTransitionTitle(next === 'auth' ? 'Opening authentication' : next === 'dashboard' ? 'Entering the dashboard' : 'Loading experience');
    setTransitionMessage(next === 'auth' ? 'Preparing the account screen.' : next === 'dashboard' ? 'Loading the unified dashboard workspace.' : 'Opening the next section.');
    setActiveView(next);
    if (opts.push !== false) {
      try { window.history.pushState({ view: next }, '', `#${next}`); } catch (e) {}
    }
    window.setTimeout(() => {
      setView(next);
      setTransitioning(false);
    }, 400);
  }

  useEffect(() => {
    if (view === 'landing') setActiveView('landing');
  }, [view]);

  useEffect(() => {
    if (view !== 'landing' || !pendingAnchor) return;
    const id = String(pendingAnchor).replace('#', '');
    const t = setTimeout(() => {
      try {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          try { window.history.replaceState(window.history.state, '', `#${id}`); } catch (e) {}
        }
      } catch (e) {}
      setPendingAnchor(null);
    }, 60);
    return () => clearTimeout(t);
  }, [view, pendingAnchor]);

  useEffect(() => {
    if (view !== 'landing') return;
    const hash = window.location.hash;
    if (!hash) return;
    const t = setTimeout(() => scrollToHash(hash), 60);
    return () => clearTimeout(t);
  }, [view]);

  useEffect(() => {
    try { window.history.replaceState({ view }, '', window.location.hash || '#landing'); } catch (e) {}

    const onPop = (e) => {
      const state = e.state || {};
      const next = state.view || (window.location.hash ? window.location.hash.replace('#', '') : 'landing');
      goTo(next, { push: false });
    };

    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  if (view === 'landing') {
    return (
      <div className="app-shell">
        <AnimatePresence>{transitioning && activeView !== 'landing' && <TransitionOverlay title={transitionTitle} message={transitionMessage} />}</AnimatePresence>
        <Nav onStart={() => goTo('auth')} />
        <main>
          <Hero onStart={() => goTo('auth')} onNavigate={(href) => scrollToHash(href)} />
          <Intro />
          <StatRow />
          <Capabilities />
          <CaseStudy />
          <Skillset />
          <Showreel />
          {/* <UnderTheHood /> */}
          <Testimonials />
          <FAQ />
        </main>
        <Footer onNavigate={(href) => {
          setPendingAnchor(href);
          goTo('landing');
        }} />
      </div>
    );
  }

  return (
    <div className="app-shell">
      <AnimatePresence>{transitioning && <TransitionOverlay title={transitionTitle} message={transitionMessage} />}</AnimatePresence>
      <Nav
        variant="compact"
        onStart={() => goTo('auth')}
        onNavigate={(href) => {
          setPendingAnchor(href);
          goTo('landing');
        }}
      />
      {view === 'auth' ? (
        <div className="auth-shell">
          <main className="dashboard-content">
            <AnimatePresence mode="wait">
              <motion.div key="auth" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}>
                <AuthView onSuccess={() => goTo('dashboard')} onBack={() => goTo('landing')} />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {view === 'dashboard' && (
            <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}>
              <DashboardView onLogout={() => goTo('auth')} onAuthNav={() => goTo('auth')} onSessionChange={setSessionActive} />
            </motion.div>
          )}
        </AnimatePresence>
      )}
      <Footer onNavigate={(href) => {
        setPendingAnchor(href);
        goTo('landing');
      }} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}