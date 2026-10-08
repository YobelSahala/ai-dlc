# Components

## Overview

The Todo App is a feature-based SPA. Components are organized by business feature (`dashboard`, `calendar`, `tasks`) with a `shared` layer for reusable primitives. Zustand stores provide global state; custom hooks encapsulate localStorage I/O. React Router v6 handles navigation between the three main views.

```
User → Router → Page Component → Feature Components → Shared Components
                      ↓
               Zustand Store ↔ localStorage hooks
```

---

## Component 1: TaskStore (Zustand)

**Purpose**: Global source of truth for all tasks. Bridges Zustand state with localStorage persistence.

**Technology**: Zustand 4.x, TypeScript

**Responsibilities**:
- Hold all tasks in memory
- Expose CRUD actions (addTask, updateTask, deleteTask)
- Persist to/hydrate from localStorage on every mutation
- Expose derived selectors (tasksByDate, tasksByStatus, searchTasks)

**Exposes**:
- `tasks: Task[]`
- `addTask(task: Omit<Task, 'id'>): void`
- `updateTask(id: string, patch: Partial<Task>): void`
- `deleteTask(id: string): void`
- `tasksByDate(date: string): Task[]`
- `tasksByStatus(status: TaskStatus): Task[]`
- `searchTasks(query: string): Task[]`

**Consumes**: `storageUtils` (localStorage read/write)

**Internal Structure**:
```
src/store/
└── taskStore.ts
```

**Key Decisions**:
1. Zustand over Context — simpler selector API, no Provider wrapping, built-in devtools
2. Persist middleware from Zustand handles localStorage sync automatically with zero boilerplate

**Error Handling**: Wrap localStorage operations in try/catch; on failure, keep in-memory state valid and log a warning.

---

## Component 2: DashboardPage

**Purpose**: Home screen — greeting, monthly task count, category filter, Today's Tasks scroll.

**Technology**: React 18, TailwindCSS

**Responsibilities**:
- Render personalized greeting based on time of day
- Display monthly task count from TaskStore
- Render CategoryFilter tabs (To-Do / Progress / Done) with counts
- Render TodayTaskList (horizontal scroll of today's task cards)
- Render SearchBar

**Exposes**: Route `/` (React Router)

**Consumes**: `TaskStore`, `SearchBar`, `CategoryFilter`, `TodayTaskList`, `TaskCard`

**Internal Structure**:
```
src/features/dashboard/
├── DashboardPage.tsx
├── TodayTaskList.tsx
└── CategoryFilter.tsx
```

**Key Decisions**:
1. Greeting computed from `new Date().getHours()` — no dependency, zero cost
2. Today's Tasks uses CSS `overflow-x: auto` scroll on mobile, hidden on desktop (tasks shown in calendar column)

**Error Handling**: If TaskStore fails to hydrate, show empty state with "Add your first task" CTA.

---

## Component 3: CalendarPage

**Purpose**: Weekly date strip + daily task timeline view.

**Technology**: React 18, TailwindCSS, Native JS Date + Intl API

**Responsibilities**:
- Render WeekStrip (Mon–Sun of current week, current day highlighted)
- Track selected day in local state (defaults to today)
- Render TaskTimeline for selected day
- Expose "+ Add Task" button pre-filled with selected date

**Exposes**: Route `/calendar`

**Consumes**: `TaskStore`, `WeekStrip`, `TaskTimeline`, `TaskCard`

**Internal Structure**:
```
src/features/calendar/
├── CalendarPage.tsx
├── WeekStrip.tsx
└── TaskTimeline.tsx
```

**Key Decisions**:
1. Native JS Date used for all week calculations — avoids date-fns/dayjs dependency
2. Selected day stored in local component state (not Zustand) — ephemeral UI state, not shared

**Error Handling**: If no tasks for selected day, show empty state "No tasks scheduled for this day".

---

## Component 4: TaskFormPage

**Purpose**: Add and edit task form.

**Technology**: React Hook Form 7.x, Zod 3.x, TailwindCSS

**Responsibilities**:
- Render form fields: title, description, date, time, status, progress (if status=Progress)
- Validate with Zod schema on submit
- On submit: call TaskStore.addTask or TaskStore.updateTask
- On cancel: navigate back without saving

**Exposes**: Routes `/tasks/new` and `/tasks/:id/edit`

**Consumes**: `TaskStore`, React Router `useNavigate`, `useParams`

**Internal Structure**:
```
src/features/tasks/
├── TaskFormPage.tsx
├── taskSchema.ts       ← Zod schema
└── TaskDetailPage.tsx
```

**Key Decisions**:
1. React Hook Form for uncontrolled performance + Zod for schema-driven validation
2. Progress field conditionally rendered only when status = "Progress"

**Error Handling**: Inline field-level error messages from Zod. Network-style errors not applicable (localStorage).

---

## Component 5: TaskDetailPage

**Purpose**: View a single task's full details with edit and delete actions.

**Technology**: React 18, TailwindCSS

**Responsibilities**:
- Display all task fields read-only
- Provide "Edit" → navigates to TaskFormPage
- Provide "Delete" → confirmation dialog → TaskStore.deleteTask

**Exposes**: Route `/tasks/:id`

**Consumes**: `TaskStore`, React Router `useParams`, `useNavigate`, `ConfirmDialog`

**Internal Structure**:
```
src/features/tasks/
└── TaskDetailPage.tsx
```

**Error Handling**: If task ID not found in store, redirect to `/` with toast "Task not found".

---

## Component 6: Shared UI Primitives

**Purpose**: Reusable design-system-level components used across features.

**Technology**: React 18, TailwindCSS

**Components**:
- `TaskCard` — colored card with title, time, progress bar, status badge
- `ProgressBar` — filled bar + percentage label
- `SearchBar` — debounced input (150ms) calling onSearch callback
- `ConfirmDialog` — modal with Confirm/Cancel for destructive actions
- `EmptyState` — icon + message for empty lists
- `Button` — primary/secondary/ghost variants, accessible

**Exposes**: Named exports from `src/components/`

**Consumes**: Nothing external — pure presentational

**Internal Structure**:
```
src/components/
├── TaskCard.tsx
├── ProgressBar.tsx
├── SearchBar.tsx
├── ConfirmDialog.tsx
├── EmptyState.tsx
└── Button.tsx
```

**Key Decisions**:
1. All shared components are pure (no store access) — props only
2. Color palette defined as Tailwind custom tokens in `tailwind.config.ts`

**Error Handling**: React Error Boundary wraps each page-level component.

---

## Component 7: AppLayout + Router

**Purpose**: Root layout — responsive two-column on desktop, single-column + bottom nav on mobile.

**Technology**: React Router v6, TailwindCSS

**Responsibilities**:
- Render bottom navigation tabs on mobile (`/`, `/calendar`, `/tasks/new`)
- Render two-column layout on desktop (≥1024px): DashboardPage left, CalendarPage right
- Wrap app in Zustand provider (no-op — Zustand needs no provider) and Error Boundary

**Exposes**: Root `<App />` component

**Internal Structure**:
```
src/
├── App.tsx
├── main.tsx
└── components/
    └── BottomNav.tsx
```

---

## Component Interactions

```
App (Router)
├── / → DashboardPage
│        ├── SearchBar ──────────────→ TaskStore.searchTasks()
│        ├── CategoryFilter ─────────→ TaskStore.tasksByStatus()
│        └── TodayTaskList
│               └── TaskCard ────────→ /tasks/:id
│
├── /calendar → CalendarPage
│        ├── WeekStrip (local state: selectedDay)
│        └── TaskTimeline
│               └── TaskCard ────────→ /tasks/:id
│
├── /tasks/new → TaskFormPage ────────→ TaskStore.addTask()
├── /tasks/:id → TaskDetailPage ─────→ TaskStore / → /tasks/:id/edit
└── /tasks/:id/edit → TaskFormPage ──→ TaskStore.updateTask()

TaskStore ↔ localStorage (via Zustand persist middleware)
```
