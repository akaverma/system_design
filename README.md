# @storybook-jest/ui

[![CI](https://github.com/akaverma/system_design/actions/workflows/ci.yml/badge.svg)](https://github.com/akaverma/system_design/actions/workflows/ci.yml)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?logo=tailwind-css&logoColor=white)
![Storybook](https://img.shields.io/badge/Storybook-8-FF4785?logo=storybook&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue)

A production-grade, accessible React component library and design system, built with
**TypeScript**, **Tailwind CSS**, and **Storybook**. Every component ships with full
keyboard support, ARIA roles, `forwardRef`, and an overridable `className`, so it drops
into any design system via CSS variable theming.

## Why this exists

Most component libraries either lock you into their design language or require a full
rewrite to theme. `@storybook-jest/ui` is built around a small set of **CSS custom properties**
(`--color-primary`, `--color-background`, `--radius`, etc.) so consumers can re-skin the
entire library — including dark mode — without touching component code.

## Installation

```bash
npm install @storybook-jest/ui
# or
pnpm add @storybook-jest/ui
# or
yarn add @storybook-jest/ui
```

`react` and `react-dom` (>=18) are peer dependencies and must be installed in your app.

Import the stylesheet once in your app's entry point (it includes Tailwind's base,
components, and utility layers plus the default light/dark token values):

```ts
import "@storybook-jest/ui/styles.css";
```

## Quick start

```tsx
import { Button, Input, ThemeProvider } from "@storybook-jest/ui";

export function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <Input label="Email" placeholder="you@example.com" />
      <Button variant="primary" onClick={() => console.log("clicked")}>
        Continue
      </Button>
    </ThemeProvider>
  );
}
```

## Theming

All colors are defined as HSL triplets on CSS custom properties and consumed by Tailwind
via `hsl(var(--color-x) / <alpha-value>)`, so opacity modifiers (`bg-primary/90`) work
out of the box.

### Light / dark mode

Wrap your app in `<ThemeProvider>`. It applies the `dark` class to `<html>` and writes
the resolved theme's tokens as CSS variables on `document.documentElement`.

```tsx
import { ThemeProvider, useTheme } from "@storybook-jest/ui";

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <button onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
      Toggle theme
    </button>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="my-app-theme">
      <ThemeToggle />
    </ThemeProvider>
  );
}
```

`defaultTheme` accepts `"light"`, `"dark"`, or `"system"` (follows the OS preference and
updates live). The chosen preference is persisted to `localStorage` under `storageKey`.

### Custom brand tokens

Override any token per theme by passing a `themes` prop:

```tsx
<ThemeProvider
  themes={{
    light: {
      name: "light",
      radius: "0.25rem",
      colors: {
        primary: "262 83% 58%", // violet
        "primary-foreground": "0 0% 100%",
      },
    },
  }}
>
  <App />
</ThemeProvider>
```

Tokens are defined in [`src/tokens`](./src/tokens) and the default light/dark palettes in
[`src/theme/themes.ts`](./src/theme/themes.ts).

## Components

| Component | Description                                                               | Storybook                                           |
| --------- | ------------------------------------------------------------------------- | --------------------------------------------------- |
| `Button`  | Primary/secondary/ghost/danger/link variants, sizes, loading state, icons | [Story](./src/components/Button/Button.stories.tsx) |
| `Input`   | Labeled text input with error/helper text and prefix/suffix slots         | [Story](./src/components/Input/Input.stories.tsx)   |

> More components (Badge, Modal, Toast, Select, and the rest of the 20+ component set) are
> actively being built — see the [project board](#) for status.

Run Storybook locally to browse every component with live controls:

```bash
npm run storybook
```

## Hooks

- `useTheme()` — read/update the current theme (`light` / `dark` / `system`).
- `useFocusTrap(active)` — traps and restores keyboard focus for modals/drawers.
- `useClickOutside(handler, active)` — fires a callback on outside clicks/taps.

## Development

```bash
npm install        # install dependencies
npm run storybook  # component playground at http://localhost:6006
npm run test       # run unit tests
npm run test:coverage
npm run lint
npm run typecheck
npm run build      # bundle the package with tsup -> dist/
```

### Project structure

```
src/
├── components/   # one folder per component: Component.tsx, .stories.tsx, .test.tsx, index.ts
├── tokens/        # color, typography, and spacing design tokens
├── theme/         # ThemeProvider + light/dark theme definitions
├── hooks/         # useTheme, useFocusTrap, useClickOutside
├── utils/         # cn() classname helper (clsx + tailwind-merge)
└── index.ts       # public package entry point
```

### Component checklist

Every component in this library:

1. Has a fully-documented TypeScript `Props` interface (JSDoc on every prop).
2. Supports `forwardRef` so consumers can access the underlying DOM node.
3. Accepts `className` for style overrides via `cn()` (clsx + tailwind-merge).
4. Implements correct ARIA roles and keyboard interactions.
5. Has a Storybook story covering every variant, with an autodocs Controls table.
6. Has unit tests covering rendering, props, interaction, and accessibility.

## Contributing

1. Fork and clone the repo, then `npm install`.
2. Create a new component folder under `src/components/<Name>/` following the structure
   above (`<Name>.tsx`, `<Name>.stories.tsx`, `<Name>.test.tsx`, `index.ts`).
3. Export the component from `src/index.ts`.
4. Run `npm run lint`, `npm run typecheck`, and `npm run test:coverage` — all must pass.
5. Open a pull request. CI runs lint, typecheck, tests (with coverage), the package
   build, and the Storybook build on every PR.

## License

MIT
