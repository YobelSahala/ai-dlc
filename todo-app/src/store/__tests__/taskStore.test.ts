import { describe, it, expect, beforeEach } from 'vitest';
import { useTaskStore } from '../taskStore';

// Helper to build a minimal task payload (no id/createdAt/updatedAt)
function makeTaskData(overrides: Partial<Parameters<ReturnType<typeof useTaskStore.getState>['addTask']>[0]> = {}) {
  return {
    title: 'Test Task',
    description: 'A description',
    date: '2026-10-08',
    time: '09:00',
    status: 'todo' as const,
    progress: 0,
    ...overrides,
  };
}

describe('taskStore', () => {
  beforeEach(() => {
    // Reset store state between tests
    useTaskStore.setState({ tasks: [] });
  });

  // -------------------------------------------------------------------------
  // addTask
  // -------------------------------------------------------------------------
  describe('addTask', () => {
    it('creates a task with a generated id', () => {
      const { addTask, tasks } = useTaskStore.getState();
      addTask(makeTaskData());
      const updated = useTaskStore.getState().tasks;
      expect(updated).toHaveLength(1);
      expect(updated[0].id).toBeTruthy();
      expect(typeof updated[0].id).toBe('string');
      // tasks from getState before add should still be empty (snapshot)
      expect(tasks).toHaveLength(0);
    });

    it('sets createdAt and updatedAt as ISO strings', () => {
      useTaskStore.getState().addTask(makeTaskData());
      const task = useTaskStore.getState().tasks[0];
      expect(() => new Date(task.createdAt)).not.toThrow();
      expect(() => new Date(task.updatedAt)).not.toThrow();
      expect(task.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
      expect(task.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });

    it('preserves all provided task data', () => {
      const data = makeTaskData({ title: 'My Task', date: '2026-11-01', progress: 50 });
      useTaskStore.getState().addTask(data);
      const task = useTaskStore.getState().tasks[0];
      expect(task.title).toBe('My Task');
      expect(task.date).toBe('2026-11-01');
      expect(task.progress).toBe(50);
    });

    it('accumulates multiple tasks', () => {
      useTaskStore.getState().addTask(makeTaskData({ title: 'A' }));
      useTaskStore.getState().addTask(makeTaskData({ title: 'B' }));
      expect(useTaskStore.getState().tasks).toHaveLength(2);
    });
  });

  // -------------------------------------------------------------------------
  // updateTask — progress 100 → status done
  // -------------------------------------------------------------------------
  describe('updateTask: progress=100 auto-sets status=done', () => {
    it('sets status to done when progress reaches 100', () => {
      useTaskStore.getState().addTask(makeTaskData({ status: 'progress', progress: 50 }));
      const id = useTaskStore.getState().tasks[0].id;
      useTaskStore.getState().updateTask(id, { progress: 100 });
      const task = useTaskStore.getState().tasks[0];
      expect(task.progress).toBe(100);
      expect(task.status).toBe('done');
    });

    it('does not change status when progress < 100', () => {
      useTaskStore.getState().addTask(makeTaskData({ status: 'progress', progress: 0 }));
      const id = useTaskStore.getState().tasks[0].id;
      useTaskStore.getState().updateTask(id, { progress: 80 });
      expect(useTaskStore.getState().tasks[0].status).toBe('progress');
    });
  });

  // -------------------------------------------------------------------------
  // updateTask — status progress→todo resets progress
  // -------------------------------------------------------------------------
  describe('updateTask: status progress→todo resets progress', () => {
    it('resets progress to 0 when moving from progress to todo', () => {
      useTaskStore.getState().addTask(makeTaskData({ status: 'progress', progress: 60 }));
      const id = useTaskStore.getState().tasks[0].id;
      useTaskStore.getState().updateTask(id, { status: 'todo' });
      const task = useTaskStore.getState().tasks[0];
      expect(task.status).toBe('todo');
      expect(task.progress).toBe(0);
    });

    it('does NOT reset progress when moving from todo to todo (already todo)', () => {
      useTaskStore.getState().addTask(makeTaskData({ status: 'todo', progress: 0 }));
      const id = useTaskStore.getState().tasks[0].id;
      useTaskStore.getState().updateTask(id, { status: 'todo' });
      // no previous status of 'progress', so progress stays unchanged
      expect(useTaskStore.getState().tasks[0].progress).toBe(0);
    });

    it('does NOT reset progress when moving from done to todo', () => {
      useTaskStore.getState().addTask(makeTaskData({ status: 'done', progress: 100 }));
      const id = useTaskStore.getState().tasks[0].id;
      // patch.status='todo' but t.status was 'done', not 'progress' → no reset
      useTaskStore.getState().updateTask(id, { status: 'todo' });
      expect(useTaskStore.getState().tasks[0].progress).toBe(100);
    });
  });

  // -------------------------------------------------------------------------
  // updateTask — updatedAt
  // -------------------------------------------------------------------------
  describe('updateTask: updatedAt is refreshed', () => {
    it('updates updatedAt on every patch', async () => {
      useTaskStore.getState().addTask(makeTaskData());
      const id = useTaskStore.getState().tasks[0].id;
      const before = useTaskStore.getState().tasks[0].updatedAt;
      // small delay to ensure timestamp differs
      await new Promise((r) => setTimeout(r, 10));
      useTaskStore.getState().updateTask(id, { title: 'Changed' });
      const after = useTaskStore.getState().tasks[0].updatedAt;
      expect(after).not.toBe(before);
    });
  });

  // -------------------------------------------------------------------------
  // deleteTask
  // -------------------------------------------------------------------------
  describe('deleteTask', () => {
    it('removes the task with the given id', () => {
      useTaskStore.getState().addTask(makeTaskData({ title: 'Keep' }));
      useTaskStore.getState().addTask(makeTaskData({ title: 'Delete me' }));
      const tasks = useTaskStore.getState().tasks;
      const deleteId = tasks.find((t) => t.title === 'Delete me')!.id;
      useTaskStore.getState().deleteTask(deleteId);
      const remaining = useTaskStore.getState().tasks;
      expect(remaining).toHaveLength(1);
      expect(remaining[0].title).toBe('Keep');
    });

    it('is a no-op for a non-existent id', () => {
      useTaskStore.getState().addTask(makeTaskData());
      useTaskStore.getState().deleteTask('nonexistent-id');
      expect(useTaskStore.getState().tasks).toHaveLength(1);
    });
  });

  // -------------------------------------------------------------------------
  // searchTasks — case-insensitive
  // -------------------------------------------------------------------------
  describe('searchTasks: case-insensitive', () => {
    it('finds tasks regardless of case', () => {
      useTaskStore.getState().addTask(makeTaskData({ title: 'Buy Groceries' }));
      useTaskStore.getState().addTask(makeTaskData({ title: 'Call Dentist' }));
      expect(useTaskStore.getState().searchTasks('buy')).toHaveLength(1);
      expect(useTaskStore.getState().searchTasks('BUY')).toHaveLength(1);
      expect(useTaskStore.getState().searchTasks('gRoCeRiEs')).toHaveLength(1);
    });

    it('returns all matching tasks', () => {
      useTaskStore.getState().addTask(makeTaskData({ title: 'Buy milk' }));
      useTaskStore.getState().addTask(makeTaskData({ title: 'Buy bread' }));
      useTaskStore.getState().addTask(makeTaskData({ title: 'Sleep' }));
      expect(useTaskStore.getState().searchTasks('buy')).toHaveLength(2);
    });

    it('returns empty array when no match', () => {
      useTaskStore.getState().addTask(makeTaskData({ title: 'Task One' }));
      expect(useTaskStore.getState().searchTasks('xyz')).toHaveLength(0);
    });
  });

  // -------------------------------------------------------------------------
  // tasksByDate
  // -------------------------------------------------------------------------
  describe('tasksByDate', () => {
    it('returns only tasks matching the given date', () => {
      useTaskStore.getState().addTask(makeTaskData({ date: '2026-10-08' }));
      useTaskStore.getState().addTask(makeTaskData({ date: '2026-10-08' }));
      useTaskStore.getState().addTask(makeTaskData({ date: '2026-10-09' }));
      expect(useTaskStore.getState().tasksByDate('2026-10-08')).toHaveLength(2);
      expect(useTaskStore.getState().tasksByDate('2026-10-09')).toHaveLength(1);
    });

    it('returns empty array when no tasks match', () => {
      useTaskStore.getState().addTask(makeTaskData({ date: '2026-10-08' }));
      expect(useTaskStore.getState().tasksByDate('2099-01-01')).toHaveLength(0);
    });
  });

  // -------------------------------------------------------------------------
  // tasksByStatus
  // -------------------------------------------------------------------------
  describe('tasksByStatus', () => {
    it('filters by todo status', () => {
      useTaskStore.getState().addTask(makeTaskData({ status: 'todo' }));
      useTaskStore.getState().addTask(makeTaskData({ status: 'todo' }));
      useTaskStore.getState().addTask(makeTaskData({ status: 'progress' }));
      useTaskStore.getState().addTask(makeTaskData({ status: 'done' }));
      expect(useTaskStore.getState().tasksByStatus('todo')).toHaveLength(2);
    });

    it('filters by progress status', () => {
      useTaskStore.getState().addTask(makeTaskData({ status: 'progress' }));
      useTaskStore.getState().addTask(makeTaskData({ status: 'done' }));
      expect(useTaskStore.getState().tasksByStatus('progress')).toHaveLength(1);
    });

    it('filters by done status', () => {
      useTaskStore.getState().addTask(makeTaskData({ status: 'done' }));
      useTaskStore.getState().addTask(makeTaskData({ status: 'done' }));
      useTaskStore.getState().addTask(makeTaskData({ status: 'todo' }));
      expect(useTaskStore.getState().tasksByStatus('done')).toHaveLength(2);
    });

    it('returns empty array when no tasks match', () => {
      useTaskStore.getState().addTask(makeTaskData({ status: 'todo' }));
      expect(useTaskStore.getState().tasksByStatus('done')).toHaveLength(0);
    });
  });
});
