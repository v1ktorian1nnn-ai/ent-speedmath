import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useI18n } from "../i18n";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { t } = useI18n();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(emailOrUsername, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container page" style={{ maxWidth: 400 }}>
      <div className="card">
        <h2 style={{ marginBottom: 20 }}>{t.nav.login}</h2>
        <form onSubmit={submit}>
          <div className="field">
            <label>{t.auth.loginOrUsername}</label>
            <input value={emailOrUsername} onChange={(e) => setEmailOrUsername(e.target.value)} required />
          </div>
          <div className="field">
            <label>{t.auth.password}</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <div className="error-text">{error}</div>}
          <button className="btn btn-primary" style={{ width: "100%", marginTop: 8 }} disabled={loading}>
            {t.auth.loginBtn}
          </button>
        </form>
        <p style={{ marginTop: 16, fontSize: 14, color: "var(--text-muted)" }}>
          {t.auth.noAccount} <Link to="/register" style={{ color: "var(--accent)" }}>{t.auth.goRegister}</Link>
        </p>
      </div>
    </div>
  );
}
