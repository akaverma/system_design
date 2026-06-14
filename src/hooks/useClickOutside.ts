import * as React from "react";

/**
 * Invokes `handler` when a pointer event occurs outside the referenced element.
 *
 * @param handler - Callback invoked with the originating event when an outside click/touch is detected.
 * @param active - Whether the listener is enabled. @default true
 * @returns A ref to attach to the element that defines the "inside" boundary.
 *
 * @example
 * ```tsx
 * const ref = useClickOutside<HTMLDivElement>(() => setOpen(false), open);
 * <div ref={ref}>...</div>
 * ```
 */
export function useClickOutside<T extends HTMLElement>(
  handler: (event: MouseEvent | TouchEvent) => void,
  active = true,
): React.RefObject<T> {
  const ref = React.useRef<T>(null);

  React.useEffect(() => {
    if (!active) return;

    const listener = (event: MouseEvent | TouchEvent) => {
      const node = ref.current;
      if (!node || node.contains(event.target as Node)) return;
      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [handler, active]);

  return ref;
}
