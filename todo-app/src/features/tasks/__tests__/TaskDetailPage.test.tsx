import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import TaskDetailPage from '../TaskDetailPage';
import type { Task } from '../../../types/task';

const mockDeleteTask = vi.fn();
const mockNavigate = vi.fn();

const baseTask: Task = {
  id: 'task-1',
  title: 'Test Task Title',
  description: 'Test description',
  date: '2026-10-08',
  time: '09:00',
  status: 'todo',
  progress: 0,
  createdAt: '2026-10-08T00:00:00Z',
  updatedAt: '2026-10-08T00:00:00Z',
};

vi.mock('../../../store/taskStore', () => ({
  useTaskStore: () => ({
    tasks: [baseTask],
    deleteTask: mockDeleteTask,
  }),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function renderDetail(taskId = 'task-1') {
  return render(
    <MemoryRouter initialEntries={[`/tasks/${taskId}`]}>
      <Routes>
        <Route path="/tasks/:id" element={<TaskDetailPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('TaskDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders task title and date', () => {
    renderDetail();
    expect(screen.getByText('Test Task Title')).toBeInTheDocument();
    expect(screen.getByText(/2026-10-08/)).toBeInTheDocument();
  });

  it('clicking Delete shows ConfirmDialog', () => {
    renderDetail();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /delete task/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Delete Task')).toBeInTheDocument();
  });

  it('confirming deletes task and navigates to "/"', () => {
    renderDetail();
    fireEvent.click(screen.getByRole('button', { name: /delete task/i }));
    fireEvent.click(screen.getByText('Confirm'));
    expect(mockDeleteTask).toHaveBeenCalledWith('task-1');
    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
  });

  it('canceling does not delete', () => {
    renderDetail();
    fireEvent.click(screen.getByRole('button', { name: /delete task/i }));
    fireEvent.click(screen.getByText('Cancel'));
    expect(mockDeleteTask).not.toHaveBeenCalled();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
