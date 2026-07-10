import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useI18n } from "../i18n";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { t, lang, setLanguage } = useI18n();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="navbar">
      <Link to="/" className="brand">
        {t.brand}
      </Link>
      <nav>
        <Link to="/practice">{t.nav.practice}</Link>
        <Link to="/duel">{t.nav.duel}</Link>
        <Link to="/leaderboard">{t.nav.leaderboard}</Link>
        {user && <Link to="/history">{t.nav.history}</Link>}
        {user && <Link to="/profile">{t.nav.profile}</Link>}
        {user?.isAdmin && <Link to="/admin">{t.nav.admin}</Link>}

        {user ? (
          <button
            className="linklike"
            onClick={() => {
              logout();
              navigate("/");
            }}
          >
            {t.nav.logout} ({user.username})
          </button>
        ) : (
          <>
            <Link to="/login">{t.nav.login}</Link>
            <Link to="/register">{t.nav.register}</Link>
          </>
        )}

        <div className="lang-switch">
          <button className={lang === "ru" ? "active" : ""} onClick={() => setLanguage("ru")}>
            RU
          </button>
          <button className={lang === "kk" ? "active" : ""} onClick={() => setLanguage("kk")}>
            KZ
          </button>
        </div>
      </nav>
    </div>
  );
}
