import { useState } from "react";
import Panel from "../components/Panel";
import { useApp } from "../context/AppContext";
import { ApiError } from "../api/client";

const EXAMPLES = ["What does process_file do?", "How is the FAISS index queried?", "Where is the LLM prompt built?"];

export default function AskView() {
  const { api } = useApp();
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleAsk(e) {
    e.preventDefault();
    if (!query.trim()) {
      setError("Type a question first.");
      return;
    }
    setLoading(true);
    setError(null);
    setAnswer(null);
    try {
      const data = await api.ask(query.trim());
      setAnswer(data.answer);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Ask failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Panel method="POST" path="/codebase/ask">
      <h1>
        ask the codebase<span className="blink-cursor" />
      </h1>
      <p className="subtitle">Semantic and keyword retrieval, then answered strictly from your indexed source.</p>

      <form onSubmit={handleAsk}>
        <div className="field">
          <label htmlFor="ask-q">query</label>
          <input
            id="ask-q"
            type="text"
            placeholder="What does process_file do?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="row">
          <button type="submit" className="btn" disabled={loading}>
            {loading ? "thinking…" : "ask"}
          </button>
          {EXAMPLES.map((ex) => (
            <button type="button" key={ex} className="btn subtle" onClick={() => setQuery(ex)}>
              {ex}
            </button>
          ))}
        </div>
      </form>

      {loading && <div className="out pending">retrieving from FAISS + BM25, then querying the model…</div>}
      {error && <div className="out err">{error}</div>}
      {answer && <div className="out ok">{answer}</div>}
    </Panel>
  );
}
