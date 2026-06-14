import * as React from "react";
import { cn } from "../../utils/cn";

export type AvatarSize = "sm" | "md" | "lg" | "xl";

export type AvatarShape = "circle" | "square";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  /** Also used to derive initials if `name` is not provided. */
  alt?: string;
  /** Used to derive fallback initials (first letters of up to the first two words). */
  name?: string;
  size?: AvatarSize;
  shape?: AvatarShape;
  className?: string;
}

const baseStyles =
  "relative inline-flex shrink-0 items-center justify-center overflow-hidden bg-muted " +
  "text-muted-foreground font-medium select-none";

const shapeStyles: Record<AvatarShape, string> = {
  circle: "rounded-full",
  square: "rounded-md",
};

const sizeStyles: Record<AvatarSize, string> = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
};

/** Up to two uppercase initials from a display name. */
function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "";
  const first = words[0] ?? "";
  if (words.length === 1) return first.charAt(0).toUpperCase();
  const last = words[words.length - 1] ?? "";
  return (first.charAt(0) + last.charAt(0)).toUpperCase();
}

function PlaceholderIcon() {
  return (
    <svg
      className="h-3/5 w-3/5"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.418 0-8 2.239-8 5v1a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1c0-2.761-3.582-5-8-5Z" />
    </svg>
  );
}

/**
 * Falls back from an image to initials derived from `name`, and finally to a
 * generic placeholder icon.
 */
export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(function Avatar(
  { src, alt, name, size = "md", shape = "circle", className, ...props },
  ref,
) {
  const [imageErrored, setImageErrored] = React.useState(false);
  const rootClassName = cn(baseStyles, shapeStyles[shape], sizeStyles[size], className);

  if (src && !imageErrored) {
    return (
      <div ref={ref} className={rootClassName} {...props}>
        <img
          src={src}
          alt={alt ?? name ?? ""}
          className="h-full w-full object-cover"
          onError={() => setImageErrored(true)}
        />
      </div>
    );
  }

  const initials = name ? getInitials(name) : "";

  return (
    <div ref={ref} role="img" aria-label={alt ?? name} className={rootClassName} {...props}>
      {initials || <PlaceholderIcon />}
    </div>
  );
});
