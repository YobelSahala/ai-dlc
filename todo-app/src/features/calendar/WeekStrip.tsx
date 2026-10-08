import { useTaskStore } from '../../store/taskStore';
import { getWeekDays, isToday } from '../../utils/dateUtils';

interface Props {
  selectedDay: string;
  onDaySelect: (date: string) => void;
}

export default function WeekStrip({ selectedDay, onDaySelect }: Props) {
  const { tasks } = useTaskStore();
  const days = getWeekDays(new Date());

  return (
    <div className="flex justify-around py-4 bg-white border-b border-gray-100">
      {days.map(({ date, label, dayNum }) => {
        const hasTasks = tasks.some(t => t.date === date);
        const isSelected = selectedDay === date;
        const todayDay = isToday(date);

        return (
          <button
            key={date}
            onClick={() => onDaySelect(date)}
            className="flex flex-col items-center gap-1 px-2"
            aria-label={`${label} ${dayNum}${hasTasks ? ', has tasks' : ''}`}
            aria-pressed={isSelected}
          >
            <span className={`text-xs font-medium ${todayDay || isSelected ? 'text-primary' : 'text-gray-400'}`}>
              {label}
            </span>
            <span className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold transition-all ${
              isSelected
                ? 'bg-primary text-white'
                : todayDay
                ? 'text-primary font-bold'
                : 'text-heading'
            }`}>
              {dayNum}
            </span>
            {/* Dot indicator */}
            <span className={`w-1 h-1 rounded-full ${hasTasks ? 'bg-primary' : 'bg-transparent'}`} />
          </button>
        );
      })}
    </div>
  );
}
