import * as React from "react";
import { darkTheme, lightTheme, themeToCssVars, type Theme, type ThemeName } from "./themes";

/** A user-selectable theme preference, including automatic OS detection. */
export type ThemeMode = ThemeName | "system";

export interface ThemeProviderProps {
  /** Application content to render within the theme context. */
  children: React.ReactNode;
  /**
   * Initial theme mode, used before any stored preference is read.
   * @default "system"
   */
  defaultTheme?: ThemeMode;
  /**
   * `localStorage` key used to persist the user's theme preference.
   * @default "akarshit-ui-theme"
   */
  storageKey?: string;
  /**
   * Overrides for the built-in light/dark token sets, allowing consumers to
   * inject custom brand colors and radii.
   */
  themes?: Partial<Record<ThemeName, Theme>>;
}

export interface ThemeContextValue {
  /** The user's selected theme preference, which may be `"system"`. */
  theme: ThemeMode;
  /** The actual light/dark theme currently applied, with `"system"` resolved. */
  resolvedTheme: ThemeName;
  /** Updates the theme preference and persists it to `localStorage`. */
  setTheme: (theme: ThemeMode) => void;
}

export const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined);

function getSystemTheme(): ThemeName {
  if (typeof window === "undefined" || !window.matchMedia) return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/**
 * Provides theme state (light/dark/system) to the component tree and applies the
 * corresponding design tokens as CSS custom properties on `document.documentElement`,
 * along with a `dark` class for Tailwind's `darkMode: "class"` strategy.
 */
export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "akarshit-ui-theme",
  themes: themeOverrides,
}: ThemeProviderProps): React.JSX.Element {
  const [theme, setThemeState] = React.useState<ThemeMode>(() => {
    if (typeof window === "undefined") return defaultTheme;
    const stored = window.localStorage.getItem(storageKey);
    return (stored as ThemeMode | null) ?? defaultTheme;
  });

  const [systemTheme, setSystemTheme] = React.useState<ThemeName>(getSystemTheme);

  React.useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = () => setSystemTheme(media.matches ? "dark" : "light");
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  const resolvedTheme: ThemeName = theme === "system" ? systemTheme : theme;

  React.useEffect(() => {
    const base = resolvedTheme === "dark" ? darkTheme : lightTheme;
    const merged: Theme = {
      ...base,
      ...themeOverrides?.[resolvedTheme],
      colors: { ...base.colors, ...themeOverrides?.[resolvedTheme]?.colors },
    };

    const root = document.documentElement;
    root.classList.toggle("dark", resolvedTheme === "dark");

    const vars = themeToCssVars(merged);
    for (const [key, value] of Object.entries(vars)) {
      root.style.setProperty(key, value);
    }
  }, [resolvedTheme, themeOverrides]);

  const setTheme = React.useCallback(
    (next: ThemeMode) => {
      setThemeState(next);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(storageKey, next);
      }
    },
    [storageKey],
  );

  const value = React.useMemo<ThemeContextValue>(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
