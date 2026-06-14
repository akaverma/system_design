import * as React from "react";
import { cn } from "../../utils/cn";
import { ChevronDownIcon } from "../../icons";

/** A single selectable option rendered inside the `<select>`. */
export interface SelectOption {
  /** The option's value attribute. */
  value: string;
  /** The option's visible label. */
  label: string;
  /** Disables this individual option. */
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  /** Visible label rendered above the select and associated via `htmlFor`/`id`. */
  label?: string;
  /**
   * Error message. When provided, the select is styled as invalid and the
   * message is announced via `aria-describedby` with `role="alert"`.
   */
  error?: string;
  /** Helper text rendered below the select when there is no error. */
  helperText?: string;
  /** Options to render. Alternatively, pass `<option>` elements as `children`. */
  options?: SelectOption[];
  /** Placeholder option shown as a disabled, initially-selected option (value=""). */
  placeholder?: string;
  /** Additional class names applied to the outer wrapper. */
  containerClassName?: string;
  /** Additional class names merged with the select element's default styles. */
  className?: string;
}

let idCounter = 0;
/** Generates a stable, unique id for associating labels/messages with a select across renders. */
function useUniqueId(prefix: string, providedId?: string): string {
  const generated = React.useRef<string>();
  if (!generated.current) {
    idCounter += 1;
    generated.current = `${prefix}-${idCounter}`;
  }
  return providedId ?? generated.current;
}

/**
 * A labeled native `<select>` with support for error/helper text and a
 * decorative dropdown chevron.
 *
 * @example
 * ```tsx
 * <Select
 *   label="Country"
 *   placeholder="Select a country"
 *   options={[
 *     { value: "us", label: "United States" },
 *     { value: "ca", label: "Canada" },
 *   ]}
 *   error={errors.country}
 * />
 * ```
 */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(function Select(
  {
    label,
    error,
    helperText,
    options,
    placeholder,
    id,
    disabled,
    className,
    containerClassName,
    children,
    "aria-describedby": ariaDescribedBy,
    ...props
  },
  ref,
) {
  const selectId = useUniqueId("select", id);
  const errorId = `${selectId}-error`;
  const helperId = `${selectId}-helper`;

  const describedBy =
    [error ? errorId : helperText ? helperId : null, ariaDescribedBy].filter(Boolean).join(" ") ||
    undefined;

  return (
    <div className={cn("flex flex-col gap-1.5", containerClassName)}>
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <select
          ref={ref}
          id={selectId}
          disabled={disabled}
          aria-invalid={!!error || undefined}
          aria-describedby={describedBy}
          className={cn(
            "flex h-10 w-full appearance-none rounded-md border border-input bg-background px-3 py-2 pr-9 text-sm",
            "text-foreground",
            "transition-colors focus-visible:outline-none focus-visible:ring-2",
            "focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-destructive focus-visible:ring-destructive",
            className,
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {options
            ? options.map((option) => (
                <option key={option.value} value={option.value} disabled={option.disabled}>
                  {option.label}
                </option>
              ))
            : children}
        </select>
        <span className="pointer-events-none absolute right-3 flex items-center text-muted-foreground">
          <ChevronDownIcon />
        </span>
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
