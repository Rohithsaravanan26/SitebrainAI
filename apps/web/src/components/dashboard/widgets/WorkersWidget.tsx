import * as React from 'react';
import { HardHat } from 'lucide-react';
import { WidgetShell } from '../shared/WidgetShell';
import { StatusBadge } from '../shared/StatusBadge';

interface TradeBreakdown {
  trade: string;
  onSite: number;
  total: number;
  supervisor: string;
}

const TRADES: TradeBreakdown[] = [
  { trade: 'Steel Fixers', onSite: 24, total: 24, supervisor: 'D. Kowalski' },
  { trade: 'Concreters', onSite: 18, total: 20, supervisor: 'B. Nkosi' },
  { trade: 'Carpenters', onSite: 14, total: 16, supervisor: 'W. Torres' },
  { trade: 'Electricians', onSite: 8, total: 10, supervisor: 'J. Park' },
  { trade: 'Plumbers', onSite: 6, total: 8, supervisor: 'A. Patel' },
  { trade: 'Crane Operators', onSite: 4, total: 4, supervisor: 'M. Collins' },
];

const totalOnSite = TRADES.reduce((s, t) => s + t.onSite, 0);
const totalWorkers = TRADES.reduce((s, t) => s + t.total, 0);

export const WorkersWidget: React.FC = () => {
  return (
    <WidgetShell
      title="Field Crew"
      subtitle={`${totalOnSite} / ${totalWorkers} on-site today`}
      noPadding
      action={
        <span className="text-[10px] font-mono font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 px-2 py-0.5 rounded-sm">
          SITE OPEN
        </span>
      }
    >
      <div className="p-4 pb-2">
        {/* Summary bar */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-sm overflow-hidden">
            <div
              className="h-full bg-orange-600 rounded-sm"
              style={{ width: `${(totalOnSite / totalWorkers) * 100}%` }}
            />
          </div>
          <span className="text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 shrink-0">
            {Math.round((totalOnSite / totalWorkers) * 100)}% Attendance
          </span>
        </div>
      </div>

      {/* Trade breakdown */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {TRADES.map((trade) => {
          const attendance = Math.round((trade.onSite / trade.total) * 100);
          const isFullAttendance = trade.onSite === trade.total;
          return (
            <div
              key={trade.trade}
              className="flex items-center px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
            >
              <div className="flex items-center gap-2 w-36 shrink-0">
                <HardHat className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span className="text-xs text-slate-800 dark:text-slate-200 font-medium truncate">
                  {trade.trade}
                </span>
              </div>
              <div className="flex-1 mx-3 hidden sm:block">
                <div className="h-1 bg-slate-200 dark:bg-slate-700 rounded-sm overflow-hidden">
                  <div
                    className="h-full bg-slate-700 dark:bg-slate-300 rounded-sm"
                    style={{ width: `${attendance}%` }}
                  />
                </div>
              </div>
              <span className="text-[11px] font-mono text-slate-500 w-12 text-center shrink-0">
                {trade.onSite}/{trade.total}
              </span>
              <StatusBadge
                status={isFullAttendance ? 'active' : 'at-risk'}
                label={isFullAttendance ? 'Full' : 'Short'}
                className="ml-2 shrink-0"
              />
            </div>
          );
        })}
      </div>
    </WidgetShell>
  );
};
