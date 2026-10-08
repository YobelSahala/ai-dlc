import type { Task } from '../types/task';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
  className?: string;
}

const statusClasses: Record<Task['status'], string> = {
  todo: 'bg-primary text-white',
  progress: 'bg-danger text-white',
  done: 'bg-green-500 text-white',
};

export default function TaskCard({ task, onClick, className = '' }: TaskCardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick?.();
      }}
      className={[
        'rounded-2xl p-4 cursor-pointer select-none',
        statusClasses[task.status],
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <h3 className="font-bold text-base leading-snug">{task.title}</h3>
        <span className="text-xs opacity-80 shrink-0">{task.time}</span>
      </div>

      <p className="text-sm opacity-80 line-clamp-2 mb-3">{task.description}</p>

      {/* Progress bar with white track for colored cards */}
      <div className="flex items-center gap-2">
        <div
          className="flex-1 bg-white/30 rounded-full h-2"
          role="progressbar"
          aria-valuenow={task.progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="bg-white rounded-full h-2 transition-all"
            style={{ width: `${task.progress}%` }}
          />
        </div>
        <span className="text-xs font-medium opacity-90">{task.progress}%</span>
      </div>
    </div>
  );
}
