# Tasks — Todo App

## Summary

- **Total Tasks**: 22 across 6 phases
- **Execution Waves**: 3 waves (Wave 0: scaffold, Wave 1: foundation layer, Wave 2: features)
- **Coverage**: 7 components, 1 entity, 0 external endpoints
- **Testing**: 6 unit, 5 component (RTL), 3 snapshot tasks
- **Strategy**: Layer-by-layer, test-after, execution waves, vertical slice priority

---

## Overview

**Strategy rationale**: Wave 0 scaffolds the project so all other tasks can run independently. Wave 1 builds the foundation layer (types, utils, store) that features depend on. Wave 2 builds feature components in parallel slices — dashboard, calendar, and task form are independent once the store exists.

**Checkbox legend**:
- `- [ ]` Phase header
- `  - [ ]` Task
- Plain items: implementation details, deps, refs

**Derived from**: `design.md`, `design/components.md`, `design/data-model.md`, `design/implementation.md`, `design/testing-strategy.md`

---

## Task Phases

- [ ] 0. Project Scaffold & Tooling

  - [x] 0.1 Initialize Vite + React + TypeScript project
    - **Deps**: none
    - **Ref**: `design/implementation.md` — Development Setup
    - Run `npm create vite@latest todo-app -- --template react-ts`
    - Install all dependencies: zustand, react-router-dom, react-hook-form, zod
    - Install devDependencies: tailwindcss, postcss, autoprefixer, vitest, @testing-library/react, @testing-library/user-event, @testing-library/jest-dom, jsdom, @vitest/coverage-v8
    - Initialize TailwindCSS: `npx tailwindcss init -p`
    - Configure `tailwind.config.ts` with content paths and custom color tokens
    - Configure `vite.config.ts` with test block (jsdom, globals, setupFiles, coverage)
    - Create `src/test/setup.ts` with localStorage mock and jest-dom import
    - Create `.env.example` with `VITE_APP_NAME` and `VITE_STORAGE_KEY`
    - Verify dev server runs: `npm run dev`

  - [x] 0.2 Configure project structure and base styles
    - **Deps**: 0.1
    - **Ref**: `design/implementation.md` — Directory Structure
    - Create all directories: `src/features/dashboard/`, `src/features/calendar/`, `src/features/tasks/`, `src/components/`, `src/store/`, `src/utils/`, `src/types/`
    - Set up `src/index.css` with Tailwind directives (`@tailwind base/components/utilities`)
    - Configure Tailwind custom colors matching UI reference palette:
      - `primary`: `#4B6EF5` (blue CTA, active day)
      - `danger`: `#E84E6A` (urgent/active tasks)
      - `heading`: `#1A1A4E` (deep navy)
      - `surface`: `#F7F7FB` (page background)
    - Add Google Fonts (Inter) to `index.html`
    - Verify Tailwind classes apply in a smoke-test component

- [ ] 1. Foundation Layer (Types, Utils, Store)

  - [x] 1.1 Define TypeScript types
    - **Deps**: 0.2
    - **Ref**: `design/data-model.md` — Entities
    - Create `src/types/task.ts`:
      - `type TaskStatus = 'todo' | 'progress' | 'done'`
      - `interface Task { id, title, description, date, time, status, progress, createdAt, updatedAt }`
      - `interface AppState { tasks: Task[]; version: number }`

  - [x] 1.2 Implement date utilities
    - **Deps**: 1.1
    - **Ref**: `design/components.md` — CalendarPage; `design/data-model.md` — Access Patterns
    - Create `src/utils/dateUtils.ts`:
      - `getWeekDays(date: Date): { date: string; label: string; dayNum: number }[]` — returns Mon–Sun of the week containing `date`
      - `isToday(dateStr: string): boolean`
      - `formatTime(time: string): string` — converts `"14:30"` → `"2:30 PM"`
      - `formatMonthLabel(date: Date): string` — `"October 2026"`
      - `getTodayString(): string` — returns `YYYY-MM-DD`

  - [x] 1.3 Implement storage utilities
    - **Deps**: 1.1
    - **Ref**: `design/integration.md` — Internal Integration: Zustand ↔ localStorage
    - Create `src/utils/storageUtils.ts`:
      - `safeRead<T>(key: string, fallback: T): T` — wraps `localStorage.getItem` with try/catch
      - `safeWrite(key: string, value: unknown): void` — wraps `localStorage.setItem` with try/catch + console.warn on failure
    - Create `src/utils/idUtils.ts`:
      - `generateId(): string` — wraps `crypto.randomUUID()`

  - [x] 1.4 Implement Zustand TaskStore
    - **Deps**: 1.1, 1.3
    - **Ref**: `design/components.md` — Component 1: TaskStore
    - Create `src/store/taskStore.ts` with Zustand `persist` middleware:
      - State: `tasks: Task[]`
      - Actions: `addTask`, `updateTask`, `deleteTask`
      - Selectors: `tasksByDate(date)`, `tasksByStatus(status)`, `searchTasks(query)`
      - Business rules:
        - `addTask`: generate UUID, set `createdAt`/`updatedAt`
        - `updateTask`: auto-set `status='done'` when `progress===100`; reset `progress=0` when `status` changes `progress→todo`
        - Persist key: `VITE_STORAGE_KEY` env var (fallback: `'todo-app-state'`)

  - [x] 1.5 Implement Zod task schema
    - **Deps**: 1.1
    - **Ref**: `design/data-model.md` — Validation Rules
    - Create `src/features/tasks/taskSchema.ts` with Zod schema for task form fields
    - Export `taskSchema` and `TaskFormValues` inferred type

  - [x] 1.6 Unit tests: utils and store
    - **Deps**: 1.2, 1.3, 1.4, 1.5
    - **Ref**: `design/testing-strategy.md` — Layer 1: Unit Tests
    - Create `src/utils/__tests__/dateUtils.test.ts` — test `getWeekDays`, `isToday`, `formatTime`, `formatMonthLabel`
    - Create `src/utils/__tests__/storageUtils.test.ts` — test success path + localStorage unavailable fallback
    - Create `src/store/__tests__/taskStore.test.ts`:
      - `addTask` creates task with UUID and timestamps
      - `updateTask progress=100` auto-sets `status='done'`
      - `updateTask status: progress→todo` resets `progress=0`
      - `deleteTask` removes task from array
      - `searchTasks` is case-insensitive
      - `tasksByDate` filters correctly
      - `tasksByStatus` filters correctly

- [ ] 2. Shared UI Primitives

  - [x] 2.1 Build shared primitive components
    - **Deps**: 0.2
    - **Ref**: `design/components.md` — Component 6: Shared UI Primitives
    - Create `src/components/Button.tsx` — primary/secondary/ghost variants, accessible (`aria-label` support)
    - Create `src/components/ProgressBar.tsx` — filled bar proportional to `value` prop (0–100) + percentage label
    - Create `src/components/EmptyState.tsx` — icon + `message` prop
    - Create `src/components/ConfirmDialog.tsx` — modal overlay, `onConfirm`/`onCancel` callbacks, keyboard-accessible (Escape closes)
    - Create `src/components/SearchBar.tsx` — debounced input (150ms), calls `onSearch(query)` prop
    - Create `src/components/TaskCard.tsx` — accepts `task: Task`, renders title, time, progress bar, color-coded background by status
    - Create `src/components/BottomNav.tsx` — mobile bottom nav tabs: Home `/`, Calendar `/calendar`, Add `/tasks/new`

  - [x] 2.2 Component + snapshot tests: shared primitives
    - **Deps**: 2.1
    - **Ref**: `design/testing-strategy.md` — Layer 2 & 3
    - `TaskCard.test.tsx`: renders title, time, progress bar; correct status color class
    - `ProgressBar.test.tsx`: correct fill width % and label
    - `SearchBar.test.tsx`: calls `onSearch` after 150ms debounce, not on every keystroke
    - `ConfirmDialog.test.tsx`: calls `onConfirm`/`onCancel`; Escape closes
    - Snapshot tests: `TaskCard`, `ProgressBar`, `EmptyState`, `Button`

- [ ] 3. App Layout & Routing

  - [x] 3.1 Set up React Router and responsive layout
    - **Deps**: 2.1
    - **Ref**: `design/components.md` — Component 7: AppLayout + Router; `design.md` — Architecture
    - Create `src/App.tsx` with React Router v6 `<BrowserRouter>`:
      - Routes: `/` → DashboardPage, `/calendar` → CalendarPage, `/tasks/new` → TaskFormPage, `/tasks/:id` → TaskDetailPage, `/tasks/:id/edit` → TaskFormPage
    - Implement responsive layout in `App.tsx`:
      - Mobile (<1024px): single column + `BottomNav` at bottom
      - Desktop (≥1024px): two-column grid — DashboardPage left (fixed), CalendarPage right (content area); hide BottomNav
    - Wrap routes in React `<ErrorBoundary>` with fallback UI
    - Update `src/main.tsx` to render `<App />`

- [ ] 4. Feature: Dashboard

  - [x] 4.1 Build DashboardPage
    - **Deps**: 1.4, 2.1, 3.1
    - **Ref**: `design/components.md` — Component 2: DashboardPage; US-001, US-002, US-007
    - Create `src/features/dashboard/CategoryFilter.tsx`:
      - Three icon buttons (To-Do / Progress / Done) with task counts from TaskStore
      - Active filter visually highlighted; tap to toggle
    - Create `src/features/dashboard/TodayTaskList.tsx`:
      - Horizontally scrollable row of `TaskCard` components for today's tasks
      - Empty state when no tasks today
    - Create `src/features/dashboard/DashboardPage.tsx`:
      - Greeting: "Good Morning/Afternoon/Evening" based on `getHours()`
      - Monthly task count from `tasksByDate` across current month
      - `SearchBar` wired to `taskStore.searchTasks()`
      - `CategoryFilter` with filter state (local `useState`)
      - `TodayTaskList` filtered by active category

  - [x] 4.2 Component tests: DashboardPage
    - **Deps**: 4.1
    - **Ref**: `design/testing-strategy.md` — Layer 2
    - `DashboardPage.test.tsx`: renders greeting, task count, today's tasks list
    - `CategoryFilter.test.tsx`: highlights active filter, calls onFilter, toggles off on re-tap
    - Mock TaskStore with a fixed set of tasks

- [ ] 5. Feature: Calendar

  - [x] 5.1 Build CalendarPage
    - **Deps**: 1.2, 1.4, 2.1, 3.1
    - **Ref**: `design/components.md` — Component 3: CalendarPage; US-009, US-010
    - Create `src/features/calendar/WeekStrip.tsx`:
      - Renders 7 days (Mon–Sun) using `getWeekDays()`
      - Highlights today with `bg-primary text-white rounded-full`
      - Shows dot indicator below days that have tasks
      - `onDaySelect(dateStr)` callback
    - Create `src/features/calendar/TaskTimeline.tsx`:
      - Vertical timeline sorted by `time` (ascending)
      - Each item: left timeline dot + colored `TaskCard`
      - Color per status: `danger` for active/todo, `primary` for progress, green for done, pastel variants for others
      - Empty state when no tasks
    - Create `src/features/calendar/CalendarPage.tsx`:
      - Local state: `selectedDay` (defaults to today)
      - `WeekStrip` + "+ Add Task" button (navigates to `/tasks/new?date={selectedDay}`)
      - `TaskTimeline` filtered by `selectedDay`

  - [x] 5.2 Component tests: CalendarPage
    - **Deps**: 5.1
    - **Ref**: `design/testing-strategy.md` — Layer 2
    - `WeekStrip.test.tsx`: highlights today; calls `onDaySelect` with correct date; shows dot for days with tasks
    - `TaskTimeline.test.tsx`: renders tasks in time order; shows empty state when no tasks

- [ ] 6. Feature: Task CRUD + Tests

  - [x] 6.1 Build TaskFormPage and TaskDetailPage
    - **Deps**: 1.4, 1.5, 2.1, 3.1
    - **Ref**: `design/components.md` — Components 4 & 5; US-003, US-004, US-005, US-006
    - Create `src/features/tasks/TaskFormPage.tsx`:
      - React Hook Form + Zod (`taskSchema`)
      - Fields: title (required), description, date, time, status (select)
      - Progress field: conditionally shown when `status === 'progress'`; 0–100 integer input
      - On submit: `addTask` (new) or `updateTask` (edit) → navigate back
      - Pre-fill from `useParams` when editing; pre-fill `date` from `?date` query param
      - "+ Add Task" blue CTA button (matches UI reference)
    - Create `src/features/tasks/TaskDetailPage.tsx`:
      - Display all task fields read-only
      - "Edit" → navigate to `/tasks/:id/edit`
      - "Delete" → `ConfirmDialog` → `deleteTask` → navigate to `/`
      - If task ID not found → redirect to `/`

  - [x] 6.2 Component tests: TaskFormPage + TaskDetailPage
    - **Deps**: 6.1
    - **Ref**: `design/testing-strategy.md` — Layer 2
    - `TaskFormPage.test.tsx`:
      - Shows "Title is required" on empty submit
      - Does not show progress field when status is `todo`
      - Shows progress field when status is `progress`
      - Calls `addTask` with correct data on valid submit
    - `TaskDetailPage.test.tsx`:
      - Renders task fields correctly
      - Delete shows ConfirmDialog; confirm calls `deleteTask`
      - Cancel does not delete

---

## Task Summary

| ID | Title | Dependencies | Phase |
|----|-------|-------------|-------|
| 0.1 | Initialize Vite + React + TypeScript | none | Scaffold |
| 0.2 | Configure structure and base styles | 0.1 | Scaffold |
| 1.1 | Define TypeScript types | 0.2 | Foundation |
| 1.2 | Implement date utilities | 1.1 | Foundation |
| 1.3 | Implement storage utilities | 1.1 | Foundation |
| 1.4 | Implement Zustand TaskStore | 1.1, 1.3 | Foundation |
| 1.5 | Implement Zod task schema | 1.1 | Foundation |
| 1.6 | Unit tests: utils and store | 1.2, 1.3, 1.4, 1.5 | Foundation |
| 2.1 | Build shared primitive components | 0.2 | Shared UI |
| 2.2 | Component + snapshot tests: shared primitives | 2.1 | Shared UI |
| 3.1 | Set up React Router and responsive layout | 2.1 | Layout |
| 4.1 | Build DashboardPage | 1.4, 2.1, 3.1 | Dashboard |
| 4.2 | Component tests: DashboardPage | 4.1 | Dashboard |
| 5.1 | Build CalendarPage | 1.2, 1.4, 2.1, 3.1 | Calendar |
| 5.2 | Component tests: CalendarPage | 5.1 | Calendar |
| 6.1 | Build TaskFormPage and TaskDetailPage | 1.4, 1.5, 2.1, 3.1 | Tasks CRUD |
| 6.2 | Component tests: TaskFormPage + TaskDetailPage | 6.1 | Tasks CRUD |

---

## Requirements Coverage

| Story | Implementing Tasks | Status |
|-------|--------------------|--------|
| US-001 View Home Dashboard | 4.1 | ✅ |
| US-002 View Today's Tasks | 4.1, 2.1 (TaskCard) | ✅ |
| US-003 Add a New Task | 6.1 | ✅ |
| US-004 Edit an Existing Task | 6.1 | ✅ |
| US-005 Delete a Task | 6.1 | ✅ |
| US-006 Update Task Progress | 6.1, 1.4 | ✅ |
| US-007 Filter Tasks by Category | 4.1 | ✅ |
| US-008 Search Tasks by Title | 4.1, 2.1 (SearchBar) | ✅ |
| US-009 View Weekly Calendar Strip | 5.1 | ✅ |
| US-010 View Daily Task Timeline | 5.1 | ✅ |
| US-011 Two-Column Desktop Layout | 3.1 | ✅ |
| US-012 Accessibility and Performance | 2.1, 3.1, 0.1 (Tailwind, semantic HTML) | ✅ |

---

## Design Coverage

| Design Element | Task(s) |
|----------------|---------|
| TaskStore (Zustand) | 1.4, 1.6 |
| DashboardPage | 4.1, 4.2 |
| CalendarPage | 5.1, 5.2 |
| TaskFormPage | 6.1, 6.2 |
| TaskDetailPage | 6.1, 6.2 |
| Shared UI Primitives | 2.1, 2.2 |
| AppLayout + Router | 3.1 |
| Task entity | 1.1, 1.4 |

---

## Testing Coverage

| Layer | Tasks | Components Covered |
|-------|-------|--------------------|
| Unit (utils) | 1.6 | dateUtils, storageUtils, idUtils |
| Unit (store) | 1.6 | taskStore business rules |
| Component (RTL) | 2.2, 4.2, 5.2, 6.2 | TaskCard, SearchBar, ConfirmDialog, CategoryFilter, WeekStrip, TaskTimeline, TaskFormPage, TaskDetailPage |
| Snapshot | 2.2 | TaskCard, ProgressBar, EmptyState, Button |

Coverage summary: 7/7 components tested, 0/0 endpoints (none), all US-* covered.

---

## Definition of Done

- [ ] Code compiles without TypeScript errors
- [ ] All Vitest unit + component tests pass
- [ ] Coverage ≥ 80% for `src/utils/` and `src/store/`
- [ ] No console errors in browser dev tools
- [ ] Renders correctly at 375px (mobile) and 1280px (desktop)
- [ ] Acceptance criteria from requirements.md verified manually
- [ ] WCAG 2.1 AA: all interactive elements keyboard-accessible with visible focus
- [ ] Lighthouse mobile performance score ≥ 90

---

## Execution Waves

### Wave 0 — Scaffold (no deps)
| Phase | Tasks | Owns |
|-------|-------|------|
| 0. Scaffold | 0.1, 0.2 | `/`, `package.json`, `vite.config.ts`, `tailwind.config.ts`, `src/index.css`, `src/types/` dirs |

### Wave 1 — Foundation (depends on Wave 0)
Tasks within Wave 1 can proceed once 0.1+0.2 are done. 1.2, 1.3, 1.5 are independent of each other.

| Phase | Tasks | Owns |
|-------|-------|------|
| 1. Foundation | 1.1 → 1.2, 1.3, 1.5 → 1.4 → 1.6 | `src/types/`, `src/utils/`, `src/store/` |
| 2. Shared UI | 2.1 → 2.2 | `src/components/` |

### Wave 2 — Features (depends on Wave 1)
Phase 3 (layout) runs first, then 4, 5, 6 are independent of each other.

| Phase | Tasks | Owns |
|-------|-------|------|
| 3. Layout | 3.1 | `src/App.tsx`, `src/main.tsx` |
| 4. Dashboard | 4.1 → 4.2 | `src/features/dashboard/` |
| 5. Calendar | 5.1 → 5.2 | `src/features/calendar/` |
| 6. Tasks CRUD | 6.1 → 6.2 | `src/features/tasks/` |

**No file ownership overlaps between phases 4, 5, and 6.**

---

## Notes

**Technical debt tracked for post-MVP**:
- Replace localStorage with REST API backend (store actions already use clean interface)
- Add PWA manifest + service worker for installability
- Add date navigation (prev/next week) to WeekStrip
- Add task recurrence support
