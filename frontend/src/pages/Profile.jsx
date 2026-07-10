import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";

export default function Profile() {
  const { t } = useI18n();
  const { user } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!user) {
    return (
      <div className="container page">
        <div className="card">
          Нужно войти в аккаунт. <Link to="/login" style={{ color: "var(--accent)" }}>{t.nav.login}</Link>
        </div>
      </div>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setSaving(true);
    try {
      await api.changePassword({ currentPassword, newPassword });
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container page" style={{ maxWidth: 440 }}>
      <div className="card" style={{ marginBottom: 20 }}>
        <h2 style={{ marginBottom: 8 }}>{t.profile.title}</h2>
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
          {user.username} · {user.email}
        </p>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: 16, fontSize: 16 }}>{t.profile.changePassword}</h3>
        <form onSubmit={submit}>
          <div className="field">
            <label>{t.profile.currentPassword}</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label>{t.profile.newPassword}</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          {error && <div className="error-text">{error}</div>}
          {success && (
            <div style={{ color: "var(--success)", fontSize: 13, marginTop: 8 }}>{t.profile.success}</div>
          )}
          <button className="btn btn-primary" style={{ width: "100%", marginTop: 8 }} disabled={saving}>
            {t.profile.save}
          </button>
        </form>
      </div>
    </div>
  );
}
