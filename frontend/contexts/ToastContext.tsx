import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  show: (message: string, type?: ToastType, durationMs?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = (): ToastContextType => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const remove = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const show = useCallback((message: string, type: ToastType = 'info', durationMs = 4000) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    const item: ToastItem = { id, type, message };
    setToasts((t) => [item, ...t]);

    // Auto remove after duration
    window.setTimeout(() => remove(id), durationMs);
  }, [remove]);

  const value = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}

  {/* Toast container (top-right) */}
  <div aria-live="polite" className="fixed top-6 right-6 z-[70] flex flex-col gap-3 items-end">
        {toasts.map((t) => (
          <div key={t.id} className={`max-w-sm w-full px-4 py-3 rounded-lg shadow-lg border ${
            t.type === 'success' ? 'bg-green-600/95 border-green-700 text-white' :
            t.type === 'error' ? 'bg-red-600/95 border-red-700 text-white' :
            'bg-[#2D1115]/95 border-gray-700 text-white'
          }`}>
            <div className="flex items-start gap-3">
              <div className="flex-1 text-sm leading-tight">{t.message}</div>
              <button
                onClick={() => remove(t.id)}
                className="text-white/80 hover:text-white ml-2 text-sm font-medium"
                aria-label="Dismiss notification"
              >
                x
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
