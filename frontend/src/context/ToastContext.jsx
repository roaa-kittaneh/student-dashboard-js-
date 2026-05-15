import { createContext, useCallback, useMemo, useState } from 'react';
import Toast from '../components/Toast.jsx';

export const ToastContext = createContext(null);

let _id = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback(
    (id) => setToasts((arr) => arr.filter((t) => t.id !== id)),
    []
  );

  const push = useCallback(
    (message, variant = 'info', ttl = 3500) => {
      const id = ++_id;
      setToasts((arr) => [...arr, { id, message, variant }]);
      if (ttl > 0) setTimeout(() => dismiss(id), ttl);
      return id;
    },
    [dismiss]
  );

  const api = useMemo(
    () => ({
      success: (m) => push(m, 'success'),
      error: (m) => push(m, 'error', 5000),
      info: (m) => push(m, 'info'),
      warn: (m) => push(m, 'warn', 4000),
      dismiss,
    }),
    [push, dismiss]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="fixed z-[100] top-4 right-4 flex flex-col gap-2 w-[min(360px,calc(100%-2rem))]">
        {toasts.map((t) => (
          <Toast key={t.id} {...t} onClose={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
