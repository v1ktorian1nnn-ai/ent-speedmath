import React, { useEffect, useState } from "react";
import { useI18n } from "../i18n";
import { api } from "../api/client";
import Spinner from "../components/Spinner";

export default function Leaderboard() {
  const { t } = useI18n();
  const [rows, setRows] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.leaderboard().then(setRows).catch((e) => setError(e.message));
  }, []);

  return (
    <div className="container page">
      <div className="card">
        <h2 style={{ marginBottom: 20 }}>{t.leaderboard.title}</h2>
        {error && <div className="error-text">{error}</div>}
        {!rows && !error && <Spinner label={t.common.loading} />}
        {rows && rows.length === 0 && <p style={{ color: "var(--text-muted)" }}>{t.leaderboard.empty}</p>}
        {rows && rows.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>{t.leaderboard.player}</th>
                <th>{t.leaderboard.correct}</th>
                <th>{t.leaderboard.total}</th>
                <th>{t.leaderboard.time}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  <td>
                    <span className={`place-badge ${i === 0 ? "gold" : ""}`}>{i + 1}</span>
                  </td>
                  <td>{r.username}</td>
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
