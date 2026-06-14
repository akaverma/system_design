import * as React from "react";
import { cn } from "../../utils/cn";

/** Controls the `resize` CSS behavior of the textarea. */
export type TextareaResize = "none" | "vertical" | "horizontal" | "both";

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> {
  /** Visible label rendered above the textarea and associated via `htmlFor`/`id`. */
  label?: string;
  /**
   * Error message. When provided, the textarea is styled as invalid and the
   * message is announced via `aria-describedby` with `role="alert"`.
   */
  error?: string;
  /** Helper text rendered below the textarea when there is no error. */
  helperText?: string;
  /**
   * Controls the `resize` CSS behavior of the textarea.
   * @default "vertical"
   */
  resize?: TextareaResize;
  /** Additional class names applied to the outer wrapper. */
  containerClassName?: string;
  /** Additional class names merged with the textarea element's default styles. */
  className?: string;
}

const resizeStyles: Record<TextareaResize, string> = {
  none: "resize-none",
  vertical: "resize-y",
  horizontal: "resize-x",
  both: "resize",
};

let idCounter = 0;
/** Generates a stable, unique id for associating labels/messages with a textarea across renders. */
function useUniqueId(prefix: string, providedId?: string): string {
  const generated = React.useRef<string>();
  if (!generated.current) {
    idCounter += 1;
    generated.current = `${prefix}-${idCounter}`;
  }
  return providedId ?? generated.current;
}

/**
 * A labeled multi-line text input with support for error/helper text and resize control.
 *
 * @example
 * ```tsx
 * <Textarea
 *   label="Bio"
 *   placeholder="Tell us about yourself"
 *   error={errors.bio}
 *   rows={4}
 * />
 * ```
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    label,
    error,
    helperText,
    resize = "vertical",
    id,
    disabled,
    className,
    containerClassName,
    "aria-describedby": ariaDescribedBy,
    ...props
  },
  ref,
) {
  const textareaId = useUniqueId("textarea", id);
  const errorId = `${textareaId}-error`;
  const helperId = `${textareaId}-helper`;

  const describedBy =
    [error ? errorId : helperText ? helperId : null, ariaDescribedBy].filter(Boolean).join(" ") ||
    undefined;

  return (
    <div className={cn("flex flex-col gap-1.5", containerClassName)}>
      {label && (
        <label htmlFor={textareaId} className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        disabled={disabled}
        aria-invalid={!!error || undefined}
        aria-describedby={describedBy}
        className={cn(
          "min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
          "text-foreground placeholder:text-muted-foreground",
          "transition-colors focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-destructive focus-visible:ring-destructive",
          resizeStyles[resize],
          className,
        )}
        {...props}
      />
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
