import { CheckCircle2, X, XCircle } from 'lucide-react';
import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

type Toast = { id: number; message: string; type: 'success' | 'error' };
type ToastContextValue = { showToast: (message: string, type?: Toast['type']) => void };

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((items) => items.filter((item) => item.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = Date.now();
    setToasts((items) => [...items, { id, message, type }]);
    window.setTimeout(() => dismiss(id), 4000);
  }, [dismiss]);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-[80] space-y-3">
        {toasts.map((toast) => {
          const Icon = toast.type === 'success' ? CheckCircle2 : XCircle;
          const bgColor = toast.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-950/40' : 'bg-rose-50 dark:bg-rose-950/40';
          const borderColor = toast.type === 'success' ? 'border-emerald-200 dark:border-emerald-800/60' : 'border-rose-200 dark:border-rose-800/60';
          const iconColor = toast.type === 'success' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400';
          const textColor = toast.type === 'success' ? 'text-emerald-900 dark:text-emerald-200' : 'text-rose-900 dark:text-rose-200';
          
          return (
            <div
              key={toast.id}
              className={`animate-enter-up flex w-80 max-w-[calc(100vw-2rem)] items-start gap-3 rounded-md border ${borderColor} ${bgColor} p-4 shadow-md backdrop-blur transition duration-150`}
            >
              <Icon className={`${iconColor} flex-shrink-0`} size={20} />
              <p className={`flex-1 text-sm font-medium ${textColor}`}>{toast.message}</p>
              <button
                className="flex-shrink-0 rounded-lg p-1 text-slate-400 transition-all hover:bg-slate-200/30 hover:text-slate-600 dark:hover:text-slate-200"
                onClick={() => dismiss(toast.id)}
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used inside ToastProvider');
  return context;
}
