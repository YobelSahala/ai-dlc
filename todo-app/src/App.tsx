import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import BottomNav from './components/BottomNav';

const DashboardPage = lazy(() => import('./features/dashboard/DashboardPage'));
const CalendarPage = lazy(() => import('./features/calendar/CalendarPage'));
const TaskFormPage = lazy(() => import('./features/tasks/TaskFormPage'));
const TaskDetailPage = lazy(() => import('./features/tasks/TaskDetailPage'));

function AppLayout() {
  return (
    <div className="min-h-screen bg-surface">
      {/* Desktop: two-column grid. Mobile: single column */}
      <div className="lg:grid lg:grid-cols-2 lg:h-screen lg:overflow-hidden">
        {/* Left column — Dashboard (always visible on desktop, routed on mobile) */}
        <div className="lg:overflow-y-auto lg:border-r lg:border-gray-100">
          <ErrorBoundary>
            <Suspense fallback={<div className="p-8 text-center text-gray-400">Loading...</div>}>
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/tasks/new" element={<TaskFormPage />} />
                <Route path="/tasks/:id/edit" element={<TaskFormPage />} />
                <Route path="/tasks/:id" element={<TaskDetailPage />} />
                {/* On desktop, redirect calendar to / since calendar is always shown in right column */}
                <Route path="/calendar" element={
                  <>
                    <span className="hidden lg:block"><Navigate to="/" replace /></span>
                    <span className="lg:hidden"><CalendarPage /></span>
                  </>
                } />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </div>

        {/* Right column — Calendar (desktop only) */}
        <div className="hidden lg:block lg:overflow-y-auto">
          <ErrorBoundary>
            <Suspense fallback={<div className="p-8 text-center text-gray-400">Loading...</div>}>
              <CalendarPage />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>

      {/* Bottom nav — mobile only */}
      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
