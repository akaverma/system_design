import * as React from "react";
import { cn } from "../../utils/cn";

export type ToggleSize = "sm" | "md" | "lg";

export interface ToggleProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "role" | "type" | "value"> {
  /** Controlled checked state. Omit for uncontrolled usage with `defaultChecked`. */
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  size?: ToggleSize;
  "aria-label"?: string;
  className?: string;
}

const trackBaseStyles =
  "inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent " +
  "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
  "focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed " +
  "disabled:opacity-50";

const thumbBaseStyles =
  "pointer-events-none block rounded-full bg-background shadow-lg ring-0 transition-transform";

const trackSizeStyles: Record<ToggleSize, string> = {
  sm: "h-4 w-7",
  md: "h-5 w-9",
  lg: "h-6 w-11",
};

const thumbSizeStyles: Record<ToggleSize, string> = {
  sm: "h-3 w-3",
  md: "h-4 w-4",
  lg: "h-5 w-5",
};

const thumbCheckedTranslateStyles: Record<ToggleSize, string> = {
  sm: "translate-x-3",
  md: "translate-x-4",
  lg: "translate-x-5",
};

/** Renders a `<button role="switch">` with a sliding thumb. */
export const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(function Toggle(
  {
    checked,
    defaultChecked = false,
    onCheckedChange,
    size = "md",
    disabled,
    className,
    onClick,
    ...props
  },
  ref,
) {
  const [uncontrolledChecked, setUncontrolledChecked] = React.useState(defaultChecked);
  const isControlled = checked !== undefined;
  const isChecked = isControlled ? checked : uncontrolledChecked;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;

    const nextChecked = !isChecked;
    if (!isControlled) {
      setUncontrolledChecked(nextChecked);
    }
    onCheckedChange?.(nextChecked);
    onClick?.(event);
  };

  return (
    <button
      ref={ref}
      type="button"
      role="switch"
      aria-checked={isChecked}
      disabled={disabled}
      className={cn(
        trackBaseStyles,
        trackSizeStyles[size],
        isChecked ? "bg-primary" : "bg-input",
        className,
      )}
      onClick={handleClick}
      {...props}
    >
      <span
        className={cn(
          thumbBaseStyles,
          thumbSizeStyles[size],
          isChecked ? thumbCheckedTranslateStyles[size] : "translate-x-0",
        )}
      />
    </button>
  );
});
