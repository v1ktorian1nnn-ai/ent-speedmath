import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";

export default function History() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [rows, setRows] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) api.history().then(setRows).catch((e) => setError(e.message));
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

  return (
    <div className="container page">
      <div className="card">
        <h2 style={{ marginBottom: 20 }}>{t.history.title}</h2>
        {error && <div className="error-text">{error}</div>}
        {!rows && !error && <p>{t.common.loading}</p>}
        {rows && rows.length === 0 && <p style={{ color: "var(--text-muted)" }}>{t.history.empty}</p>}
        {rows && rows.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>{t.leaderboard.date}</th>
                <th>{t.leaderboard.correct}</th>
                <th>{t.leaderboard.total}</th>
                <th>{t.leaderboard.time}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>{new Date(r.finishedAt).toLocaleString()}</td>
                  <td>{r.correctCount}</td>
                  <td>{r.totalCount}</td>
                  <td className="mono">{(r.totalTimeMs / 1000).toFixed(1)} с</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
