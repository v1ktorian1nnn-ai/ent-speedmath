import React, { useEffect, useRef, useState } from "react";

function formatMs(ms) {
  const totalSeconds = ms / 1000;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = (totalSeconds % 60).toFixed(1).padStart(4, "0");
  return `${minutes}:${seconds}`;
}

/**
 * Секундомер, который считает с момента монтирования (или с момента смены key
 * родителем — так удобно "перезапускать" его на каждой новой задаче).
 * progressMax, если передан, рисует полоску прогресса (для обратного отсчёта).
 */
export default function TimerDisplay({ running = true, onTick }) {
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(Date.now());
  const frameRef = useRef();

  useEffect(() => {
    startRef.current = Date.now();
    setElapsed(0);

    if (!running) return;

    const loop = () => {
      const e = Date.now() - startRef.current;
      setElapsed(e);
      if (onTick) onTick(e);
      frameRef.current = requestAnimationFrame(loop);
    };
    frameRef.current = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(frameRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  return <div className="timer-display mono">{formatMs(elapsed)}</div>;
}

export function getElapsedSince(startTimestamp) {
  return Date.now() - startTimestamp;
}
