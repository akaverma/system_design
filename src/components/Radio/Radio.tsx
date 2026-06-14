import * as React from "react";
import { cn } from "../../utils/cn";

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  /** Visible label rendered next to the radio button and associated via `htmlFor`/`id`. */
  label?: string;
  /** Additional class names applied to the outer wrapper. */
  containerClassName?: string;
  /** Additional class names merged with the radio input's default styles. */
  className?: string;
}

export interface RadioGroupProps {
  /** Name shared by all radio inputs in the group (overrides each Radio's own `name`). */
  name: string;
  /** The currently selected value (controlled). */
  value?: string;
  /** Default selected value (uncontrolled). */
  defaultValue?: string;
  /** Called with the new value when the selection changes. */
  onChange?: (value: string) => void;
  /** Accessible label for the group. */
  "aria-label"?: string;
  /** Visible legend/label for the group, rendered above the options. */
  label?: string;
  /** `Radio` elements (each needs its own `value` prop). */
  children: React.ReactNode;
  /** Additional class names merged with the group's default styles. */
  className?: string;
}

interface RadioGroupContextValue {
  name: string;
  value: string | undefined;
  onChange: (value: string) => void;
}

const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(null);

let idCounter = 0;
/** Generates a stable, unique id for associating labels with a radio across renders. */
function useUniqueId(prefix: string, providedId?: string): string {
  const generated = React.useRef<string>();
  if (!generated.current) {
    idCounter += 1;
    generated.current = `${prefix}-${idCounter}`;
  }
  return providedId ?? generated.current;
}

/**
 * A styled radio button with a visible label.
 *
 * When rendered inside a `RadioGroup`, the `name`, `checked`, and `onChange`
 * behavior are derived from the group's context, so only `value` (and
 * optionally `label`) need to be provided. When used standalone, all props
 * behave like a regular native `<input type="radio">`.
 *
 * @example
 * ```tsx
 * <RadioGroup name="plan" label="Choose a plan" defaultValue="free">
 *   <Radio value="free" label="Free" />
 *   <Radio value="pro" label="Pro" />
 * </RadioGroup>
 * ```
 */
export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(function Radio(
  {
    label,
    id,
    name,
    checked,
    onChange,
    disabled,
    className,
    containerClassName,
    value,
    ...props
  },
  ref,
) {
  const radioId = useUniqueId("radio", id);
  const group = React.useContext(RadioGroupContext);

  const resolvedName = group ? group.name : name;
  const resolvedChecked = group ? group.value === value : checked;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (group) {
      if (typeof value === "string") {
        group.onChange(value);
      }
    }
    onChange?.(event);
  };

  return (
    <div className={cn("inline-flex items-center gap-2", containerClassName)}>
      <span className="relative inline-flex h-4 w-4 shrink-0 items-center justify-center">
        <input
          ref={ref}
          type="radio"
          id={radioId}
          name={resolvedName}
          value={value}
          checked={resolvedChecked}
          onChange={handleChange}
          disabled={disabled}
          className={cn("peer sr-only", className)}
          {...props}
        />
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-input bg-background",
            "transition-colors",
            "peer-checked:border-primary",
            "peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background",
            "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
          )}
        >
          <span className="h-2 w-2 rounded-full bg-primary opacity-0 transition-opacity peer-checked:opacity-100" />
        </span>
      </span>
      {label && (
        <label
          htmlFor={radioId}
          className={cn(
            "text-sm font-medium text-foreground",
            disabled && "cursor-not-allowed opacity-50",
          )}
        >
          {label}
        </label>
      )}
    </div>
  );
});

/**
 * A context provider that groups `Radio` elements so only one can be
 * selected at a time, supporting both controlled (`value`/`onChange`) and
 * uncontrolled (`defaultValue`) usage.
 *
 * @example
 * ```tsx
 * <RadioGroup name="plan" label="Choose a plan" defaultValue="free" onChange={setPlan}>
 *   <Radio value="free" label="Free" />
 *   <Radio value="pro" label="Pro" />
 *   <Radio value="enterprise" label="Enterprise" />
 * </RadioGroup>
 * ```
 */
export const RadioGroup = function RadioGroup({
  name,
  value,
  defaultValue,
  onChange,
  "aria-label": ariaLabel,
  label,
  children,
  className,
}: RadioGroupProps) {
  const [internalValue, setInternalValue] = React.useState<string | undefined>(defaultValue);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const handleChange = React.useCallback(
    (newValue: string) => {
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    },
    [isControlled, onChange],
  );

  const contextValue = React.useMemo<RadioGroupContextValue>(
    () => ({ name, value: currentValue, onChange: handleChange }),
    [name, currentValue, handleChange],
  );

  return (
    <div className="flex flex-col gap-2">
      {label && <span className="text-sm font-medium text-foreground">{label}</span>}
      <div
        role="radiogroup"
        aria-label={ariaLabel ?? label}
        className={cn("flex flex-col gap-2", className)}
      >
        <RadioGroupContext.Provider value={contextValue}>{children}</RadioGroupContext.Provider>
      </div>
    </div>
  );
};
