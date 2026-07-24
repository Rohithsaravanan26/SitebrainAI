import * as React from 'react';
import { cn } from '@/lib/utils';

export interface WidgetShellProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export const WidgetShell: React.FC<WidgetShellProps> = ({
  title,
  subtitle,
  action,
  children,
  className,
  noPadding = false,
}) => {
  return (
    <div
      className={cn(
        'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-sm flex flex-col',
        className
      )}
    >
      {/* Widget Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 dark:border-slate-800 shrink-0">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            {title}
          </h3>
          {subtitle && (
            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">{subtitle}</p>
          )}
        </div>
        {action && <div className="ml-auto pl-4 shrink-0">{action}</div>}
      </div>

      {/* Widget Content */}
      <div className={cn('flex-1 min-h-0', !noPadding && 'p-4')}>
        {children}
      </div>
    </div>
  );
};
