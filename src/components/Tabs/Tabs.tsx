import * as React from "react";
import { cn } from "../../utils/cn";

interface TabsContextValue {
  value: string | undefined;
  setValue: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

function useTabsContext(component: string): TabsContextValue {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error(`<${component} /> must be used within a <Tabs> component.`);
  }
  return context;
}

export interface TabsProps {
  /** The currently selected tab's value (controlled). */
  value?: string;
  /** The initially selected tab's value (uncontrolled). */
  defaultValue?: string;
  /** Called when the selected tab changes. */
  onValueChange?: (value: string) => void;
  /** `TabList` and `TabPanel` elements. */
  children: React.ReactNode;
  className?: string;
}

/**
 * Root component for an accessible tabs widget following the WAI-ARIA Tabs pattern.
 *
 * Provides shared state to `TabList`, `Tab`, and `TabPanel` children via context.
 * Supports both controlled (`value` + `onValueChange`) and uncontrolled
 * (`defaultValue`) usage.
 *
 * @example
 * ```tsx
 * <Tabs defaultValue="account">
 *   <TabList>
 *     <Tab value="account">Account</Tab>
 *     <Tab value="password">Password</Tab>
 *   </TabList>
 *   <TabPanel value="account">Account settings</TabPanel>
 *   <TabPanel value="password">Password settings</TabPanel>
 * </Tabs>
 * ```
 */
export function Tabs({ value, defaultValue, onValueChange, children, className }: TabsProps) {
  const [internalValue, setInternalValue] = React.useState<string | undefined>(defaultValue);

  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const setValue = React.useCallback(
    (next: string) => {
      if (!isControlled) {
        setInternalValue(next);
      }
      onValueChange?.(next);
    },
    [isControlled, onValueChange],
  );

  const contextValue = React.useMemo<TabsContextValue>(
    () => ({ value: currentValue, setValue }),
    [currentValue, setValue],
  );

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={cn("flex flex-col gap-2", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export type TabListProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * Container for `Tab` elements. Renders `role="tablist"` and implements
 * arrow-key/Home/End keyboard navigation per the WAI-ARIA Tabs pattern.
 */
export const TabList = React.forwardRef<HTMLDivElement, TabListProps>(function TabList(
  { className, onKeyDown, ...props },
  ref,
) {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);

    const key = event.key;
    if (key !== "ArrowRight" && key !== "ArrowLeft" && key !== "Home" && key !== "End") {
      return;
    }

    const tabs = Array.from(
      event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]:not([disabled])'),
    );
    if (tabs.length === 0) {
      return;
    }

    const currentIndex = tabs.findIndex((tab) => tab === document.activeElement);

    let nextIndex: number;
    switch (key) {
      case "ArrowRight":
        nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % tabs.length;
        break;
      case "ArrowLeft":
        nextIndex = currentIndex === -1 ? 0 : (currentIndex - 1 + tabs.length) % tabs.length;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = tabs.length - 1;
        break;
      default:
        return;
    }

    const nextTab = tabs[nextIndex];
    if (!nextTab) {
      return;
    }

    event.preventDefault();
    nextTab.focus();
    nextTab.click();
  };

  return (
    <div
      ref={ref}
      role="tablist"
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      className={cn("inline-flex items-center gap-1 border-b border-border", className)}
      {...props}
    />
  );
});

export interface TabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Unique value identifying this tab; matches a `TabPanel`'s `value`. */
  value: string;
}

const tabBaseStyles =
  "inline-flex items-center justify-center whitespace-nowrap rounded-t-md border-b-2 " +
  "border-transparent px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none " +
  "focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";

const tabActiveStyles = "border-primary text-foreground";
const tabInactiveStyles = "text-muted-foreground hover:text-foreground";

/**
 * A single selectable tab trigger. Must be rendered inside a `TabList`,
 * which itself must be inside a `Tabs` component.
 */
export const Tab = React.forwardRef<HTMLButtonElement, TabProps>(function Tab(
  { value, disabled, className, onClick, ...props },
  ref,
) {
  const { value: selected, setValue } = useTabsContext("Tab");
  const isSelected = selected === value;
  const tabId = `tab-${value}`;
  const panelId = `tabpanel-${value}`;

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    onClick?.(event);
    if (!disabled) {
      setValue(value);
    }
  };

  return (
    <button
      ref={ref}
      role="tab"
      type="button"
      id={tabId}
      aria-selected={isSelected}
      aria-controls={panelId}
      tabIndex={isSelected ? 0 : -1}
      disabled={disabled}
      onClick={handleClick}
      className={cn(tabBaseStyles, isSelected ? tabActiveStyles : tabInactiveStyles, className)}
      {...props}
    />
  );
});

export interface TabPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Value matching the corresponding `Tab`'s `value`. */
  value: string;
}

/**
 * Content panel associated with a `Tab` of the same `value`. Renders `null`
 * when its tab is not the selected one.
 */
export const TabPanel = React.forwardRef<HTMLDivElement, TabPanelProps>(function TabPanel(
  { value, className, ...props },
  ref,
) {
  const { value: selected } = useTabsContext("TabPanel");

  if (selected !== value) {
    return null;
  }

  return (
    <div
      ref={ref}
      role="tabpanel"
      id={`tabpanel-${value}`}
      aria-labelledby={`tab-${value}`}
      tabIndex={0}
      className={cn("mt-2", className)}
      {...props}
    />
  );
});
