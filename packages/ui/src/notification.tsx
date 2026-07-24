import * as React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CheckCircle2, AlertTriangle, AlertOctagon, Info, X } from 'lucide-react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type NotificationVariant = 'success' | 'warning' | 'danger' | 'info';

export interface AlertProps {
  variant?: NotificationVariant;
  title: string;
  description?: string;
  onClose?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  description,
  onClose,
  className,
}) => {
  const styles = {
    info: {
      container: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900 text-blue-900 dark:text-blue-200',
      icon: <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />,
    },
    success: {
      container: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-200',
      icon: <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />,
    },
    warning: {
      container: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200',
      icon: <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />,
    },
    danger: {
      container: 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900 text-red-900 dark:text-red-200',
      icon: <AlertOctagon className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0" />,
    },
  };

  const current = styles[variant];

  return (
    <div
      role="alert"
      className={cn('flex items-start p-3 border rounded-sm text-xs space-x-2.5', current.container, className)}
    >
      <div className="mt-0.5">{current.icon}</div>
      <div className="flex-1">
        <h4 className="font-semibold leading-tight">{title}</h4>
        {description && <p className="mt-1 opacity-90 leading-relaxed font-normal">{description}</p>}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="opacity-70 hover:opacity-100 p-0.5 rounded-sm focus:outline-none"
          aria-label="Dismiss alert"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
};
