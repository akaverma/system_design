import type { Config } from "tailwindcss";
import { colorTokens, fontFamily, fontSize, fontWeight, radius, spacing } from "./src/tokens";

/** Builds the Tailwind `colors` map from semantic tokens, e.g. `primary: "hsl(var(--color-primary) / <alpha-value>)"`. */
function buildColors() {
  const colors: Record<string, string> = {};
  for (const token of colorTokens) {
    colors[token] = `hsl(var(--color-${token}) / <alpha-value>)`;
  }
  return colors;
}

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}", "./.storybook/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: buildColors(),
      borderRadius: radius,
      spacing,
      fontFamily,
      fontSize,
      fontWeight,
    },
  },
  plugins: [],
};

export default config;
