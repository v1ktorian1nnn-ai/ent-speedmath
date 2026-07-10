import React, { useMemo } from "react";

const COLORS = ["var(--accent)", "var(--success)", "#ff9fb2", "#8ec9ff", "#eef1fa"];

/**
 * Простой конфетти-эффект на чистом CSS (без библиотек). Рендерит N полосок,
 * которые падают и вращаются один раз, затем анимация естественно
 * заканчивается (элементы просто остаются невидимыми за пределами экрана).
 */
export default function Confetti({ count = 60 }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.4,
        duration: 2.2 + Math.random() * 1.4,
        color: COLORS[i % COLORS.length],
        rotate: Math.random() * 360,
        drift: (Math.random() - 0.5) * 120,
      })),
    [count]
  );

  return (
    <div className="confetti-layer" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            background: p.color,
            "--drift": `${p.drift}px`,
            transform: `rotate(${p.rotate}deg)`,
          }}
        />
      ))}
    </div>
  );
}
