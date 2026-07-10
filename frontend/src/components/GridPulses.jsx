import React from "react";

/**
 * Декоративный слой с бегущими "импульсами света" поверх фоновой сетки —
 * визуальная метафора "тока по плате" / "сигнала на табло". Чисто CSS,
 * без JS-анимации. Намеренно ограничен областью hero-секции, а не всей
 * страницей — чтобы эффект оставался акцентом, а не фоновым шумом.
 */
export default function GridPulses() {
  return (
    <div className="grid-pulses" aria-hidden="true">
      <span className="pulse-line pulse-h" style={{ top: "18%", animationDelay: "0s" }} />
      <span className="pulse-line pulse-h" style={{ top: "64%", animationDelay: "2.4s" }} />
      <span className="pulse-line pulse-v" style={{ left: "22%", animationDelay: "1.2s" }} />
      <span className="pulse-line pulse-v" style={{ left: "78%", animationDelay: "3.6s" }} />
    </div>
  );
}
