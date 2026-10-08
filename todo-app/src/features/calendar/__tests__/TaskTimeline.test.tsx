import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TaskTimeline from '../TaskTimeline';
import type { Task } from '../../../types/task';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

const makeTasks = (overrides: Partial<Task>[] = []): Task[] =>
  overrides.map((o, i) => ({
    id: `task-${i}`,
    title: `Task ${i}`,
    description: '',
    date: '2026-10-08',
    time: '09:00',
    status: 'todo' as const,
    progress: 0,
    createdAt: '2026-10-08T00:00:00Z',
    updatedAt: '2026-10-08T00:00:00Z',
    ...o,
  }));

describe('TaskTimeline', () => {
  it('renders tasks sorted by time', () => {
    const tasks = makeTasks([
      { id: 'a', title: 'Late Task', time: '14:00' },
      { id: 'b', title: 'Early Task', time: '08:00' },
      { id: 'c', title: 'Mid Task', time: '11:00' },
    ]);

    render(<TaskTimeline tasks={tasks} />);

    const titles = screen.getAllByRole('button').map((btn) =>
      btn.querySelector('span.font-semibold')?.textContent
    );
    expect(titles).toEqual(['Early Task', 'Mid Task', 'Late Task']);
  });

  it('shows empty state when tasks array is empty', () => {
    render(<TaskTimeline tasks={[]} />);
    expect(screen.getByText('No tasks scheduled for this day')).toBeInTheDocument();
  });

  it('calls navigate when a task card is clicked', () => {
    const tasks = makeTasks([{ id: 'nav-task', title: 'Navigate Me', time: '10:00' }]);
    render(<TaskTimeline tasks={tasks} />);

    const card = screen.getByRole('button', { name: /Navigate Me/i });
    fireEvent.click(card);

    expect(mockNavigate).toHaveBeenCalledWith('/tasks/nav-task');
  });

  it('calls navigate when Enter key is pressed on a task card', () => {
    const tasks = makeTasks([{ id: 'key-task', title: 'Key Task', time: '10:00' }]);
    render(<TaskTimeline tasks={tasks} />);

    const card = screen.getByRole('button', { name: /Key Task/i });
    fireEvent.keyDown(card, { key: 'Enter' });

    expect(mockNavigate).toHaveBeenCalledWith('/tasks/key-task');
  });
});
