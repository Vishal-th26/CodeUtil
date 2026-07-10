import { useState } from "react";
import Panel from "../components/Panel";
import { useApp } from "../context/AppContext";
import { ApiError } from "../api/client";
import "./VivaView.css";

const DIFFICULTIES = ["easy", "medium", "hard"];

export default function VivaView() {
  const { api } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await api.viva();
      setData(res);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Viva generation failed.");
    } finally {
      setLoading(false);
    }
  }

  const answers = data?.answers || {};
  const hasStructuredAnswers = DIFFICULTIES.some((d) => Array.isArray(answers[d]) && answers[d].length);

  return (
    <Panel method="POST" path="/codebase/viva">
      <h1>
        generate a viva<span className="blink-cursor" />
      </h1>
      <p className="subtitle">
        10 questions across easy, medium, and hard — each answered with evidence pulled from your files.
      </p>

      <div className="row">
        <button className="btn" onClick={handleGenerate} disabled={loading}>
          {loading ? "generating…" : "generate"}
        </button>
      </div>

      {loading && <div className="out pending">building questions from your codebase…</div>}
      {error && <div className="out err">{error}</div>}

      {data && hasStructuredAnswers && (
        <div className="viva-results">
          {DIFFICULTIES.map((diff) => {
            const list = answers[diff];
            if (!list || !list.length) return null;
            return (
              <div key={diff}>
                <div className="diff-label mono">{diff}</div>
                {list.map((item, i) => (
                  <div className="qa-block" key={i}>
                    <div className="qa-q">{item.question || item.q}</div>
                    <div className="qa-a">{item.answer || item.a}</div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {data && !hasStructuredAnswers && <div className="out">{JSON.stringify(data, null, 2)}</div>}
    </Panel>
  );
}
