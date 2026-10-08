import React from 'react';

interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
}

const variantClasses: Record<ButtonProps['variant'], string> = {
  primary: 'bg-primary text-white rounded-2xl px-6 py-3 font-semibold',
  secondary: 'bg-white text-primary border border-primary rounded-2xl px-6 py-3',
  ghost: 'text-primary px-4 py-2',
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant,
    children,
    onClick,
    type = 'button',
    disabled = false,
    className = '',
    'aria-label': ariaLabel,
  },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={[
        variantClasses[variant],
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'transition-opacity',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </button>
  );
});

export default Button;
