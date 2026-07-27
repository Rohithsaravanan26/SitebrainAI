import * as React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Enterprise Header Nav Bar
export const HeaderNav: React.FC<React.HTMLAttributes<HTMLElement>> = ({
  className,
  children,
  ...props
}) => (
  <header
    className={cn(
      'h-12 bg-slate-900 text-white border-b border-slate-800 px-4 flex items-center justify-between text-xs',
      className
    )}
    {...props}
  >
    {children}
  </header>
);

// Navigation Tabs
export interface TabItem {
  id: string;
  label: string;
  count?: number;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange, className }) => {
  return (
    <div
      className={cn('border-b border-slate-200 dark:border-slate-800 flex space-x-6', className)}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            disabled={tab.disabled}
            onClick={() => onChange(tab.id)}
            className={cn(
              'py-2 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors focus:outline-none flex items-center space-x-2',
              isActive
                ? 'border-orange-600 text-orange-600 dark:text-orange-500 font-bold'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200',
              tab.disabled && 'opacity-40 cursor-not-allowed'
            )}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={cn(
                  'px-1.5 py-0.2 text-[10px] font-mono rounded-sm',
                  isActive
                    ? 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

// Segmented Control
export interface SegmentedControlProps {
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  value,
  onChange,
  className,
}) => {
  return (
    <div
      className={cn(
        'inline-flex p-0.5 bg-slate-200 dark:bg-slate-800 rounded-sm border border-slate-300 dark:border-slate-700 text-xs font-medium',
        className
      )}
    >
      {options.map((opt) => {
        const isSelected = opt.value === value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={cn(
              'px-3 py-1 rounded-sm transition-colors font-mono',
              isSelected
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};
