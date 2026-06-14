# @storybook-jest/ui — Project Context for Claude

This is a from-scratch, production-grade **React + TypeScript design system / component
library**, published as `@storybook-jest/ui`, intended as a Staff-level portfolio project.
GitHub repo: `git@github.com:akaverma/system_design.git` (pushed via SSH — HTTPS push
fails, no credential helper configured).

## Tech stack

- React 18 + TypeScript (strict mode), `"type": "module"` package
- Tailwind CSS 3, theming via CSS custom properties (HSL triplets)
- Storybook 8 (`@storybook/react-vite`), a11y addon enabled, light/dark toolbar toggle
- Jest + React Testing Library (`ts-jest`), 90% coverage threshold enforced
- tsup for bundling (dual ESM `dist/index.js` + CJS `dist/index.cjs` + `.d.ts` + `dist/styles.css`)
- ESLint (typescript-eslint, jsx-a11y, react-hooks, storybook) + Prettier (tailwind plugin)
- GitHub Actions: single workflow `deploy-storybook.yml` — `build` job runs
  lint/typecheck/test/build/storybook-build on PRs and pushes to `main`; `deploy` job (push to
  `main` only) deploys Storybook to GitHub Pages, base path `/system_design/` via
  `STORYBOOK_BASE_PATH` env var read in `.storybook/main.ts`. `ci.yml` and `publish.yml` were
  removed (publish.yml needed an `NPM_TOKEN` secret that was never set up and never ran since it
  only triggered on GitHub releases).
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

### Components (all 21 done)
Each component folder has `Component.tsx`, `Component.stories.tsx`, `Component.test.tsx`, `index.ts`.
All use `forwardRef` (except `Modal`/`Drawer`/`Tooltip`, which have no single host element to
forward to before/around their portal/clone), accept `className` (merged via `cn()`), and are
exported from `src/index.ts`. JSDoc is kept to short one-liners only where a prop's behavior isn't
obvious from its name/type. Global coverage is 98.6% stmts / 95.76% branches (threshold 80%/90%),
476 tests across 26 suites.

Components that generate an element id for label/aria association (Input, Textarea, Checkbox,
Radio, Select, Modal, Drawer, Tooltip) use `React.useId()` rather than a hand-rolled
counter/`useUniqueId` helper.

- **Button** (`src/components/Button/`) — variants `primary | secondary | ghost | danger | link`,
  sizes `sm | md | lg`, `isLoading` (spinner + `aria-busy`), `iconLeft`/`iconRight`, defaults to
  `type="button"`.
- **Input** (`src/components/Input/`) — `label` (auto-generated unique `id`), `error` (role="alert",
  `aria-invalid`, `aria-describedby`), `helperText`, `prefix`/`suffix` adornments. `InputProps` omits
  `"size" | "prefix" | "suffix"` from `InputHTMLAttributes`.
- **Badge** (`src/components/Badge/`) — variants `default | primary | secondary | success | warning |
  danger | info | outline`, sizes `sm | md | lg`.
- **Spinner** (`src/components/Spinner/`) — wraps `SpinnerIcon`, sizes `sm | md | lg | xl`,
  `role="status"` + `sr-only` `label` (default "Loading").
- **Skeleton** (`src/components/Skeleton/`) — variants `text | circular | rectangular`,
  numeric/string `width`/`height`, `animate-pulse bg-muted`, `aria-hidden`.
- **Avatar** (`src/components/Avatar/`) — `src`/`alt`/`name` with `onError` fallback to initials
  (first letters of first/last word) then a generic person-silhouette icon; sizes `sm | md | lg | xl`,
  shapes `circle | square`.
- **Toggle** (`src/components/Toggle/`) — `<button role="switch" aria-checked>` (not a checkbox
  input), controlled (`checked`/`onCheckedChange`) or uncontrolled (`defaultChecked`), sizes
  `sm | md | lg`.
- **Checkbox** (`src/components/Checkbox/`) — visually-hidden `<input type="checkbox" className="peer
  sr-only">` + styled `<span>` box using `peer-*` variants and `CheckIcon`; `indeterminate` set
  imperatively via merged ref + `useEffect` (it's a DOM property, not an attribute); label/error/
  helperText pattern like Input.
- **Radio** (`src/components/Radio/`) — exports `Radio` + `RadioGroup`. `RadioGroup` is a
  `React.createContext` provider supplying `name`/`value`/`onChange` to child `Radio`s (controlled
  or uncontrolled via `defaultValue`); a bare `Radio` outside a group falls back to its own props.
- **Textarea** (`src/components/Textarea/`) — Input-style label/error/helperText for `<textarea>`,
  plus `resize: "none" | "vertical" | "horizontal" | "both"` (default `"vertical"`).
- **Select** (`src/components/Select/`) — native `<select appearance-none>` + `ChevronDownIcon`
  decoration, `options`/`SelectOption[]` or `children` `<option>`s, `placeholder` (disabled+hidden
  empty option), Input-style label/error/helperText.
- **Card** (`src/components/Card/`) — composable: `Card`, `CardHeader`, `CardTitle` (has an
  eslint-disable for `jsx-a11y/heading-has-content` since content comes via spread `props`),
  `CardDescription`, `CardContent`, `CardFooter`.
- **Modal** (`src/components/Modal/`) — `isOpen`/`onClose`, portal to `document.body` via
  `createPortal` (renders `null` when closed), `useFocusTrap`, ESC-to-close, overlay-click-to-close
  (target-check, not `useClickOutside`), sizes `sm | md | lg | xl | full`. Overlay div has an
  eslint-disable for `jsx-a11y/click-events-have-key-events`/`no-static-element-interactions`
  (decorative; ESC + close button cover keyboard access).
- **Drawer** (`src/components/Drawer/`) — same portal/focus-trap/ESC pattern as Modal but slides in
  from `position: "left" | "right" | "top" | "bottom"`, `size: "sm" | "md" | "lg" | "full"` (width
  for left/right, height for top/bottom). Deliberately duplicates Modal's overlay logic rather than
  sharing, to keep each component self-contained.
- **Tooltip** (`src/components/Tooltip/`) — wraps a single child via `React.cloneElement`, composes
  existing hover/focus/blur handlers, `position: "top" | "bottom" | "left" | "right"`, `delay`
  (default 200ms) via `setTimeout`, `role="tooltip"` + `aria-describedby`.
- **Tabs** (`src/components/Tabs/`) — compound `Tabs`/`TabList`/`Tab`/`TabPanel` via context, WAI-ARIA
  tabs pattern with full arrow-key/Home/End navigation + automatic activation (`.focus()` +
  `.click()`). `TabList` div needs `tabIndex={-1}` for `jsx-a11y/interactive-supports-focus`.
- **Accordion** (`src/components/Accordion/`) — compound `Accordion`/`AccordionItem`/
  `AccordionTrigger`/`AccordionContent` via nested contexts, `type: "single" | "multiple"`,
  `collapsible`, controlled/uncontrolled, `ChevronDownIcon` rotates via `isOpen`.
- **Table** (`src/components/Table/`) — shadcn-style wrappers: `Table` (wraps `<table>` in an
  `overflow-auto` div but forwards the ref to the `<table>` itself), `TableHeader`, `TableBody`,
  `TableFooter`, `TableRow`, `TableHead`, `TableCell`, `TableCaption`.
- **Pagination** (`src/components/Pagination/`) — `<nav aria-label="Pagination">`, exports the pure
  `getPageRange(currentPage, totalPages, siblingCount = 1)` helper (returns `(number | "ellipsis")[]`)
  separately for unit testing, `aria-current="page"`, prev/next with `aria-label`s and
  disabled-at-boundaries.
- **Toast** (`src/components/Toast/`) — presentational `Toast` (`role="status"` `aria-live="polite"`,
  variant icons from status icons) + `ToastProvider`/`useToast()` managing a queue, portal viewport
  fixed top-right, auto-dismiss via `setTimeout` (duration `0` disables it, default 5000ms).
- **Alert** (`src/components/Alert/`) — inline banner, `variant: "default" | "success" | "warning" |
  "danger" | "info"`, `role="alert"` only for `"danger"` (else `"status"`), `AlertProps` omits
  `"title"` from `HTMLAttributes` (collides with native `title` tooltip attribute), optional
  `onDismiss` close button, status icons (no icon for `"default"`).

### Barrel export
`src/index.ts` re-exports all 21 components (alphabetical), theme (`ThemeProvider`, `themes`), hooks
(`useTheme`, `useFocusTrap`, `useClickOutside`), icons, tokens, `cn`.

### Visual regression (Chromatic)
- `chromatic` devDependency and `npm run chromatic` script (`chromatic --exit-zero-on-changes`) are
  still present for local/manual use.
- The `.github/workflows/chromatic.yml` CI workflow was removed — it required
  `secrets.CHROMATIC_PROJECT_TOKEN`, which was never created, so the check failed on every PR/push.
  If visual regression CI is wanted later: create a project at chromatic.com (link the GitHub repo),
  add the resulting token as a repo secret named `CHROMATIC_PROJECT_TOKEN`, then re-add a workflow
  that runs `chromatic-com/chromatic@v11` with `projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}`
  on PRs and pushes to `main`.

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

## Remaining work

All 21 components from the original spec are built, tested, exported, lint-clean, and pass
`build`/`build-storybook`. Chromatic CI is not set up (see "Visual regression (Chromatic)" above) —
optional follow-up if visual regression testing is wanted later.
