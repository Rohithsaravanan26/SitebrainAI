import * as React from 'react';
import { Calendar, CheckCircle2, Clock, Circle } from 'lucide-react';
import type { ProjectMilestone } from '@sitebrain/types';

const SAMPLE_MILESTONES: ProjectMilestone[] = [
  {
    id: 'm1',
    projectId: 'p1',
    name: 'Site Establishment & Excavation',
    targetDate: '2026-02-15T00:00:00Z',
    status: 'COMPLETED',
    progressPercent: 100,
  },
  {
    id: 'm2',
    projectId: 'p1',
    name: 'Piling & Foundation Footings',
    targetDate: '2026-04-01T00:00:00Z',
    status: 'COMPLETED',
    progressPercent: 100,
  },
  {
    id: 'm3',
    projectId: 'p1',
    name: 'Podium Structure L1–L3 Slab',
    targetDate: '2026-05-15T00:00:00Z',
    status: 'COMPLETED',
    progressPercent: 100,
  },
  {
    id: 'm4',
    projectId: 'p1',
    name: 'Tower Structural Core L4–L14',
    targetDate: '2026-09-30T00:00:00Z',
    status: 'IN_PROGRESS',
    progressPercent: 72,
  },
  {
    id: 'm5',
    projectId: 'p1',
    name: 'MEP Riser & Primary Services',
    targetDate: '2026-11-15T00:00:00Z',
    status: 'IN_PROGRESS',
    progressPercent: 31,
  },
  {
    id: 'm6',
    projectId: 'p1',
    name: 'Facade Curtain Wall Enclosure',
    targetDate: '2027-01-30T00:00:00Z',
    status: 'UPCOMING',
    progressPercent: 0,
  },
  {
    id: 'm7',
    projectId: 'p1',
    name: 'Internal Fitout & Handover',
    targetDate: '2027-04-15T00:00:00Z',
    status: 'UPCOMING',
    progressPercent: 0,
  },
];

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-AU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export const ProjectTimeline: React.FC<{ milestones?: ProjectMilestone[] }> = ({
  milestones = SAMPLE_MILESTONES,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-sm p-4 lg:p-5">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono mb-4">
        Project Milestone & Work Package Schedule
      </h3>

      <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-3 space-y-6">
        {milestones.map((m) => {
          const isDone = m.status === 'COMPLETED';
          const isCurrent = m.status === 'IN_PROGRESS';
          return (
            <div key={m.id} className="relative pl-6">
              {/* Timeline Bullet */}
              <div
                className={`absolute -left-[9px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white dark:bg-slate-900 ${
                  isDone ? 'text-emerald-600' : isCurrent ? 'text-orange-600' : 'text-slate-400'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="h-4 w-4 fill-emerald-100 dark:fill-emerald-950/60" />
                ) : isCurrent ? (
                  <Clock className="h-4 w-4 animate-pulse" />
                ) : (
                  <Circle className="h-3 w-3" />
                )}
              </div>

              {/* Content */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <p
                      className={`text-xs font-semibold ${isDone ? 'text-slate-700 dark:text-slate-300' : isCurrent ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-500'}`}
                    >
                      {m.name}
                    </p>
                    <span
                      className={`text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-px rounded-sm ${
                        isDone
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900'
                          : isCurrent
                            ? 'bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400 border border-orange-200 dark:border-orange-900'
                            : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
                      }`}
                    >
                      {m.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400 mt-0.5">
                    <Calendar className="h-3 w-3" />
                    Target Completion: {fmtDate(m.targetDate)}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full sm:w-36 shrink-0">
                  <div className="flex justify-between text-[10px] font-mono text-slate-500 mb-1">
                    <span>Progress</span>
                    <span>{m.progressPercent}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-sm overflow-hidden">
                    <div
                      className={`h-full rounded-sm ${isDone ? 'bg-emerald-600' : isCurrent ? 'bg-orange-600' : 'bg-slate-400'}`}
                      style={{ width: `${m.progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
