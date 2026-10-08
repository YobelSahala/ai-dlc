# Design — Todo App

## Summary

- **Architecture**: Feature-based SPA (React + Vite), mobile-first, responsive
- **Stack**: TypeScript 5.5.3 / React 18.3.1 / TailwindCSS 3.4.6 / Zustand 4.5.4 / localStorage
- **Routing**: React Router 6.26.1
- **Forms**: React Hook Form 7.52.2 + Zod 3.23.8
- **Testing**: Vitest 2.0.5 + React Testing Library 16.0.0
- **Hosting**: Vercel (static SPA)
- **Components**: 7 designed
- **Entities**: 1 (Task)
- **API Endpoints**: None — localStorage only
- **Integrations**: localStorage (internal)
- **Operations**: Minimal (console logging + React Error Boundaries)
- **NFR**: Mobile performance ≥ Lighthouse 90, WCAG 2.1 AA

---

## Architecture

**Pattern**: Feature-based SPA with shared primitives layer

**Rationale**: 
- Feature-based grouping fits the 3 clear domains (dashboard, calendar, tasks)
- Zustand replaces Redux boilerplate for a solo developer
- localStorage persistence requires no backend for MVP — full offline capability
- Breakpoint at 1024px: single-column (mobile) ↔ two-column (desktop)

```
┌─────────────────────────────────────────────────────┐
│                    Browser                          │
│  ┌──────────────────────────────────────────────┐  │
│  │              React App (SPA)                 │  │
│  │                                              │  │
│  │  ┌──────────┐  ┌────────────┐  ┌─────────┐  │  │
│  │  │Dashboard │  │  Calendar  │  │  Tasks  │  │  │
│  │  │  Page    │  │    Page    │  │  Form   │  │  │
│  │  └────┬─────┘  └─────┬──────┘  └────┬────┘  │  │
│  │       └──────────────┼──────────────┘        │  │
│  │                      ▼                        │  │
│  │           ┌─────────────────────┐             │  │
│  │           │   Zustand TaskStore  │             │  │
│  │           └──────────┬──────────┘             │  │
│  │                      ▼                        │  │
│  │           ┌─────────────────────┐             │  │
│  │           │     localStorage     │             │  │
│  │           └─────────────────────┘             │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘

Mobile (<1024px)          Desktop (≥1024px)
┌────────────────┐        ┌──────────┬──────────────┐
│  Dashboard /   │        │Dashboard │  Calendar    │
│  Calendar /    │  →→→   │  Page    │   Page       │
│  Form          │        └──────────┴──────────────┘
│ [Bottom Nav]   │
└────────────────┘
```

---

## Components

See `design/components.md` for full detail.

| Component | Purpose | Stories |
|-----------|---------|---------|
| TaskStore (Zustand) | Global task state + localStorage persistence | All |
| DashboardPage | Home screen — greeting, stats, today's tasks | US-001, US-002, US-007 |
| CalendarPage | Weekly strip + daily timeline | US-009, US-010 |
| TaskFormPage | Add / Edit task form | US-003, US-004, US-006 |
| TaskDetailPage | Task detail + delete | US-004, US-005 |
| Shared UI Primitives | TaskCard, ProgressBar, SearchBar, ConfirmDialog, Button | US-002, US-006, US-008 |
| AppLayout + Router | Responsive layout + navigation | US-011 |

---

## Data Model

See `design/data-model.md` for full detail.

**Task** (localStorage JSON):
```typescript
interface Task {
  id: string;           // UUID v4
  title: string;        // 1–100 chars, required
  description: string;  // max 500 chars, optional
  date: string;         // YYYY-MM-DD
  time: string;         // HH:MM (24h)
  status: 'todo' | 'progress' | 'done';
  progress: number;     // 0–100
  createdAt: string;    // ISO 8601
  updatedAt: string;    // ISO 8601
}
```

**Business Rules**:
1. `progress === 100` → auto-set `status = "done"`
2. `status: progress → todo` → reset `progress = 0`
3. Progress field only editable when `status === "progress"`

---

## API Specification

No external API for MVP. All data operations are in-process via Zustand store actions:

| Operation | Method | Description |
|-----------|--------|-------------|
| `addTask` | store action | Creates task, assigns UUID, saves to localStorage |
| `updateTask` | store action | Patches task fields, updates `updatedAt`, saves |
| `deleteTask` | store action | Removes task by ID, saves |
| `tasksByDate` | selector | Filters tasks by `date` field |
| `tasksByStatus` | selector | Filters tasks by `status` field |
| `searchTasks` | selector | Case-insensitive filter on `title` |

---

## Integration Points

See `design/integration.md` for full detail.

| Integration | Type | Purpose |
|-------------|------|---------|
| localStorage | Browser API | Persist task data across sessions |

No external service integrations for MVP.

---

## Implementation

See `design/implementation.md` for full scaffold, directory structure, and dev setup.

**Key dependencies** (pinned versions):

```json
{
  "dependencies": {
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "react-router-dom": "6.26.1",
    "zustand": "4.5.4",
    "react-hook-form": "7.52.2",
    "zod": "3.23.8"
  },
  "devDependencies": {
    "typescript": "5.5.3",
    "vite": "5.3.4",
    "tailwindcss": "3.4.6",
    "vitest": "2.0.5",
    "@testing-library/react": "16.0.0",
    "@testing-library/user-event": "14.5.2"
  }
}
```

---

## Testing Strategy

See `design/testing-strategy.md` for full detail.

- **Unit tests**: Vitest — `dateUtils`, `storageUtils`, `taskStore` business rules
- **Component tests**: RTL — `TaskCard`, `TaskFormPage`, `WeekStrip`, `SearchBar`
- **Snapshot tests**: `TaskCard`, `ProgressBar`, `EmptyState`, `Button`
- **Coverage target**: 80% lines/functions overall

---

## NFR

| Requirement | Target | Implementation |
|-------------|--------|----------------|
| Mobile performance | Lighthouse ≥ 90 | Code splitting by route (React.lazy), no heavy libs |
| Accessibility | WCAG 2.1 AA | Semantic HTML, aria-labels, 4.5:1 contrast, keyboard nav |
| Offline | All tasks readable without internet | localStorage — no network dependency |
| Initial load | < 1s on 4G | Vite build optimizations, TailwindCSS purge, lazy routes |
| Responsive | 375px–1440px | TailwindCSS breakpoints: `sm:`, `lg:` (1024px two-column) |

---

## Operations

**Level**: Minimal

- **Error Boundaries**: React `<ErrorBoundary>` wraps each page-level component — catches render errors, shows fallback UI
- **Console logging**: Structured `console.warn` / `console.error` with `[component]` prefix
- **localStorage failure**: Graceful fallback to in-memory state with user-visible warning toast

---

## Traceability

| Requirement | Component(s) | Entity | Status |
|-------------|-------------|--------|--------|
| US-001 View Home Dashboard | DashboardPage, TaskStore | Task | ✅ Covered |
| US-002 View Today's Tasks | DashboardPage, TodayTaskList, TaskCard | Task | ✅ Covered |
| US-003 Add a New Task | TaskFormPage, TaskStore | Task | ✅ Covered |
| US-004 Edit an Existing Task | TaskFormPage, TaskDetailPage, TaskStore | Task | ✅ Covered |
| US-005 Delete a Task | TaskDetailPage, ConfirmDialog, TaskStore | Task | ✅ Covered |
| US-006 Update Task Progress | TaskFormPage, TaskDetailPage, ProgressBar, TaskStore | Task | ✅ Covered |
| US-007 Filter Tasks by Category | DashboardPage, CategoryFilter, TaskStore | Task | ✅ Covered |
| US-008 Search Tasks by Title | SearchBar, TaskStore | Task | ✅ Covered |
| US-009 View Weekly Calendar Strip | CalendarPage, WeekStrip | Task | ✅ Covered |
| US-010 View Daily Task Timeline | CalendarPage, TaskTimeline, TaskCard | Task | ✅ Covered |
| US-011 Two-Column Desktop Layout | AppLayout, Router | — | ✅ Covered |
| US-012 Accessibility and Performance | All components (NFR) | — | ✅ Covered |

**Coverage**: 12/12 stories covered. No gaps.

**Components without direct story** (infrastructure/shared):
- `BottomNav` — navigation scaffold (serves US-011)
- `EmptyState` — shared UI primitive (serves US-002, US-010)
- `Button` — shared primitive (serves all interactive stories)
