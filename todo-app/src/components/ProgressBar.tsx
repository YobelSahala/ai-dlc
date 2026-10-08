interface ProgressBarProps {
  value: number; // 0–100
  className?: string;
}

export default function ProgressBar({ value, className = '' }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className="flex-1 bg-gray-200 rounded-full h-2"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="bg-primary rounded-full h-2 transition-all"
          style={{ width: `${clamped}%` }}
        />
      </div>
      <span className="text-sm font-medium shrink-0">{clamped}%</span>
    </div>
  );
}
