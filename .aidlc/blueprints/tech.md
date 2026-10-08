# Tech Blueprint

## Summary
- **Stack**: TypeScript / React / TailwindCSS / localStorage
- **Architecture**: SPA, component-based, mobile-first
- **Infra**: Static hosting (Vercel / Netlify)

## Stack

- **Languages**: TypeScript
- **Frameworks**: React 18 (Vite), TailwindCSS v3
- **Build System**: Vite
- **Package Manager**: npm
- **Testing**: Vitest + React Testing Library

## Architecture

- **Pattern**: SPA — component-based with custom hooks for state
- **API Style**: None for MVP (localStorage); REST-ready interface for future backend

## Infrastructure

- **Cloud Provider**: TBD (Vercel or Netlify for static hosting)
- **Compute**: Static CDN
- **Database**: localStorage (browser)
- **IaC Tool**: N/A for MVP

## Patterns & Conventions

- **Architecture pattern**: Feature-based component structure — `features/tasks`, `features/calendar`, `features/dashboard`
- **Data access**: Custom hooks wrapping localStorage — `useTasks`, `useCalendar`
- **Error handling**: React error boundaries + graceful localStorage fallback
- **Validation**: Zod schemas for task form inputs
- **Code style**: ESLint + Prettier
- **Naming conventions**: PascalCase components, camelCase hooks/utils, kebab-case files

## Environment Configuration

- **Config approach**: `.env` for future API base URL
- **Environments**: development, production
- **Secrets management**: None for MVP

## CI/CD Pipeline

- **Tool**: GitHub Actions (TBD)
- **Stages**: lint → test → build → deploy
- **Deploy target**: Vercel / Netlify

## Dependency Management

- **Lockfile**: package-lock.json
- **Version strategy**: Exact pinned versions
