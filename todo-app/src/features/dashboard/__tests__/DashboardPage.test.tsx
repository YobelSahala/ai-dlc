import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import DashboardPage from '../DashboardPage';
import type { Task } from '../../../types/task';

// Mock the task store
vi.mock('../../../store/taskStore', () => ({
  useTaskStore: vi.fn(),
}));

import { useTaskStore } from '../../../store/taskStore';

const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
const currentMonth = today.slice(0, 7);

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Task One',
    description: 'Desc one',
    date: today,
    time: '09:00',
    status: 'todo',
    progress: 0,
    createdAt: `${today}T00:00:00Z`,
    updatedAt: `${today}T00:00:00Z`,
  },
  {
    id: '2',
    title: 'Task Two',
    description: 'Desc two',
    date: today,
    time: '10:00',
    status: 'progress',
    progress: 50,
    createdAt: `${today}T00:00:00Z`,
    updatedAt: `${today}T00:00:00Z`,
  },
  {
    id: '3',
    title: 'Task Three',
    description: 'Desc three',
    date: `${currentMonth}-01`,
    time: '11:00',
    status: 'done',
    progress: 100,
    createdAt: `${currentMonth}-01T00:00:00Z`,
    updatedAt: `${currentMonth}-01T00:00:00Z`,
  },
];

function setupStore(tasks: Task[] = mockTasks) {
  (useTaskStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
    tasks,
    tasksByDate: (date: string) => tasks.filter(t => t.date === date),
    tasksByStatus: (status: string) => tasks.filter(t => t.status === status),
    searchTasks: (query: string) =>
      tasks.filter(t => t.title.toLowerCase().includes(query.toLowerCase())),
  });
}

function renderDashboard() {
  return render(
    <MemoryRouter>
      <DashboardPage />
    </MemoryRouter>
  );
}

describe('DashboardPage', () => {
  beforeEach(() => {
    setupStore();
  });

  it('renders greeting text', () => {
    renderDashboard();
    // Greeting is one of Good Morning/Afternoon/Evening
    const greeting = screen.getByText(/Good (Morning|Afternoon|Evening), Alex!/);
    expect(greeting).toBeInTheDocument();
  });

  it('renders monthly task count', () => {
    renderDashboard();
    // All 3 mock tasks are in the current month
    expect(screen.getByText('3 tasks')).toBeInTheDocument();
    expect(screen.getByText(/this month/)).toBeInTheDocument();
  });

  it('renders category filter', () => {
    renderDashboard();
    expect(screen.getByLabelText(/Filter by To-Do/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Filter by Progress/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Filter by Done/)).toBeInTheDocument();
  });

  it("renders today's tasks list", () => {
    renderDashboard();
    // Tasks with today's date
    expect(screen.getByText('Task One')).toBeInTheDocument();
    expect(screen.getByText('Task Two')).toBeInTheDocument();
    // Task Three is not today
    expect(screen.queryByText('Task Three')).not.toBeInTheDocument();
  });
});
