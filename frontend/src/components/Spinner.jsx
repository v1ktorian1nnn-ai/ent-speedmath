import React from "react";

export default function Spinner({ label }) {
  return (
    <div className="spinner-row">
      <span className="spinner" />
      {label && <span style={{ color: "var(--text-muted)", fontSize: 14 }}>{label}</span>}
    </div>
  );
}
