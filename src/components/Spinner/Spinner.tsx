import * as React from "react";
import { cn } from "../../utils/cn";
import { SpinnerIcon } from "../../icons";

export type SpinnerSize = "sm" | "md" | "lg" | "xl";

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: SpinnerSize;
  /** Announced to screen readers while the spinner is visible. */
  label?: string;
  className?: string;
}

const sizeStyles: Record<SpinnerSize, string> = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
  xl: "h-12 w-12",
};

/** Animated loading indicator with a visually-hidden label for screen readers. */
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
