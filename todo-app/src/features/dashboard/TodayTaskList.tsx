import { useNavigate } from 'react-router-dom';
import TaskCard from '../../components/TaskCard';
import EmptyState from '../../components/EmptyState';
import type { Task } from '../../types/task';

interface Props { tasks: Task[]; }

export default function TodayTaskList({ tasks }: Props) {
  const navigate = useNavigate();
  if (tasks.length === 0) return <EmptyState message="No tasks for today" />;
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none">
      {tasks.map(task => (
        <div key={task.id} className="snap-start flex-none w-56">
          <TaskCard task={task} onClick={() => navigate(`/tasks/${task.id}`)} />
        </div>
      ))}
    </div>
  );
}
