/**
 * Inline SVG icon set — single source of truth, no emoji anywhere.
 * Stroke-based icons inherit `currentColor`; size via the `size` prop or className.
 */
const base = (size, props) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  ...props,
});

export const IconLogo = ({ size = 22, ...p }) => (
  // Graduation cap
  <svg {...base(size, p)}>
    <path d="M2 9l10-5 10 5-10 5L2 9z" />
    <path d="M6 11v4c0 1.5 3 3 6 3s6-1.5 6-3v-4" />
    <path d="M22 9v6" />
  </svg>
);

export const IconSun = ({ size = 18, ...p }) => (
  <svg {...base(size, p)}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
);

export const IconMoon = ({ size = 18, ...p }) => (
  <svg {...base(size, p)}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
  </svg>
);

export const IconUsers = ({ size = 22, ...p }) => (
  // People group
  <svg {...base(size, p)}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export const IconCheckCircle = ({ size = 22, ...p }) => (
  // Active state
  <svg {...base(size, p)}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <path d="M22 4 12 14.01l-3-3" />
  </svg>
);

export const IconPause = ({ size = 22, ...p }) => (
  // Inactive / paused
  <svg {...base(size, p)}>
    <rect x="6" y="4" width="4" height="16" rx="1" />
    <rect x="14" y="4" width="4" height="16" rx="1" />
  </svg>
);

export const IconGraduation = ({ size = 22, ...p }) => (
  // Graduated student
  <svg {...base(size, p)}>
    <path d="M2 9l10-5 10 5-10 5L2 9z" />
    <path d="M6 11v4c0 1.5 3 3 6 3s6-1.5 6-3v-4" />
  </svg>
);

export const IconMenu = ({ size = 20, ...p }) => (
  <svg {...base(size, p)}>
    <path d="M3 6h18M3 12h18M3 18h18" />
  </svg>
);

export const IconLogout = ({ size = 16, ...p }) => (
  <svg {...base(size, p)}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="M16 17l5-5-5-5" />
    <path d="M21 12H9" />
  </svg>
);

export const IconHome = ({ size = 18, ...p }) => (
  <svg {...base(size, p)}>
    <path d="M3 9.5 12 3l9 6.5V21a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1V9.5z" />
  </svg>
);

export const IconList = ({ size = 18, ...p }) => (
  <svg {...base(size, p)}>
    <path d="M8 6h13M8 12h13M8 18h13" />
    <circle cx="4" cy="6"  r="1.2" />
    <circle cx="4" cy="12" r="1.2" />
    <circle cx="4" cy="18" r="1.2" />
  </svg>
);

export const IconPlus = ({ size = 18, ...p }) => (
  <svg {...base(size, p)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);
