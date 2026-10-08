# Structure Blueprint

## Summary
- **Repo type**: Single repo, SPA
- **Key source directories**: `src/features/`, `src/components/`, `src/hooks/`
- **Main entry points**: `src/main.tsx` → `src/App.tsx`

## Repository

- **Type**: Single repo
- **Root**: React + Vite SPA

## Key Directories

| Directory | Purpose | Key Contents |
|-----------|---------|--------------|
| `src/features/dashboard/` | Home screen feature | DashboardPage, TaskCard, CategoryFilter |
| `src/features/calendar/` | Calendar & timeline feature | CalendarPage, WeekStrip, TaskTimeline |
| `src/features/tasks/` | Task CRUD feature | AddTaskForm, TaskDetail, useTask |
| `src/components/` | Shared UI components | Button, Input, ProgressBar, Avatar |
| `src/hooks/` | Custom React hooks | useTasks, useCalendar, useSearch |
| `src/store/` | State management | tasksStore (Zustand or Context) |
| `src/types/` | TypeScript types | Task, Category, CalendarDay |
| `src/utils/` | Utility functions | dateUtils, storageUtils |
| `src/assets/` | Static assets | icons, images |

## Key Files

| File | Purpose | Notes |
|------|---------|-------|
| `src/main.tsx` | App entry point | React DOM render |
| `src/App.tsx` | Root component + router | React Router v6 |
| `tailwind.config.ts` | Tailwind config | Custom colors, fonts |
| `vite.config.ts` | Vite build config | |
| `tsconfig.json` | TypeScript config | |

## Entry Points

| Entry | Type | Description |
|-------|------|-------------|
| `/` | Page | Home dashboard |
| `/calendar` | Page | Calendar + timeline view |
| `/tasks/new` | Page | Add new task form |
| `/tasks/:id` | Page | Task detail view |
