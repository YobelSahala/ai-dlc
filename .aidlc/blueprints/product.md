# Product Blueprint

## Summary
- **Product**: Mobile-first Todo app for personal task management
- **Users**: Individual users managing daily tasks on mobile and desktop
- **Type**: Greenfield — New standalone web application

## Overview
A beautifully designed, mobile-first task management application that helps individuals organize their daily workload. The app features a home dashboard with task summaries, a weekly calendar view with a daily timeline, category-based filtering (To-Do / In Progress / Done), real-time search, and per-task progress tracking. The desktop layout extends the mobile experience with a two-column view.

## Problem Statement
People struggle to keep track of daily tasks across different states (todo, in-progress, done) and need a clear, visually appealing way to see what's on their plate for the day and week — especially on mobile where most quick task-checking happens.

## Target Users

| Type | Description | Primary Goal |
|------|-------------|--------------|
| Individual user | Person managing personal or work tasks daily | Quickly add, track, and complete tasks |

## Key Features

| Area | Description |
|------|-------------|
| Home Dashboard | Greeting, monthly task count, search bar, category filter tabs (To-Do / Progress / Done), Today's Tasks horizontal scroll |
| Calendar View | Weekly date strip (Mon–Sun), highlighted current day, daily task timeline with time slots |
| Task Cards | Title, description, time, progress bar with percentage, color-coded by status |
| Add Task | Form to create a new task with title, description, date, time, category |
| Search | Real-time full-text search across all tasks |
| Progress Tracking | Per-task progress percentage, visual progress bar |
| Desktop Layout | Two-column view — left: home dashboard, right: calendar/timeline view |

## Domain Language

| Term | Definition | Example |
|------|-----------|---------|
| Task | A unit of work with a title, description, time, and status | "Team Meeting at 10:00 AM" |
| Category | Status bucket for a task | To-Do, Progress, Done |
| Progress | Completion percentage of a task | 48% |
| Timeline | Chronological list of tasks for a selected day | Daily task list sorted by time |
| Today's Tasks | Tasks scheduled for the current date | Shown on home dashboard |

## Success Criteria

| Metric | Target |
|--------|--------|
| Mobile usability | All core actions reachable in ≤2 taps on mobile |
| Load performance | Initial render < 1s on 4G |
| Offline support | Tasks readable without internet (localStorage) |
| Accessibility | WCAG 2.1 AA compliance |

## Constraints & Assumptions

**Constraints**:
- Mobile-first — all layouts must work at 375px width
- No backend for MVP — localStorage persistence
- Single user (no auth for MVP)

**Assumptions**:
- Users primarily access on mobile but may use desktop
- English UI for MVP
- No recurring tasks for MVP

## Project Type
- **Type**: Greenfield
- **Scope**: New standalone application
