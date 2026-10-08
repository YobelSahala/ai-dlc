# Personas

## Summary
- **User Types**: 1 persona
- **Key Roles**: Alex — Personal Task Manager
- **Design Implications**: Mobile-first, no auth, simple onboarding, fast task entry

## Overview
This app serves one primary user type: an individual managing their own daily tasks across mobile and desktop.

---

## Alex — Personal Task Manager

**Role**: Individual user managing daily personal or work tasks

**Goals**:
- Quickly capture and organize tasks for today and the week ahead
- Track progress on ongoing tasks at a glance
- Stay on top of what's scheduled and when

**Pain Points**:
- Forgetting tasks that were mentally noted but not written down
- Losing track of which tasks are in-progress vs still todo
- No clear overview of the day's schedule without opening each task

**User Journey**: Opens app → sees today's task count + status summary → taps into calendar to check schedule → adds or updates a task → checks progress

**Implications**:
- Mobile-first layout with large tap targets
- Dashboard must show key info immediately (no navigation required)
- Task entry must be fast — minimal required fields
- Progress bar and status are first-class UI elements

---

## Design Implications

- **Architecture**: Single user, no RBAC needed — all data local to device
- **UI/UX**: Mobile-first at 375px; large cards, clear status colors, thumb-reachable actions; desktop extends to two-column layout
- **Data & Privacy**: All data in localStorage — no server, no tracking
