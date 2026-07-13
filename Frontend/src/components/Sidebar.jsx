import React from 'react';
import './Sidebar.css';

function scrollToPanel(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  try { window.history.replaceState(window.history.state, '', `#${id}`); } catch (e) {}
}

export default function Sidebar({ onLogout, onAuthNav, email, hasIndexed }) {
  function handlePanelClick(e, id) {
    e.preventDefault();
    if (!hasIndexed && id !== 'panel-upload') return;
    scrollToPanel(id);
  }

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-top">
        <div className="logo mono">&gt;_ CodeUtil</div>
        <div className="email mono" title={email}>{email}</div>
      </div>

      <nav className="sidebar-nav">
        <a className="active">Dashboard</a>
        <a href="#panel-upload" onClick={(e) => handlePanelClick(e, 'panel-upload')}>Upload</a>
        <a href="#panel-ask" className={!hasIndexed ? 'locked' : ''} onClick={(e) => handlePanelClick(e, 'panel-ask')}>Ask</a>
        <a href="#panel-viva" className={!hasIndexed ? 'locked' : ''} onClick={(e) => handlePanelClick(e, 'panel-viva')}>Viva</a>
        <a href="#panel-status" className={!hasIndexed ? 'locked' : ''} onClick={(e) => handlePanelClick(e, 'panel-status')}>Session</a>
      </nav>

      <div className="sidebar-bottom">
        <button className="btn subtle" onClick={() => onAuthNav?.('auth')}>Back to auth</button>
        <button className="btn" onClick={() => onLogout?.()}>Logout</button>
      </div>
    </aside>
  );
}
