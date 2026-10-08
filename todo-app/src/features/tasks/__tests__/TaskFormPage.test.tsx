import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import TaskFormPage from '../TaskFormPage';

// Mock the store
const mockAddTask = vi.fn();
const mockUpdateTask = vi.fn();

vi.mock('../../../store/taskStore', () => ({
  useTaskStore: () => ({
    tasks: [],
    addTask: mockAddTask,
    updateTask: mockUpdateTask,
  }),
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock dateUtils
vi.mock('../../../utils/dateUtils', () => ({
  getTodayString: () => '2026-10-08',
}));

function renderForm(path = '/tasks/new') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/tasks/new" element={<TaskFormPage />} />
        <Route path="/tasks/:id/edit" element={<TaskFormPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('TaskFormPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows "Title is required" when submitted with empty title', async () => {
    renderForm();
    fireEvent.click(screen.getByRole('button', { name: /add task/i }));
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Title is required');
    });
  });

  it('does not show progress field when status is "todo"', () => {
    renderForm();
    // Default status is 'todo'
    expect(screen.queryByLabelText(/progress/i)).not.toBeInTheDocument();
  });

  it('shows progress field when status is "progress"', async () => {
    const user = userEvent.setup();
    renderForm();
    const statusSelect = screen.getByLabelText(/status/i);
    await user.selectOptions(statusSelect, 'progress');
    await waitFor(() => {
      expect(screen.getByLabelText(/progress/i)).toBeInTheDocument();
    });
  });

  it('calls addTask with correct data on valid submit', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText(/title \*/i), 'My New Task');

    // Clear and set date
    const dateInput = screen.getByLabelText(/date \*/i);
    fireEvent.change(dateInput, { target: { value: '2026-10-08' } });

    // Clear and set time
    const timeInput = screen.getByLabelText(/time \*/i);
    fireEvent.change(timeInput, { target: { value: '09:00' } });

    fireEvent.click(screen.getByRole('button', { name: /add task/i }));

    await waitFor(() => {
      expect(mockAddTask).toHaveBeenCalledTimes(1);
      expect(mockAddTask).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'My New Task',
          status: 'todo',
        })
      );
    });
  });
});
