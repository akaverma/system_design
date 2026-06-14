import * as React from "react";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "../ThemeProvider";
import type { ThemeColors } from "../themes";
import { useTheme } from "../../hooks/useTheme";

function ThemeConsumer() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="resolved">{resolvedTheme}</span>
      <button onClick={() => setTheme("dark")}>Set dark</button>
      <button onClick={() => setTheme("light")}>Set light</button>
    </div>
  );
}

describe("ThemeProvider / useTheme", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.classList.remove("dark");
    document.documentElement.removeAttribute("style");
  });

  it("throws when useTheme is used outside a ThemeProvider", () => {
    function Bare() {
      useTheme();
      return null;
    }
    expect(() => render(<Bare />)).toThrow(/must be used within a <ThemeProvider>/);
  });

  it("defaults to the light theme when defaultTheme is 'light'", () => {
    render(
      <ThemeProvider defaultTheme="light">
        <ThemeConsumer />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("theme")).toHaveTextContent("light");
    expect(screen.getByTestId("resolved")).toHaveTextContent("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("applies the dark class and CSS variables for the dark theme", () => {
    render(
      <ThemeProvider defaultTheme="dark">
        <ThemeConsumer />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("resolved")).toHaveTextContent("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(document.documentElement.style.getPropertyValue("--color-primary")).toBe("217 91% 60%");
  });

  it("switches themes via setTheme and persists the choice to localStorage", async () => {
    const storageKey = "test-theme-key";
    render(
      <ThemeProvider defaultTheme="light" storageKey={storageKey}>
        <ThemeConsumer />
      </ThemeProvider>,
    );

    await userEvent.click(screen.getByText("Set dark"));

    expect(screen.getByTestId("resolved")).toHaveTextContent("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(window.localStorage.getItem(storageKey)).toBe("dark");
  });

  it("reads the persisted theme preference on mount", () => {
    const storageKey = "test-theme-key-2";
    window.localStorage.setItem(storageKey, "dark");

    render(
      <ThemeProvider defaultTheme="light" storageKey={storageKey}>
        <ThemeConsumer />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("theme")).toHaveTextContent("dark");
    expect(screen.getByTestId("resolved")).toHaveTextContent("dark");
  });

  it("applies custom theme color overrides", () => {
    render(
      <ThemeProvider
        defaultTheme="light"
        themes={{
          light: {
            name: "light",
            radius: "1rem",
            colors: { primary: "0 0% 0%" } as ThemeColors,
          },
        }}
      >
        <ThemeConsumer />
      </ThemeProvider>,
    );

    expect(document.documentElement.style.getPropertyValue("--color-primary")).toBe("0 0% 0%");
    expect(document.documentElement.style.getPropertyValue("--radius")).toBe("1rem");
  });

  it("resolves 'system' theme using prefers-color-scheme and reacts to changes", () => {
    const listeners: Array<(e: { matches: boolean }) => void> = [];
    const media = {
      matches: true,
      addEventListener: (_: string, listener: (e: { matches: boolean }) => void) =>
        listeners.push(listener),
      removeEventListener: jest.fn(),
    };
    window.matchMedia = jest
      .fn()
      .mockImplementation(() => media) as unknown as typeof window.matchMedia;

    render(
      <ThemeProvider defaultTheme="system" storageKey="system-theme-key">
        <ThemeConsumer />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("theme")).toHaveTextContent("system");
    expect(screen.getByTestId("resolved")).toHaveTextContent("dark");

    act(() => {
      media.matches = false;
      listeners.forEach((listener) => listener({ matches: false }));
    });

    expect(screen.getByTestId("resolved")).toHaveTextContent("light");
  });
});
