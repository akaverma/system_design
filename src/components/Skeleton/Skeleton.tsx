import * as React from "react";
import { cn } from "../../utils/cn";

export type SkeletonVariant = "text" | "circular" | "rectangular";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
  /** CSS width value (e.g. "100%", "240px") or a number of pixels. */
  width?: number | string;
  /** CSS height value (e.g. "1rem", "40px") or a number of pixels. */
  height?: number | string;
  className?: string;
}

const baseStyles = "animate-pulse bg-muted";

const variantStyles: Record<SkeletonVariant, string> = {
  text: "rounded-md",
  circular: "rounded-full",
  rectangular: "rounded-md",
};

/** Pulsing placeholder block for loading content. Purely decorative (`aria-hidden`). */
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
