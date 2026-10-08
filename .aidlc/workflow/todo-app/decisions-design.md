# Design Decisions

## Context Summary
- **Feature**: Mobile-first Todo app — dashboard, CRUD, calendar view, progress tracking
- **Type**: Greenfield SPA
- **Scope**: new (full workflow)
- **Stack**: TypeScript / React / TailwindCSS
- **Persistence**: localStorage (no backend for MVP)
- **Team**: Solo developer
- **NFR**: Mobile performance + WCAG 2.1 AA

---

## Decision Questions

### D3-1: Frontend Framework
**Question**: Which React-based framework should be used?
- 1) React + Vite (SPA) — fast build, minimal config, ideal for localStorage-only apps **(Recommended)**
- 2) Next.js — SSR/SSG capable, adds complexity not needed for MVP
- 3) Remix — server-first, overkill for localStorage MVP
- 4) Other (please specify): _______

**Answer**: 1) React + Vite (SPA)

---

### D3-2: State Management
**Question**: How should global app state be managed?
- 1) React Context API + useReducer — built-in, sufficient for small apps
- 2) Zustand — lightweight (~1kb), minimal boilerplate, easy localStorage sync **(Recommended)**
- 3) Redux Toolkit — mature but heavy for solo MVP
- 4) Other (please specify): _______

**Answer**: 2) Zustand

---

### D3-3: UI Component Library
**Question**: Which UI approach for components?
- 1) TailwindCSS only — utility classes, full design control **(Recommended)** — matches custom UI reference
- 2) TailwindCSS + shadcn/ui — headless accessible primitives + Tailwind
- 3) TailwindCSS + Headless UI — accessibility-first primitives
- 4) Other (please specify): _______

**Answer**: 1) TailwindCSS only

---

### D3-4: Form Handling
**Question**: How should the Add/Edit Task form be handled?
- 1) React Hook Form + Zod — lightweight, schema-based validation **(Recommended)**
- 2) Formik + Yup — more verbose but well-known
- 3) Controlled components with native validation — no library
- 4) Other (please specify): _______

**Answer**: 1) React Hook Form + Zod

---

### D3-5: Routing
**Question**: Which routing library for navigation between views?
- 1) React Router v6 — standard SPA routing **(Recommended)**
- 2) TanStack Router — type-safe, newer
- 3) No router — single-page with conditional rendering
- 4) Other (please specify): _______

**Answer**: 1) React Router v6

---

### D3-6: Data Persistence Strategy
**Question**: How should localStorage interactions be structured?
- 1) Direct localStorage calls inline in components — simple but hard to test
- 2) Custom hooks (useTasks, useCalendar) wrapping localStorage — testable, clean **(Recommended)**
- 3) Repository pattern — abstract class over localStorage, ready for future backend swap
- 4) Other (please specify): _______

**Answer**: 2) Custom hooks wrapping localStorage

---

### D3-7: Testing Strategy
**Question**: What testing approach for this project?
- 1) Unit tests only — Vitest for hooks and utilities
- 2) Unit + component tests — Vitest + React Testing Library **(Recommended)**
- 3) Unit + component + E2E — Vitest + RTL + Playwright (thorough but slower solo)
- 4) Other (please specify): _______

**Answer**: 2) Unit + component tests — Vitest + React Testing Library

---

### D3-8: Date/Time Handling
**Question**: How should dates and times be handled?
- 1) Native JS Date + Intl API — zero dependencies **(Recommended)** — sufficient for week strip + timeline
- 2) date-fns — utility functions, tree-shakeable
- 3) dayjs — lightweight Moment.js alternative
- 4) Other (please specify): _______

**Answer**: 1) Native JS Date + Intl API

---

### D3-9: Hosting / Deployment
**Question**: Where will the app be deployed?
- 1) Vercel — zero-config, free tier, instant deploys **(Recommended)**
- 2) Netlify — similar to Vercel, free tier
- 3) GitHub Pages — free, static only
- 4) Other (please specify): _______

**Answer**: 1) Vercel

---

### D3-10: Observability Strategy
**Question**: What level of observability does this app need?
- 1) Minimal — structured console logging only (sufficient for solo MVP) **(Recommended)**
- 2) Standard — logging + error boundary reporting
- 3) Full — Sentry error tracking + analytics
- 4) None — skip entirely

**Answer**: 1) Minimal — structured console logging only

---

### D3-11: Error Tracking
**Question**: How should runtime errors be captured?
- 1) Log-based only — React Error Boundaries + console.error **(Recommended for solo MVP)**
- 2) Dedicated error tracking — Sentry free tier
- 3) None — no error tracking
- 4) Other (please specify): _______

**Answer**: 1) Log-based only — React Error Boundaries + console.error

---

### D3-12: Correctness & Testing Approach
**Question**: Which correctness verification strategy should be used?
- 1) Unit tests for business logic (hook/util level) only
- 2) Unit tests + snapshot tests for key components **(Recommended)**
- 3) Unit tests + property-based tests (fast-check) for data transformations
- 4) Other (please specify): _______

**Answer**: 2) Unit tests + snapshot tests for key components

---

## Decisions Summary
- D3-1 Framework: React + Vite (SPA)
- D3-2 State Management: Zustand
- D3-3 UI Library: TailwindCSS only
- D3-4 Form Handling: React Hook Form + Zod
- D3-5 Routing: React Router v6
- D3-6 Persistence: Custom hooks wrapping localStorage
- D3-7 Testing: Vitest + React Testing Library
- D3-8 Date/Time: Native JS Date + Intl API
- D3-9 Hosting: Vercel
- D3-10 Observability: Minimal — structured console logging only
- D3-11 Error Tracking: Log-based only — React Error Boundaries
- D3-12 Correctness: Unit tests + snapshot tests for key components

---

**Instructions**: Fill in your answers above and respond with "done"
