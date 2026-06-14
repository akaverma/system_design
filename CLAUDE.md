# @akarshit/ui — Project Context for Claude

This is a from-scratch, production-grade **React + TypeScript design system / component
library**, published as `@akarshit/ui`, intended as a Staff-level portfolio project.
GitHub repo: `git@github.com:akaverma/system_design.git` (pushed via SSH — HTTPS push
fails, no credential helper configured).

## Tech stack

- React 18 + TypeScript (strict mode), `"type": "module"` package
- Tailwind CSS 3, theming via CSS custom properties (HSL triplets)
- Storybook 8 (`@storybook/react-vite`), a11y addon enabled, light/dark toolbar toggle
- Jest + React Testing Library (`ts-jest`), 90% coverage threshold enforced
- tsup for bundling (dual ESM `dist/index.js` + CJS `dist/index.cjs` + `.d.ts` + `dist/styles.css`)
- ESLint (typescript-eslint, jsx-a11y, react-hooks, storybook) + Prettier (tailwind plugin)
- GitHub Actions: `ci.yml` (lint/typecheck/test/build/storybook-build on PR + push to main),
  `publish.yml` (npm publish on GitHub release, needs `NPM_TOKEN` secret),
  `deploy-storybook.yml` (deploys Storybook to GitHub Pages on push to main, base path
  `/system_design/` via `STORYBOOK_BASE_PATH` env var read in `.storybook/main.ts`)
- Storybook is live at `https://akaverma.github.io/system_design/` (Pages source = GitHub Actions)

## What exists so far

### Config / scaffolding (done)
- `package.json`, `tsconfig.json` (+ `tsconfig.test.json` for ts-jest, CommonJS), `tailwind.config.ts`,
  `postcss.config.js`, `tsup.config.ts`, `jest.config.cjs` (NOT `.ts` — ts-node not installed),
  `.eslintrc.json`, `.prettierrc`/`.prettierignore`, `.gitignore`

### Design tokens & theming (done)
- `src/tokens/{colors,typography,spacing}.ts` — semantic color token names, font scale, spacing/radius scale
- `src/theme/themes.ts` — `lightTheme`/`darkTheme` as HSL triplets, `themeToCssVars()`
- `src/theme/ThemeProvider.tsx` — `light` / `dark` / `system` modes, persists to `localStorage`,
  applies `dark` class + CSS vars to `document.documentElement`, supports per-theme token overrides
- `src/hooks/useTheme.ts` — context hook (throws if used outside provider)
- `src/styles.css` — `@tailwind` directives + `:root`/`.dark` fallback CSS vars (mirrors `themes.ts`)
- Tailwind colors are wired as `hsl(var(--color-x) / <alpha-value>)` so opacity modifiers work

### Hooks (done)
- `src/hooks/useFocusTrap.ts` — traps Tab/Shift+Tab focus in a container, restores focus on deactivate
- `src/hooks/useClickOutside.ts` — fires callback on outside mousedown/touchstart

### Utils (done)
- `src/utils/cn.ts` — `cn()` = `clsx` + `tailwind-merge`

### Icons (done) — `src/icons/`
- Dependency-free inline-SVG icon set via `createIcon()` factory (24x24 viewBox, `currentColor`,
  `aria-hidden="true"` by default, `size` prop, forwardRef)
- Icons: `CloseIcon`, `CheckIcon`, `CheckCircleIcon`, `InfoIcon`, `AlertTriangleIcon`,
  `AlertCircleIcon`, `ChevronDownIcon`, `SearchIcon`, `MailIcon`, `StarIcon`, `SpinnerIcon`
- Story: `Foundations/Icons` (AllIcons grid, Sizes, Colors)
- 100% test coverage in `icons.test.tsx`

### Components (done — pattern to replicate for future components)
Each component folder has `Component.tsx`, `Component.stories.tsx`, `Component.test.tsx`, `index.ts`.
All use `forwardRef`, accept `className` (merged via `cn()`), have JSDoc on every prop, and are
exported from `src/index.ts`.

- **Button** (`src/components/Button/`) — variants `primary | secondary | ghost | danger | link`,
  sizes `sm | md | lg`, `isLoading` (spinner + `aria-busy`), `iconLeft`/`iconRight`, defaults to
  `type="button"`. Story has per-variant/size/state stories + `iconLeft`/`iconRight`/`className`
  controls disabled (object-control bug, see "Gotchas" below).
- **Input** (`src/components/Input/`) — `label` (auto-generated unique `id`), `error` (role="alert",
  `aria-invalid`, `aria-describedby`), `helperText`, `prefix`/`suffix` adornments. `InputProps` omits
  `"size" | "prefix" | "suffix"` from `InputHTMLAttributes` (native attrs collide with these prop names).

### Barrel export
`src/index.ts` re-exports: components, theme (`ThemeProvider`, `themes`), hooks (`useTheme`,
`useFocusTrap`, `useClickOutside`), icons, tokens, `cn`.

## Gotchas / lessons learned (don't redo these mistakes)

1. **Jest config must be `.cjs`** (`jest.config.cjs`), not `.ts` — `ts-node` isn't installed and
   adding it wasn't worth it. `tsconfig.test.json` extends the root tsconfig with
   `module: CommonJS`, `moduleResolution: Node`, `noEmit: false` for `ts-jest`.
2. **`InputHTMLAttributes` has `prefix`/`suffix`/`size` built in** (typed as `string`) — any prop
   reusing those names must `Omit` them from the extended interface or TS errors.
3. **Storybook `argTypes` must explicitly set `control: false`** for any `ReactNode`/`className`
   prop without a declared control type. Otherwise Storybook renders a generic JSON "object"
   editor; if a user fills it in (e.g. `{ test: "test" }`), it gets passed directly as the prop
   and React throws error #31 ("objects are not valid as a React child"). Applied to
   `iconLeft`/`iconRight`/`className` (Button) and `prefix`/`suffix`/`className`/`containerClassName` (Input).
4. **`.storybook/main.ts` needs `createRequire(import.meta.url)`** for `require.resolve` —
   package.json has `"type": "module"` so bare `require` isn't available.
5. **Storybook deployed to a GitHub Pages subpath needs `viteFinal` to set `config.base`** —
   set via `STORYBOOK_BASE_PATH` env var (`/system_design/` in the deploy workflow), otherwise
   asset URLs resolve to `/` and the page is blank.
6. **WCAG contrast**: `--color-destructive` was originally `0 84% 60%` (3.61:1 against the
   `98%`-lightness foreground, failing AA's 4.5:1). Fixed by darkening to `0 84% 48%` (~4.6:1).
   When adding new color tokens, check contrast against their paired `-foreground` token.
7. **Git push uses SSH**, not HTTPS — `origin` is `git@github.com:akaverma/system_design.git`.
   HTTPS push fails with "could not read Username for 'https://github.com'".
8. Local git author auto-resolved to `Akarshit Verma <akaverma007@Akarshits-MacBook-Pro.local>`
   (no global `user.name`/`user.email` configured) — commits still succeed, just shows a warning.

## Commands

```bash
npm run storybook       # dev server at :6006
npm run build-storybook # static build -> storybook-static/
npm run build           # tsup -> dist/
npm test                # jest
npm run test:coverage   # jest --coverage (90% threshold)
npm run lint
npm run typecheck
```

## Remaining work (from original spec, not yet started)

The original ask was 20+ components. Only **Button** and **Input** are complete. Still to build,
following the exact same pattern (component + stories + tests + index, exported from
`src/index.ts`, `forwardRef`, `cn()`-merged `className`, ARIA, JSDoc props):

Badge, Modal, Toast (these three were called out as "start with these 5" along with Button/Input),
then Textarea, Select, Checkbox, Radio, Toggle, Drawer, Tooltip, Avatar, Card, Tabs, Accordion,
Spinner (icon already exists, may just need a wrapper component with size/label), Skeleton, Table,
Pagination, Alert.

Modal/Drawer should use `useFocusTrap` + `useClickOutside` (already built). Toast/Alert should use
the status icons in `src/icons` (`CheckCircleIcon`, `AlertTriangleIcon`, `AlertCircleIcon`, `InfoIcon`).

Chromatic visual regression testing was requested but not yet set up.
