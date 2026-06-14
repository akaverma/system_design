import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "../../utils/cn";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { CloseIcon } from "../../icons";

/** Edge of the screen the drawer slides in from. */
export type DrawerPosition = "left" | "right" | "top" | "bottom";

/** Size of the drawer along its sliding axis. */
export type DrawerSize = "sm" | "md" | "lg" | "full";

export interface DrawerProps {
  /** Whether the drawer is open. When `false`, nothing is rendered. */
  isOpen: boolean;
  /** Called on ESC, overlay click, or close button. */
  onClose: () => void;
  position?: DrawerPosition;
  /** Rendered in the header and used for `aria-labelledby`. */
  title?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  size?: DrawerSize;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
  className?: string;
}

const positionStyles: Record<DrawerPosition, string> = {
  left: "inset-y-0 left-0 h-full border-r border-border",
  right: "inset-y-0 right-0 h-full border-l border-border",
  top: "inset-x-0 top-0 w-full border-b border-border",
  bottom: "inset-x-0 bottom-0 w-full border-t border-border",
};

const widthBySize: Record<DrawerSize, string> = {
  sm: "w-64",
  md: "w-80",
  lg: "w-96",
  full: "w-full",
};

const heightBySize: Record<DrawerSize, string> = {
  sm: "h-1/4",
  md: "h-1/3",
  lg: "h-1/2",
  full: "h-full",
};

/**
 * A panel that slides in from an edge of the screen, used for off-canvas navigation or forms.
 * Renders into `document.body` via a portal, traps focus while open, and can be dismissed via
 * the Escape key, an overlay click, or a close button.
 */
export function Drawer({
  isOpen,
  onClose,
  position = "right",
  title,
  children,
  footer,
  size = "md",
  closeOnOverlayClick = true,
  closeOnEsc = true,
  showCloseButton = true,
  className,
}: DrawerProps) {
  const focusTrapRef = useFocusTrap<HTMLDivElement>(isOpen);
  const titleId = React.useId();

  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (closeOnEsc && event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeOnEsc, onClose]);

  if (!isOpen) return null;

  const isHorizontal = position === "left" || position === "right";
  const sizeStyles = isHorizontal ? widthBySize[size] : heightBySize[size];

  return createPortal(
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- decorative overlay; closing is also available via the close button and Escape key
    <div
      className="fixed inset-0 z-50 bg-black/50"
      onClick={(e) => {
        if (closeOnOverlayClick && e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        ref={focusTrapRef}
        className={cn(
          "fixed bg-background shadow-lg flex flex-col p-6",
          positionStyles[position],
          sizeStyles,
          className,
        )}
      >
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between gap-4">
            {title && (
              <h2 id={titleId} className="text-lg font-semibold text-foreground">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className={cn(
                  "inline-flex items-center justify-center rounded-md p-1 text-muted-foreground",
                  "transition-colors hover:bg-accent hover:text-accent-foreground",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  "focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  !title && "ml-auto",
                )}
              >
                <CloseIcon />
              </button>
            )}
          </div>
        )}
        <div className="mt-4 flex-1 overflow-auto">{children}</div>
        {footer && <div className="mt-4 flex items-center justify-end gap-2">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
