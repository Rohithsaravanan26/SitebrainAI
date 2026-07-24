import * as React from 'react';
import { cn } from '@/lib/utils';

export type StatusVariant =
  | 'on-track'
  | 'at-risk'
  | 'delayed'
  | 'complete'
  | 'not-started'
  | 'active'
  | 'inactive'
  | 'critical'
  | 'low-stock'
  | 'in-progress';

const statusConfig: Record<
  StatusVariant,
  { label: string; className: string }
> = {
  'on-track':    { label: 'On Track',    className: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900' },
  'at-risk':     { label: 'At Risk',     className: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900' },
  'delayed':     { label: 'Delayed',     className: 'bg-red-50 text-red-800 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900' },
  'complete':    { label: 'Complete',    className: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700' },
  'not-started': { label: 'Not Started', className: 'bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-900 dark:text-slate-500 dark:border-slate-800' },
  'active':      { label: 'Active',      className: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900' },
  'inactive':    { label: 'Inactive',    className: 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-500 dark:border-slate-700' },
  'critical':    { label: 'Critical',    className: 'bg-red-50 text-red-800 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900' },
  'low-stock':   { label: 'Low Stock',   className: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900' },
  'in-progress': { label: 'In Progress', className: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900' },
};

export interface StatusBadgeProps {
  status: StatusVariant;
  label?: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label, className }) => {
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        'inline-flex items-center px-1.5 py-0.5 rounded-sm text-[10px] font-semibold font-mono uppercase tracking-wide border',
        config.className,
        className
      )}
    >
      {label ?? config.label}
    </span>
  );
};
