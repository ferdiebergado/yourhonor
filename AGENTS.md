# AI Agent Guide for netlify-fullstack

## Purpose

This repository is a fullstack TypeScript template for Netlify with a React + Vite frontend, backend function handlers, and Netlify edge middleware.

## Key commands

- `pnpm dev` — run local dev server via `netlify dev`
- `pnpm build` — run `tsc -b` then `vite build`
- `pnpm preview` — run `vite preview`
- `pnpm lint` — run `eslint .`
- `pnpm test` — run `vitest`
- `pnpm db:create` — initialize local SQLite database from `init.sql`
- `pnpm db:reset` — reset local SQLite database

## Important architecture

- `src/client/` — client-side React application and UI
- `src/client/app/` — React app shell, route definitions, provider, error boundary, and suspense wrappers
- `src/client/components/` — shared UI components and layout elements
- `src/client/features/auth/` — client auth API, React Query hooks, sign-in flow, and route guards
- `src/client/lib/` — client HTTP helpers and query client setup
- `src/server/` — shared server-side code, database, OAuth, session, and HTTP helpers
- `src/server/netlify/edge-functions/` — Netlify Edge Functions for request, json, session, csrf middleware
- `src/server/netlify/functions/` — Netlify Functions for API endpoints such as `/api/me`, `/api/signin`, `/api/signout`
- `src/shared/` — shared types, utils, and schema definitions used by both client and server
- `tests/` — integration tests, with helpers in `tests/helpers`

## React conventions

- Uses React 19 with `createRoot`, `StrictMode`, `BrowserRouter`, `React Query`, `Suspense`, and `ErrorBoundary`.
- Routes are defined in `src/client/app/routes.ts` using React Router v7 object route components and lazy loading.
- Route protection is implemented with `RequireUser` and `RequireGuest` wrapper components in `src/client/features/auth/components/`.
- Client auth state is managed through `useMe`, `useSignin`, and `useSignout` in `src/client/features/auth/hooks.ts`.
- The root provider is `src/client/app/provider.ts`, which wraps `QueryClientProvider`, `ThemeProvider`, and `BrowserRouter`.
- Keep auth and query cache updates aligned with existing React Query patterns to avoid stale UI state.

## Important configs

- `tsconfig.json` references `tsconfig.app.json`, `tsconfig.node.json`, and `tsconfig.edge-functions.json`
- Path aliases:
  - `@client/*` → `./src/client/*`
  - `@server/*` → `./src/server/*`
  - `@shared/*` → `./src/shared/*`
- React Compiler is enabled via `@vitejs/plugin-react` plus Babel `reactCompilerPreset`
- Vitest config in `vite.config.ts` defines separate `unit` and `integration` projects

## Netlify behavior

- `netlify.toml` configures build/publish and mappings:
  - `/api/*` is redirected to `/.netlify/functions/:splat`
  - app SPA fallback goes to `/index.html`
  - edge functions are mounted on `/api/*`
  - session middleware excludes `/api/signin`
- Local dev uses `pnpm dev` / `netlify dev`, while `netlify.toml` defines `vite` as the low-level `dev.command`
- Avoid breaking the `/api/*` routing and edge function paths without understanding Netlify route semantics

## Testing and conventions

- Use `src/server/**/*.{test,spec}.ts` for server-side unit tests
- Use `tests/integration/**/*.{test,spec}.ts` for integration tests
- Keep shared type/schema definitions in `src/shared/schemas` and `src/shared/types`

## Best practices for the agent

- Prefer changes that preserve Netlify routing and environment behavior
- Keep frontend and backend separation clear: `src/client/` is client-only and `src/server/` contain server-side logic
- Use existing code patterns for auth, session handling, and HTTP helpers
- If adding new API routes, follow the current `/api/*` Netlify function and edge middleware conventions

## Useful references

- `[README.md](README.md)` — project-level template notes
- `package.json` — scripts and dependency conventions
- `vite.config.ts` — alias configuration and Vitest projects
- `netlify.toml` — Netlify deployment and edge-function routing
