import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Task, TaskStatus } from '../types/task';
import { generateId } from '../utils/idUtils';

interface TaskStore {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, patch: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;
  deleteTask: (id: string) => void;
  tasksByDate: (date: string) => Task[];
  tasksByStatus: (status: TaskStatus) => Task[];
  searchTasks: (query: string) => Task[];
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      addTask: (taskData) => {
        const now = new Date().toISOString();
        const task: Task = {
          ...taskData,
          id: generateId(),
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ tasks: [...state.tasks, task] }));
      },
      updateTask: (id, patch) => {
        set((state) => ({
          tasks: state.tasks.map((t) => {
            if (t.id !== id) return t;
            const updated = { ...t, ...patch, updatedAt: new Date().toISOString() };
            // Business rule: progress 100 → done
            if (updated.progress === 100) updated.status = 'done';
            // Business rule: status progress→todo resets progress
            if (patch.status === 'todo' && t.status === 'progress') updated.progress = 0;
            return updated;
          }),
        }));
      },
      deleteTask: (id) => {
        set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }));
      },
      tasksByDate: (date) => get().tasks.filter((t) => t.date === date),
      tasksByStatus: (status) => get().tasks.filter((t) => t.status === status),
      searchTasks: (query) => {
        const q = query.toLowerCase();
        return get().tasks.filter((t) => t.title.toLowerCase().includes(q));
      },
    }),
    {
      name: import.meta.env.VITE_STORAGE_KEY ?? 'todo-app-state',
    }
  )
);
