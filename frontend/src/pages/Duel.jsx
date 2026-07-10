import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useI18n } from "../i18n";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";
import { getSocket } from "../socket";
import TimerDisplay from "../components/TimerDisplay";
import Confetti from "../components/Confetti";

const STAGE = { MENU: "menu", QUEUED: "queued", RACING: "racing", DONE_WAITING: "done_waiting", RESULTS: "results" };

// ВАЖНО: должно совпадать со списком ALLOWED_REACTIONS на бэкенде
// (backend/src/sockets/duel.js) — сервер отбрасывает всё, чего нет в списке.
const REACTIONS = ["👍", "🔥", "😅", "🤝", "ГГ!", "Ух, это было близко!", "Математика — сила!"];

function ReactionBar({ onSend }) {
  return (
    <div className="reaction-bar">
      {REACTIONS.map((r) => (
        <button key={r} className="reaction-btn" onClick={() => onSend(r)}>
          {r}
        </button>
      ))}
    </div>
  );
}

export default function Duel() {
  const { t } = useI18n();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stage, setStage] = useState(STAGE.MENU);
  const [mode, setMode] = useState(null);
  const [duelId, setDuelId] = useState(null);
  const [problems, setProblems] = useState([]);
  const [opponents, setOpponents] = useState([]);
  const [progressByUser, setProgressByUser] = useState({}); // userId -> index

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [problemStart, setProblemStart] = useState(Date.now());
  const [results, setResults] = useState(null);

  const [incomingReactions, setIncomingReactions] = useState([]); // [{id, username, text}]
  const [rematchRequested, setRematchRequested] = useState(false);
  const [rematchStatus, setRematchStatus] = useState(null); // { readyCount, total }

  const socketRef = useRef(null);
  const reactionIdRef = useRef(0);

  useEffect(() => {
    if (!user) return;
    const socket = getSocket();
    socketRef.current = socket;
    socket.connect();

    socket.on("duel:start", (payload) => {
      setDuelId(payload.duelId);
      setProblems(payload.problems);
      setOpponents(payload.opponents.filter((o) => o.id !== user.id));
      setIndex(0);
      setSelected(null);
      setFeedback(null);
      setProblemStart(Date.now());
      setProgressByUser({});
      setRematchRequested(false);
      setRematchStatus(null);
      setIncomingReactions([]);
      setStage(STAGE.RACING);
    });

    socket.on("duel:progress", ({ userId, index }) => {
      setProgressByUser((prev) => ({ ...prev, [userId]: index }));
    });

    socket.on("duel:answerResult", (res) => {
      setFeedback(res);
    });

    socket.on("duel:results", (payload) => {
      setResults(payload.results);
      setStage(STAGE.RESULTS);
    });

    socket.on("duel:reactionReceived", ({ username, text }) => {
      const id = ++reactionIdRef.current;
      setIncomingReactions((prev) => [...prev, { id, username, text }]);
      setTimeout(() => {
        setIncomingReactions((prev) => prev.filter((r) => r.id !== id));
      }, 3500);
    });

    socket.on("duel:rematchWaiting", ({ readyCount, total }) => {
      setRematchStatus({ readyCount, total });
    });

    return () => {
      socket.off("duel:start");
      socket.off("duel:progress");
      socket.off("duel:answerResult");
      socket.off("duel:results");
      socket.off("duel:reactionReceived");
      socket.off("duel:rematchWaiting");
      socket.disconnect();
    };
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

  const joinQueue = (m) => {
    setMode(m);
    socketRef.current.emit("duel:join", { mode: m });
    setStage(STAGE.QUEUED);
  };

  const cancelQueue = () => {
    socketRef.current.emit("duel:leaveQueue");
    setStage(STAGE.MENU);
  };

  const answer = (optIndex) => {
    if (feedback) return;
    const timeMs = Date.now() - problemStart;
    setSelected(optIndex);
    socketRef.current.emit("duel:answer", { duelId, problemIndex: index, chosenIndex: optIndex, timeMs });
  };

  const next = () => {
    const nextIndex = index + 1;
    setSelected(null);
    setFeedback(null);
    if (nextIndex >= problems.length) {
      setStage(STAGE.DONE_WAITING);
      return;
    }
    setIndex(nextIndex);
    setProblemStart(Date.now());
  };

  const sendReaction = (text) => {
    socketRef.current.emit("duel:reaction", { duelId, text });
  };

  const requestRematch = () => {
    setRematchRequested(true);
    socketRef.current.emit("duel:rematch", { duelId });
  };

  const ReactionToasts = () =>
    incomingReactions.length > 0 && (
      <div className="reaction-toasts">
        {incomingReactions.map((r) => (
          <div key={r.id} className="reaction-toast">
            <strong>{r.username}:</strong> {r.text}
          </div>
        ))}
      </div>
    );

  if (stage === STAGE.MENU) {
    return (
      <div className="container page" style={{ maxWidth: 480 }}>
        <div className="card">
          <h2 style={{ marginBottom: 20 }}>{t.duel.title}</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <button className="btn btn-primary" onClick={() => joinQueue("1v1")}>
              {t.duel.mode1v1}
            </button>
            <button className="btn btn-secondary" onClick={() => joinQueue("group")}>
              {t.duel.modeGroup}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (stage === STAGE.QUEUED) {
    return (
      <div className="container page" style={{ maxWidth: 480 }}>
        <div className="card" style={{ textAlign: "center" }}>
          <p style={{ marginBottom: 20 }}>{mode === "1v1" ? t.duel.searching : t.duel.searchingGroup}</p>
          <button className="btn btn-danger" onClick={cancelQueue}>
            {t.duel.cancel}
          </button>
        </div>
      </div>
    );
  }

  if (stage === STAGE.RACING) {
    const problem = problems[index];
    return (
      <div className="container page" style={{ maxWidth: 640 }}>
        <ReactionToasts />
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ marginBottom: 8, fontSize: 13, color: "var(--text-muted)" }}>{t.duel.opponentsProgress}</div>
          {opponents.map((o) => {
            const p = progressByUser[o.id] || 0;
            const pct = (p / problems.length) * 100;
            return (
              <div className="opponent-row" key={o.id}>
                <div className="opponent-name">{o.username}</div>
                <div className="opponent-track">
                  <div className="opponent-fill" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>

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

          {feedback && (
            <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={next}>
              {t.practice.next}
            </button>
          )}
        </div>

        <ReactionBar onSend={sendReaction} />
      </div>
    );
  }

  if (stage === STAGE.DONE_WAITING) {
    return (
      <div className="container page" style={{ maxWidth: 480 }}>
        <ReactionToasts />
        <div className="card" style={{ textAlign: "center" }}>
          <p>{t.duel.finished}</p>
        </div>
        <ReactionBar onSend={sendReaction} />
      </div>
    );
  }

  // STAGE.RESULTS
  const myResult = results.find((r) => r.userId === user.id);
  const won = myResult?.place === 1;

  return (
    <div className="container page" style={{ maxWidth: 560 }}>
      {won && <Confetti />}
      <ReactionToasts />
      <div className="card">
        <h2 style={{ marginBottom: 20 }}>{t.duel.resultsTitle}</h2>
        <table>
          <thead>
            <tr>
              <th>{t.duel.place}</th>
              <th>{t.duel.player}</th>
              <th>{t.duel.scoreCorrect}</th>
              <th>{t.duel.time}</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={r.userId}>
                <td>
                  <span className={`place-badge ${r.place === 1 ? "gold" : ""}`}>{r.place}</span>
                </td>
                <td>{r.username}{r.userId === user.id ? " (вы)" : ""}</td>
                <td>{r.correctCount}</td>
                <td className="mono">{(r.timeMs / 1000).toFixed(1)} с</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ display: "flex", gap: 12, marginTop: 20, flexWrap: "wrap" }}>
          <button className="btn btn-primary" onClick={requestRematch} disabled={rematchRequested}>
            {rematchRequested
              ? rematchStatus
                ? `${t.duel.rematchWaiting} (${rematchStatus.readyCount}/${rematchStatus.total})`
                : t.duel.rematchWaiting
              : t.duel.rematch}
          </button>
          <button className="btn btn-secondary" onClick={() => navigate("/")}>
            {t.duel.backToMenu}
          </button>
        </div>
      </div>

      <ReactionBar onSend={sendReaction} />
    </div>
  );
}
