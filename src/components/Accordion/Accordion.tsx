import * as React from "react";
import { cn } from "../../utils/cn";
import { ChevronDownIcon } from "../../icons";

export type AccordionType = "single" | "multiple";

export interface AccordionProps {
  type?: AccordionType;
  /** Open item value(s) (controlled). String for "single", string[] for "multiple". */
  value?: string | string[];
  /** Initially open item value(s) (uncontrolled). */
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  /** In "single" mode, whether the open item can be collapsed back to none. */
  collapsible?: boolean;
  children: React.ReactNode;
  className?: string;
}

export interface AccordionItemProps {
  value: string;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

export type AccordionTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export type AccordionContentProps = React.HTMLAttributes<HTMLDivElement>;

interface AccordionContextValue {
  type: AccordionType;
  openValues: string[];
  toggle: (value: string) => void;
}

interface AccordionItemContextValue {
  value: string;
  disabled?: boolean;
  isOpen: boolean;
}

const AccordionContext = React.createContext<AccordionContextValue | null>(null);
const AccordionItemContext = React.createContext<AccordionItemContextValue | null>(null);

function useAccordionContext(componentName: string): AccordionContextValue {
  const context = React.useContext(AccordionContext);
  if (!context) {
    throw new Error(`${componentName} must be used within an Accordion`);
  }
  return context;
}

function useAccordionItemContext(componentName: string): AccordionItemContextValue {
  const context = React.useContext(AccordionItemContext);
  if (!context) {
    throw new Error(`${componentName} must be used within an AccordionItem`);
  }
  return context;
}

function toArray(value: string | string[] | undefined): string[] {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

/** A vertically stacked set of collapsible sections, following the WAI-ARIA accordion pattern. */
export function Accordion({
  type = "single",
  value,
  defaultValue,
  onValueChange,
  collapsible = true,
  children,
  className,
}: AccordionProps) {
  const isControlled = value !== undefined;
  const [internalValues, setInternalValues] = React.useState<string[]>(() => toArray(defaultValue));

  const openValues = isControlled ? toArray(value) : internalValues;

  const toggle = React.useCallback(
    (itemValue: string) => {
      const current = isControlled ? toArray(value) : internalValues;
      let next: string[];

      if (type === "multiple") {
        next = current.includes(itemValue)
          ? current.filter((v) => v !== itemValue)
          : [...current, itemValue];
      } else if (current.includes(itemValue) && collapsible) {
        next = [];
      } else {
        next = [itemValue];
      }

      if (!isControlled) {
        setInternalValues(next);
      }

      onValueChange?.(type === "multiple" ? next : next[0] ?? "");
    },
    [isControlled, value, internalValues, type, collapsible, onValueChange],
  );

  const contextValue = React.useMemo<AccordionContextValue>(
    () => ({ type, openValues, toggle }),
    [type, openValues, toggle],
  );

  return (
    <AccordionContext.Provider value={contextValue}>
      <div className={cn("flex flex-col divide-y divide-border rounded-md border border-border", className)}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}
Accordion.displayName = "Accordion";

/** A single collapsible section within an `Accordion`. */
export function AccordionItem({ value, disabled, children, className }: AccordionItemProps) {
  const { openValues } = useAccordionContext("AccordionItem");
  const isOpen = openValues.includes(value);

  const itemContextValue = React.useMemo<AccordionItemContextValue>(
    () => ({ value, disabled, isOpen }),
    [value, disabled, isOpen],
  );

  return (
    <AccordionItemContext.Provider value={itemContextValue}>
      <div className={cn("flex flex-col", className)}>{children}</div>
    </AccordionItemContext.Provider>
  );
}
AccordionItem.displayName = "AccordionItem";

/** Toggles its parent `AccordionItem`'s open state. Renders a chevron that rotates when open. */
export const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  function AccordionTrigger({ className, children, ...props }, ref) {
    const { value, disabled, isOpen } = useAccordionItemContext("AccordionTrigger");
    const { toggle } = useAccordionContext("AccordionTrigger");

    return (
      <button
        ref={ref}
        type="button"
        aria-expanded={isOpen}
        aria-controls={`accordion-content-${value}`}
        id={`accordion-trigger-${value}`}
        disabled={disabled}
        onClick={() => toggle(value)}
        className={cn(
          "flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-50",
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon className={cn("transition-transform", isOpen && "rotate-180")} />
      </button>
    );
  },
);

/** The collapsible content panel of an `AccordionItem`, mounted only while open. */
export const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  function AccordionContent({ className, children, ...props }, ref) {
    const { value, isOpen } = useAccordionItemContext("AccordionContent");

    if (!isOpen) {
      return null;
    }

    return (
      <div
        ref={ref}
        role="region"
        id={`accordion-content-${value}`}
        aria-labelledby={`accordion-trigger-${value}`}
        className={cn("px-4 pb-4 text-sm text-muted-foreground", className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);
