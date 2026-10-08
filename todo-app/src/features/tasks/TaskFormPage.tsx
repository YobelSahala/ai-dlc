import { useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useForm, Controller, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTaskStore } from '../../store/taskStore';
import { taskSchema, type TaskFormValues } from './taskSchema';
import { getTodayString } from '../../utils/dateUtils';

// The zod schema has optional fields with defaults; use the output type for the form
type FormValues = Required<TaskFormValues>;

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: 'todo', label: 'To-Do' },
  { value: 'progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];

export default function TaskFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { tasks, addTask, updateTask } = useTaskStore();

  const isEditing = Boolean(id);
  const existingTask = id ? tasks.find(t => t.id === id) : undefined;
  const prefillDate = searchParams.get('date') ?? getTodayString();

  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(taskSchema) as Resolver<FormValues>,
    defaultValues: {
      title: '',
      description: '',
      date: prefillDate,
      time: '09:00',
      status: 'todo',
      progress: 0,
    },
  });

  useEffect(() => {
    if (existingTask) {
      reset({
        title: existingTask.title,
        description: existingTask.description,
        date: existingTask.date,
        time: existingTask.time,
        status: existingTask.status,
        progress: existingTask.progress,
      });
    }
  }, [existingTask, reset]);

  const currentStatus = watch('status');

  const onSubmit = (data: FormValues) => {
    if (isEditing && id) {
      updateTask(id, data);
      navigate(`/tasks/${id}`);
    } else {
      addTask(data);
      navigate('/');
    }
  };

  const inputClass = 'w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary';
  const errorClass = 'text-danger text-xs mt-1';

  return (
    <div className="p-6 pb-24 lg:pb-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-white shadow-sm" aria-label="Go back">←</button>
        <h1 className="text-heading text-xl font-bold">{isEditing ? 'Edit Task' : 'Add Task'}</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-heading mb-1" htmlFor="title">Title *</label>
          <input id="title" {...register('title')} className={inputClass} placeholder="Task title" />
          {errors.title && <p className={errorClass} role="alert">{errors.title.message}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-heading mb-1" htmlFor="description">Description</label>
          <textarea id="description" {...register('description')} className={`${inputClass} resize-none h-20`} placeholder="Optional description" />
        </div>

        {/* Date + Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-heading mb-1" htmlFor="date">Date *</label>
            <input id="date" type="date" {...register('date')} className={inputClass} />
            {errors.date && <p className={errorClass} role="alert">{errors.date.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-heading mb-1" htmlFor="time">Time *</label>
            <input id="time" type="time" {...register('time')} className={inputClass} />
            {errors.time && <p className={errorClass} role="alert">{errors.time.message}</p>}
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-heading mb-1" htmlFor="status">Status</label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <select id="status" {...field} className={inputClass}>
                {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            )}
          />
        </div>

        {/* Progress — only when status is progress */}
        {currentStatus === 'progress' && (
          <div>
            <label className="block text-sm font-medium text-heading mb-1" htmlFor="progress">
              Progress: {watch('progress')}%
            </label>
            <input
              id="progress"
              type="range"
              min={0}
              max={100}
              step={1}
              {...register('progress', { valueAsNumber: true })}
              className="w-full accent-primary"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button type="button" onClick={() => navigate(-1)} className="flex-1 py-3 rounded-2xl border border-gray-200 text-gray-500 font-semibold">
            Cancel
          </button>
          <button type="submit" className="flex-1 py-3 rounded-2xl bg-primary text-white font-semibold">
            {isEditing ? 'Save Changes' : '+ Add Task'}
          </button>
        </div>
      </form>
    </div>
  );
}
