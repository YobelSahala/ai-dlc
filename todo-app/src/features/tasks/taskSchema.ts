import { z } from 'zod';

export const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  description: z.string().max(500, 'Description too long').optional().default(''),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format'),
  status: z.enum(['todo', 'progress', 'done']).default('todo'),
  progress: z.number().int().min(0).max(100).default(0),
});

export type TaskFormValues = z.infer<typeof taskSchema>;
