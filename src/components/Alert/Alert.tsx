import * as React from "react";
import { cn } from "../../utils/cn";
import {
  CheckCircleIcon,
  AlertTriangleIcon,
  AlertCircleIcon,
  InfoIcon,
  CloseIcon,
} from "../../icons";

/** Visual style / severity of the alert. */
export type AlertVariant = "default" | "success" | "warning" | "danger" | "info";

export interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /**
   * Visual style / severity of the alert.
   * @default "default"
   */
  variant?: AlertVariant;
  /** Alert title. */
  title?: React.ReactNode;
  /**
   * Whether to show the variant's status icon on the left. Has no effect for
   * the `"default"` variant, which has no associated icon.
   * @default true
   */
  showIcon?: boolean;
  /** Called when the dismiss (close) button is clicked. If omitted, no dismiss button is shown. */
  onDismiss?: () => void;
  /** Additional class names merged with the component's default styles. */
  className?: string;
}

const variantStyles: Record<AlertVariant, string> = {
  default: "border-border bg-background text-foreground",
  success: "border-success/50 bg-success/10 text-foreground",
  warning: "border-warning/50 bg-warning/10 text-foreground",
  danger: "border-destructive/50 bg-destructive/10 text-foreground",
  info: "border-info/50 bg-info/10 text-foreground",
};

const variantIcons: Record<AlertVariant, React.ReactNode> = {
  default: null,
  success: <CheckCircleIcon className="h-5 w-5 shrink-0 mt-0.5 text-success" aria-hidden="true" />,
  warning: (
    <AlertTriangleIcon className="h-5 w-5 shrink-0 mt-0.5 text-warning" aria-hidden="true" />
  ),
  danger: (
    <AlertCircleIcon className="h-5 w-5 shrink-0 mt-0.5 text-destructive" aria-hidden="true" />
  ),
  info: <InfoIcon className="h-5 w-5 shrink-0 mt-0.5 text-info" aria-hidden="true" />,
};

/**
 * An inline banner used to surface form-level messages, page notices, and
 * other status information, with optional title, icon, and dismiss button.
 *
 * Renders a `<div>` with `role="alert"` for the `"danger"` variant (so
 * assistive technology announces it immediately) and `role="status"` for
 * all other variants.
 *
 * @example
 * ```tsx
 * <Alert variant="success" title="Saved" onDismiss={() => setVisible(false)}>
 *   Your changes have been saved.
 * </Alert>
 * ```
 */
export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { variant = "default", title, showIcon = true, onDismiss, className, children, ...props },
  ref,
) {
  const icon = showIcon && variant !== "default" ? variantIcons[variant] : null;

  return (
    <div
      ref={ref}
      role={variant === "danger" ? "alert" : "status"}
      className={cn(
        "relative flex w-full gap-3 rounded-md border p-4 text-sm",
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {icon}
      <div className="flex-1">
        {title && <h5 className="mb-1 font-medium leading-none">{title}</h5>}
        {children && <div className="text-sm [&_p]:leading-relaxed">{children}</div>}
      </div>
      {onDismiss && (
        <button
          type="button"
          aria-label="Dismiss"
          onClick={onDismiss}
          className={cn(
            "absolute right-3 top-3 inline-flex h-5 w-5 items-center justify-center rounded-md",
            "text-foreground/50 transition-colors hover:text-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          )}
        >
          <CloseIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  );
});
