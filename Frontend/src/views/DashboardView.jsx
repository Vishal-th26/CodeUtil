// DashboardView.jsx
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import { ApiError } from "../api/client";
import { useApp } from "../context/AppContext";
import "./DashboardView.css";

// Lightweight inline-markdown formatter: turns **bold** and `code` spans
// from LLM-generated answers into real React elements. Intentionally
// minimal (no lists/headings) since answers are single-paragraph text.
function formatInlineMarkdown(text) {
  if (!text || typeof text !== "string") return text;
  const regex = /\*\*(.+?)\*\*|`(.+?)`/g;
  const parts = [];
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[1] !== undefined) {
      parts.push(<strong key={`b-${key++}`}>{match[1]}</strong>);
    } else if (match[2] !== undefined) {
      parts.push(<code key={`c-${key++}`}>{match[2]}</code>);
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts;
}

function IndexingAnimation({ fileCount }) {
  const COLS = 12;
  const ROWS = 5;
  const cells = Array.from({ length: COLS * ROWS });

  return (
    <motion.div
      className="indexing-fx"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="indexing-fx__grid" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
        {cells.map((_, i) => {
          const col = i % COLS;
          const row = Math.floor(i / COLS);
          const delay = (col * 0.05) + (row * 0.09) + ((i % 5) * 0.03);
          return (
            <motion.div
              key={i}
              className="indexing-fx__cell"
              initial={{ opacity: 0.08, backgroundColor: 'rgba(255,255,255,0.04)' }}
              animate={{
                opacity: [0.08, 1, 0.3],
                backgroundColor: ['rgba(255,255,255,0.04)', 'rgba(255,180,84,0.9)', 'rgba(255,180,84,0.18)'],
              }}
              transition={{
                duration: 1.3,
                repeat: Infinity,
                repeatDelay: 0.6,
                delay,
                ease: 'easeInOut',
              }}
            />
          );
        })}
      </div>
      <div className="indexing-fx__status mono">
        <span className="indexing-fx__dot" />
        vectorizing {fileCount} file{fileCount === 1 ? '' : 's'} → building FAISS + BM25 index…
      </div>
    </motion.div>
  );
}

function UploadPanel({ api, onIndexed }) {
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState(null);
  const [indexing, setIndexing] = useState(false);
  const [uploadingCount, setUploadingCount] = useState(0);

  function addFiles(fileList) {
    const incoming = Array.from(fileList).filter((f) => f.name.endsWith(".py"));
    if (!incoming.length) return;
    setFiles((prev) => {
      const existing = new Set(prev.map((f) => f.name + f.size));
      const merged = [...prev];
      incoming.forEach((f) => {
        if (!existing.has(f.name + f.size)) merged.push(f);
      });
      return merged;
    });
  }

  function removeFile(name, size) {
    setFiles((prev) => prev.filter((f) => f.name + f.size !== name + size));
  }

  async function handleUpload() {
    if (!files.length) {
      setStatus({ ok: false, message: "Add at least one .py file." });
      return;
    }
    setUploadingCount(files.length);
    setIndexing(true);
    setStatus(null);
    const MIN_DURATION = 2600;
    const startedAt = Date.now();
    try {
      const data = await api.uploadFiles(files);
      const elapsed = Date.now() - startedAt;
      if (elapsed < MIN_DURATION) {
        await new Promise((resolve) => setTimeout(resolve, MIN_DURATION - elapsed));
      }
      setStatus({ ok: true, message: data?.message || "Codebase indexed." });
      setFiles([]);
      onIndexed?.();
    } catch (err) {
      const elapsed = Date.now() - startedAt;
      if (elapsed < MIN_DURATION) {
        await new Promise((resolve) => setTimeout(resolve, MIN_DURATION - elapsed));
      }
      setStatus({ ok: false, message: err instanceof ApiError ? err.message : "Upload failed." });
    } finally {
      setIndexing(false);
    }
  }

  return (
    <motion.div
      className="dashboard-panel upload-panel--animated"
      id="panel-upload"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="panel-head">
        <h2>Upload &amp; Index</h2>
      </div>
      <p className="subtitle">Drop .py </p>

      <motion.label
        className="dropzone dropzone--animated"
        whileHover={{ scale: 1.01, borderColor: "var(--accent)" }}
        whileTap={{ scale: 0.99 }}
      >
        <input type="file" multiple accept=".py" onChange={(e) => addFiles(e.target.files)} />
        <span className="mono">+ choose .py files</span>
      </motion.label>

      {files.length > 0 && (
        <ul className="file-list mono">
          {files.map((f) => (
            <li key={f.name + f.size}>
              <span>{f.name}</span>
              <span className="file-list-right">
                <span className="muted">{Math.ceil(f.size / 1024)} kb</span>
                <button className="btn-x" onClick={() => removeFile(f.name, f.size)} aria-label="remove">×</button>
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="row">
        <motion.button
          className="btn"
          onClick={handleUpload}
          disabled={indexing}
          whileHover={{ scale: indexing ? 1 : 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          <AnimatePresence mode="wait">
            {indexing ? (
              <motion.span
                key="indexing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="btn-indexing"
              >
                <span className="btn-spinner" /> indexing…
              </motion.span>
            ) : (
              <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                upload &amp; index
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      <AnimatePresence>
        {indexing && <IndexingAnimation fileCount={uploadingCount} />}
      </AnimatePresence>

      <AnimatePresence>
        {status && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            className={"out " + (status.ok ? "ok" : "err")}
          >
            {status.message}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function AskPanel({ api, locked }) {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleAsk(e) {
    e?.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setAnswer(null);
    try {
      const data = await api.ask(query.trim());
      setAnswer(data.answer);
    } catch (err) {
      setAnswer(err instanceof ApiError ? err.message : "Ask failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dashboard-panel" id="panel-ask">
      <div className="panel-head">
        <h2>Ask</h2>
      </div>
      {locked && (
        <div className="panel-lock-overlay">
          <span className="lock-icon">🔒</span>
          <p>Upload and index a codebase first to unlock this section.</p>
        </div>
      )}
      <div className={locked ? "panel-body panel-body--locked" : "panel-body"}>
        <p className="subtitle">Query your indexed codebase.</p>
        <form onSubmit={handleAsk} className="row">
          <input
            className="text-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What does process_file do?"
            disabled={locked}
          />
          <button className="btn" type="submit" disabled={locked || loading}>
            {loading ? "thinking…" : "ask"}
          </button>
        </form>
        {answer && (
          <div className="ask-answer">
            <div className="ask-answer__label mono">
              <span className="ask-answer__dot" />
              answer
            </div>
            <div className="ask-answer__body">{formatInlineMarkdown(answer)}</div>
          </div>
        )}
      </div>
    </div>
  );
}

const LOADING_WORDS = ['thinking', 'reading code', 'rendering', 'almost there'];

function useRotatingLabel(active, words = LOADING_WORDS, intervalMs = 900) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!active) {
      setI(0);
      return;
    }
    const t = setInterval(() => setI((n) => (n + 1) % words.length), intervalMs);
    return () => clearInterval(t);
  }, [active, words, intervalMs]);
  return words[i];
}

function VivaPanel({ api, locked, resetKey }) {
  const [questions, setQuestions] = useState(null);
  const [answers, setAnswers] = useState(null);
  const [loadingQ, setLoadingQ] = useState(false);
  const [loadingA, setLoadingA] = useState(false);
  const [answersFetched, setAnswersFetched] = useState(false);
  const [genCount, setGenCount] = useState(0);
  const genLabel = useRotatingLabel(loadingQ);
  const ansLabel = useRotatingLabel(loadingA);

  useEffect(() => {
    setGenCount(0);
    setAnswersFetched(false);
    setQuestions(null);
    setAnswers(null);
  }, [resetKey]);

  async function genQuestions() {
    setLoadingQ(true);
    setQuestions(null);
    setAnswers(null);
    setAnswersFetched(false);
    try {
      const res = await api.vivaQuestions();
      setQuestions(res?.questions || res);
      setGenCount((c) => c + 1);
    } catch (err) {
      setQuestions({ error: err instanceof ApiError ? err.message : "Failed" });
    } finally {
      setLoadingQ(false);
    }
  }

  async function fetchAnswers() {
    setLoadingA(true);
    setAnswers(null);
    try {
      const res = await api.vivaAnswers();
      setAnswers(res?.answers || res);
      setAnswersFetched(true);
    } catch (err) {
      setAnswers({ error: err instanceof ApiError ? err.message : "Failed" });
    } finally {
      setLoadingA(false);
    }
  }

  const merged = ['easy', 'medium', 'hard'].flatMap((difficulty) => {
    const qList = Array.isArray(questions?.[difficulty]) ? questions[difficulty] : [];
    const aList = Array.isArray(answers?.[difficulty]) ? answers[difficulty] : [];
    return qList.map((q, i) => ({
      ...q,
      difficulty,
      answer: aList[i]?.answer ?? aList.find((a) => a.id === q.id || a.question === q.question)?.answer ?? null,
    }));
  });

  return (
    <div className="dashboard-panel" id="panel-viva">
      <div className="panel-head">
        <h2>Viva</h2>
      </div>
      {locked && (
        <div className="panel-lock-overlay">
          <span className="lock-icon">🔒</span>
          <p>Upload and index a codebase first to unlock this section.</p>
        </div>
      )}
      <div className={locked ? "panel-body panel-body--locked" : "panel-body"}>
        <p className="subtitle">Generate questions, then fetch evidence-backed answers.</p>

        <div className="row">
          <button className="btn" onClick={genQuestions} disabled={locked || loadingQ || genCount >= 2}>
            {loadingQ ? (<><span className="btn-spinner" />{genLabel}…</>) : 'generate questions'}
          </button>
          <button className="btn subtle" onClick={fetchAnswers} disabled={locked || loadingA || !questions || answersFetched}>
            {loadingA ? (<><span className="btn-spinner" />{ansLabel}…</>) : 'get answers'}
          </button>
        </div>

        {genCount >= 2 && (
          <p className="viva-limit-msg">
            You've used both attempts for this codebase. Re-upload or change your codebase to generate new questions.
          </p>
        )}

        {merged.length > 0 && (
          <div className="viva-list">
            {merged.map((q, i) => (
              <div className={`viva-card viva-card--${(q.difficulty || 'medium').toLowerCase()}`} key={`${q.difficulty}-${q.id ?? i}`}>
                <div className="viva-card__head">
                  <span className="viva-card__index mono">Q{i + 1}</span>
                  <span className={`viva-badge viva-badge--${(q.difficulty || 'medium').toLowerCase()}`}>
                    {(q.difficulty || 'medium').toUpperCase()}
                  </span>
                </div>
                <p className="viva-card__question">{q.question}</p>
                {q.answer && (
                  <div className="viva-card__answer">
                    <span className="viva-card__answer-label mono">answer</span>
                    <p>{formatInlineMarkdown(q.answer)}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatusPanel({ api, onSessionChange, locked }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  async function refresh() {
    setLoading(true);
    try {
      const res = await api.status();
      setData(res);
      onSessionChange?.(Boolean(res?.active));
    } catch (err) {
      setData({ error: err instanceof ApiError ? err.message : "Failed" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dashboard-panel" id="panel-status">
      <div className="panel-head">
        <h2>Session</h2>
      </div>
      {locked && (
        <div className="panel-lock-overlay">
          <span className="lock-icon">🔒</span>
          <p>Upload and index a codebase first to unlock this section.</p>
        </div>
      )}
      <div className={locked ? "panel-body panel-body--locked" : "panel-body"}>
        <p className="subtitle">Session and index health.</p>
        <div className="row">
          <button className="btn subtle" onClick={refresh} disabled={locked || loading}>
            {loading ? "checking…" : "refresh"}
          </button>
        </div>
        {data && !data.error && (() => {
          const used = Number(data.requests_used_today ?? 0);
          const remaining = Number(data.requests_remaining_today ?? 0);
          const limit = Math.max(used + remaining, used || 1);
          const percent = limit > 0 ? Math.max(0, Math.min(100, (used / limit) * 100)) : 0;
          const timeLeft = Number(data.expires_in_seconds ?? 0);
          const hours = Math.floor(timeLeft / 3600);
          const minutes = Math.floor((timeLeft % 3600) / 60);

          return (
            <div className="session-status">
              <div className="session-status__row">
                <div className="session-gauge">
                  <svg viewBox="0 0 120 120" className="session-gauge__ring">
                    <circle cx="60" cy="60" r="52" className="session-gauge__track" />
                    <circle
                      cx="60"
                      cy="60"
                      r="52"
                      className="session-gauge__fill"
                      style={{
                        strokeDasharray: 2 * Math.PI * 52,
                        strokeDashoffset: 2 * Math.PI * 52 * (1 - Math.min(used / limit, 1)),
                      }}
                    />
                  </svg>
                  <div className="session-gauge__label">
                    <span className="session-gauge__value">{used}</span>
                    <span className="session-gauge__of">/ {limit}</span>
                    <span className="session-gauge__unit mono">requests</span>
                  </div>
                </div>

                <div className="session-meta">
                  <div className="session-meta__item">
                    <span className="session-meta__label mono">status</span>
                    <span className={`session-pill ${data.active ? 'session-pill--on' : 'session-pill--off'}`}>
                      <span className="session-pill__dot" />
                      {data.active ? 'active' : 'idle'}
                    </span>
                  </div>

                  <div className="session-meta__item">
                    <span className="session-meta__label mono">time remaining</span>
                    <div className="session-timebar">
                      <div
                        className="session-timebar__fill"
                        style={{ width: `${Math.max(0, Math.min(100, percent))}%` }}
                      />
                    </div>
                    <span className="session-meta__value mono">
                      {hours}h {minutes}m left
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
        {data && data.error && <div className="out err">{data.error}</div>}
      </div>
    </div>
  );
}

export default function DashboardView({ onAuthNav }) {
  const { email, api } = useApp();
  const [sessionActive, setSessionActive] = useState(false);
  const [hasIndexed, setHasIndexed] = useState(false);
  const [indexVersion, setIndexVersion] = useState(0);

  function handleLogout() {
    onAuthNav?.("auth");
  }

  return (
    <section className="dashboard-root">
      <Sidebar onLogout={handleLogout} onAuthNav={onAuthNav} email={email} hasIndexed={hasIndexed} />

      <main className="dashboard-main-area">
        <div className="dashboard-topbar">
          <div className="topbar-left">
            <h1 className="dashboard-heading">
              <span className="dashboard-heading__prompt mono">&gt;_</span>
              Dashboard
              <span className="dashboard-heading__cursor" />
            </h1>
            <p className="subtitle">
              Signed in as <span className="dashboard-heading__email mono">{email || "your account"}</span> — everything indexed, ready to query.
            </p>
          </div>
        </div>

        <div className="dashboard-stack">
          <UploadPanel api={api} onIndexed={() => {
            setHasIndexed(true);
            setIndexVersion((v) => v + 1);
          }} />
          <AskPanel api={api} locked={!hasIndexed} />
          <VivaPanel api={api} locked={!hasIndexed} resetKey={indexVersion} />
          <StatusPanel api={api} onSessionChange={setSessionActive} locked={!hasIndexed} />
        </div>
      </main>
    </section>
  );
}
