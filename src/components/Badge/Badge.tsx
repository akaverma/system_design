import * as React from "react";
import { cn } from "../../utils/cn";

/** Visual style of the badge. */
export type BadgeVariant =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "outline";

/** Size of the badge, controlling padding and font size. */
export type BadgeSize = "sm" | "md" | "lg";

/** Props for the {@link Badge} component. */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Visual style of the badge.
   * @default "default"
   */
  variant?: BadgeVariant;
  /**
   * Size of the badge.
   * @default "md"
   */
  size?: BadgeSize;
  /** Additional class names merged with the component's default styles. */
  className?: string;
}

const baseStyles =
  "inline-flex items-center justify-center rounded-full font-medium border border-transparent " +
  "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
  "focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-muted text-muted-foreground",
  primary: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  success: "bg-success text-success-foreground",
  warning: "bg-warning text-warning-foreground",
  danger: "bg-destructive text-destructive-foreground",
  info: "bg-info text-info-foreground",
  outline: "bg-transparent text-foreground border-border",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "h-5 px-2 text-xs",
  md: "h-6 px-2.5 text-xs",
  lg: "h-7 px-3 text-sm",
};

/**
 * A small inline status or label indicator.
 *
 * Renders a native `<span>` element, so all standard span attributes
 * (`aria-*`, `id`, `onClick`, etc.) work out of the box.
 *
 * @example
 * ```tsx
 * <Badge variant="success" size="sm">
 *   Active
 * </Badge>
 * ```
 */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { variant = "default", size = "md", className, children, ...props },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      {...props}
    >
      {children}
    </span>
  );
});
