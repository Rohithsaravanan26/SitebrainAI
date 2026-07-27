import * as React from 'react';
import { MessageSquare, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import type { RFI, RfiStatus, RfiPriority } from '@sitebrain/types';
import { StatusBadge, type StatusVariant } from '@/components/dashboard/shared/StatusBadge';

const statusMap: Record<RfiStatus, StatusVariant> = {
  OPEN: 'at-risk',
  IN_REVIEW: 'in-progress',
  ANSWERED: 'complete',
  CLOSED: 'complete',
};

const priorityBadge: Record<RfiPriority, { label: string; className: string }> = {
  LOW: { label: 'Low', className: 'text-slate-600 bg-slate-100 dark:bg-slate-800' },
  MEDIUM: { label: 'Medium', className: 'text-blue-700 bg-blue-50 dark:bg-blue-950/40' },
  HIGH: { label: 'High', className: 'text-amber-700 bg-amber-50 dark:bg-amber-950/40' },
  URGENT: {
    label: 'URGENT',
    className: 'text-red-700 font-bold bg-red-50 dark:bg-red-950/40 border-red-200',
  },
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-AU', { day: '2-digit', month: 'short' });
}

interface RfisTableProps {
  rfis: RFI[];
  onRfiClick?: (rfi: RFI) => void;
}

export const RfisTable: React.FC<RfisTableProps> = ({ rfis, onRfiClick }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-sm overflow-hidden">
      <table className="w-full text-xs">
        <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800">
          <tr>
            <th className="text-left px-4 py-2.5 font-bold uppercase tracking-wider text-slate-500 text-[10px]">
              RFI No / Subject
            </th>
            <th className="text-left px-3 py-2.5 font-bold uppercase tracking-wider text-slate-500 text-[10px]">
              Priority
            </th>
            <th className="text-left px-3 py-2.5 font-bold uppercase tracking-wider text-slate-500 text-[10px]">
              Status
            </th>
            <th className="text-left px-3 py-2.5 font-bold uppercase tracking-wider text-slate-500 text-[10px] hidden sm:table-cell">
              Author
            </th>
            <th className="text-right px-4 py-2.5 font-bold uppercase tracking-wider text-slate-500 text-[10px] hidden md:table-cell">
              Due Date
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {rfis.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-10 text-slate-400 font-mono text-xs">
                No RFIs submitted for this project
              </td>
            </tr>
          ) : (
            rfis.map((rfi) => {
              const prio = priorityBadge[rfi.priority];
              const isOverdue = rfi.status === 'OPEN' && new Date(rfi.dueDate) < new Date();
              return (
                <tr
                  key={rfi.id}
                  onClick={() => onRfiClick?.(rfi)}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-2.5">
                    <p className="font-mono text-orange-600 font-semibold text-[11px]">
                      {rfi.rfiNumber}
                    </p>
                    <p className="font-medium text-slate-900 dark:text-slate-100 truncate max-w-[280px]">
                      {rfi.title}
                    </p>
                    {rfi.answer && (
                      <p className="text-[10px] text-emerald-600 font-mono mt-0.5 truncate max-w-[280px]">
                        ✓ {rfi.answer}
                      </p>
                    )}
                  </td>
                  <td className="px-3 py-2.5">
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded-sm text-[10px] font-mono uppercase tracking-wider ${prio.className}`}
                    >
                      {prio.label}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <StatusBadge
                      status={statusMap[rfi.status] ?? 'at-risk'}
                      label={rfi.status.replace('_', ' ')}
                    />
                  </td>
                  <td className="px-3 py-2.5 text-slate-600 dark:text-slate-400 font-mono text-[11px] hidden sm:table-cell">
                    {rfi.authorName || 'M. Vance'}
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono text-[11px] hidden md:table-cell">
                    <span className={isOverdue ? 'text-red-600 font-bold' : 'text-slate-500'}>
                      {fmtDate(rfi.dueDate)}
                    </span>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};
