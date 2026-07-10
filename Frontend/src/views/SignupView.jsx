import { useState } from "react";
import Panel from "../components/Panel";
import { useApp } from "../context/AppContext";
import { ApiError } from "../api/client";

export default function SignupView({ onDone }) {
  const { api } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState(null); // { ok, message }
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
      const data = await api.register(email.trim(), password);
      setStatus({
        ok: true,
        message: `Account created for ${data?.email || email}. Switch to log in to continue.`,
      });
    } catch (err) {
      setStatus({ ok: false, message: err instanceof ApiError ? err.message : "Registration failed." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Panel method="POST" path="/register">
      <h1>
        create account<span className="blink-cursor" />
      </h1>
      <p className="subtitle">
        Register once. Every session after this is scoped to your codebase, not anyone else's.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="su-email">email</label>
          <input
            id="su-email"
            type="email"
            placeholder="you@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>
        <div className="field">
          <label htmlFor="su-pass">password</label>
          <input
            id="su-pass"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
        </div>
        <div className="row">
          <button type="submit" className="btn" disabled={loading}>
            {loading ? "registering…" : "register"}
          </button>
          {onDone && (
            <button type="button" className="btn subtle" onClick={onDone}>
              go to log in
            </button>
          )}
        </div>
      </form>

      {status && <div className={"out " + (status.ok ? "ok" : "err")}>{status.message}</div>}
    </Panel>
  );
}
