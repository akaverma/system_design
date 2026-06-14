import * as React from "react";
import { cn } from "../../utils/cn";
import { SpinnerIcon } from "../../icons";

/** Size of the spinner. */
export type SpinnerSize = "sm" | "md" | "lg" | "xl";

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Size of the spinner.
   * @default "md"
   */
  size?: SpinnerSize;
  /**
   * Accessible label announced to screen readers while the spinner is visible.
   * @default "Loading"
   */
  label?: string;
  /** Additional class names merged with the component's default styles. */
  className?: string;
}

const sizeStyles: Record<SpinnerSize, string> = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
  xl: "h-12 w-12",
};

/**
 * A small, animated spinner used to indicate a loading state.
 *
 * Renders with `role="status"` and a visually-hidden label so assistive
 * technologies announce the loading state, while the icon itself stays
 * `aria-hidden`.
 *
 * @example
 * ```tsx
 * <Spinner size="lg" label="Loading results" />
 * ```
 */
export const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(function Spinner(
  { size = "md", label = "Loading", className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      role="status"
      className={cn("inline-flex items-center justify-center", className)}
      {...props}
    >
      <SpinnerIcon className={cn("animate-spin text-primary", sizeStyles[size])} />
      <span className="sr-only">{label}</span>
    </div>
  );
});
