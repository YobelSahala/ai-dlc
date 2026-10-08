export type TaskStatus = 'todo' | 'progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  date: string;        // YYYY-MM-DD
  time: string;        // HH:MM (24h)
  status: TaskStatus;
  progress: number;    // 0–100 integer
  createdAt: string;   // ISO 8601
  updatedAt: string;   // ISO 8601
}

export interface AppState {
  tasks: Task[];
  version: number;
}
