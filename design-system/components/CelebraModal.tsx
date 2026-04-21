import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';

interface CelebraModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeStyles = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
};

const CelebraModal: React.FC<CelebraModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-slide-in-up">
        <div
          className={cn(
            'w-full bg-white dark:bg-[var(--celebra-dark)] rounded-lg shadow-xl',
            'max-h-[90vh] overflow-y-auto',
            sizeStyles[size]
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {(title || description) && (
            <div className="border-b border-[var(--border-color)] p-6">
              {title && (
                <h2 className="text-2xl font-bold font-display text-[var(--celebra-purple)]">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-sm text-[var(--text-secondary)] mt-1">
                  {description}
                </p>
              )}
            </div>
          )}

          {/* Content */}
          <div className="p-6">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="border-t border-[var(--border-color)] p-6 flex gap-2 justify-end">
              {footer}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CelebraModal;
