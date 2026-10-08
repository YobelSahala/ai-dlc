import { useNavigate } from 'react-router-dom';
import EmptyState from '../../components/EmptyState';
import type { Task } from '../../types/task';

// Timeline dot color by status
function dotColor(status: Task['status']): string {
  if (status === 'todo') return 'bg-danger';
  if (status === 'progress') return 'bg-primary';
  return 'bg-green-500';
}

// Card background by status (pastel variants for timeline)
function cardBg(status: Task['status']): string {
  if (status === 'todo') return 'bg-danger/10 border-l-4 border-danger';
  if (status === 'progress') return 'bg-primary/10 border-l-4 border-primary';
  return 'bg-green-50 border-l-4 border-green-400';
}

interface Props { tasks: Task[]; }

export default function TaskTimeline({ tasks }: Props) {
  const navigate = useNavigate();

  const sorted = [...tasks].sort((a, b) => a.time.localeCompare(b.time));

  if (sorted.length === 0) return <EmptyState message="No tasks scheduled for this day" />;

  return (
    <div className="flex flex-col gap-0">
      {sorted.map((task) => (
        <div key={task.id} className="flex gap-3 items-stretch">
          {/* Timeline line + dot */}
          <div className="flex flex-col items-center w-6 pt-4">
            <span className={`w-3 h-3 rounded-full flex-none ${dotColor(task.status)}`} />
            <span className="flex-1 w-px bg-gray-200 mt-1" />
          </div>

          {/* Task card */}
          <div
            className={`flex-1 mb-4 p-4 rounded-2xl cursor-pointer ${cardBg(task.status)}`}
            onClick={() => navigate(`/tasks/${task.id}`)}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && navigate(`/tasks/${task.id}`)}
            aria-label={`${task.title} at ${task.time}`}
          >
            <div className="flex justify-between items-start mb-1">
              <span className="font-semibold text-heading text-sm">{task.title}</span>
              <span className="text-xs text-gray-500">{task.time}</span>
            </div>
            {task.description && (
              <p className="text-xs text-gray-500 line-clamp-2">{task.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
