import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import EmptyState from '../EmptyState';

describe('EmptyState', () => {
  it('renders the message', () => {
    render(<EmptyState message="No tasks found" />);
    expect(screen.getByText('No tasks found')).toBeInTheDocument();
  });

  it('renders the clipboard emoji', () => {
    render(<EmptyState message="Nothing here" />);
    expect(screen.getByRole('img', { name: 'empty list' })).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { container } = render(<EmptyState message="No tasks yet" />);
    expect(container).toMatchSnapshot();
  });
});
