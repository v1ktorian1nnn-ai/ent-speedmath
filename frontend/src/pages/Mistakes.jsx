import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useI18n } from "../i18n";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";
import Spinner from "../components/Spinner";

export default function Mistakes() {
  const { t } = useI18n();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [problems, setProblems] = useState(null);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      api.mistakes().then(setProblems).catch((e) => setError(e.message));
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

  const answer = async (optIndex) => {
    if (feedback) return;
    setSelected(optIndex);
    try {
      const res = await api.checkAnswer({ problemId: problems[index].id, chosenIndex: optIndex });
      setFeedback(res);
    } catch (err) {
      setError(err.message);
    }
  };

  const next = () => {
    setSelected(null);
    setFeedback(null);
    setIndex((i) => i + 1);
  };

  return (
    <div className="container page" style={{ maxWidth: 640 }}>
      <div className="card" style={{ marginBottom: 16 }}>
        <h2 style={{ marginBottom: 6 }}>{t.mistakes.title}</h2>
        <p style={{ color: "var(--text-muted)", fontSize: 14, margin: 0 }}>{t.mistakes.subtitle}</p>
      </div>

      {error && (
        <div className="card">
          <div className="error-text">{error}</div>
        </div>
      )}

      {!problems && !error && (
        <div className="card">
          <Spinner label={t.common.loading} />
        </div>
      )}

      {problems && problems.length === 0 && (
        <div className="card" style={{ textAlign: "center" }}>
          <p style={{ marginBottom: 16 }}>{t.mistakes.empty}</p>
          <button className="btn btn-primary" onClick={() => navigate("/practice")}>
            {t.mistakes.backToPractice}
          </button>
        </div>
      )}

      {problems && problems.length > 0 && index >= problems.length && (
        <div className="card" style={{ textAlign: "center" }}>
          <p style={{ marginBottom: 16 }}>{t.mistakes.done}</p>
          <button className="btn btn-primary" onClick={() => navigate("/practice")}>
            {t.mistakes.backToPractice}
          </button>
        </div>
      )}

      {problems && problems.length > 0 && index < problems.length && (
        <div className="card">
          <div style={{ marginBottom: 16, fontSize: 13, color: "var(--text-muted)" }}>
            {index + 1} / {problems.length}
          </div>

          <div className="problem-statement">{problems[index].statement}</div>
          {problems[index].imageUrl && (
            <img className="problem-image" src={`${api.API_URL}${problems[index].imageUrl}`} alt="" />
          )}

          {problems[index].options.map((opt, i) => {
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

          {feedback && (
            <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={next}>
              {t.mistakes.next}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
