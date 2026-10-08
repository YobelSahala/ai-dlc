import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import SearchBar from '../SearchBar';

describe('SearchBar', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders an input field', () => {
    render(<SearchBar onSearch={vi.fn()} placeholder="Search tasks" />);
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });

  it('does NOT call onSearch immediately on input', () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'hello' } });
    expect(onSearch).not.toHaveBeenCalled();
  });

  it('calls onSearch after 150ms debounce', () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'hello' } });
    vi.advanceTimersByTime(150);
    expect(onSearch).toHaveBeenCalledWith('hello');
    expect(onSearch).toHaveBeenCalledTimes(1);
  });

  it('debounces multiple rapid changes — only fires once', () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);
    const input = screen.getByRole('searchbox');
    fireEvent.change(input, { target: { value: 'a' } });
    fireEvent.change(input, { target: { value: 'ab' } });
    fireEvent.change(input, { target: { value: 'abc' } });
    vi.advanceTimersByTime(150);
    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledWith('abc');
  });
});
