import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Button from '../Button';

describe('Button', () => {
  it('snapshot — primary variant', () => {
    const { container } = render(<Button variant="primary">Save</Button>);
    expect(container).toMatchSnapshot();
  });

  it('snapshot — secondary variant', () => {
    const { container } = render(<Button variant="secondary">Cancel</Button>);
    expect(container).toMatchSnapshot();
  });

  it('snapshot — ghost variant', () => {
    const { container } = render(<Button variant="ghost">Skip</Button>);
    expect(container).toMatchSnapshot();
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<Button variant="primary" onClick={onClick}>Click me</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button variant="primary" disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('renders with aria-label', () => {
    render(<Button variant="ghost" aria-label="Close dialog">X</Button>);
    expect(screen.getByRole('button', { name: 'Close dialog' })).toBeInTheDocument();
  });
});
