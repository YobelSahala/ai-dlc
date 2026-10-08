import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TaskCard from '../TaskCard';
import type { Task } from '../../types/task';

const baseTask: Task = {
  id: '1',
  title: 'Test Task',
  description: 'A test description',
  date: '2024-01-01',
  time: '09:00',
  status: 'todo',
  progress: 40,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

describe('TaskCard', () => {
  it('renders title and time', () => {
    render(<TaskCard task={baseTask} />);
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('09:00')).toBeInTheDocument();
  });

  it('shows correct background class for todo status', () => {
    const { container } = render(<TaskCard task={{ ...baseTask, status: 'todo' }} />);
    expect(container.firstChild).toHaveClass('bg-primary');
  });

  it('shows correct background class for progress status', () => {
    const { container } = render(<TaskCard task={{ ...baseTask, status: 'progress' }} />);
    expect(container.firstChild).toHaveClass('bg-danger');
  });

  it('shows correct background class for done status', () => {
    const { container } = render(<TaskCard task={{ ...baseTask, status: 'done' }} />);
    expect(container.firstChild).toHaveClass('bg-green-500');
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<TaskCard task={baseTask} onClick={handleClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('calls onClick when Enter key is pressed', () => {
    const handleClick = vi.fn();
    render(<TaskCard task={baseTask} onClick={handleClick} />);
    fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' });
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
