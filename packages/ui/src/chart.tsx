import * as React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Enterprise Metric Card
export interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  unit?: string;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  trend = 'neutral',
  unit,
  className,
}) => {
  const trendColors = {
    up: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-900',
    down: 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-900',
    neutral:
      'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
  };

  return (
    <div
      className={cn(
        'p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-sm',
        className
      )}
    >
      <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {title}
      </p>
      <div className="mt-2 flex items-baseline justify-between">
        <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {value}
          {unit && <span className="ml-1 text-sm font-normal text-slate-500">{unit}</span>}
        </div>
        {change && (
          <span
            className={cn(
              'inline-flex items-center px-1.5 py-0.5 rounded-sm text-xs font-mono font-medium border',
              trendColors[trend]
            )}
          >
            {change}
          </span>
        )}
      </div>
    </div>
  );
};

// High-Visibility Progress Bar
export interface ProgressBarProps {
  value: number; // 0 - 100
  max?: number;
  variant?: 'orange' | 'navy' | 'slate';
  showLabel?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  variant = 'orange',
  showLabel = false,
  className,
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const fillColors = {
    orange: 'bg-orange-600',
    navy: 'bg-slate-900 dark:bg-slate-100',
    slate: 'bg-slate-600 dark:bg-slate-400',
  };

  return (
    <div className={cn('w-full space-y-1', className)}>
      {showLabel && (
        <div className="flex justify-between text-xs font-mono text-slate-600 dark:text-slate-400">
          <span>Progress</span>
          <span>{percentage.toFixed(0)}%</span>
        </div>
      )}
      <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-sm overflow-hidden">
        <div
          className={cn('h-full transition-all duration-300', fillColors[variant])}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
};

// Industrial SVG Bar Chart Component
export interface BarChartDataPoint {
  label: string;
  value: number;
}

export interface SimpleBarChartProps {
  data: BarChartDataPoint[];
  height?: number;
  className?: string;
}

export const SimpleBarChart: React.FC<SimpleBarChartProps> = ({
  data,
  height = 140,
  className,
}) => {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div
      className={cn(
        'w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-sm',
        className
      )}
    >
      <div className="flex items-end justify-between gap-2" style={{ height: `${height}px` }}>
        {data.map((item, idx) => {
          const barHeightPercentage = (item.value / maxValue) * 100;
          return (
            <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
              <div className="text-[10px] font-mono text-slate-500 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {item.value}
              </div>
              <div
                className="w-full bg-slate-800 dark:bg-slate-200 group-hover:bg-orange-600 rounded-xs transition-colors"
                style={{ height: `${barHeightPercentage}%` }}
              />
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-2 truncate w-full text-center">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
