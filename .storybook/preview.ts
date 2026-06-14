import type { Preview } from "@storybook/react";
import React from "react";
import { ThemeProvider } from "../src/theme/ThemeProvider";
import "../src/styles.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#ffffff" },
        { name: "dark", value: "#0f172a" },
      ],
    },
    a11y: {
      test: "todo",
    },
  },
  globalTypes: {
    theme: {
      name: "Theme",
      description: "Global theme for components",
      defaultValue: "light",
      toolbar: {
        icon: "circlehollow",
        items: [
          { value: "light", icon: "sun", title: "Light" },
          { value: "dark", icon: "moon", title: "Dark" },
        ],
        showName: true,
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme ?? "light";
      document.documentElement.classList.toggle("dark", theme === "dark");
      document.body.style.background = theme === "dark" ? "#0f172a" : "#ffffff";

      return React.createElement(
        ThemeProvider,
        { key: theme, defaultTheme: theme, storageKey: "akarshit-ui-storybook-theme" },
        React.createElement(Story),
      );
    },
  ],
};

export default preview;
