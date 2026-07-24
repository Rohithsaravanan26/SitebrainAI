import type { Metadata } from 'next';
import {
  FolderKanban,
  Users,
  AlertTriangle,
  DollarSign,
} from 'lucide-react';
import { ProjectsWidget }       from '@/components/dashboard/widgets/ProjectsWidget';
import { WorkersWidget }        from '@/components/dashboard/widgets/WorkersWidget';
import { InventoryWidget }      from '@/components/dashboard/widgets/InventoryWidget';
import { ProgressWidget }       from '@/components/dashboard/widgets/ProgressWidget';
import { EquipmentWidget }      from '@/components/dashboard/widgets/EquipmentWidget';
import { WeatherWidget }        from '@/components/dashboard/widgets/WeatherWidget';
import { AiInsightsWidget }     from '@/components/dashboard/widgets/AiInsightsWidget';
import { NotificationsWidget }  from '@/components/dashboard/widgets/NotificationsWidget';
import { RecentUploadsWidget }  from '@/components/dashboard/widgets/RecentUploadsWidget';
import { TrendIndicator }       from '@/components/dashboard/shared/TrendIndicator';

export const metadata: Metadata = {
  title: 'Dashboard — SiteBrain AI',
  description: 'Construction project management command centre.',
};

const KPI_CARDS = [
  {
    id: 'kpi-projects',
    label: 'Active Projects',
    value: '5',
    sub: '3 on track · 1 at risk · 1 delayed',
    icon: <FolderKanban className="h-4 w-4 text-slate-500" />,
    trend: 0,
  },
  {
    id: 'kpi-workers',
    label: 'Workers On-Site',
    value: '74',
    sub: 'of 82 total headcount',
    icon: <Users className="h-4 w-4 text-slate-500" />,
    trend: 2,
  },
  {
    id: 'kpi-rfis',
    label: 'Open RFIs',
    value: '14',
    sub: '3 overdue · 11 in review',
    icon: <AlertTriangle className="h-4 w-4 text-slate-500" />,
    trend: -3,
  },
  {
    id: 'kpi-budget',
    label: 'Budget Burned',
    value: '61%',
    sub: '$24.4M of $40.0M claimed',
    icon: <DollarSign className="h-4 w-4 text-slate-500" />,
    trend: 1,
  },
];

export default function DashboardPage() {
  const now = new Date().toLocaleString('en-AU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="space-y-4 lg:space-y-5">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">
            Construction Intelligence Overview
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
            {now} · Harbor City Tower — Block C
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 px-2.5 py-1 rounded-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            API LIVE
          </span>
          <span className="text-[11px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-sm">
            Last sync: 60s ago
          </span>
        </div>
      </div>

      {/* ─── Row 1: KPI Metric Cards ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {KPI_CARDS.map((kpi) => (
          <div
            key={kpi.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-sm p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {kpi.label}
              </span>
              {kpi.icon}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">
                {kpi.value}
              </span>
              <TrendIndicator value={kpi.trend} />
            </div>
            <p className="text-[11px] text-slate-400 font-mono mt-1">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* ─── Row 2: Projects + Notifications ─── */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <div className="xl:col-span-3">
          <ProjectsWidget />
        </div>
        <div className="xl:col-span-2">
          <NotificationsWidget />
        </div>
      </div>

      {/* ─── Row 3: Progress + Equipment ─── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <ProgressWidget />
        <EquipmentWidget />
      </div>

      {/* ─── Row 4: Workers + Inventory + Weather + AI ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <WorkersWidget />
        <InventoryWidget />
        <WeatherWidget />
        <AiInsightsWidget />
      </div>

      {/* ─── Row 5: Recent Uploads (full width) ─── */}
      <RecentUploadsWidget />
    </div>
  );
}
