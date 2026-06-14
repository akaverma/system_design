import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "../../utils/cn";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { CloseIcon } from "../../icons";

/** Size of the modal, controlling the dialog panel's max width. */
export type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

export interface ModalProps {
  /** Whether the modal is open. When `false`, nothing is rendered. */
  isOpen: boolean;
  /** Called when the modal requests to be closed (ESC key, overlay click, or close button). */
  onClose: () => void;
  /** Title rendered in the modal header and used for `aria-labelledby`. */
  title?: React.ReactNode;
  /** Optional description rendered below the title, used for `aria-describedby`. */
  description?: React.ReactNode;
  /** Modal body content. */
  children?: React.ReactNode;
  /** Optional footer content (e.g. action buttons), rendered at the bottom. */
  footer?: React.ReactNode;
  /**
   * Size of the modal.
   * @default "md"
   */
  size?: ModalSize;
  /**
   * Whether clicking the overlay closes the modal.
   * @default true
   */
  closeOnOverlayClick?: boolean;
  /**
   * Whether pressing Escape closes the modal.
   * @default true
   */
  closeOnEsc?: boolean;
  /**
   * Whether to show the built-in close (X) button in the header.
   * @default true
   */
  showCloseButton?: boolean;
  /** Additional class names for the dialog panel. */
  className?: string;
}

const sizeStyles: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-[calc(100vw-2rem)] h-[calc(100vh-2rem)]",
};

let idCounter = 0;
/** Generates a stable, unique id for associating the title/description with the dialog across renders. */
function useUniqueId(prefix: string): string {
  const generated = React.useRef<string>();
  if (!generated.current) {
    idCounter += 1;
    generated.current = `${prefix}-${idCounter}`;
  }
  return generated.current;
}

/**
 * A modal dialog rendered in a portal, with focus trapping, ESC-to-close, and
 * overlay-click-to-close behavior.
 *
 * Renders `null` when `isOpen` is `false` (the modal is not kept mounted while closed).
 *
 * @example
 * ```tsx
 * <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Confirm">
 *   Are you sure?
 * </Modal>
 * ```
 */
export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  closeOnOverlayClick = true,
  closeOnEsc = true,
  showCloseButton = true,
  className,
}: ModalProps) {
  const focusTrapRef = useFocusTrap<HTMLDivElement>(isOpen);
  const titleId = useUniqueId("modal-title");
  const descId = useUniqueId("modal-description");

  React.useEffect(() => {
    if (!isOpen || !closeOnEsc) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeOnEsc, onClose]);

  if (!isOpen) return null;

  return createPortal(
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- decorative overlay; closing is also available via the close button and Escape key
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(event) => {
        if (closeOnOverlayClick && event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descId : undefined}
        ref={focusTrapRef}
        className={cn("w-full rounded-lg bg-background p-6 shadow-lg", sizeStyles[size], className)}
      >
        {(title || description || showCloseButton) && (
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              {title && (
                <h2 id={titleId} className="text-lg font-semibold text-foreground">
                  {title}
                </h2>
              )}
              {description && (
                <p id={descId} className="mt-1 text-sm text-muted-foreground">
                  {description}
                </p>
              )}
            </div>
            {showCloseButton && (
              <button aria-label="Close" onClick={onClose}>
                <CloseIcon />
              </button>
            )}
          </div>
        )}
        {children}
        {footer && <div className="mt-6 flex items-center justify-end gap-2">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
