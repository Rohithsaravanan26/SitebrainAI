import * as React from 'react';
import { ExternalLink } from 'lucide-react';
import { WidgetShell } from '../shared/WidgetShell';
import { StatusBadge, StatusVariant } from '../shared/StatusBadge';
import { TrendIndicator } from '../shared/TrendIndicator';

interface Project {
  id: string;
  name: string;
  location: string;
  pm: string;
  status: StatusVariant;
  progress: number;
  dueDate: string;
  trend: number;
}

const PROJECTS: Project[] = [
  {
    id: 'p1',
    name: 'Harbor City Tower — Block C',
    location: 'Sydney CBD',
    pm: 'M. Vance',
    status: 'on-track',
    progress: 67,
    dueDate: 'Nov 2026',
    trend: 3,
  },
  {
    id: 'p2',
    name: 'Westfield Metro Station',
    location: 'Parramatta',
    pm: 'S. Okafor',
    status: 'at-risk',
    progress: 41,
    dueDate: 'Mar 2027',
    trend: -5,
  },
  {
    id: 'p3',
    name: 'Riverside Industrial Park',
    location: 'Homebush Bay',
    pm: 'T. Nakamura',
    status: 'on-track',
    progress: 88,
    dueDate: 'Sep 2026',
    trend: 1,
  },
  {
    id: 'p4',
    name: 'Olympic Precinct Upgrade',
    location: 'Penrith',
    pm: 'L. Ferreira',
    status: 'delayed',
    progress: 22,
    dueDate: 'Feb 2027',
    trend: -12,
  },
  {
    id: 'p5',
    name: 'Green Square Mixed Use',
    location: 'Alexandria',
    pm: 'R. Singh',
    status: 'in-progress',
    progress: 55,
    dueDate: 'Aug 2027',
    trend: 0,
  },
];

export const ProjectsWidget: React.FC = () => {
  return (
    <WidgetShell
      title="Active Projects"
      subtitle={`${PROJECTS.length} projects • This quarter`}
      noPadding
      action={
        <button className="text-[11px] font-medium text-orange-600 hover:text-orange-700 flex items-center gap-1 font-mono">
          All Projects <ExternalLink className="h-3 w-3" />
        </button>
      }
    >
      <table className="w-full text-xs">
        <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800">
          <tr>
            <th className="text-left px-4 py-2 font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-[10px]">
              Project
            </th>
            <th className="text-left px-3 py-2 font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-[10px] hidden md:table-cell">
              PM
            </th>
            <th className="text-left px-3 py-2 font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-[10px]">
              Status
            </th>
            <th className="text-left px-3 py-2 font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-[10px] hidden lg:table-cell">
              Progress
            </th>
            <th className="text-right px-4 py-2 font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-[10px] hidden md:table-cell">
              Due
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {PROJECTS.map((project) => (
            <tr
              key={project.id}
              className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
            >
              <td className="px-4 py-2.5">
                <p className="font-medium text-slate-900 dark:text-slate-100 truncate max-w-[200px]">
                  {project.name}
                </p>
                <p className="text-[11px] text-slate-400 font-mono">{project.location}</p>
              </td>
              <td className="px-3 py-2.5 text-slate-600 dark:text-slate-400 hidden md:table-cell font-mono">
                {project.pm}
              </td>
              <td className="px-3 py-2.5">
                <StatusBadge status={project.status} />
              </td>
              <td className="px-3 py-2.5 hidden lg:table-cell">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-sm overflow-hidden">
                    <div
                      className="h-full bg-orange-600 rounded-sm"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-mono text-slate-600 dark:text-slate-400 w-8 text-right shrink-0">
                    {project.progress}%
                  </span>
                  <TrendIndicator value={project.trend} />
                </div>
              </td>
              <td className="px-4 py-2.5 text-right text-[11px] font-mono text-slate-500 hidden md:table-cell">
                {project.dueDate}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </WidgetShell>
  );
};
