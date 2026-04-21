import React from 'react';
import { cn } from '@/lib/utils';

interface CelebraCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'liturgical';
  children: React.ReactNode;
}

const CelebraCard = React.forwardRef<HTMLDivElement, CelebraCardProps>(
  ({ variant = 'default', className, children, ...props }, ref) => {
    const baseStyles = 'rounded-lg transition-all duration-300';

    const variantStyles = {
      default: 'bg-white dark:bg-[var(--celebra-dark)] border border-[var(--border-color)] shadow-sm',
      elevated: 'bg-white dark:bg-[var(--celebra-dark)] shadow-lg hover:shadow-xl',
      outlined: 'bg-transparent border-2 border-[var(--celebra-purple)] hover:border-[var(--celebra-gold)]',
      liturgical: 'bg-gradient-to-br from-[var(--celebra-purple)]/10 to-[var(--celebra-gold)]/10 border border-[var(--celebra-purple)]/20 dark:from-[var(--celebra-purple)]/20 dark:to-[var(--celebra-gold)]/20',
    };

    return (
      <div
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CelebraCard.displayName = 'CelebraCard';

export default CelebraCard;

// Subcomponentes
export const CelebraCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6 border-b border-[var(--border-color)]', className)}
    {...props}
  />
));
CelebraCardHeader.displayName = 'CelebraCardHeader';

export const CelebraCardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn('text-2xl font-bold font-display text-[var(--celebra-purple)]', className)}
    {...props}
  />
));
CelebraCardTitle.displayName = 'CelebraCardTitle';

export const CelebraCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-[var(--text-secondary)]', className)}
    {...props}
  />
));
CelebraCardDescription.displayName = 'CelebraCardDescription';

export const CelebraCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
CelebraCardContent.displayName = 'CelebraCardContent';

export const CelebraCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0 gap-2', className)}
    {...props}
  />
));
CelebraCardFooter.displayName = 'CelebraCardFooter';
