import * as React from 'react';
import { WidgetShell } from '../shared/WidgetShell';
import { StatusBadge } from '../shared/StatusBadge';
import { TrendIndicator } from '../shared/TrendIndicator';

interface WorkPackage {
  id: string;
  name: string;
  planned: number;
  actual: number;
  trend: number;
  startDate: string;
  endDate: string;
}

const PACKAGES: WorkPackage[] = [
  {
    id: 'wp1',
    name: 'Excavation & Earthworks',
    planned: 100,
    actual: 100,
    trend: 0,
    startDate: 'Jan 2026',
    endDate: 'Feb 2026',
  },
  {
    id: 'wp2',
    name: 'Piling & Foundation',
    planned: 100,
    actual: 100,
    trend: 0,
    startDate: 'Feb 2026',
    endDate: 'Apr 2026',
  },
  {
    id: 'wp3',
    name: 'Structural Concrete — Podium',
    planned: 100,
    actual: 100,
    trend: 0,
    startDate: 'Apr 2026',
    endDate: 'May 2026',
  },
  {
    id: 'wp4',
    name: 'Structural Concrete — Tower',
    planned: 80,
    actual: 72,
    trend: -8,
    startDate: 'May 2026',
    endDate: 'Nov 2026',
  },
  {
    id: 'wp5',
    name: 'Mechanical & Plumbing (MEP)',
    planned: 40,
    actual: 31,
    trend: -9,
    startDate: 'Jun 2026',
    endDate: 'Feb 2027',
  },
  {
    id: 'wp6',
    name: 'Electrical & Fire Services',
    planned: 25,
    actual: 28,
    trend: 3,
    startDate: 'Jul 2026',
    endDate: 'Mar 2027',
  },
  {
    id: 'wp7',
    name: 'Facade & Curtain Wall',
    planned: 10,
    actual: 8,
    trend: -2,
    startDate: 'Sep 2026',
    endDate: 'May 2027',
  },
  {
    id: 'wp8',
    name: 'Internal Fitout & Finishes',
    planned: 0,
    actual: 0,
    trend: 0,
    startDate: 'Jan 2027',
    endDate: 'Aug 2027',
  },
];

export const ProgressWidget: React.FC = () => {
  return (
    <WidgetShell title="Schedule Progress" subtitle="Work packages vs. planned baseline" noPadding>
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {PACKAGES.map((pkg) => {
          const isComplete = pkg.actual >= 100;
          const isNotStarted = pkg.actual === 0;
          const isBehind = pkg.actual < pkg.planned - 5;
          const isAhead = pkg.actual > pkg.planned + 2;

          let status = 'on-track' as const;
          if (isComplete) status = 'complete' as const;
          else if (isNotStarted) status = 'not-started' as const;
          else if (isBehind) status = 'at-risk' as const;

          return (
            <div
              key={pkg.id}
              className="px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <p className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">
                    {pkg.name}
                  </p>
                  <StatusBadge status={status} />
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <TrendIndicator value={pkg.trend} />
                  <span className="text-[11px] font-mono text-slate-600 dark:text-slate-400 w-8 text-right">
                    {pkg.actual}%
                  </span>
                </div>
              </div>
              <div className="relative h-2 bg-slate-200 dark:bg-slate-700 rounded-sm overflow-hidden">
                {/* Planned baseline marker */}
                {pkg.planned > 0 && (
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-slate-400 dark:bg-slate-500 z-10"
                    style={{ left: `${pkg.planned}%` }}
                  />
                )}
                {/* Actual progress */}
                <div
                  className={`h-full rounded-sm ${
                    isComplete
                      ? 'bg-slate-600 dark:bg-slate-400'
                      : isNotStarted
                        ? 'bg-slate-300 dark:bg-slate-700'
                        : isBehind
                          ? 'bg-amber-500'
                          : 'bg-orange-600'
                  }`}
                  style={{ width: `${pkg.actual}%` }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[10px] font-mono text-slate-400">{pkg.startDate}</span>
                <span className="text-[10px] font-mono text-slate-400">{pkg.endDate}</span>
              </div>
            </div>
          );
        })}
      </div>
    </WidgetShell>
  );
};
