import { useState } from "react";
import Panel from "../components/Panel";
import IndexVisualizer from "../components/IndexVisualizer";
import { useApp } from "../context/AppContext";
import { ApiError } from "../api/client";
import "./StatusView.css";

export default function StatusView({ onSessionChange }) {
  const { api } = useApp();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.status();
      setData(res);
      onSessionChange?.(Boolean(res?.active));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not load status.");
    } finally {
      setLoading(false);
    }
  }

  async function handleEndSession() {
    setError(null);
    try {
      await api.endSession();
      setData(null);
      onSessionChange?.(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not end session.");
    }
  }

  const active = Boolean(data?.active);
  const functionCount = data?.files_indexed_functions ?? 0;
  const filledRatio = active ? Math.min(1, functionCount / 96) : 0;

  return (
    <Panel method="GET" path="/codebase/status">
      <h1>
        session status<span className="blink-cursor" />
      </h1>
      <p className="subtitle">Sessions expire after inactivity and are capped at a daily message quota.</p>

      <div className="row">
        <button className="btn" onClick={refresh} disabled={loading}>
          {loading ? "checking…" : "refresh"}
        </button>
        <button className="btn ghost" onClick={handleEndSession}>
          end session
        </button>
      </div>

      <div className="status-layout">
        <div className="statline">
          {!data && !error && <span className="statline-empty">no session data yet — click refresh</span>}
          {data && !active && <span className="statline-empty">no active session — upload a codebase to start one</span>}
          {data && active && (
            <>
              <span>
                <b>{functionCount}</b> functions indexed
              </span>
              <span>
                expires in <b>{Math.max(0, Math.round((data.expires_in_seconds || 0) / 60))}m</b>
              </span>
              <span>
                <b>{data.requests_remaining_today}</b> requests left today
              </span>
            </>
          )}
        </div>

        <IndexVisualizer
          filledRatio={filledRatio}
          dense
          label={active ? `${functionCount} chunks live` : "no live index"}
        />
      </div>

      {error && <div className="out err">{error}</div>}
      {data && <div className="out">{JSON.stringify(data, null, 2)}</div>}
    </Panel>
  );
}
