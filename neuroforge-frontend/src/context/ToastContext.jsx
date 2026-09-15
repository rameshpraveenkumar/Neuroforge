import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback((msg, dur) => addToast(msg, 'success', dur), [addToast]);
  const error = useCallback((msg, dur) => addToast(msg, 'error', dur), [addToast]);
  const warning = useCallback((msg, dur) => addToast(msg, 'warning', dur), [addToast]);
  const info = useCallback((msg, dur) => addToast(msg, 'info', dur), [addToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, success, error, warning, info }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border bg-[#FFFFFF] shadow-lg transition-all duration-150 animate-in fade-in slide-in-from-bottom-2 ${
              toast.type === 'success'
                ? 'border-emerald-200 border-l-4 border-l-[#2E9B62]'
                : toast.type === 'error'
                ? 'border-rose-200 border-l-4 border-l-[#D94A4A]'
                : toast.type === 'warning'
                ? 'border-amber-200 border-l-4 border-l-[#C58A16]'
                : 'border-slate-200 border-l-4 border-l-[#635BFF]'
            }`}
          >
            <span className="shrink-0 mt-0.5">
              {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#2E9B62]" />}
              {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-[#D94A4A]" />}
              {toast.type === 'warning' && <AlertTriangle className="w-4 h-4 text-[#C58A16]" />}
              {toast.type === 'info' && <Info className="w-4 h-4 text-[#635BFF]" />}
            </span>
            <p className="text-xs font-medium text-[#111111] flex-1 leading-relaxed">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 text-[#888888] hover:text-[#111111] p-0.5 rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastProvider;
