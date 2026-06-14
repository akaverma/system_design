import { darkTheme, lightTheme, themeToCssVars, themes } from "../themes";

describe("themes", () => {
  it("exposes light and dark themes", () => {
    expect(themes.light).toBe(lightTheme);
    expect(themes.dark).toBe(darkTheme);
  });

  it("converts a theme into CSS custom properties", () => {
    const vars = themeToCssVars(lightTheme);

    expect(vars["--radius"]).toBe(lightTheme.radius);
    expect(vars["--color-primary"]).toBe(lightTheme.colors.primary);
    expect(vars["--color-background"]).toBe(lightTheme.colors.background);
  });

  it("produces distinct variables for light and dark themes", () => {
    const lightVars = themeToCssVars(lightTheme);
    const darkVars = themeToCssVars(darkTheme);

    expect(lightVars["--color-background"]).not.toBe(darkVars["--color-background"]);
  });
});
