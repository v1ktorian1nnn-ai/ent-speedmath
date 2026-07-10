import React, { useRef, useState } from "react";

/**
 * Сигнатурный визуальный элемент сайта: секундомер с бегущей стрелкой
 * и "тикающими" делениями. По умолчанию стрелка плавно крутится сама
 * (CSS-анимация), а при наведении курсора — доворачивается точно в его
 * сторону, как будто отслеживает мышь. При уходе курсора снова переходит
 * на автоматический ход.
 */
export default function HeroStopwatch() {
  const ticks = Array.from({ length: 12 });
  const svgRef = useRef(null);
  const [hoverAngle, setHoverAngle] = useState(null);

  const handleMouseMove = (e) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    // Центр циферблата в исходных координатах viewBox — (130, 140) из 260x260
    const centerX = rect.left + rect.width * (130 / 260);
    const centerY = rect.top + rect.height * (140 / 260);
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const angleDeg = (Math.atan2(dx, -dy) * 180) / Math.PI;
    setHoverAngle(angleDeg);
  };

  const handleMouseLeave = () => setHoverAngle(null);

  return (
    <svg
      ref={svgRef}
      className="hero-stopwatch"
      viewBox="0 0 260 260"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Секундомер"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
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

      <g
        className={hoverAngle === null ? "hero-stopwatch-hand" : "hero-stopwatch-hand hero-stopwatch-hand--manual"}
        style={{
          transformOrigin: "130px 140px",
          transform: hoverAngle !== null ? `rotate(${hoverAngle}deg)` : undefined,
        }}
      >
        <line x1="130" y1="140" x2="130" y2="66" stroke="var(--accent)" strokeWidth="4" strokeLinecap="round" />
      </g>
      <line x1="130" y1="140" x2="168" y2="140" stroke="var(--success)" strokeWidth="4" strokeLinecap="round" opacity="0.85" />

      <circle cx="130" cy="140" r="6" fill="var(--text)" />
    </svg>
  );
}
