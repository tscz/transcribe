import * as React from "react";
import { cn } from "@/lib/utils";

// ── Types ────────────────────────────────────────────────────────────────────

type ToastType = "error" | "warning" | "info";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

// ── Context ──────────────────────────────────────────────────────────────────

interface ToastContextValue {
  addToast: (message: string, type?: ToastType) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

// ── Module-level emitter (for use outside React, e.g. window error handlers) ─

const TOAST_EVENT = "app:toast";

export function emitToast(message: string, type: ToastType = "error") {
  window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail: { message, type } }));
}

// ── Provider + Container ─────────────────────────────────────────────────────

let nextId = 0;
const DURATION_MS = 5000;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const addToast = React.useCallback((message: string, type: ToastType = "error") => {
    const id = ++nextId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, DURATION_MS);
  }, []);

  const dismiss = React.useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Listen for events emitted by emitToast() (from window error handlers)
  React.useEffect(() => {
    const handler = (e: Event) => {
      const { message, type } = (e as CustomEvent).detail;
      addToast(message, type);
    };
    window.addEventListener(TOAST_EVENT, handler);
    return () => window.removeEventListener(TOAST_EVENT, handler);
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "flex items-start gap-3 rounded-lg border px-4 py-3 shadow-lg text-sm pointer-events-auto",
              toast.type === "error" && "bg-destructive text-destructive-foreground border-destructive",
              toast.type === "warning" && "bg-yellow-500 text-white border-yellow-600",
              toast.type === "info" && "bg-secondary text-secondary-foreground border-border"
            )}
          >
            <span className="flex-1 break-words">{toast.message}</span>
            <button
              onClick={() => dismiss(toast.id)}
              className="shrink-0 opacity-70 hover:opacity-100 transition-opacity"
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
