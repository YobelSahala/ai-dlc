# Data Model

## Overview

- **Storage**: Browser localStorage via Zustand persist middleware
- **Format**: JSON serialized arrays
- **ORM/Client**: None — plain TypeScript interfaces + Zustand

No relational database. All entities are stored as flat JSON arrays in a single localStorage key (`todo-app-tasks`).

---

## Entities

### Task

**Purpose**: Core unit of work — represents a single todo item with scheduling and progress info.

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `id` | `string` (UUID v4) | Yes | Unique, auto-generated on create |
| `title` | `string` | Yes | 1–100 characters |
| `description` | `string` | No | Max 500 characters |
| `date` | `string` (ISO date: YYYY-MM-DD) | Yes | Must be a valid date |
| `time` | `string` (HH:MM, 24h) | Yes | Must be a valid time |
| `status` | `TaskStatus` enum | Yes | Default: `"todo"` |
| `progress` | `number` | Yes | Integer 0–100, default: 0 |
| `createdAt` | `string` (ISO 8601) | Yes | Auto-set on create |
| `updatedAt` | `string` (ISO 8601) | Yes | Auto-updated on every mutation |

**TypeScript Interface**:
```typescript
type TaskStatus = 'todo' | 'progress' | 'done';

interface Task {
  id: string;           // UUID v4
  title: string;        // 1–100 chars
  description: string;  // optional, max 500 chars
  date: string;         // YYYY-MM-DD
  time: string;         // HH:MM (24h)
  status: TaskStatus;
  progress: number;     // 0–100 integer
  createdAt: string;    // ISO 8601
  updatedAt: string;    // ISO 8601
}
```

**Business Rules**:
1. When `progress` is set to 100, `status` automatically transitions to `"done"`
2. When `status` is changed from `"progress"` to `"todo"`, `progress` resets to 0
3. `progress` field is only editable when `status === "progress"`
4. `id` is generated client-side with `crypto.randomUUID()`

---

### AppState (localStorage root)

**Purpose**: Root structure stored in localStorage.

```typescript
interface AppState {
  tasks: Task[];
  version: number;  // for future migration support, starts at 1
}
```

**localStorage key**: `todo-app-state`

---

## ER Diagram

```
┌───────────────────────────────────┐
│              Task                 │
├───────────────────────────────────┤
│ id          : string (UUID)  [PK] │
│ title       : string              │
│ description : string              │
│ date        : string (YYYY-MM-DD) │
│ time        : string (HH:MM)      │
│ status      : TaskStatus enum     │
│ progress    : number (0–100)      │
│ createdAt   : string (ISO 8601)   │
│ updatedAt   : string (ISO 8601)   │
└───────────────────────────────────┘

Single entity — no relationships for MVP.
Future: User entity for multi-user, Tag entity for labels.
```

---

## Access Patterns

| Query | Frequency | Implementation |
|-------|-----------|----------------|
| All tasks | On app load | `store.tasks` — full array from localStorage |
| Tasks by date | Every calendar day select + dashboard | `tasks.filter(t => t.date === dateStr)` |
| Tasks by status | Category filter on dashboard | `tasks.filter(t => t.status === status)` |
| Search by title | On search input (debounced 150ms) | `tasks.filter(t => t.title.toLowerCase().includes(q))` |
| Single task by ID | Task detail / edit view | `tasks.find(t => t.id === id)` |
| Tasks for current month | Monthly count on dashboard | `tasks.filter(t => t.date.startsWith(monthPrefix))` |

**Performance note**: All queries are O(n) over the tasks array. For MVP (expected <1000 tasks), this is sufficient. No indexing needed in localStorage.

---

## Validation Rules (Zod Schema)

```typescript
import { z } from 'zod';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().max(500).optional().default(''),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format'),
  status: z.enum(['todo', 'progress', 'done']).default('todo'),
  progress: z.number().int().min(0).max(100).default(0),
});
```
