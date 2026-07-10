import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useI18n } from "../i18n";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";
import TimerDisplay from "../components/TimerDisplay";
import Confetti from "../components/Confetti";

const STAGE = { SETUP: "setup", RUNNING: "running", RESULT: "result" };

export default function Practice() {
  const { t } = useI18n();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stage, setStage] = useState(STAGE.SETUP);
  const [topics, setTopics] = useState([]);
  const [count, setCount] = useState(10);
  const [topic, setTopic] = useState("");

  const [sessionId, setSessionId] = useState(null);
  const [problems, setProblems] = useState([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null); // { correctIndex }
  const [problemStart, setProblemStart] = useState(Date.now());

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      api.topics().then(setTopics).catch(() => {});
    }
  }, [user]);

  if (!user) {
    return (
      <div className="container page">
        <div className="card">
          Нужно войти в аккаунт. <Link to="/login" style={{ color: "var(--accent)" }}>{t.nav.login}</Link>
        </div>
      </div>
    );
  }

  const start = async () => {
    setError(null);
    try {
      const { sessionId } = await api.startSession();
      const set = await api.practiceSet(count, topic || undefined);
      if (set.length === 0) {
        setError("В банке пока нет подходящих задач.");
        return;
      }
      setSessionId(sessionId);
      setProblems(set);
      setIndex(0);
      setSelected(null);
      setFeedback(null);
      setProblemStart(Date.now());
      setStage(STAGE.RUNNING);
    } catch (err) {
      setError(err.message);
    }
  };

  const answer = async (optIndex) => {
    if (feedback) return; // уже ответили на эту задачу
    const timeMs = Date.now() - problemStart;
    setSelected(optIndex);
    try {
      const res = await api.submitAttempt({
        sessionId,
        problemId: problems[index].id,
        chosenIndex: optIndex,
        timeMs,
      });
      setFeedback(res);
    } catch (err) {
      setError(err.message);
    }
  };

  const next = () => {
    if (index + 1 >= problems.length) {
      finish();
      return;
    }
    setIndex(index + 1);
    setSelected(null);
    setFeedback(null);
    setProblemStart(Date.now());
  };

  const finish = async () => {
    try {
      const res = await api.finishSession(sessionId);
      setResult(res);
      setStage(STAGE.RESULT);
    } catch (err) {
      setError(err.message);
    }
  };

  if (stage === STAGE.SETUP) {
    return (
      <div className="container page" style={{ maxWidth: 480 }}>
        <div className="card">
          <h2 style={{ marginBottom: 20 }}>{t.practice.title}</h2>
          <div className="field">
            <label>{t.practice.countLabel}</label>
            <input type="number" min={3} max={30} value={count} onChange={(e) => setCount(Number(e.target.value))} />
          </div>
          <div className="field">
            <label>{t.practice.topicLabel}</label>
            <select value={topic} onChange={(e) => setTopic(e.target.value)}>
              <option value="">{t.practice.allTopics}</option>
              {topics.map((tp) => (
                <option key={tp} value={tp}>
                  {tp}
                </option>
              ))}
            </select>
          </div>
          {error && <div className="error-text">{error}</div>}
          <button className="btn btn-primary" style={{ width: "100%" }} onClick={start}>
            {t.practice.start}
          </button>
        </div>
      </div>
    );
  }

  if (stage === STAGE.RUNNING) {
    const problem = problems[index];
    return (
      <div className="container page" style={{ maxWidth: 640 }}>
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <span style={{ color: "var(--text-muted)", fontSize: 14 }}>
              {t.duel.problem} {index + 1} / {problems.length}
            </span>
            <TimerDisplay key={index} running={!feedback} />
          </div>

          <div className="problem-statement">{problem.statement}</div>
          {problem.imageUrl && (
            <img className="problem-image" src={`${api.API_URL}${problem.imageUrl}`} alt="" />
          )}

          {problem.options.map((opt, i) => {
            let cls = "option";
            if (feedback) {
              if (i === feedback.correctIndex) cls += " correct";
              else if (i === selected) cls += " incorrect";
            }
            return (
              <button key={i} className={cls} onClick={() => answer(i)}>
                {opt}
              </button>
            );
          })}

          {error && <div className="error-text">{error}</div>}

          {feedback && (
            <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={next}>
              {index + 1 >= problems.length ? t.practice.finish : t.practice.next}
            </button>
          )}
        </div>
      </div>
    );
  }

  // STAGE.RESULT
  const scoreRatio = result.totalCount ? result.correctCount / result.totalCount : 0;
  return (
    <div className="container page" style={{ maxWidth: 480 }}>
      {scoreRatio >= 0.8 && <Confetti />}
      <div className="card">
        <h2 style={{ marginBottom: 20 }}>{t.practice.resultTitle}</h2>
        <p style={{ fontSize: 18, marginBottom: 8 }}>
          {t.practice.correct}: <strong>{result.correctCount}</strong> {t.practice.of} {result.totalCount}
        </p>
        <p style={{ fontSize: 18, marginBottom: 24 }}>
          {t.practice.totalTime}: <span className="mono">{(result.totalTimeMs / 1000).toFixed(1)} с</span>
        </p>
        <div style={{ display: "flex", gap: 12 }}>
          <button className="btn btn-secondary" onClick={() => setStage(STAGE.SETUP)}>
            {t.practice.again}
          </button>
          <button className="btn btn-primary" onClick={() => navigate("/leaderboard")}>
            {t.practice.toLeaderboard}
          </button>
        </div>
      </div>
    </div>
  );
}
