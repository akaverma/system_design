import * as React from "react";
import { cn } from "../../utils/cn";
import { CheckIcon } from "../../icons";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  /** Visible label rendered next to the checkbox and associated via `htmlFor`/`id`. */
  label?: string;
  /**
   * Error message. When provided, the checkbox is styled as invalid and the
   * message is announced via `aria-describedby` with `role="alert"`.
   */
  error?: string;
  /** Helper text rendered below the checkbox when there is no error. */
  helperText?: string;
  /** Sets the checkbox to an indeterminate visual state (does not affect `checked`). @default false */
  indeterminate?: boolean;
  /** Additional class names applied to the outer wrapper. */
  containerClassName?: string;
  /** Additional class names merged with the checkbox element's default styles. */
  className?: string;
}

let idCounter = 0;
/** Generates a stable, unique id for associating labels/messages with a checkbox across renders. */
function useUniqueId(prefix: string, providedId?: string): string {
  const generated = React.useRef<string>();
  if (!generated.current) {
    idCounter += 1;
    generated.current = `${prefix}-${idCounter}`;
  }
  return providedId ?? generated.current;
}

/**
 * A styled checkbox input with a visible label, error/helper text, and
 * indeterminate state support.
 *
 * @example
 * ```tsx
 * <Checkbox
 *   label="Accept terms and conditions"
 *   error={errors.terms}
 * />
 * ```
 */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  {
    label,
    error,
    helperText,
    indeterminate = false,
    id,
    disabled,
    className,
    containerClassName,
    "aria-describedby": ariaDescribedBy,
    ...props
  },
  ref,
) {
  const checkboxId = useUniqueId("checkbox", id);
  const errorId = `${checkboxId}-error`;
  const helperId = `${checkboxId}-helper`;

  const describedBy =
    [error ? errorId : helperText ? helperId : null, ariaDescribedBy].filter(Boolean).join(" ") ||
    undefined;

  const internalRef = React.useRef<HTMLInputElement | null>(null);

  const setRefs = React.useCallback(
    (node: HTMLInputElement | null) => {
      internalRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    },
    [ref],
  );

  React.useEffect(() => {
    if (internalRef.current) {
      internalRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <div className={cn("flex flex-col gap-1.5", containerClassName)}>
      <div className="flex items-center gap-2">
        <span className="relative inline-flex h-4 w-4 shrink-0 items-center justify-center">
          <input
            ref={setRefs}
            type="checkbox"
            id={checkboxId}
            disabled={disabled}
            aria-invalid={!!error || undefined}
            aria-describedby={describedBy}
            className={cn("peer sr-only", className)}
            {...props}
          />
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-input bg-background text-background",
              "transition-colors",
              "peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-foreground",
              "peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background",
              "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
              "[&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100",
              error && "border-destructive peer-focus-visible:ring-destructive",
            )}
          >
            {indeterminate ? (
              <span className="h-0.5 w-2.5 bg-current" />
            ) : (
              <CheckIcon className="h-3 w-3" />
            )}
          </span>
        </span>
        {label && (
          <label
            htmlFor={checkboxId}
            className={cn(
              "text-sm font-medium text-foreground",
              disabled && "cursor-not-allowed opacity-50",
            )}
          >
            {label}
          </label>
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
