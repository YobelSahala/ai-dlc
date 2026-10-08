# Tasks Decisions

## Context Summary
- **Feature**: Mobile-first Todo app
- **Components**: 7 (TaskStore, DashboardPage, CalendarPage, TaskFormPage, TaskDetailPage, Shared UI, AppLayout)
- **Entities**: 1 (Task)
- **Integrations**: 1 (localStorage)
- **Stories**: 12 across 5 areas
- **Team**: Solo developer
- **Testing**: Vitest + RTL (from D3)

---

## Decision Questions

### D4-1: Task Breakdown Strategy
**Question**: How should tasks be broken down from the design?
- 1) Component-by-component — one task per component, includes its tests
- 2) Layer-by-layer — scaffold first, then features, then tests **(Recommended)** — cleaner dependencies
- 3) Story-by-story — each user story as one task
- 4) Other (please specify): _______

**Answer**: 2) Layer-by-layer — scaffold first, then features, then tests

---

### D4-2: Implementation Approach
**Question**: TDD or test-after?
- 1) TDD — write tests first, then implementation
- 2) Test-after — implement, then write tests **(Recommended)** — pragmatic for solo MVP
- 3) TDD for business logic only (store + utils), test-after for components
- 4) Other (please specify): _______

**Answer**: 2) Test-after — implement, then write tests

---

### D4-3: Component Build Priority
**Question**: Which components should be built first?
- 1) Bottom-up — shared primitives → store → features
- 2) Vertical slice — one full feature end-to-end first **(Recommended)** — validates data flow early
- 3) Top-down — pages first, stub dependencies
- 4) Other (please specify): _______

**Answer**: 2) Vertical slice — one full feature end-to-end first

---

### D4-4: Task Granularity
**Question**: How large should individual tasks be?
- 1) Atomic — one function/component per task (very fine-grained)
- 2) Single-concern — one logical unit per task (e.g., "TaskStore CRUD + tests") **(Recommended)**
- 3) Multi-concern — group related items (e.g., "All dashboard components")
- 4) Other (please specify): _______

**Answer**: 2) Single-concern — one logical unit per task

---

### D4-5: Parallel Execution
**Question**: Should tasks be organized for sequential or parallel execution?
- 1) Sequential — one wave, tasks done in order
- 2) Execution waves — tasks grouped by dependency layer, parallelizable within each wave **(Recommended)**
- 3) Fully parallel — all independent tasks dispatched simultaneously
- 4) Other (please specify): _______

**Answer**: 2) Execution waves — tasks grouped by dependency layer

---

### D4-6: Scaffold / Setup Task
**Question**: Should project scaffold be a separate first task?
- 1) Yes — scaffold + tooling setup as Wave 0 **(Recommended)** — unblocks all other tasks
- 2) No — fold into first feature task
- 3) Other (please specify): _______

**Answer**: 1) Yes — scaffold + tooling setup as Wave 0

---

## Decisions Summary
- D4-1 Breakdown Strategy: Layer-by-layer — scaffold first, then features, then tests
- D4-2 Implementation Approach: Test-after
- D4-3 Build Priority: Vertical slice — one full feature end-to-end first
- D4-4 Granularity: Single-concern — one logical unit per task
- D4-5 Parallel Execution: Execution waves
- D4-6 Scaffold: Yes — Wave 0

---

**Instructions**: Fill in your answers above and respond with "done"
