import * as React from 'react';
import Link from 'next/link';
import { MapPin, Calendar, DollarSign, ArrowRight, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Project } from '@sitebrain/types';
import { StatusBadge, type StatusVariant } from '@/components/dashboard/shared/StatusBadge';

const statusVariantMap: Record<string, StatusVariant> = {
  ACTIVE: 'on-track',
  PLANNING: 'not-started',
  ON_HOLD: 'at-risk',
  COMPLETED: 'complete',
};

function fmtCurrency(n: number) {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    maximumFractionDigits: 0,
  }).format(n);
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-AU', { month: 'short', year: 'numeric' });
}

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-sm p-4 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <span className="text-[10px] font-mono font-bold text-orange-600 bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900 px-1.5 py-0.5 rounded-sm">
              {project.code}
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1 leading-snug">
              {project.name}
            </h3>
          </div>
          <StatusBadge status={statusVariantMap[project.status] ?? 'active'} />
        </div>

        {/* Location & PM */}
        <div className="space-y-1 mb-3">
          <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-mono">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{project.location}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-mono">
            <User className="h-3 w-3 shrink-0" />
            <span>PM: {project.projectManagerName || 'M. Vance'}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-[11px] font-mono mb-1">
            <span className="text-slate-500">Progress</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {project.progressPercent}%
            </span>
          </div>
          <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-sm overflow-hidden">
            <div
              className="h-full bg-orange-600 rounded-sm transition-all"
              style={{ width: `${project.progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Footer info */}
      <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex items-center justify-between">
        <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500">
          <span className="flex items-center gap-1">
            <DollarSign className="h-3 w-3" />
            {fmtCurrency(project.budget)}
          </span>
          {project.openRfiCount > 0 && (
            <span className="text-amber-700 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-950/30 px-1.5 py-0.5 rounded-sm">
              {project.openRfiCount} RFI{project.openRfiCount > 1 ? 's' : ''}
            </span>
          )}
        </div>

        <Link
          href={`/dashboard/projects/${project.id}`}
          className="flex items-center gap-1 text-xs font-semibold text-orange-600 hover:text-orange-700 font-mono"
        >
          View Project <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
};
