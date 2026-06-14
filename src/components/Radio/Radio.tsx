import * as React from "react";
import { cn } from "../../utils/cn";

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: string;
  containerClassName?: string;
  className?: string;
}

export interface RadioGroupProps {
  /** Shared by all radios in the group; overrides each Radio's own `name`. */
  name: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  "aria-label"?: string;
  label?: string;
  children: React.ReactNode;
  className?: string;
}

interface RadioGroupContextValue {
  name: string;
  value: string | undefined;
  onChange: (value: string) => void;
}

const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(null);

/**
 * Standalone by default; when rendered inside a `RadioGroup`, `name`,
 * `checked`, and `onChange` are derived from the group context.
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
  const generatedId = React.useId();
  const radioId = id ?? generatedId;
  const group = React.useContext(RadioGroupContext);

  const resolvedName = group ? group.name : name;
  const resolvedChecked = group ? group.value === value : checked;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (group && typeof value === "string") {
      group.onChange(value);
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
 * Groups `Radio` elements so only one can be selected at a time, supporting
 * both controlled (`value`/`onChange`) and uncontrolled (`defaultValue`) usage.
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
