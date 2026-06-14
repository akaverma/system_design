import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "../../utils/cn";
import {
  AlertCircleIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  CloseIcon,
  InfoIcon,
} from "../../icons";

export type ToastVariant = "default" | "success" | "warning" | "danger" | "info";

export interface ToastProps {
  variant?: ToastVariant;
  title?: React.ReactNode;
  description?: React.ReactNode;
  onDismiss?: () => void;
  className?: string;
}

export interface ToastOptions {
  variant?: ToastVariant;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Duration in ms before auto-dismiss. Set to `0` to disable auto-dismiss. */
  duration?: number;
}

export interface ToastContextValue {
  toast: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
}

const variantStyles: Record<ToastVariant, string> = {
  default: "",
  success: "border-l-4 border-l-success",
  warning: "border-l-4 border-l-warning",
  danger: "border-l-4 border-l-destructive",
  info: "border-l-4 border-l-info",
};

const variantIcons: Record<ToastVariant, React.ReactNode> = {
  default: null,
  success: <CheckCircleIcon className="text-success" />,
  warning: <AlertTriangleIcon className="text-warning" />,
  danger: <AlertCircleIcon className="text-destructive" />,
  info: <InfoIcon className="text-info" />,
};

/** A single toast notification with an optional status icon, title, description, and dismiss button. */
export const Toast = React.forwardRef<HTMLDivElement, ToastProps>(function Toast(
  { variant = "default", title, description, onDismiss, className },
  ref,
) {
  const icon = variantIcons[variant];

  return (
    <div
      ref={ref}
      role="status"
      aria-live="polite"
      className={cn(
        "flex w-full items-start gap-3 rounded-md border border-border bg-card p-4 text-card-foreground shadow-lg",
        variantStyles[variant],
        className,
      )}
    >
      {icon && <span aria-hidden="true">{icon}</span>}
      <div className="flex-1">
        {title && <p className="font-semibold text-sm">{title}</p>}
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {onDismiss && (
        <button
          type="button"
          aria-label="Dismiss"
          onClick={onDismiss}
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          <CloseIcon />
        </button>
      )}
    </div>
  );
});

const ToastContext = React.createContext<ToastContextValue | null>(null);

const DEFAULT_DURATION = 5000;

let toastIdCounter = 0;

interface ToastRecord extends ToastOptions {
  id: string;
}

/** Provides a toast queue and renders the toast viewport in a portal. */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastRecord[]>([]);
  const timeoutsRef = React.useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = React.useCallback((id: string) => {
    setToasts((current) => current.filter((t) => t.id !== id));
    const timeout = timeoutsRef.current.get(id);
    if (timeout) {
      clearTimeout(timeout);
      timeoutsRef.current.delete(id);
    }
  }, []);

  const toast = React.useCallback(
    (options: ToastOptions) => {
      const id = `toast-${++toastIdCounter}`;
      setToasts((current) => [...current, { ...options, id }]);

      const duration = options.duration ?? DEFAULT_DURATION;
      if (duration !== 0) {
        const timeout = setTimeout(() => {
          dismiss(id);
        }, duration);
        timeoutsRef.current.set(id, timeout);
      }

      return id;
    },
    [dismiss],
  );

  React.useEffect(() => {
    const timeouts = timeoutsRef.current;
    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout));
      timeouts.clear();
    };
  }, []);

  const value = React.useMemo<ToastContextValue>(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {typeof document !== "undefined" &&
        createPortal(
          <div className="fixed top-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2">
            {toasts.map(({ id, ...options }) => (
              <Toast key={id} {...options} onDismiss={() => dismiss(id)} />
            ))}
          </div>,
          document.body,
        )}
    </ToastContext.Provider>
  );
}

/** Must be used within a {@link ToastProvider}. */
export function useToast(): ToastContextValue {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a <ToastProvider>.");
  }
  return context;
}
