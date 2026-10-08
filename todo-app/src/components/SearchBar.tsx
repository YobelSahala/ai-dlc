import { useRef } from 'react';
import type { ChangeEvent } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({
  onSearch,
  placeholder = 'Search…',
  className = '',
}: SearchBarProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onSearch(value);
    }, 150);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Search icon */}
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </span>
      <input
        type="search"
        placeholder={placeholder}
        onChange={handleChange}
        aria-label={placeholder}
        className="w-full rounded-full bg-white shadow-sm px-4 py-3 pl-11 text-sm
          focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
          placeholder:text-gray-400"
      />
    </div>
  );
}
