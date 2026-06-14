import type { ColorToken } from "../tokens";

/** A full set of color values for a theme, expressed as `"H S% L%"` HSL triplets. */
export type ThemeColors = Record<ColorToken, string>;

/** A named theme: a color palette plus a base border radius. */
export interface Theme {
  /** Human-readable theme name. */
  name: string;
  /** Color tokens as HSL triplets (e.g. `"222 47% 11%"`), consumed via `hsl(var(--color-x) / <alpha>)`. */
  colors: ThemeColors;
  /** Base border radius applied to the `--radius` CSS variable (e.g. `"0.5rem"`). */
  radius: string;
}

/** Default light theme. */
export const lightTheme: Theme = {
  name: "light",
  radius: "0.5rem",
  colors: {
    background: "0 0% 100%",
    foreground: "222 47% 11%",
    card: "0 0% 100%",
    "card-foreground": "222 47% 11%",
    popover: "0 0% 100%",
    "popover-foreground": "222 47% 11%",
    primary: "221 83% 53%",
    "primary-foreground": "210 40% 98%",
    secondary: "210 40% 96%",
    "secondary-foreground": "222 47% 11%",
    muted: "210 40% 96%",
    "muted-foreground": "215 16% 47%",
    accent: "210 40% 96%",
    "accent-foreground": "222 47% 11%",
    destructive: "0 84% 60%",
    "destructive-foreground": "210 40% 98%",
    success: "142 71% 45%",
    "success-foreground": "210 40% 98%",
    warning: "38 92% 50%",
    "warning-foreground": "222 47% 11%",
    info: "199 89% 48%",
    "info-foreground": "210 40% 98%",
    border: "214 32% 91%",
    input: "214 32% 91%",
    ring: "221 83% 53%",
  },
};

/** Default dark theme. */
export const darkTheme: Theme = {
  name: "dark",
  radius: "0.5rem",
  colors: {
    background: "222 47% 11%",
    foreground: "210 40% 98%",
    card: "222 47% 14%",
    "card-foreground": "210 40% 98%",
    popover: "222 47% 11%",
    "popover-foreground": "210 40% 98%",
    primary: "217 91% 60%",
    "primary-foreground": "222 47% 11%",
    secondary: "217 33% 17%",
    "secondary-foreground": "210 40% 98%",
    muted: "217 33% 17%",
    "muted-foreground": "215 20% 65%",
    accent: "217 33% 17%",
    "accent-foreground": "210 40% 98%",
    destructive: "0 63% 31%",
    "destructive-foreground": "210 40% 98%",
    success: "142 71% 45%",
    "success-foreground": "210 40% 98%",
    warning: "38 92% 50%",
    "warning-foreground": "222 47% 11%",
    info: "199 89% 48%",
    "info-foreground": "210 40% 98%",
    border: "217 33% 17%",
    input: "217 33% 17%",
    ring: "217 91% 60%",
  },
};

/** Built-in themes keyed by name. */
export const themes = {
  light: lightTheme,
  dark: darkTheme,
} as const;

/** Name of a built-in theme. */
export type ThemeName = keyof typeof themes;

/** Converts a {@link Theme} into a CSS custom property map (e.g. `{ "--color-primary": "221 83% 53%" }`). */
export function themeToCssVars(theme: Theme): Record<string, string> {
  const vars: Record<string, string> = { "--radius": theme.radius };
  for (const [token, value] of Object.entries(theme.colors)) {
    vars[`--color-${token}`] = value;
  }
  return vars;
}
