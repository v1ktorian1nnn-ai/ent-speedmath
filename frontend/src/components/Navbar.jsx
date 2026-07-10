import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useI18n } from "../i18n";
import { useAuth } from "../context/AuthContext";
import {
  IconTimer,
  IconSwords,
  IconTrophy,
  IconShield,
  IconUser,
  IconHistory,
  IconLogout,
  IconChevronDown,
  IconLogin,
  IconUserPlus,
} from "./Icons";

function BrandMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="brand-mark">
      <circle cx="12" cy="13" r="8" stroke="currentColor" strokeWidth="2" />
      <path d="M12 13V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M9 3h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function Navbar() {
  const { t, lang, setLanguage } = useI18n();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function onClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  return (
    <div className="navbar">
      <div className="brand-group">
        <Link to="/" className="brand">
          <BrandMark />
          {t.brand}
        </Link>
        {user?.isAdmin && (
          <Link to="/admin" className={`admin-badge ${isActive("/admin") ? "active" : ""}`}>
            <IconShield /> {t.nav.admin}
          </Link>
        )}
      </div>
      <nav>
        <Link to="/practice" className={`nav-link ${isActive("/practice") ? "active" : ""}`}>
          <IconTimer /> {t.nav.practice}
        </Link>
        <Link to="/duel" className={`nav-link ${isActive("/duel") ? "active" : ""}`}>
          <IconSwords /> {t.nav.duel}
        </Link>
        <Link to="/leaderboard" className={`nav-link ${isActive("/leaderboard") ? "active" : ""}`}>
          <IconTrophy /> {t.nav.leaderboard}
        </Link>

        {user ? (
          <div className="account-menu" ref={menuRef}>
            <button className="account-trigger" onClick={() => setMenuOpen((v) => !v)}>
              <span className="account-avatar">{user.username[0]?.toUpperCase()}</span>
              {user.username}
              <IconChevronDown />
            </button>
            {menuOpen && (
              <div className="account-dropdown">
                <Link to="/profile" className={isActive("/profile") ? "active" : ""}>
                  <IconUser /> {t.nav.profile}
                </Link>
                <Link to="/history" className={isActive("/history") ? "active" : ""}>
                  <IconHistory /> {t.nav.history}
                </Link>
                <button
                  className="logout-item"
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                >
                  <IconLogout /> {t.nav.logout}
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/login" className="nav-link">
              <IconLogin /> {t.nav.login}
            </Link>
            <Link to="/register" className="nav-link">
              <IconUserPlus /> {t.nav.register}
            </Link>
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
