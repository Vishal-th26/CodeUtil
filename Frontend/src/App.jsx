import { useState } from 'react';
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
import Pricing from './components/Pricing';
import Testimonials from './components/Testimonials';
import LogoStrip from './components/LogoStrip';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Footer from './components/Footer';
import TopBar from './components/TopBar';
import Sidebar from './components/Sidebar';
import SignupView from './views/SignupView';
import LoginView from './views/LoginView';
import UploadView from './views/UploadView';
import AskView from './views/AskView';
import VivaView from './views/VivaView';
import StatusView from './views/StatusView';
import './App.css';

function Shell() {
  const { isAuthed } = useApp();
  const [view, setView] = useState('landing');
  const [sessionActive, setSessionActive] = useState(false);

  function goTo(next) {
    setView(next);
  }

  if (view === 'landing') {
    return (
      <div className="app-shell">
        <Nav onStart={() => goTo('signup')} />
        <main>
          <Hero />
          <Intro />
          <StatRow />
          <Capabilities />
          <CaseStudy />
          <Skillset />
          <Showreel />
          <UnderTheHood />
          <Pricing />
          <Testimonials />
          <LogoStrip />
          <FAQ />
          <Contact />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="app-shell">
      <TopBar />
      <div className="dashboard-shell container">
        <Sidebar view={view} setView={goTo} isAuthed={isAuthed} />
        <main className="dashboard-content">
          {view === 'signup' && <SignupView onDone={() => goTo('login')} />}
          {view === 'login' && <LoginView onSuccess={() => goTo('upload')} />}
          {view === 'upload' && isAuthed && <UploadView />}
          {view === 'ask' && isAuthed && <AskView />}
          {view === 'viva' && isAuthed && <VivaView />}
          {view === 'status' && isAuthed && <StatusView onSessionChange={setSessionActive} />}
          {!isAuthed && ['upload', 'ask', 'viva', 'status'].includes(view) && (
            <LoginView onSuccess={() => goTo('upload')} />
          )}
        </main>
      </div>
      <footer className="app-footer">
        <div className="container app-footer__inner">
          <span>CodeUtil • unified auth, indexing, and Q&A experience</span>
          <span className={`app-footer__status ${sessionActive ? 'active' : ''}`}>
            {sessionActive ? 'session active' : 'ready for upload'}
          </span>
        </div>
      </footer>
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
