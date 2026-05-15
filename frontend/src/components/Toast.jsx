const STYLES = {
  success: 'bg-emerald-600 text-white',
  error: 'bg-red-600 text-white',
  info: 'bg-slate-800 text-white',
  warn: 'bg-amber-500 text-white',
};

export default function Toast({ message, variant = 'info', onClose }) {
  return (
    <div
      role="status"
      className={`${STYLES[variant]} rounded-lg shadow-lg px-4 py-3 flex items-start gap-3`}
    >
      <span className="text-sm flex-1">{message}</span>
      <button
        onClick={onClose}
        aria-label="Dismiss"
        className="opacity-80 hover:opacity-100 text-sm"
      >
        ×
      </button>
    </div>
  );
}
