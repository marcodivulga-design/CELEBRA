import React from 'react';
import { cn } from '@/lib/utils';

interface CelebraInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  helperText?: string;
}

const CelebraInput = React.forwardRef<HTMLInputElement, CelebraInputProps>(
  ({ label, error, icon, helperText, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full px-4 py-2 rounded-lg border-2 transition-all duration-300',
              'bg-white dark:bg-[var(--celebra-dark)]',
              'border-[var(--border-color)] dark:border-[var(--border-color)]',
              'text-[var(--text-primary)] placeholder-[var(--text-secondary)]',
              'focus:outline-none focus:ring-2 focus:ring-[var(--celebra-purple)] focus:border-[var(--celebra-purple)]',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              error && 'border-[var(--celebra-red)] focus:ring-[var(--celebra-red)] focus:border-[var(--celebra-red)]',
              icon && 'pl-10',
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="text-sm text-[var(--celebra-red)] mt-1">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-sm text-[var(--text-secondary)] mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

CelebraInput.displayName = 'CelebraInput';

export default CelebraInput;
