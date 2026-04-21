import React from 'react';
import { cn } from '@/lib/utils';

interface CelebraFooterProps {
  sections?: Array<{
    title: string;
    links: Array<{ label: string; href: string }>;
  }>;
  copyright?: string;
  social?: Array<{ icon: React.ReactNode; href: string; label: string }>;
  className?: string;
}

const CelebraFooter: React.FC<CelebraFooterProps> = ({
  sections,
  copyright,
  social,
  className,
}) => {
  return (
    <footer
      className={cn(
        'bg-white dark:bg-[var(--celebra-dark)] border-t border-[var(--border-color)]',
        'mt-12 py-12',
        className
      )}
    >
      <div className="container mx-auto px-4">
        {/* Main Content */}
        {sections && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {sections.map((section, idx) => (
              <div key={idx}>
                <h3 className="font-bold text-[var(--celebra-purple)] mb-4">
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.links.map((link, linkIdx) => (
                    <li key={linkIdx}>
                      <a
                        href={link.href}
                        className="text-[var(--text-secondary)] hover:text-[var(--celebra-purple)] transition-colors duration-300"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Section */}
        <div className="border-t border-[var(--border-color)] pt-8 flex items-center justify-between flex-wrap gap-4">
          {copyright && (
            <p className="text-sm text-[var(--text-secondary)]">{copyright}</p>
          )}

          {social && (
            <div className="flex items-center gap-4">
              {social.map((item, idx) => (
                <a
                  key={idx}
                  href={item.href}
                  title={item.label}
                  className="text-[var(--text-secondary)] hover:text-[var(--celebra-purple)] transition-colors duration-300"
                >
                  {item.icon}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

export default CelebraFooter;
