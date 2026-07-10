import React from "react";

/**
 * Сигнатурный визуальный элемент сайта: секундомер с бегущей стрелкой
 * и "тикающими" делениями — визуальная метафора всего продукта
 * (соревнование на скорость). Чистый SVG + CSS-анимация, без библиотек.
 */
export default function HeroStopwatch() {
  const ticks = Array.from({ length: 12 });

  return (
    <svg
      className="hero-stopwatch"
      viewBox="0 0 260 260"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Секундомер"
    >
      <circle cx="130" cy="140" r="98" fill="var(--surface)" stroke="var(--border)" strokeWidth="2" />
      <circle cx="130" cy="140" r="86" fill="none" stroke="var(--border)" strokeWidth="2" />

      {ticks.map((_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        const x1 = 130 + Math.sin(angle) * 78;
        const y1 = 140 - Math.cos(angle) * 78;
        const x2 = 130 + Math.sin(angle) * 88;
        const y2 = 140 - Math.cos(angle) * 88;
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={i % 3 === 0 ? "var(--accent)" : "var(--text-muted)"}
            strokeWidth={i % 3 === 0 ? 3 : 1.5}
            strokeLinecap="round"
          />
        );
      })}

      <rect x="118" y="20" width="24" height="14" rx="4" fill="var(--accent)" />
      <rect x="90" y="14" width="10" height="18" rx="4" fill="var(--border)" transform="rotate(-35 95 23)" />
      <rect x="160" y="14" width="10" height="18" rx="4" fill="var(--border)" transform="rotate(35 165 23)" />

      <g className="hero-stopwatch-hand" style={{ transformOrigin: "130px 140px" }}>
        <line x1="130" y1="140" x2="130" y2="66" stroke="var(--accent)" strokeWidth="4" strokeLinecap="round" />
      </g>
      <line x1="130" y1="140" x2="168" y2="140" stroke="var(--success)" strokeWidth="4" strokeLinecap="round" opacity="0.85" />

      <circle cx="130" cy="140" r="6" fill="var(--text)" />
    </svg>
  );
}
