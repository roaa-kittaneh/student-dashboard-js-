/**
 * Text-only avatar — derives initials from name (or email fallback) and
 * picks a stable color from a small palette via a cheap hash.
 * No images, no external requests.
 */
const PALETTE = [
  'bg-brand-500',
  'bg-amber-500',
  'bg-teal-500',
  'bg-rose-500',
  'bg-indigo-500',
  'bg-emerald-500',
  'bg-fuchsia-500',
  'bg-sky-500',
];

const SIZES = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-14 w-14 text-lg',
};

function initials(nameOrEmail = '') {
  const src = String(nameOrEmail).trim();
  if (!src) return '?';
  // If it's an email, take the local-part
  const base = src.includes('@') ? src.split('@')[0] : src;
  const parts = base.replace(/[._-]+/g, ' ').split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function hashColor(seed = '') {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return PALETTE[Math.abs(h) % PALETTE.length];
}

export default function Avatar({ name, email, size = 'md', className = '' }) {
  const seed = (name || email || '').toLowerCase();
  const color = hashColor(seed);
  return (
    <div
      aria-hidden="true"
      className={`${SIZES[size]} ${color} ${className} rounded-full text-white font-semibold flex items-center justify-center select-none shrink-0`}
    >
      {initials(name || email)}
    </div>
  );
}
