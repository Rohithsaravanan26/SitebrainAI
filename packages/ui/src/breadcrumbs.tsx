import * as React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ChevronRight } from 'lucide-react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrent?: boolean;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  onNavigate?: (href: string) => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className, onNavigate }) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        'flex items-center text-xs text-slate-500 dark:text-slate-400 font-mono',
        className
      )}
    >
      <ol className="flex items-center space-x-1.5">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center space-x-1.5">
              {index > 0 && (
                <ChevronRight className="h-3 w-3 text-slate-400 dark:text-slate-600 shrink-0" />
              )}
              {isLast || !item.href ? (
                <span
                  className={cn(
                    'font-medium truncate max-w-[200px]',
                    isLast
                      ? 'text-slate-900 dark:text-slate-100 font-bold'
                      : 'text-slate-600 dark:text-slate-400'
                  )}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <button
                  onClick={() => onNavigate?.(item.href!)}
                  className="hover:text-slate-900 dark:hover:text-slate-200 hover:underline truncate max-w-[200px]"
                >
                  {item.label}
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
