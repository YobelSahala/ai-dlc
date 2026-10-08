# Requirements — Todo App

## Summary
- **Total Stories**: 12 across 5 functional areas
- **Priority**: 7 High, 3 Medium, 2 Low
- **User Types**: Individual personal user (Alex)
- **Personas**: Generated (personas.md)
- **Key Entities**: Task, Category, CalendarDay
- **Integrations**: None — localStorage only
- **Core Flows**:
  1. User views dashboard with task count, category stats, and today's tasks
  2. User adds a new task with title, description, date, time, and status
  3. User updates task progress (0–100%) and status
  4. User views weekly calendar and taps a day to see timeline
  5. User searches tasks by title in real time

---

## Functional Area 1: Dashboard

### US-001: View Home Dashboard
**As a** user,
**I want** to see a greeting, my monthly task count, and category summary on the home screen,
**So that** I have an instant overview of my workload without navigating anywhere.

**Priority**: High
**Source**: D1-1 (Feature Scope), UI reference — left screen

**Acceptance Criteria**:
- WHEN the app loads, THEN the home screen displays a personalized greeting ("Good Morning/Afternoon/Evening, [Name]!") based on the current time of day
- The system shall display the total number of tasks for the current month prominently on the dashboard
- WHEN the app loads, THEN three category summary icons are shown: To-Do, Progress, and Done with their respective task counts
- The system shall render correctly at viewport widths from 375px (mobile) to 1440px (desktop)

**Dependencies**: None

---

### US-002: View Today's Tasks on Dashboard
**As a** user,
**I want** to see my tasks for today in a horizontally scrollable card list on the dashboard,
**So that** I can quickly check what I need to do today without leaving the home screen.

**Priority**: High
**Source**: D1-1, UI reference — "Today's Tasks" section

**Acceptance Criteria**:
- WHEN the dashboard loads, THEN tasks scheduled for the current date are shown in a horizontally scrollable card row
- The system shall display each task card with: title, time, progress percentage, and a color-coded background based on status
- WHEN there are no tasks for today, THEN an empty state message "No tasks for today" is shown
- WHEN a task card is tapped/clicked, THEN the task detail view opens

**Dependencies**: US-004

---

## Functional Area 2: Task Management

### US-003: Add a New Task
**As a** user,
**I want** to create a new task with a title, description, date, time, and status,
**So that** I can capture and schedule work items quickly.

**Priority**: High
**Source**: D1-4 (Task Properties)

**Acceptance Criteria**:
- WHEN the user taps "+ Add Task", THEN a task creation form opens with fields: title (required), description (optional), date (required), time (required), status (default: To-Do)
- IF the user submits the form without a title, THEN an inline validation error "Title is required" is shown and the form is not submitted
- WHEN the user submits a valid form, THEN the task is saved to localStorage and appears in the relevant views within 200ms
- The system shall support task dates from today up to 1 year in the future

**Dependencies**: None

---

### US-004: Edit an Existing Task
**As a** user,
**I want** to edit a task's title, description, date, time, or status,
**So that** I can keep tasks accurate as work evolves.

**Priority**: High
**Source**: D1-4

**Acceptance Criteria**:
- WHEN the user opens a task detail view, THEN all task fields are editable
- WHEN the user saves edits, THEN the task is updated in localStorage and all views reflect the change immediately
- WHEN the user cancels editing, THEN no changes are saved and the previous values are preserved
- IF the user clears the title field and tries to save, THEN an error "Title is required" is shown

**Dependencies**: US-003

---

### US-005: Delete a Task
**As a** user,
**I want** to delete a task I no longer need,
**So that** my task list stays relevant and uncluttered.

**Priority**: Medium
**Source**: D1-1

**Acceptance Criteria**:
- WHEN the user is in a task detail view, THEN a delete action is available
- WHEN the user initiates delete, THEN a confirmation prompt "Delete this task?" with Confirm/Cancel is shown
- WHEN the user confirms deletion, THEN the task is removed from localStorage and disappears from all views
- WHEN the user cancels, THEN the task is not deleted

**Dependencies**: US-003

---

### US-006: Update Task Progress
**As a** user,
**I want** to manually set a task's progress percentage (0–100%),
**So that** I can track how far along I am on in-progress work.

**Priority**: High
**Source**: D1-5 (Progress Tracking), UI reference — progress bar

**Acceptance Criteria**:
- WHEN editing a task with status "Progress", THEN a progress input (0–100 integer) is available
- WHEN the user sets progress to 100%, THEN the status automatically updates to "Done"
- IF the user enters a value outside 0–100, THEN the input is clamped to the valid range
- The system shall display the progress value as both a percentage label and a filled progress bar on task cards

**Dependencies**: US-004

---

### US-007: Filter Tasks by Category
**As a** user,
**I want** to filter tasks by category (To-Do, Progress, Done),
**So that** I can focus on one type of task at a time.

**Priority**: High
**Source**: D1-1, UI reference — category icons

**Acceptance Criteria**:
- WHEN the user taps a category icon (To-Do / Progress / Done), THEN only tasks matching that status are shown in the task list
- WHEN no category filter is active, THEN all tasks are shown
- WHEN a filter is active, THEN the selected category icon is visually highlighted
- WHEN the user taps the active filter again, THEN the filter is cleared and all tasks are shown

**Dependencies**: US-003

---

## Functional Area 3: Search

### US-008: Search Tasks by Title
**As a** user,
**I want** to search for tasks by typing in the search bar,
**So that** I can quickly find a specific task without scrolling.

**Priority**: Medium
**Source**: D1-8 (Search), UI reference — search bar

**Acceptance Criteria**:
- WHEN the user types in the search input, THEN the task list filters in real time to show only tasks whose titles contain the search string (case-insensitive)
- WHEN the search input is cleared, THEN all tasks are shown again
- WHEN no tasks match the search query, THEN an empty state "No tasks found" is displayed
- The system shall debounce search input by 150ms to avoid excessive re-renders

**Dependencies**: US-003

---

## Functional Area 4: Calendar View

### US-009: View Weekly Calendar Strip
**As a** user,
**I want** to see a horizontal strip showing Mon–Sun of the current week with the current day highlighted,
**So that** I can navigate to any day and see its tasks.

**Priority**: High
**Source**: D1-6 (Calendar View), UI reference — right screen

**Acceptance Criteria**:
- WHEN the calendar view loads, THEN a horizontal strip displays all 7 days of the current week with day abbreviation (Mon–Sun) and date number
- The system shall highlight the current day with a distinct color (blue per UI reference)
- WHEN the user taps a day in the strip, THEN the timeline below updates to show tasks for that selected day
- WHEN a day has tasks, THEN a small dot indicator is shown below its date number

**Dependencies**: US-003

---

### US-010: View Daily Task Timeline
**As a** user,
**I want** to see tasks for a selected day arranged in a vertical timeline sorted by time,
**So that** I can understand my schedule at a glance.

**Priority**: High
**Source**: D1-6, UI reference — timeline cards

**Acceptance Criteria**:
- WHEN a day is selected in the weekly strip, THEN all tasks for that day are shown in a vertical timeline sorted by start time (ascending)
- The system shall display each timeline task card with: title, time, description, and a color-coded left border or background based on status
- WHEN there are no tasks for the selected day, THEN an empty state "No tasks scheduled" is shown
- WHEN a timeline card is tapped, THEN the task detail/edit view opens

**Dependencies**: US-009

---

## Functional Area 5: Desktop Layout & NFR

### US-011: Two-Column Desktop Layout
**As a** user,
**I want** the app to use a two-column layout on desktop (dashboard left, calendar right),
**So that** I can see both my task overview and schedule simultaneously.

**Priority**: Medium
**Source**: D1-7 (Desktop Layout)

**Acceptance Criteria**:
- WHEN the viewport width is ≥1024px, THEN the layout switches to two columns: dashboard on the left, calendar/timeline on the right
- WHEN the viewport width is <1024px, THEN the layout is single-column with bottom navigation tabs
- The system shall transition between layouts without page reload (responsive CSS breakpoints)
- The system shall maintain all functionality at both breakpoints

**Dependencies**: US-001, US-009

---

### US-012: Accessibility and Performance
**As a** user,
**I want** the app to be fast and accessible,
**So that** it works well on my phone and is usable regardless of ability.

**Priority**: Low
**Source**: D1-11 (NFR)

**Acceptance Criteria**:
- The system shall achieve a Lighthouse performance score ≥ 90 on mobile
- The system shall meet WCAG 2.1 AA — all interactive elements have accessible labels, sufficient color contrast (≥4.5:1), and keyboard navigation support
- WHEN the app is opened on a device with no internet connection, THEN all previously saved tasks load correctly from localStorage
- The system shall render the initial view within 1 second on a 4G connection

**Dependencies**: US-001, US-003

---

## Story Summary

| ID | Title | Area | Priority | Dependencies |
|----|-------|------|----------|--------------|
| US-001 | View Home Dashboard | Dashboard | High | — |
| US-002 | View Today's Tasks on Dashboard | Dashboard | High | US-004 |
| US-003 | Add a New Task | Task Management | High | — |
| US-004 | Edit an Existing Task | Task Management | High | US-003 |
| US-005 | Delete a Task | Task Management | Medium | US-003 |
| US-006 | Update Task Progress | Task Management | High | US-004 |
| US-007 | Filter Tasks by Category | Task Management | High | US-003 |
| US-008 | Search Tasks by Title | Search | Medium | US-003 |
| US-009 | View Weekly Calendar Strip | Calendar | High | US-003 |
| US-010 | View Daily Task Timeline | Calendar | High | US-009 |
| US-011 | Two-Column Desktop Layout | Desktop / NFR | Medium | US-001, US-009 |
| US-012 | Accessibility and Performance | Desktop / NFR | Low | US-001, US-003 |

---

## Story–Persona Matrix

| Story | Alex (Primary) |
|-------|---------------|
| US-001 | Primary |
| US-002 | Primary |
| US-003 | Primary |
| US-004 | Primary |
| US-005 | Primary |
| US-006 | Primary |
| US-007 | Primary |
| US-008 | Primary |
| US-009 | Primary |
| US-010 | Primary |
| US-011 | Primary |
| US-012 | Primary |

---

## Non-Functional Notes

- **Performance**: Lighthouse ≥90 mobile, initial render <1s on 4G
- **Accessibility**: WCAG 2.1 AA — labels, contrast, keyboard nav
- **Offline**: localStorage ensures offline read/write
- **Responsiveness**: 375px mobile up to 1440px desktop, breakpoint at 1024px
