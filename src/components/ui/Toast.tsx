import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

// Toast type definitions
export type ToastType = 'success' | 'error' | 'info';

export interface ToastProps {
  id?: string;
  title: string;
  message?: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
}

// Toast component
export const Toast: React.FC<ToastProps> = ({
  title,
  message,
  type = 'info',
  duration = 5000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onClose?.();
      }, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 300);
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-100';
      case 'error':
        return 'bg-red-50 border-red-100';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-100';
    }
  };

  return (
    <div
      className={`
        transform transition-all duration-300 ease-in-out
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}
        max-w-sm w-full bg-white rounded-lg shadow-lg pointer-events-auto
        border-l-4 ${type === 'success' ? 'border-l-green-500' : type === 'error' ? 'border-l-red-500' : 'border-l-blue-500'}
      `}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">{getIcon()}</div>
          <div className="ml-3 w-0 flex-1">
            <p className="text-sm font-medium text-slate-900">{title}</p>
            {message && <p className="mt-1 text-sm text-slate-500">{message}</p>}
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className="bg-white rounded-md inline-flex text-slate-400 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={handleClose}
            >
              <span className="sr-only">Close</span>
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Toast container
export const Toaster: React.FC = () => {
  return createPortal(
    <div className="fixed top-0 right-0 p-4 z-50 space-y-4 pointer-events-none w-full md:w-auto md:max-w-sm">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast {...toast} onClose={() => removeToast(toast.id)} />
        </div>
      ))}
    </div>,
    document.body
  );
};

// Toast state management
let toasts: (ToastProps & { id: string })[] = [];
let listeners: (() => void)[] = [];

const updateToasts = (updater: (toasts: typeof toasts) => typeof toasts) => {
  toasts = updater(toasts);
  listeners.forEach((listener) => listener());
};

export const useToaster = () => {
  const [state, setState] = useState(toasts);

  useEffect(() => {
    const listener = () => setState([...toasts]);
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  return state;
};

// Toast actions
export const toast = (props: ToastProps) => {
  const id = Math.random().toString(36).substring(2, 9);
  updateToasts((toasts) => [...toasts, { ...props, id }]);
  return id;
};

export const removeToast = (id: string) => {
  updateToasts((toasts) => toasts.filter((toast) => toast.id !== id));
};

export default Toast;