# Integration

## Overview

The Todo App MVP has **no external API integrations**. All data lives in the browser via localStorage. This document defines the internal integration contracts between the app's layers.

---

## Internal Integration: Zustand Store ↔ localStorage

**Integration type**: In-process, synchronous

**Contract**:
- Zustand's `persist` middleware serializes the full store state to JSON and writes to `localStorage['todo-app-state']` on every state mutation
- On app initialization, the middleware reads and deserializes the stored JSON to hydrate Zustand state
- If `localStorage` is unavailable (private mode, quota exceeded), the app falls back to in-memory only — tasks are lost on refresh but the UI remains functional

**Error handling**:
```
try {
  localStorage.setItem('todo-app-state', JSON.stringify(state))
} catch (e) {
  console.warn('[TaskStore] localStorage write failed — running in-memory only', e)
}
```

---

## Internal Integration: React Router ↔ TaskStore

**Integration type**: In-process, via hooks

| Route | Store Action |
|-------|-------------|
| `POST /tasks/new` | `TaskStore.addTask()` → navigate to `/` |
| `PUT /tasks/:id/edit` | `TaskStore.updateTask()` → navigate to `/tasks/:id` |
| `DELETE /tasks/:id` | `TaskStore.deleteTask()` → navigate to `/` |

---

## Internal Integration: SearchBar ↔ TaskStore

**Integration type**: In-process, reactive

- SearchBar emits debounced query string (150ms) via `onSearch(query: string)` prop
- DashboardPage passes query to `TaskStore.searchTasks(query)` selector
- Result is passed as `filteredTasks` prop to TodayTaskList

---

## Future Integration Points (post-MVP)

| Integration | Trigger | Notes |
|-------------|---------|-------|
| REST API backend | When multi-user auth is added | Replace localStorage hooks with fetch/SWR calls |
| Push notifications | Reminder feature | Service Worker + Web Push API |
| Calendar sync | Export to Google Calendar | iCal format via Blob download |

---

## No External Dependencies

- No third-party API calls
- No authentication service
- No analytics or tracking
- No CDN for data (only for static assets via Vercel)
