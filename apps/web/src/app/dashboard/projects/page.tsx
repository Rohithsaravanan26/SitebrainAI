'use client';

import * as React from 'react';
import {
  FolderKanban,
  Search,
  Plus,
  DollarSign,
  AlertTriangle,
  BarChart3,
  Building2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Project, PaginatedProjectsResponse } from '@sitebrain/types';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { CreateProjectModal } from '@/components/projects/CreateProjectModal';

// ─── Fixture data fallback for demo / offline mode ───
const SEED_PROJECTS: Project[] = [
  {
    id: 'p1',
    code: 'HCT-BLKC',
    name: 'Harbor City Tower — Block C',
    description:
      '21-storey mixed-use commercial and residential tower including 3-level podium structural works.',
    location: 'Sydney CBD',
    status: 'ACTIVE',
    startDate: '2026-01-15T00:00:00Z',
    endDate: '2026-11-30T00:00:00Z',
    budget: 45000000,
    progressPercent: 67,
    openRfiCount: 3,
    projectManagerName: 'M. Vance',
    createdAt: '2026-01-10T00:00:00Z',
    updatedAt: '2026-07-27T00:00:00Z',
  },
  {
    id: 'p2',
    code: 'WST-METRO',
    name: 'Westfield Metro Station Underground',
    description:
      'Underground rail link station box excavation, structural diaphragm walling, and MEP fitout.',
    location: 'Parramatta',
    status: 'ON_HOLD',
    startDate: '2026-03-01T00:00:00Z',
    endDate: '2027-03-31T00:00:00Z',
    budget: 82000000,
    progressPercent: 41,
    openRfiCount: 5,
    projectManagerName: 'S. Okafor',
    createdAt: '2026-02-15T00:00:00Z',
    updatedAt: '2026-07-27T00:00:00Z',
  },
  {
    id: 'p3',
    code: 'RVR-INDUS',
    name: 'Riverside Industrial Logistics Park',
    description:
      'Dual-warehouse portal frame steel structures with 35,000m² heavy duty post-tensioned concrete slab.',
    location: 'Homebush Bay',
    status: 'ACTIVE',
    startDate: '2025-11-01T00:00:00Z',
    endDate: '2026-09-15T00:00:00Z',
    budget: 28500000,
    progressPercent: 88,
    openRfiCount: 1,
    projectManagerName: 'T. Nakamura',
    createdAt: '2025-10-20T00:00:00Z',
    updatedAt: '2026-07-27T00:00:00Z',
  },
  {
    id: 'p4',
    code: 'OLY-PRCNT',
    name: 'Olympic Precinct Upgrade & Civils',
    description:
      'Civil infrastructure upgrade, pedestrian overpass bridge, and stormwater culvert retention works.',
    location: 'Penrith',
    status: 'PLANNING',
    startDate: '2026-09-01T00:00:00Z',
    endDate: '2027-05-30T00:00:00Z',
    budget: 18000000,
    progressPercent: 12,
    openRfiCount: 2,
    projectManagerName: 'L. Ferreira',
    createdAt: '2026-06-01T00:00:00Z',
    updatedAt: '2026-07-27T00:00:00Z',
  },
];

function fmtCurrency(n: number) {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    maximumFractionDigits: 0,
  }).format(n);
}

export default function ProjectsPage() {
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('ALL');
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  // Fetch paginated projects from API with fallback
  React.useEffect(() => {
    async function loadProjects() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          page: String(page),
          limit: '9',
        });
        if (statusFilter !== 'ALL') queryParams.set('status_filter', statusFilter);
        if (searchQuery.trim()) queryParams.set('search', searchQuery.trim());

        const res = await fetch(`/api/v1/projects?${queryParams.toString()}`);
        if (res.ok) {
          const data: PaginatedProjectsResponse = await res.json();
          setProjects(data.items.length > 0 ? data.items : SEED_PROJECTS);
          setTotalPages(data.totalPages || 1);
        } else {
          setProjects(SEED_PROJECTS);
        }
      } catch {
        setProjects(SEED_PROJECTS);
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, [page, statusFilter, searchQuery]);

  const handleProjectCreated = (newProject: Project) => {
    setProjects((prev) => [newProject, ...prev]);
  };

  const filteredProjects = projects.filter((p) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.code.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalBudget = projects.reduce((s, p) => s + p.budget, 0);
  const openRfis = projects.reduce((s, p) => s + p.openRfiCount, 0);
  const avgProgress =
    projects.length > 0
      ? Math.round(projects.reduce((s, p) => s + p.progressPercent, 0) / projects.length)
      : 0;

  return (
    <>
      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={handleProjectCreated}
      />

      <div className="space-y-4">
        {/* Page Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">Project Directory</h1>
            <p className="text-xs font-mono text-slate-500 mt-0.5">
              Portfolio overview · Work packages, budgets, and RFI governance
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-orange-700 hover:bg-orange-600 text-white rounded-sm transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Project
          </button>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              label: 'Active Projects',
              value: String(projects.filter((p) => p.status === 'ACTIVE').length),
              sub: `of ${projects.length} total projects`,
              icon: <Building2 className="h-4 w-4 text-slate-400" />,
            },
            {
              label: 'Portfolio Budget',
              value: fmtCurrency(totalBudget),
              sub: 'Total allocated capital',
              icon: <DollarSign className="h-4 w-4 text-emerald-500" />,
            },
            {
              label: 'Open RFIs',
              value: String(openRfis),
              sub: 'Pending technical response',
              icon: <AlertTriangle className="h-4 w-4 text-amber-500" />,
            },
            {
              label: 'Average Progress',
              value: `${avgProgress}%`,
              sub: 'Across active packages',
              icon: <BarChart3 className="h-4 w-4 text-blue-500" />,
            },
          ].map((kpi) => (
            <div
              key={kpi.label}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-sm p-4"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {kpi.label}
                </span>
                {kpi.icon}
              </div>
              <p className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100">
                {kpi.value}
              </p>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">{kpi.sub}</p>
            </div>
          ))}
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-sm p-3">
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-sm px-3 py-1.5 flex-1 min-w-[240px]">
            <Search className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search by project name, code (e.g. HCT-C), or site location..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="flex-1 bg-transparent text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto">
            {(['ALL', 'ACTIVE', 'PLANNING', 'ON_HOLD', 'COMPLETED'] as const).map((st) => (
              <button
                key={st}
                onClick={() => {
                  setStatusFilter(st);
                  setPage(1);
                }}
                className={cn(
                  'px-2.5 py-1 text-[11px] font-mono rounded-sm transition-colors uppercase',
                  statusFilter === st
                    ? 'bg-slate-800 text-white font-bold'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                )}
              >
                {st === 'ALL' ? 'All' : st.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-48 bg-slate-100 dark:bg-slate-800/40 rounded-sm animate-pulse"
              />
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-sm text-slate-400">
            <FolderKanban className="h-10 w-10 mb-2 text-slate-300 dark:text-slate-700" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No projects found
            </p>
            <p className="text-xs font-mono text-slate-500 mt-0.5">
              Try adjusting your search query or status filter
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredProjects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-3">
            <p className="text-xs font-mono text-slate-500">
              Page {page} of {totalPages}
            </p>
            <div className="flex items-center gap-1">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-sm border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-sm border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
