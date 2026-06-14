import * as React from "react";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

/**
 * Traps keyboard focus within the referenced container while `active` is true.
 *
 * On activation, focus moves to the first focusable element inside the container
 * (or the container itself). `Tab`/`Shift+Tab` cycle focus within the container,
 * and focus is restored to the previously focused element on deactivation.
 *
 * @param active - Whether the focus trap is currently enabled.
 * @returns A ref to attach to the container element that should trap focus.
 *
 * @example
 * ```tsx
 * const trapRef = useFocusTrap(isOpen);
 * <div ref={trapRef}>...</div>
 * ```
 */
export function useFocusTrap<T extends HTMLElement>(active: boolean): React.RefObject<T> {
  const containerRef = React.useRef<T>(null);
  const previouslyFocused = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    if (!active) return;

    const container = containerRef.current;
    if (!container) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;

    const getFocusable = (): HTMLElement[] =>
      Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));

    const focusable = getFocusable();
    (focusable[0] ?? container).focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;

      const elements = getFocusable();
      if (elements.length === 0) {
        event.preventDefault();
        return;
      }

      const first = elements[0]!;
      const last = elements[elements.length - 1]!;
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    container.addEventListener("keydown", handleKeyDown);

    return () => {
      container.removeEventListener("keydown", handleKeyDown);
      previouslyFocused.current?.focus();
    };
  }, [active]);

  return containerRef;
}
