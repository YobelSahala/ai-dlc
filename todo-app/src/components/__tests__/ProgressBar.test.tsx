import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ProgressBar from '../ProgressBar';

describe('ProgressBar', () => {
  it('renders correct percentage label', () => {
    render(<ProgressBar value={65} />);
    expect(screen.getByText('65%')).toBeInTheDocument();
  });

  it('renders 0% label', () => {
    render(<ProgressBar value={0} />);
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('renders 100% label', () => {
    render(<ProgressBar value={100} />);
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('has correct progressbar aria attributes', () => {
    render(<ProgressBar value={42} />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '42');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
  });

  it('matches snapshot', () => {
    const { container } = render(<ProgressBar value={50} />);
    expect(container).toMatchSnapshot();
  });
});
