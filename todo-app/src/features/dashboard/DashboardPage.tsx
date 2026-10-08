import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTaskStore } from '../../store/taskStore';
import { getTodayString } from '../../utils/dateUtils';
import SearchBar from '../../components/SearchBar';
import CategoryFilter from './CategoryFilter';
import TodayTaskList from './TodayTaskList';
import type { TaskStatus } from '../../types/task';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { tasks, tasksByDate, tasksByStatus, searchTasks } = useTaskStore();
  const [activeFilter, setActiveFilter] = useState<TaskStatus | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const today = getTodayString();

  // Monthly count
  const currentMonth = today.slice(0, 7); // YYYY-MM
  const monthlyCount = tasks.filter(t => t.date.startsWith(currentMonth)).length;

  // Category counts
  const counts: Record<TaskStatus, number> = {
    todo: tasksByStatus('todo').length,
    progress: tasksByStatus('progress').length,
    done: tasksByStatus('done').length,
  };

  // Today's tasks, filtered by category and/or search
  let todayTasks = tasksByDate(today);
  if (activeFilter) todayTasks = todayTasks.filter(t => t.status === activeFilter);
  if (searchQuery) todayTasks = searchTasks(searchQuery).filter(t => t.date === today);

  return (
    <div className="p-6 pb-24 lg:pb-6 max-w-lg mx-auto">
      {/* Top bar */}
      <div className="flex justify-between items-center mb-6">
        <button aria-label="Menu" className="p-2 rounded-xl bg-white shadow-sm">
          <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
            <rect width="20" height="2" rx="1" fill="#1A1A4E"/>
            <rect y="6" width="14" height="2" rx="1" fill="#1A1A4E"/>
            <rect y="12" width="20" height="2" rx="1" fill="#1A1A4E"/>
          </svg>
        </button>
        <div className="w-10 h-10 rounded-full bg-orange-400 flex items-center justify-center text-lg" aria-label="User avatar">
          🧑
        </div>
      </div>

      {/* Greeting */}
      <p className="text-gray-500 text-sm mb-1">{getGreeting()}, Alex!</p>
      <h1 className="text-heading text-2xl font-bold mb-6 leading-tight">
        You have{' '}
        <span className="text-primary">{monthlyCount} tasks</span>
        {' '}this month 👍
      </h1>

      {/* Search */}
      <div className="mb-6">
        <SearchBar onSearch={setSearchQuery} placeholder="Search a task..." />
      </div>

      {/* Category filter */}
      <div className="mb-8">
        <CategoryFilter activeFilter={activeFilter} counts={counts} onFilter={setActiveFilter} />
      </div>

      {/* Today's tasks */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-heading text-lg font-bold">Today's Tasks</h2>
        <button
          onClick={() => navigate('/calendar')}
          className="text-gray-400 text-sm"
          aria-label="See all tasks"
        >
          See All
        </button>
      </div>
      <TodayTaskList tasks={todayTasks} />
    </div>
  );
}
