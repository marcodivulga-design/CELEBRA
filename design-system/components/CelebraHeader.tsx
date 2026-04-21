import React from 'react';
import { cn } from '@/lib/utils';

interface CelebraHeaderProps {
  logo?: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  navigation?: React.ReactNode;
  sticky?: boolean;
  className?: string;
}

const CelebraHeader: React.FC<CelebraHeaderProps> = ({
  logo,
  title,
  subtitle,
  actions,
  navigation,
  sticky = false,
  className,
}) => {
  return (
    <header
      className={cn(
        'bg-white dark:bg-[var(--celebra-dark)] border-b border-[var(--border-color)]',
        'transition-all duration-300',
        sticky && 'sticky top-0 z-40 shadow-md',
        className
      )}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4 mb-4">
          {/* Logo/Title */}
          <div className="flex items-center gap-3">
            {logo && <div className="flex-shrink-0">{logo}</div>}
            <div>
              {title && (
                <h1 className="text-2xl font-bold font-display text-[var(--celebra-purple)]">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-sm text-[var(--text-secondary)]">{subtitle}</p>
              )}
            </div>
          </div>

          {/* Actions */}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>

        {/* Navigation */}
        {navigation && (
          <nav className="flex items-center gap-4 border-t border-[var(--border-color)] pt-4">
            {navigation}
          </nav>
        )}
      </div>
    </header>
  );
};

export default CelebraHeader;

// Navigation Link Component
interface CelebraNavLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  active?: boolean;
  children: React.ReactNode;
}

export const CelebraNavLink = React.forwardRef<HTMLAnchorElement, CelebraNavLinkProps>(
  ({ active = false, className, children, ...props }, ref) => (
    <a
      ref={ref}
      className={cn(
        'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300',
        'text-[var(--text-secondary)] hover:text-[var(--celebra-purple)]',
        active && 'text-[var(--celebra-purple)] bg-[var(--celebra-purple)]/10',
        className
      )}
      {...props}
    >
      {children}
    </a>
  )
);
CelebraNavLink.displayName = 'CelebraNavLink';
