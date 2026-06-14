/**
 * Color design tokens.
 *
 * Each semantic token maps to a CSS custom property which is defined per-theme
 * in `src/theme/themes.ts`. Values are stored as "H S% L%" triplets (without the
 * `hsl()` wrapper) so Tailwind can apply alpha transparency via
 * `hsl(var(--color-x) / <alpha-value>)`.
 */

/** Semantic color token names exposed as CSS variables and Tailwind colors. */
export const colorTokens = [
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "destructive-foreground",
  "success",
  "success-foreground",
  "warning",
  "warning-foreground",
  "info",
  "info-foreground",
  "border",
  "input",
  "ring",
] as const;

export type ColorToken = (typeof colorTokens)[number];

/** Maps a {@link ColorToken} to the CSS variable used to read its value. */
export const colorVar = (token: ColorToken): string => `var(--color-${token})`;
