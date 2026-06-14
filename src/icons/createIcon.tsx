import * as React from "react";
import { cn } from "../utils/cn";

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  /**
   * Width and height of the icon, in pixels (or any valid CSS size if a string).
   * @default 16
   */
  size?: number | string;
}

/**
 * Builds a small, dependency-free SVG icon component from a set of `<path>`/`<circle>`
 * elements. Icons default to a 24x24 viewBox, inherit color via `currentColor`, and are
 * marked `aria-hidden` since they are decorative by default.
 */
export function createIcon(displayName: string, children: React.ReactNode, filled = false) {
  const Icon = React.forwardRef<SVGSVGElement, IconProps>(function Icon(
    { size = 16, className, ...props },
    ref,
  ) {
    return (
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={filled ? "currentColor" : "none"}
        stroke={filled ? "none" : "currentColor"}
        strokeWidth={filled ? undefined : 2}
        strokeLinecap={filled ? undefined : "round"}
        strokeLinejoin={filled ? undefined : "round"}
        aria-hidden="true"
        className={cn(className)}
        {...props}
      >
        {children}
      </svg>
    );
  });
  Icon.displayName = displayName;
  return Icon;
}
