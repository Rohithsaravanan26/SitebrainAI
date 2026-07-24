import * as React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TrendIndicatorProps {
  value: number;
  unit?: string;
  className?: string;
}

export const TrendIndicator: React.FC<TrendIndicatorProps> = ({ value, unit = '%', className }) => {
  const isPositive = value > 0;
  const isNeutral = value === 0;

  if (isNeutral) {
    return (
      <span className={cn('inline-flex items-center gap-0.5 text-[10px] font-mono font-semibold text-slate-500', className)}>
        <Minus className="h-3 w-3" />
        {Math.abs(value)}{unit}
      </span>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-0.5 text-[10px] font-mono font-semibold',
        isPositive
          ? 'text-emerald-700 dark:text-emerald-400'
          : 'text-red-700 dark:text-red-400',
        className
      )}
    >
      {isPositive
        ? <TrendingUp className="h-3 w-3" />
        : <TrendingDown className="h-3 w-3" />}
      {isPositive ? '+' : ''}{value}{unit}
    </span>
  );
};
