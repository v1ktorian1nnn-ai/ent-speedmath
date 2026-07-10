import React from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n";
import HeroStopwatch from "../components/HeroStopwatch";

export default function Home() {
  const { t } = useI18n();
  return (
    <div className="container">
      <div className="hero">
        <div className="hero-layout">
          <HeroStopwatch />
          <div className="hero-text">
            <h1>
              {t.hero.title} <span className="accent">{t.hero.titleAccent}</span>
            </h1>
            <p>{t.hero.subtitle}</p>
            <div className="mode-grid" style={{ maxWidth: 420 }}>
              <Link to="/practice" className="btn btn-primary">
                {t.hero.practiceBtn}
              </Link>
              <Link to="/duel" className="btn btn-secondary">
                {t.hero.duelBtn}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="steps-row">
        <div className="step-item">
          <span className="step-num">01</span>
          <h3>{t.hero.step1Title}</h3>
          <p>{t.hero.step1Text}</p>
        </div>
        <div className="step-item">
          <span className="step-num">02</span>
          <h3>{t.hero.step2Title}</h3>
          <p>{t.hero.step2Text}</p>
        </div>
        <div className="step-item">
          <span className="step-num">03</span>
          <h3>{t.hero.step3Title}</h3>
          <p>{t.hero.step3Text}</p>
        </div>
      </div>

      <div className="topics-strip">
        <div className="topics-label">{t.hero.topicsLabel}</div>
        <div className="topics-pills">
          {t.hero.topics.map((topic) => (
            <span className="topic-pill" key={topic}>
              {topic}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
