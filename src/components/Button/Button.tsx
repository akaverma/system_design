import * as React from "react";
import { cn } from "../../utils/cn";

/** Visual style of the button. */
export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "link";

/** Size of the button, controlling padding and font size. */
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Visual style of the button.
   * @default "primary"
   */
  variant?: ButtonVariant;
  /**
   * Size of the button.
   * @default "md"
   */
  size?: ButtonSize;
  /**
   * Shows a loading spinner and disables the button while `true`.
   * @default false
   */
  isLoading?: boolean;
  /** Icon rendered before the button label. */
  iconLeft?: React.ReactNode;
  /** Icon rendered after the button label. */
  iconRight?: React.ReactNode;
  /** Additional class names merged with the component's default styles. */
  className?: string;
}

const baseStyles =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium " +
  "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
  "focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none " +
  "disabled:opacity-50";

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  ghost: "bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground",
  danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  link: "bg-transparent text-primary underline-offset-4 hover:underline p-0 h-auto",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

/** Animated spinner used for the `isLoading` state. */
function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn("h-4 w-4 animate-spin", className)}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647Z"
      />
    </svg>
  );
}

/**
 * A clickable button supporting multiple visual variants, sizes, and a loading state.
 *
 * Renders a native `<button>` element, so all standard button attributes
 * (`onClick`, `type`, `aria-*`, etc.) and keyboard interactions work out of the box.
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="md" onClick={handleSave}>
 *   Save
 * </Button>
 * ```
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    size = "md",
    isLoading = false,
    iconLeft,
    iconRight,
    disabled,
    className,
    children,
    type = "button",
    ...props
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      aria-disabled={disabled || isLoading || undefined}
      {...props}
    >
      {isLoading && <Spinner />}
      {!isLoading && iconLeft && <span aria-hidden="true">{iconLeft}</span>}
      {children}
      {!isLoading && iconRight && <span aria-hidden="true">{iconRight}</span>}
    </button>
  );
});
