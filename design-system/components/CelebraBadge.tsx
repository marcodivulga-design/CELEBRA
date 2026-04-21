import React from 'react';
import { cn } from '@/lib/utils';

interface CelebraBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'purple' | 'gold' | 'green' | 'red' | 'blue' | 'gray';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const CelebraBadge = React.forwardRef<HTMLSpanElement, CelebraBadgeProps>(
  ({ variant = 'purple', size = 'md', className, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-full transition-all duration-300';

    const variantStyles = {
      purple: 'bg-[var(--celebra-purple)]/20 text-[var(--celebra-purple)] dark:bg-[var(--celebra-purple)]/30',
      gold: 'bg-[var(--celebra-gold)]/20 text-[var(--celebra-gold)] dark:bg-[var(--celebra-gold)]/30',
      green: 'bg-[var(--celebra-green)]/20 text-[var(--celebra-green)] dark:bg-[var(--celebra-green)]/30',
      red: 'bg-[var(--celebra-red)]/20 text-[var(--celebra-red)] dark:bg-[var(--celebra-red)]/30',
      blue: 'bg-[var(--celebra-blue)]/20 text-[var(--celebra-blue)] dark:bg-[var(--celebra-blue)]/30',
      gray: 'bg-[var(--text-secondary)]/20 text-[var(--text-secondary)] dark:bg-[var(--text-secondary)]/30',
    };

    const sizeStyles = {
      sm: 'px-2 py-1 text-xs',
      md: 'px-3 py-1.5 text-sm',
      lg: 'px-4 py-2 text-base',
    };

    return (
      <span
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {children}
      </span>
    );
  }
);

CelebraBadge.displayName = 'CelebraBadge';

export default CelebraBadge;
