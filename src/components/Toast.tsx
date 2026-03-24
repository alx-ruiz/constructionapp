import { useState, useEffect, useCallback } from 'react';
import { CheckCircle2, X, AlertTriangle, Info } from 'lucide-react';
import './Toast.css';

export interface ToastData {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

// Global toast state managed via custom events
let toastIdCounter = 0;

export function showToast(message: string, type: ToastData['type'] = 'success') {
  const id = `toast-${++toastIdCounter}`;
  window.dispatchEvent(new CustomEvent('bc-toast', { detail: { id, message, type } }));
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const toast = (e as CustomEvent<ToastData>).detail;
      setToasts(prev => [...prev, toast]);
      setTimeout(() => removeToast(toast.id), 3500);
    };
    window.addEventListener('bc-toast', handler);
    return () => window.removeEventListener('bc-toast', handler);
  }, [removeToast]);

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div key={toast.id} className={`toast-item toast-${toast.type} animate-fade-in`}>
          <div className="toast-icon">
            {toast.type === 'success' && <CheckCircle2 size={18} />}
            {toast.type === 'error' && <AlertTriangle size={18} />}
            {toast.type === 'info' && <Info size={18} />}
          </div>
          <span className="toast-message">{toast.message}</span>
          <button className="toast-close" onClick={() => removeToast(toast.id)}>
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
