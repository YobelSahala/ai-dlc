import type { TaskStatus } from '../../types/task';

interface Props {
  activeFilter: TaskStatus | null;
  counts: Record<TaskStatus, number>;
  onFilter: (status: TaskStatus | null) => void;
}

export default function CategoryFilter({ activeFilter, counts, onFilter }: Props) {
  const categories: { status: TaskStatus; label: string; emoji: string; color: string }[] = [
    { status: 'todo', label: 'To-Do', emoji: '📋', color: 'text-danger' },
    { status: 'progress', label: 'Progress', emoji: '📌', color: 'text-yellow-500' },
    { status: 'done', label: 'Done', emoji: '✅', color: 'text-green-500' },
  ];

  return (
    <div className="flex gap-6 justify-around">
      {categories.map(({ status, label, emoji, color }) => (
        <button
          key={status}
          onClick={() => onFilter(activeFilter === status ? null : status)}
          className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-all ${
            activeFilter === status ? 'bg-primary/10 ring-2 ring-primary' : 'bg-white'
          }`}
          aria-pressed={activeFilter === status}
          aria-label={`Filter by ${label} (${counts[status]})`}
        >
          <span className={`text-2xl ${color}`}>{emoji}</span>
          <span className="text-xs font-medium text-gray-600">{label}</span>
          <span className="text-xs text-gray-400">{counts[status]}</span>
        </button>
      ))}
    </div>
  );
}
