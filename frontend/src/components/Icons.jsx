import React from "react";

const base = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export function IconTimer(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="13" r="8" />
      <path d="M12 13V9" />
      <path d="M9 3h6" />
      <path d="M17.5 6.5l1.2-1.2" />
    </svg>
  );
}

export function IconSwords(props) {
  return (
    <svg {...base} {...props}>
      <path d="M5 4l14 14" />
      <path d="M19 4L5 18" />
      <path d="M5 4H3v2l2 2" />
      <path d="M19 4h2v2l-2 2" />
      <path d="M5 18v2l2-2" />
      <path d="M19 18v2l-2-2" />
    </svg>
  );
}

export function IconTrophy(props) {
  return (
    <svg {...base} {...props}>
      <path d="M8 4h8v5a4 4 0 0 1-8 0V4z" />
      <path d="M8 5H5a3 3 0 0 0 3 4" />
      <path d="M16 5h3a3 3 0 0 1-3 4" />
      <path d="M10 15h4" />
      <path d="M12 13v6" />
      <path d="M9 21h6" />
    </svg>
  );
}

export function IconShield(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
      <path d="M9.5 12l1.8 1.8L15 10" />
    </svg>
  );
}

export function IconUser(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="8" r="3.4" />
      <path d="M5 20c1-3.5 4-5.5 7-5.5s6 2 7 5.5" />
    </svg>
  );
}

export function IconHistory(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 10a8 8 0 1 1 2.3 5.6" />
      <path d="M4 4v5h5" />
      <path d="M12 8v4l3 2" />
    </svg>
  );
}

export function IconLogout(props) {
  return (
    <svg {...base} {...props}>
      <path d="M9 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h4" />
      <path d="M14 8l4 4-4 4" />
      <path d="M18 12H9" />
    </svg>
  );
}

export function IconChevronDown(props) {
  return (
    <svg {...base} width={14} height={14} {...props}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function IconLogin(props) {
  return (
    <svg {...base} {...props}>
      <path d="M15 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4" />
      <path d="M10 8l-4 4 4 4" />
      <path d="M15 12H6" />
    </svg>
  );
}

export function IconTarget(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconSun(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.5v2.2" />
      <path d="M12 19.3v2.2" />
      <path d="M4.2 4.2l1.6 1.6" />
      <path d="M18.2 18.2l1.6 1.6" />
      <path d="M2.5 12h2.2" />
      <path d="M19.3 12h2.2" />
      <path d="M4.2 19.8l1.6-1.6" />
      <path d="M18.2 5.8l1.6-1.6" />
    </svg>
  );
}

export function IconMoon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z" />
    </svg>
  );
}
export function IconUserPlus(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="10" cy="8" r="3.2" />
      <path d="M4 20c0.9-3.3 3.7-5.2 6-5.2s5.1 1.9 6 5.2" />
      <path d="M19 8v4" />
      <path d="M17 10h4" />
    </svg>
  );
}
