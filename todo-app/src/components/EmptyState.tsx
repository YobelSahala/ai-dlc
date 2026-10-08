interface EmptyStateProps {
  message: string;
  className?: string;
}

export default function EmptyState({ message, className = '' }: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 py-16 text-center ${className}`}
    >
      <span className="text-5xl" role="img" aria-label="empty list">
        📋
      </span>
      <p className="text-gray-400 text-sm">{message}</p>
    </div>
  );
}
