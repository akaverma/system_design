import * as React from "react";
import { cn } from "../../utils/cn";

export type TooltipPosition = "top" | "bottom" | "left" | "right";

export interface TooltipProps {
  /** Content shown inside the tooltip. */
  content: React.ReactNode;
  /** A single element that triggers the tooltip on hover/focus; cloned to attach handlers. */
  children: React.ReactElement;
  position?: TooltipPosition;
  delay?: number;
  /** Disables the tooltip entirely (no listeners attached, never shown). */
  disabled?: boolean;
  className?: string;
}

const positionStyles: Record<TooltipPosition, string> = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
};

/** Wraps a single trigger element and shows a floating label on hover/focus. */
export function Tooltip({
  content,
  children,
  position = "top",
  delay = 200,
  disabled = false,
  className,
}: TooltipProps): React.ReactElement {
  const [visible, setVisible] = React.useState(false);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>();
  const tooltipId = React.useId();

  React.useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  if (disabled) {
    return <span className="relative inline-flex">{children}</span>;
  }

  const show = () => {
    timeoutRef.current = setTimeout(() => setVisible(true), delay);
  };

  const hide = () => {
    clearTimeout(timeoutRef.current);
    setVisible(false);
  };

  const childProps = children.props as Record<string, unknown>;

  const handleMouseEnter = (event: React.MouseEvent) => {
    (childProps.onMouseEnter as ((e: React.MouseEvent) => void) | undefined)?.(event);
    show();
  };

  const handleMouseLeave = (event: React.MouseEvent) => {
    (childProps.onMouseLeave as ((e: React.MouseEvent) => void) | undefined)?.(event);
    hide();
  };

  const handleFocus = (event: React.FocusEvent) => {
    (childProps.onFocus as ((e: React.FocusEvent) => void) | undefined)?.(event);
    show();
  };

  const handleBlur = (event: React.FocusEvent) => {
    (childProps.onBlur as ((e: React.FocusEvent) => void) | undefined)?.(event);
    hide();
  };

  const trigger = React.cloneElement(children, {
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onFocus: handleFocus,
    onBlur: handleBlur,
    "aria-describedby": visible ? tooltipId : undefined,
  } as Partial<unknown>);

  return (
    <span className="relative inline-flex">
      {trigger}
      {visible && (
        <div
          role="tooltip"
          id={tooltipId}
          className={cn(
            "absolute z-50 whitespace-nowrap rounded-md bg-popover px-2 py-1 text-xs text-popover-foreground shadow-md border border-border",
            positionStyles[position],
            className,
          )}
        >
          {content}
        </div>
      )}
    </span>
  );
}
