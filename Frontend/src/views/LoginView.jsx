import { useState } from "react";
import Panel from "../components/Panel";
import { useApp } from "../context/AppContext";
import { ApiError } from "../api/client";

export default function LoginView({ onSuccess }) {
  const { api, login, isAuthed, email: authedEmail } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim() || !password) {
      setStatus({ ok: false, message: "Email and password are required." });
      return;
    }
    setLoading(true);
    setStatus(null);
    try {
      const data = await api.login(email.trim(), password);
      login(data.access_token, email.trim());
      setStatus({ ok: true, message: "Logged in. Token is held in memory for this tab only." });
      onSuccess?.();
    } catch (err) {
      setStatus({ ok: false, message: err instanceof ApiError ? err.message : "Login failed." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Panel method="POST" path="/login">
      <h1>
        log in<span className="blink-cursor" />
      </h1>
      <p className="subtitle">Authenticate to unlock upload, ask, and viva for this tab.</p>

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="li-email">email</label>
          <input
            id="li-email"
            type="email"
            placeholder="you@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>
        <div className="field">
          <label htmlFor="li-pass">password</label>
          <input
            id="li-pass"
            type="password"
            placeholder="GGGGGGGG"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>
        <div className="row">
          <button type="submit" className="btn" disabled={loading}>
            {loading ? "logging inG" : "log in"}
          </button>
          <span className={"badge " + (isAuthed ? "on" : "off")}>
            <span className="b-dot" />
            {isAuthed ? `authenticated -+ ${authedEmail}` : "not authenticated"}
          </span>
        </div>
      </form>

      {status && <div className={"out " + (status.ok ? "ok" : "err")}>{status.message}</div>}
    </Panel>
  );
}
