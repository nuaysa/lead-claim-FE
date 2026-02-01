"use client";

import Toast from "@/components/Common/Toast";
import type { ReactNode } from "react";
import { createContext, useCallback, useContext, useState } from "react";


interface ToastContextProps {
  showToast: (message: string, type: "SUCCESS" | "ERROR" | "INFO") => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

interface ToastItem {
  id: string;
  message: string;
  type: "SUCCESS" | "ERROR" | "INFO";
}

type ToastPosition =
  | "bottom-right"
  | "top-center"
  | "bottom-center"
  | "bottom-left";

interface ToastProviderProps {
  children: ReactNode;
  position?: ToastPosition;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  position = "bottom-left",
}) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: "SUCCESS" | "ERROR" | "INFO") => {
      const id = `toast-${Date.now()}-${crypto.randomUUID?.() || Math.random()}`;
      setToasts((prevToasts) => [...prevToasts, { id, message, type }]);

      setTimeout(() => {
        removeToast(id);
      }, 5000);
    },
    [removeToast]
  );

  const positionClasses: Record<ToastPosition, string> = {
    "bottom-right": "bottom-4 right-4 items-end",
    "top-center": "top-4 left-1/2 -translate-x-1/2 items-center",
    "bottom-center": "bottom-4 left-1/2 -translate-x-1/2 items-center",
    "bottom-left": "bottom-4 left-4 items-start",
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div
        className={`fixed flex flex-col gap-2 z-[9999] ${positionClasses[position]}`}
      >
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
