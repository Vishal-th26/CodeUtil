import { useState } from "react";
import Panel from "../components/Panel";
import { useApp } from "../context/AppContext";
import { ApiError } from "../api/client";
import "./VivaView.css";

const DIFFICULTIES = ["easy", "medium", "hard"];

function normalizeQuestionList(list) {
  // Each item may be a plain string or an object with a question/q field.
  return (list || []).map((item) =>
    typeof item === "string" ? { question: item } : { question: item.question || item.q }
  );
}

export default function VivaView() {
  const { api } = useApp();

  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [loadingAnswers, setLoadingAnswers] = useState(false);
  const [questionsError, setQuestionsError] = useState(null);
  const [answersError, setAnswersError] = useState(null);
  const [questions, setQuestions] = useState(null); // raw { easy: [...], medium: [...], hard: [...] }
  const [answers, setAnswers] = useState(null); // raw { easy: [...], medium: [...], hard: [...] }

  async function handleGenerateQuestions() {
    setLoadingQuestions(true);
    setQuestionsError(null);
    setQuestions(null);
    setAnswers(null);
    setAnswersError(null);
    try {
      const res = await api.vivaQuestions();
      setQuestions(res?.questions || res);
    } catch (err) {
      setQuestionsError(err instanceof ApiError ? err.message : "Viva question generation failed.");
    } finally {
      setLoadingQuestions(false);
    }
  }

  async function handleGetAnswers() {
    setLoadingAnswers(true);
    setAnswersError(null);
    setAnswers(null);
    try {
      const res = await api.vivaAnswers();
      setAnswers(res?.answers || res);
    } catch (err) {
      setAnswersError(err instanceof ApiError ? err.message : "Fetching viva answers failed.");
    } finally {
      setLoadingAnswers(false);
    }
  }

  const hasQuestions = DIFFICULTIES.some((d) => Array.isArray(questions?.[d]) && questions[d].length);
  const hasAnswers = DIFFICULTIES.some((d) => Array.isArray(answers?.[d]) && answers[d].length);

  return (
    <Panel method="POST" path={hasQuestions ? "/codebase/viva/answers" : "/codebase/viva/questions"}>
      <h1>
        generate a viva<span className="blink-cursor" />
      </h1>
      <p className="subtitle">
        10 questions across easy, medium, and hard. Generate the questions first, then
        fetch answers backed by evidence pulled from your files.
      </p>

      <div className="row">
        <button className="btn" onClick={handleGenerateQuestions} disabled={loadingQuestions}>
          {loadingQuestions ? "generating…" : "generate questions"}
        </button>
        <button
          className="btn"
          onClick={handleGetAnswers}
          disabled={!hasQuestions || loadingAnswers}
          title={!hasQuestions ? "Generate questions first" : undefined}
        >
          {loadingAnswers ? "fetching…" : "get answers"}
        </button>
      </div>

      {loadingQuestions && <div className="out pending">building questions from your codebase…</div>}
      {questionsError && <div className="out err">{questionsError}</div>}

      {loadingAnswers && <div className="out pending">answering each question with evidence…</div>}
      {answersError && <div className="out err">{answersError}</div>}

      {hasQuestions && !hasAnswers && (
        <div className="viva-results">
          {DIFFICULTIES.map((diff) => {
            const list = normalizeQuestionList(questions[diff]);
            if (!list.length) return null;
            return (
              <div key={diff}>
                <div className="diff-label mono">{diff}</div>
                {list.map((item, i) => (
                  <div className="qa-block" key={i}>
                    <div className="qa-q">{item.question}</div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {hasAnswers && (
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

      {hasQuestions && !hasAnswers && !questions?.easy && !questions?.medium && !questions?.hard && (
        <div className="out">{JSON.stringify(questions, null, 2)}</div>
      )}
    </Panel>
  );
}