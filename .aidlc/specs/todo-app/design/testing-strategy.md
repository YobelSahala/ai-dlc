# Testing Strategy

## Overview

- **Approach**: Unit + component tests (Vitest + React Testing Library)
- **Correctness**: Unit tests for business logic + snapshot tests for key components
- **Coverage target**: 80% lines/functions for `src/utils/` and `src/store/`
- **No E2E for MVP** — solo developer, localStorage-only, no network to mock

---

## Test Layers

### Layer 1: Unit Tests (utils + store)

**Framework**: Vitest
**Location**: `src/**/__tests__/*.test.ts`

| Module | Tests |
|--------|-------|
| `dateUtils.ts` | `getWeekDays()`, `formatTime()`, `isToday()`, `formatMonthLabel()` |
| `storageUtils.ts` | read/write success, localStorage unavailable fallback |
| `taskStore.ts` | addTask, updateTask, deleteTask, tasksByDate, tasksByStatus, searchTasks |
| `idUtils.ts` | generates unique UUID on each call |

**Key test cases**:
```typescript
// dateUtils — edge cases
it('getWeekDays returns 7 days starting from Monday')
it('isToday returns true for current date string')
it('formatTime formats 24h time to 12h display correctly')

// taskStore — business rules
it('setting progress to 100 auto-sets status to done')
it('changing status from progress to todo resets progress to 0')
it('searchTasks is case-insensitive')
it('deleteTask removes task from store and localStorage')
```

---

### Layer 2: Component Tests (RTL)

**Framework**: Vitest + React Testing Library + @testing-library/user-event
**Location**: `src/**/__tests__/*.test.tsx`

| Component | What to test |
|-----------|-------------|
| `TaskCard` | Renders title, time, progress bar, status color |
| `ProgressBar` | Correct fill width % and label |
| `SearchBar` | Calls onSearch after 150ms debounce |
| `CategoryFilter` | Highlights active filter, calls onFilter |
| `ConfirmDialog` | Renders, calls onConfirm/onCancel correctly |
| `TaskFormPage` | Shows validation errors, submits valid data |
| `WeekStrip` | Highlights today, calls onDaySelect on tap |
| `DashboardPage` | Renders greeting, task count, today's tasks |

**Key test cases**:
```typescript
// TaskFormPage — validation
it('shows "Title is required" when title is empty on submit')
it('does not show progress field when status is todo')
it('shows progress field when status is progress')

// SearchBar — debounce
it('calls onSearch after 150ms debounce, not on every keystroke')

// WeekStrip — current day highlight
it('highlights today with primary color class')
it('calls onDaySelect with correct date string when day is clicked')
```

---

### Layer 3: Snapshot Tests

**Framework**: Vitest (`toMatchSnapshot`)
**Components**: `TaskCard`, `ProgressBar`, `EmptyState`, `Button`

Snapshots catch unintended visual regressions in shared primitives. Run on CI; update intentionally with `--update-snapshots`.

---

## Coverage Targets

| Scope | Target |
|-------|--------|
| `src/utils/` | 90% lines |
| `src/store/` | 85% lines |
| `src/components/` | 70% lines |
| `src/features/` | 60% lines (integration-heavy) |
| Overall | 80% lines/functions |

---

## CI Integration

```yaml
# In GitHub Actions workflow:
- name: Run tests
  run: npm run test -- --coverage

- name: Check coverage thresholds
  run: npm run test -- --coverage --reporter=verbose
```

---

## What Is NOT Tested (and Why)

| Excluded | Reason |
|----------|--------|
| E2E (Playwright) | Solo dev MVP — overkill, no server to test against |
| `src/main.tsx` | Bootstrap only, no logic |
| `src/types/` | Type definitions, no runtime behavior |
| Vite/Tailwind config | Build tool config, tested by tooling itself |
