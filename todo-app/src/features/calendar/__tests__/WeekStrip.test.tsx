import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import WeekStrip from '../WeekStrip';
import * as taskStoreModule from '../../../store/taskStore';
import { getWeekDays } from '../../../utils/dateUtils';

// Build stable week days based on a fixed date so tests don't depend on real "today"
const FIXED_DATE = new Date('2026-10-08'); // Thursday
const WEEK_DAYS = getWeekDays(FIXED_DATE);

// A task that falls on Monday of that week
const TASK_WITH_DATE = {
  id: '1',
  title: 'Monday Task',
  description: '',
  date: WEEK_DAYS[0].date, // Monday
  time: '09:00',
  status: 'todo' as const,
  progress: 0,
  createdAt: '2026-10-05T00:00:00Z',
  updatedAt: '2026-10-05T00:00:00Z',
};

vi.mock('../../../store/taskStore');

describe('WeekStrip', () => {
  beforeEach(() => {
    vi.mocked(taskStoreModule.useTaskStore).mockReturnValue({
      tasks: [TASK_WITH_DATE],
      addTask: vi.fn(),
      updateTask: vi.fn(),
      deleteTask: vi.fn(),
      tasksByDate: vi.fn(),
      tasksByStatus: vi.fn(),
      searchTasks: vi.fn(),
    });
  });

  it('renders 7 day buttons', () => {
    const onDaySelect = vi.fn();
    render(<WeekStrip selectedDay={WEEK_DAYS[3].date} onDaySelect={onDaySelect} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(7);
  });

  it('highlights the selected day with aria-pressed=true', () => {
    const selectedDate = WEEK_DAYS[2].date; // Wednesday
    render(<WeekStrip selectedDay={selectedDate} onDaySelect={vi.fn()} />);

    const pressedButtons = screen.getAllByRole('button').filter(
      (btn) => btn.getAttribute('aria-pressed') === 'true'
    );
    expect(pressedButtons).toHaveLength(1);
    expect(pressedButtons[0]).toHaveAttribute('aria-label', expect.stringContaining('Wed'));
  });

  it('calls onDaySelect with the correct date string when a button is clicked', () => {
    const onDaySelect = vi.fn();
    render(<WeekStrip selectedDay={WEEK_DAYS[3].date} onDaySelect={onDaySelect} />);

    // Click Tuesday (index 1)
    const tuesdayBtn = screen.getByRole('button', { name: /Tue/i });
    fireEvent.click(tuesdayBtn);

    expect(onDaySelect).toHaveBeenCalledTimes(1);
    expect(onDaySelect).toHaveBeenCalledWith(WEEK_DAYS[1].date);
  });

  it('shows dot indicator for days with tasks and hides it for days without', () => {
    render(<WeekStrip selectedDay={WEEK_DAYS[3].date} onDaySelect={vi.fn()} />);

    // Monday button should mention "has tasks" in aria-label
    const mondayBtn = screen.getByRole('button', { name: /Mon.*has tasks/i });
    expect(mondayBtn).toBeInTheDocument();

    // Tuesday should NOT mention "has tasks"
    const tuesdayLabel = screen.getByRole('button', { name: /^Tue \d+$/ });
    expect(tuesdayLabel).toBeInTheDocument();
  });
});
