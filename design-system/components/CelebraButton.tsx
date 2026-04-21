import React from 'react';
import { cn } from '@/lib/utils';

interface CelebraButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const CelebraButton = React.forwardRef<HTMLButtonElement, CelebraButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      icon,
      children,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantStyles = {
      primary: 'bg-[var(--celebra-purple)] text-white hover:bg-[var(--celebra-purple-light)] focus:ring-[var(--celebra-purple)]',
      secondary: 'bg-[var(--celebra-gold)] text-[var(--celebra-dark)] hover:bg-[var(--celebra-gold-light)] focus:ring-[var(--celebra-gold)]',
      accent: 'bg-[var(--celebra-blue)] text-white hover:bg-[var(--celebra-blue-light)] focus:ring-[var(--celebra-blue)]',
      ghost: 'bg-transparent text-[var(--celebra-purple)] hover:bg-[var(--celebra-purple)]/10 focus:ring-[var(--celebra-purple)]',
      outline: 'border-2 border-[var(--celebra-purple)] text-[var(--celebra-purple)] hover:bg-[var(--celebra-purple)]/5 focus:ring-[var(--celebra-purple)]',
    };

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {icon && !isLoading && icon}
        {children}
      </button>
    );
  }
);

CelebraButton.displayName = 'CelebraButton';

export default CelebraButton;
