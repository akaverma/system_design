import * as React from "react";
import { cn } from "../../utils/cn";

export interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size" | "prefix" | "suffix"
> {
  /** Visible label rendered above the input and associated via `htmlFor`/`id`. */
  label?: string;
  /**
   * Error message. When provided, the input is styled as invalid and the
   * message is announced via `aria-describedby` with `role="alert"`.
   */
  error?: string;
  /** Helper text rendered below the input when there is no error. */
  helperText?: string;
  /** Icon or element rendered inside the input on the left side. */
  prefix?: React.ReactNode;
  /** Icon or element rendered inside the input on the right side. */
  suffix?: React.ReactNode;
  /** Additional class names applied to the outer wrapper. */
  containerClassName?: string;
  /** Additional class names merged with the input element's default styles. */
  className?: string;
}

let idCounter = 0;
/** Generates a stable, unique id for associating labels/messages with an input across renders. */
function useUniqueId(prefix: string, providedId?: string): string {
  const generated = React.useRef<string>();
  if (!generated.current) {
    idCounter += 1;
    generated.current = `${prefix}-${idCounter}`;
  }
  return providedId ?? generated.current;
}

/**
 * A labeled text input with support for error/helper text and prefix/suffix adornments.
 *
 * @example
 * ```tsx
 * <Input
 *   label="Email"
 *   placeholder="you@example.com"
 *   error={errors.email}
 *   prefix={<MailIcon />}
 * />
 * ```
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    error,
    helperText,
    prefix,
    suffix,
    id,
    disabled,
    className,
    containerClassName,
    "aria-describedby": ariaDescribedBy,
    ...props
  },
  ref,
) {
  const inputId = useUniqueId("input", id);
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  const describedBy =
    [error ? errorId : helperText ? helperId : null, ariaDescribedBy].filter(Boolean).join(" ") ||
    undefined;

  return (
    <div className={cn("flex flex-col gap-1.5", containerClassName)}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {prefix && (
          <span className="pointer-events-none absolute left-3 flex items-center text-muted-foreground">
            {prefix}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          aria-invalid={!!error || undefined}
          aria-describedby={describedBy}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
            "text-foreground placeholder:text-muted-foreground",
            "transition-colors focus-visible:outline-none focus-visible:ring-2",
            "focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-destructive focus-visible:ring-destructive",
            prefix && "pl-9",
            suffix && "pr-9",
            className,
          )}
          {...props}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-3 flex items-center text-muted-foreground">
            {suffix}
          </span>
        )}
      </div>
      {error ? (
        <p id={errorId} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : helperText ? (
        <p id={helperId} className="text-sm text-muted-foreground">
          {helperText}
        </p>
      ) : null}
    </div>
  );
});
