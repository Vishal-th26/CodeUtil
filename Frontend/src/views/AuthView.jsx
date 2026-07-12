import { useState } from "react";
import { motion } from "framer-motion";
import { useApp } from "../context/AppContext";
import { ApiError } from "../api/client";
import "./AuthView.css";

export default function AuthView({ onSuccess, onBack }) {
  const { api, login, isAuthed, email: authedEmail } = useApp();

  const [mode, setMode] = useState("login");
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
      if (mode === "login") {
        const data = await api.login(email.trim(), password);
        login(data.access_token, email.trim());
        setStatus({ ok: true, message: "Signed in successfully." });
        setTimeout(() => onSuccess?.(), 400);
      } else {
        await api.register(email.trim(), password);
        setStatus({ ok: true, message: "Account created — you may sign in now." });
        setMode("login");
      }
    } catch (err) {
      setStatus({ ok: false, message: err instanceof ApiError ? err.message : "Request failed." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-split">
      <aside className="auth-left">
        <video className="auth-left__video" src="/videos/auth-page-video.mp4" autoPlay muted loop playsInline />
        <div className="auth-left__overlay" aria-hidden />
      </aside>

      <main className="auth-right">
        <motion.div className="auth-card" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>

          <div className="card-header">
            <h3 className="mode-title">{mode === "login" ? "Sign in" : "Create an account"}</h3>
          </div>

          <form onSubmit={handleSubmit} className="card-form">
            {/* Name field removed — only email & password required */}

            <div className="field">
              <label>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>

            <div className="field">
              <label>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Choose a strong password" />
            </div>

            <div className="form-actions">
              <button className="primary" type="submit" disabled={loading}>{loading ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}</button>
            </div>
          </form>

          
          <div className="card-footer">
            <button className="link" onClick={() => { setMode(mode === "login" ? "signup" : "login"); setStatus(null); }}>
              {mode === "login" ? "Create an account" : "Have an account? Sign in"}
            </button>
            {onBack && <button className="link muted" onClick={onBack}>Back to site</button>}
          </div>

          {status && <div className={`toast ${status.ok ? "ok" : "err"}`}>{status.message}</div>}
        </motion.div>
      </main>
    </div>
  );
}