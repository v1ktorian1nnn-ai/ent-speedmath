import React from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n";

export default function Home() {
  const { t } = useI18n();
  return (
    <div className="container">
      <div className="hero">
        <h1>
          {t.hero.title} <span className="accent">{t.hero.titleAccent}</span>
        </h1>
        <p>{t.hero.subtitle}</p>
        <div className="mode-grid" style={{ maxWidth: 480, margin: "0 auto" }}>
          <Link to="/practice" className="btn btn-primary">
            {t.hero.practiceBtn}
          </Link>
          <Link to="/duel" className="btn btn-secondary">
            {t.hero.duelBtn}
          </Link>
        </div>
      </div>
    </div>
  );
}
