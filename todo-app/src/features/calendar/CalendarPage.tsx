import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTaskStore } from '../../store/taskStore';
import { getTodayString } from '../../utils/dateUtils';
import WeekStrip from './WeekStrip';
import TaskTimeline from './TaskTimeline';

export default function CalendarPage() {
  const navigate = useNavigate();
  const { tasksByDate } = useTaskStore();
  const [selectedDay, setSelectedDay] = useState(getTodayString());

  const dayTasks = tasksByDate(selectedDay);

  return (
    <div className="flex flex-col h-full min-h-screen lg:min-h-0">
      {/* Top bar */}
      <div className="flex justify-between items-center px-6 py-4 bg-white border-b border-gray-100">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-gray-50 lg:hidden"
          aria-label="Go back"
        >
          ←
        </button>
        <div className="hidden lg:block" />
        <button
          onClick={() => navigate(`/tasks/new?date=${selectedDay}`)}
          className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-full font-semibold text-sm"
          aria-label="Add task"
        >
          <span>+</span> Add Task
        </button>
      </div>

      {/* Week strip */}
      <WeekStrip selectedDay={selectedDay} onDaySelect={setSelectedDay} />

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto p-6 pb-24 lg:pb-6">
        <TaskTimeline tasks={dayTasks} />
      </div>
    </div>
  );
}
