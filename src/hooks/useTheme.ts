import * as React from "react";
import { ThemeContext, type ThemeContextValue } from "../theme/ThemeProvider";

/**
 * Reads and updates the current theme. Must be used within a {@link ThemeProvider}.
 *
 * @example
 * ```tsx
 * const { resolvedTheme, setTheme } = useTheme();
 * <button onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")} />
 * ```
 */
export function useTheme(): ThemeContextValue {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a <ThemeProvider>");
  }
  return context;
}
