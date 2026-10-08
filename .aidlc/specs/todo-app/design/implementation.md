# Implementation

## Code Organization

**Architecture Pattern**: Feature-based SPA with shared primitives layer
**Repository Type**: Single repo

### Directory Structure

```
todo-app/
├── public/
│   └── favicon.svg
├── src/
│   ├── main.tsx                    ← React DOM entry point
│   ├── App.tsx                     ← Router + AppLayout
│   ├── features/
│   │   ├── dashboard/
│   │   │   ├── DashboardPage.tsx   ← US-001, US-002, US-007
│   │   │   ├── TodayTaskList.tsx   ← US-002
│   │   │   └── CategoryFilter.tsx  ← US-007
│   │   ├── calendar/
│   │   │   ├── CalendarPage.tsx    ← US-009, US-010
│   │   │   ├── WeekStrip.tsx       ← US-009
│   │   │   └── TaskTimeline.tsx    ← US-010
│   │   └── tasks/
│   │       ├── TaskFormPage.tsx    ← US-003, US-004
│   │       ├── TaskDetailPage.tsx  ← US-005, US-006
│   │       └── taskSchema.ts       ← Zod validation schema
│   ├── components/                 ← Shared UI primitives
│   │   ├── TaskCard.tsx            ← US-002, US-010
│   │   ├── ProgressBar.tsx         ← US-006
│   │   ├── SearchBar.tsx           ← US-008
│   │   ├── ConfirmDialog.tsx       ← US-005
│   │   ├── EmptyState.tsx
│   │   ├── Button.tsx
│   │   └── BottomNav.tsx           ← US-011 (mobile nav)
│   ├── store/
│   │   └── taskStore.ts            ← Zustand store + localStorage persist
│   ├── utils/
│   │   ├── dateUtils.ts            ← Week generation, date formatting (Intl API)
│   │   ├── storageUtils.ts         ← localStorage read/write with try/catch
│   │   └── idUtils.ts              ← crypto.randomUUID() wrapper
│   └── types/
│       └── task.ts                 ← Task, TaskStatus, AppState interfaces
├── index.html
├── tailwind.config.ts
├── vite.config.ts
├── tsconfig.json
├── package.json
└── .env.example
```

### Module Boundaries

- `features/*` — may import from `components/`, `store/`, `utils/`, `types/`
- `components/` — may import from `types/` only. No store access. Pure presentational.
- `store/` — may import from `types/`, `utils/storageUtils`
- `utils/` — no imports from features or store (pure functions)
- No circular imports allowed

### Naming Conventions

- **Components**: PascalCase (`TaskCard.tsx`)
- **Hooks**: camelCase with `use` prefix (`useTasks`)
- **Utilities**: camelCase (`dateUtils.ts`)
- **Types/interfaces**: PascalCase (`Task`, `TaskStatus`)
- **Files**: kebab-case for non-component files (`task-schema.ts`), PascalCase for components
- **CSS**: Tailwind utility classes only — no custom CSS files except `index.css` for base reset

---

## Technology Stack

| Tool | Version | Purpose |
|------|---------|---------|
| React | 18.3.1 | UI framework |
| TypeScript | 5.5.3 | Type safety |
| Vite | 5.3.4 | Build tool + dev server |
| TailwindCSS | 3.4.6 | Utility-first CSS |
| Zustand | 4.5.4 | State management + localStorage persist |
| React Router | 6.26.1 | Client-side routing |
| React Hook Form | 7.52.2 | Form state + validation |
| Zod | 3.23.8 | Schema validation |
| Vitest | 2.0.5 | Unit + component test runner |
| React Testing Library | 16.0.0 | Component testing utilities |
| @testing-library/user-event | 14.5.2 | User interaction simulation |
| autoprefixer | 10.4.19 | CSS vendor prefixes |
| postcss | 8.4.40 | CSS processing |

> ⚠️ Versions marked as best-known at spec time — verify latest stable on npm before scaffolding.

---

## Development Setup

### Prerequisites

- Node.js ≥ 20.x (LTS)
- npm ≥ 10.x

### Setup Commands

```bash
# 1. Create project
npm create vite@latest todo-app -- --template react-ts
cd todo-app

# 2. Install dependencies
npm install zustand react-router-dom react-hook-form zod
npm install -D tailwindcss postcss autoprefixer vitest @vitest/coverage-v8 \
  @testing-library/react @testing-library/user-event @testing-library/jest-dom \
  jsdom

# 3. Initialize Tailwind
npx tailwindcss init -p

# 4. Start dev server
npm run dev
```

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_APP_NAME` | App display name | `My Tasks` |
| `VITE_STORAGE_KEY` | localStorage key | `todo-app-state` |

No secrets required for MVP.

---

## Testing

| Layer | Framework | Run Command | Coverage Target |
|-------|-----------|-------------|-----------------|
| Unit (utils, store) | Vitest | `npm run test` | 80% |
| Component | Vitest + RTL | `npm run test` | Key flows |
| Snapshot | Vitest | `npm run test` | TaskCard, ProgressBar |

### Vitest Config (`vite.config.ts` test block)

```typescript
test: {
  environment: 'jsdom',
  globals: true,
  setupFiles: ['./src/test/setup.ts'],
  coverage: {
    provider: 'v8',
    reporter: ['text', 'html'],
    include: ['src/**/*.{ts,tsx}'],
    exclude: ['src/main.tsx', 'src/types/**'],
    thresholds: { lines: 80, functions: 80 }
  }
}
```

### Test Setup (`src/test/setup.ts`)

```typescript
import '@testing-library/jest-dom';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });
```
