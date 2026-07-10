import { useApp } from "../context/AppContext";
import "./TopBar.css";

export default function TopBar() {
  const { baseUrl, setBaseUrl, isAuthed, email } = useApp();

  return (
    <header className="topbar">
      <div className="logo-dot" />
      <div className="logo">
        codeutil<span className="blink-cursor" />
      </div>

      {isAuthed && (
        <span className="topbar-user mono" title={email || undefined}>
          {email}
        </span>
      )}

      <div className="topbar-endpoint">
        <label htmlFor="baseUrl" className="mono">
          api base
        </label>
        <input
          id="baseUrl"
          type="text"
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
          spellCheck={false}
        />
      </div>
    </header>
  );
}
