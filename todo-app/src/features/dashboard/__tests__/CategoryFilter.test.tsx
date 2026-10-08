import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CategoryFilter from '../CategoryFilter';
import type { TaskStatus } from '../../../types/task';

const counts: Record<TaskStatus, number> = {
  todo: 5,
  progress: 3,
  done: 8,
};

describe('CategoryFilter', () => {
  it('renders all 3 categories', () => {
    render(<CategoryFilter activeFilter={null} counts={counts} onFilter={vi.fn()} />);
    expect(screen.getByLabelText('Filter by To-Do (5)')).toBeInTheDocument();
    expect(screen.getByLabelText('Filter by Progress (3)')).toBeInTheDocument();
    expect(screen.getByLabelText('Filter by Done (8)')).toBeInTheDocument();
  });

  it('highlights the active filter via aria-pressed', () => {
    render(<CategoryFilter activeFilter="todo" counts={counts} onFilter={vi.fn()} />);
    const todoBtn = screen.getByLabelText('Filter by To-Do (5)');
    const progressBtn = screen.getByLabelText('Filter by Progress (3)');
    expect(todoBtn).toHaveAttribute('aria-pressed', 'true');
    expect(progressBtn).toHaveAttribute('aria-pressed', 'false');
  });

  it('calls onFilter with null when the same active filter is tapped again', () => {
    const onFilter = vi.fn();
    render(<CategoryFilter activeFilter="todo" counts={counts} onFilter={onFilter} />);
    fireEvent.click(screen.getByLabelText('Filter by To-Do (5)'));
    expect(onFilter).toHaveBeenCalledWith(null);
  });

  it('calls onFilter with the status when an inactive filter is tapped', () => {
    const onFilter = vi.fn();
    render(<CategoryFilter activeFilter={null} counts={counts} onFilter={onFilter} />);
    fireEvent.click(screen.getByLabelText('Filter by Progress (3)'));
    expect(onFilter).toHaveBeenCalledWith('progress');
  });
});
