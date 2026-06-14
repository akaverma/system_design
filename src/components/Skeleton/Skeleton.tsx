import * as React from "react";
import { cn } from "../../utils/cn";

/** Shape of the skeleton placeholder. */
export type SkeletonVariant = "text" | "circular" | "rectangular";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Shape of the skeleton placeholder.
   * @default "rectangular"
   */
  variant?: SkeletonVariant;
  /** Width of the skeleton. Accepts any CSS width value (e.g. "100%", "240px") or a number (px). */
  width?: number | string;
  /** Height of the skeleton. Accepts any CSS height value (e.g. "1rem", "40px") or a number (px). */
  height?: number | string;
  /** Additional class names merged with the component's default styles. */
  className?: string;
}

const baseStyles = "animate-pulse bg-muted";

const variantStyles: Record<SkeletonVariant, string> = {
  text: "rounded-md",
  circular: "rounded-full",
  rectangular: "rounded-md",
};

/**
 * A loading placeholder rendered as a pulsing block, used to indicate that
 * content is loading.
 *
 * Renders a purely decorative `<div>` (marked with `aria-hidden="true"`), so
 * it should be paired with a visible loading indicator or accessible label
 * elsewhere on the page when appropriate.
 *
 * @example
 * ```tsx
 * <Skeleton variant="circular" width={48} height={48} />
 * ```
 */
export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  { variant = "rectangular", width, height, className, style, ...props },
  ref,
) {
  const resolvedWidth = typeof width === "number" ? `${width}px` : width;
  const resolvedHeight =
    typeof height === "number"
      ? `${height}px`
      : height ?? (variant === "text" ? "1em" : undefined);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn(baseStyles, variantStyles[variant], className)}
      style={{ width: resolvedWidth, height: resolvedHeight, ...style }}
      {...props}
    />
  );
});
