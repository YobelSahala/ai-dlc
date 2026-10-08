import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTaskStore } from '../../store/taskStore';
import ConfirmDialog from '../../components/ConfirmDialog';
import ProgressBar from '../../components/ProgressBar';

const STATUS_LABEL: Record<string, string> = {
  todo: 'To-Do',
  progress: 'In Progress',
  done: 'Done',
};

export default function TaskDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tasks, deleteTask } = useTaskStore();
  const [showConfirm, setShowConfirm] = useState(false);

  const task = tasks.find(t => t.id === id);

  if (!task) {
    navigate('/', { replace: true });
    return null;
  }

  const handleDelete = () => {
    deleteTask(task.id);
    navigate('/', { replace: true });
  };

  return (
    <div className="p-6 pb-24 lg:pb-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-white shadow-sm" aria-label="Go back">←</button>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/tasks/${task.id}/edit`)}
            className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold"
            aria-label="Edit task"
          >
            Edit
          </button>
          <button
            onClick={() => setShowConfirm(true)}
            className="px-4 py-2 rounded-xl bg-danger/10 text-danger text-sm font-semibold"
            aria-label="Delete task"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Task details */}
      <div className="bg-white rounded-3xl p-6 shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-heading text-xl font-bold flex-1">{task.title}</h1>
          <span className={`ml-3 px-3 py-1 rounded-full text-xs font-semibold ${
            task.status === 'todo' ? 'bg-danger/10 text-danger' :
            task.status === 'progress' ? 'bg-primary/10 text-primary' :
            'bg-green-50 text-green-600'
          }`}>
            {STATUS_LABEL[task.status]}
          </span>
        </div>

        {task.description && (
          <p className="text-gray-500 text-sm mb-6">{task.description}</p>
        )}

        <div className="flex gap-4 text-sm text-gray-500 mb-6">
          <span>📅 {task.date}</span>
          <span>🕐 {task.time}</span>
        </div>

        {task.status === 'progress' && (
          <div>
            <p className="text-sm font-medium text-heading mb-2">Progress</p>
            <ProgressBar value={task.progress} />
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}
