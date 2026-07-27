'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  DollarSign,
  User,
  Plus,
  FileText,
  HelpCircle,
  Folder,
  Users,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Project, RFI, ProjectDocument } from '@sitebrain/types';
import { StatusBadge, type StatusVariant } from '@/components/dashboard/shared/StatusBadge';
import { RfisTable } from '@/components/projects/RfisTable';
import { CreateRfiModal } from '@/components/projects/CreateRfiModal';
import { DocumentsTable } from '@/components/projects/DocumentsTable';

// ─── Initial Seed Data for Detail Page Fallback ───
const DEFAULT_PROJECT: Project = {
  id: 'p1',
  code: 'HCT-BLKC',
  name: 'Harbor City Tower — Block C',
  description:
    '21-storey mixed-use commercial and residential tower including 3-level podium structural works, post-tensioned slab pours, and structural steel facade framing.',
  location: 'Sydney CBD (Grid Ref: 33.8688° S, 151.2093° E)',
  status: 'ACTIVE',
  startDate: '2026-01-15T00:00:00Z',
  endDate: '2026-11-30T00:00:00Z',
  budget: 45000000,
  progressPercent: 67,
  openRfiCount: 3,
  projectManagerName: 'M. Vance',
  createdAt: '2026-01-10T00:00:00Z',
  updatedAt: '2026-07-27T00:00:00Z',
};

const INITIAL_RFIS: RFI[] = [
  {
    id: 'rfi-1',
    projectId: 'p1',
    rfiNumber: 'RFI-HCT-001',
    title: 'Footing setdown depth discrepancy at grid G-12',
    question:
      'Structural drawing SK-STRUCT-C-187 Rev3 conflicts with architectural setdown drawings. Request confirmation on 450mm vs 350mm depth.',
    answer:
      'Structural SK-STRUCT-C-187 Rev3 overrides. Maintain 450mm setdown to accommodate structural shear key.',
    status: 'ANSWERED',
    priority: 'HIGH',
    authorName: 'M. Vance',
    dueDate: '2026-07-28T00:00:00Z',
    createdAt: '2026-07-22T00:00:00Z',
    updatedAt: '2026-07-24T00:00:00Z',
  },
  {
    id: 'rfi-2',
    projectId: 'p1',
    rfiNumber: 'RFI-HCT-002',
    title: 'Level 14 core wall rebar lap length verification',
    question:
      'N20 bar lap length specified as 750mm. Structural notes state 900mm for high-seismic zone. Please clarify.',
    status: 'OPEN',
    priority: 'URGENT',
    authorName: 'J. Chen',
    dueDate: '2026-07-29T00:00:00Z',
    createdAt: '2026-07-25T00:00:00Z',
    updatedAt: '2026-07-25T00:00:00Z',
  },
  {
    id: 'rfi-3',
    projectId: 'p1',
    rfiNumber: 'RFI-HCT-003',
    title: 'MEP penetration sleeve sizes on Level 12 slab pour',
    question:
      'Hydraulics drawing HYD-102 shows 150mm sleeves. Electrical layout requires 200mm penetration for riser tray.',
    status: 'IN_REVIEW',
    priority: 'MEDIUM',
    authorName: 'S. Okafor',
    dueDate: '2026-08-02T00:00:00Z',
    createdAt: '2026-07-26T00:00:00Z',
    updatedAt: '2026-07-26T00:00:00Z',
  },
];

const INITIAL_DOCS: ProjectDocument[] = [
  {
    id: 'doc-1',
    projectId: 'p1',
    title: 'SK-STRUCT-C-187_Rev3_Footings.pdf',
    filePath: 'storage/documents/SK-STRUCT-C-187_Rev3.pdf',
    fileType: 'PDF',
    fileSizeBytes: 2340000,
    uploadedByName: 'S. Okafor',
    createdAt: '2026-07-20T00:00:00Z',
  },
  {
    id: 'doc-2',
    projectId: 'p1',
    title: 'SWMS_Concrete_Pour_L14.pdf',
    filePath: 'storage/documents/SWMS_Concrete_Pour_L14.pdf',
    fileType: 'PDF',
    fileSizeBytes: 340000,
    uploadedByName: 'M. Vance',
    createdAt: '2026-07-24T00:00:00Z',
  },
  {
    id: 'doc-3',
    projectId: 'p1',
    title: 'ITP-CIVIL-009_Foundation_Signed.pdf',
    filePath: 'storage/documents/ITP-CIVIL-009_signed.pdf',
    fileType: 'PDF',
    fileSizeBytes: 890000,
    uploadedByName: 'L. Ferreira',
    createdAt: '2026-07-25T00:00:00Z',
  },
];

const TEAM_MEMBERS = [
  { name: 'M. Vance', role: 'Project Manager', trade: 'Management', phone: '0412 889 012' },
  { name: 'J. Chen', role: 'Site Engineer', trade: 'Structural Civils', phone: '0421 990 123' },
  { name: 'S. Okafor', role: 'BIM Coordinator', trade: 'BIM / VDC', phone: '0433 112 234' },
  {
    name: 'T. Nakamura',
    role: 'Site Supervisor',
    trade: 'Concrete & Rebar',
    phone: '0444 223 345',
  },
  { name: 'D. Kowalski', role: 'Leading Hand', trade: 'Formwork', phone: '0455 334 456' },
];

type DetailTab = 'overview' | 'rfis' | 'documents' | 'team';

function fmtCurrency(n: number) {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    maximumFractionDigits: 0,
  }).format(n);
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-AU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = (params?.id as string) || 'p1';

  const [project, setProject] = React.useState<Project>(DEFAULT_PROJECT);
  const [rfis, setRfis] = React.useState<RFI[]>(INITIAL_RFIS);
  const [documents, setDocuments] = React.useState<ProjectDocument[]>(INITIAL_DOCS);
  const [activeTab, setActiveTab] = React.useState<DetailTab>('overview');
  const [isRfiModalOpen, setIsRfiModalOpen] = React.useState(false);

  const handleRfiCreated = (newRfi: RFI) => {
    setRfis((prev) => [newRfi, ...prev]);
  };

  return (
    <>
      <CreateRfiModal
        projectId={project.id}
        projectCode={project.code}
        isOpen={isRfiModalOpen}
        onClose={() => setIsRfiModalOpen(false)}
        onCreated={handleRfiCreated}
      />

      <div className="space-y-4">
        {/* Top Breadcrumb & Actions */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard/projects"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Project Directory
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsRfiModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-orange-700 hover:bg-orange-600 text-white rounded-sm transition-colors"
            >
              <Plus className="h-3.5 w-3.5" /> Submit RFI
            </button>
          </div>
        </div>

        {/* Project Title Banner */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-sm p-4 lg:p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold text-orange-600 bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900 px-2 py-0.5 rounded-sm">
                  {project.code}
                </span>
                <StatusBadge status="on-track" label={project.status} />
              </div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                {project.name}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
                {project.description}
              </p>
            </div>

            <div className="flex items-center gap-4 border-t md:border-t-0 border-slate-100 dark:border-slate-800 pt-3 md:pt-0 shrink-0">
              <div className="text-right">
                <p className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100">
                  {fmtCurrency(project.budget)}
                </p>
                <p className="text-[10px] font-mono uppercase text-slate-400">Total Budget</p>
              </div>
              <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />
              <div className="text-right">
                <p className="text-lg font-bold font-mono text-orange-600">
                  {project.progressPercent}%
                </p>
                <p className="text-[10px] font-mono uppercase text-slate-400">Progress</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-0 border-b border-slate-200 dark:border-slate-800">
          {[
            { id: 'overview', label: 'Overview', icon: <Folder className="h-3.5 w-3.5" /> },
            {
              id: 'rfis',
              label: `RFIs (${rfis.length})`,
              icon: <HelpCircle className="h-3.5 w-3.5" />,
            },
            {
              id: 'documents',
              label: `Documents (${documents.length})`,
              icon: <FileText className="h-3.5 w-3.5" />,
            },
            {
              id: 'team',
              label: `Project Team (${TEAM_MEMBERS.length})`,
              icon: <Users className="h-3.5 w-3.5" />,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as DetailTab)}
              className={cn(
                'flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap',
                activeTab === tab.id
                  ? 'border-orange-600 text-orange-700 dark:text-orange-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-4">
              {/* Site Details Card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-sm p-4 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono">
                  Site Information & Schedule Timeline
                </h3>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 font-mono block">Location</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {project.location}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-mono block">Project Manager</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {project.projectManagerName}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-mono block">Start Date</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200">
                      {fmtDate(project.startDate)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-mono block">Target Completion</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200">
                      {fmtDate(project.endDate)}
                    </span>
                  </div>
                </div>
              </div>

              {/* RFIs Snapshot */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono">
                    Recent Requests for Information
                  </h3>
                  <button
                    onClick={() => setActiveTab('rfis')}
                    className="text-[11px] font-mono text-orange-600 hover:text-orange-700"
                  >
                    View All RFIs →
                  </button>
                </div>
                <RfisTable rfis={rfis.slice(0, 3)} />
              </div>
            </div>

            {/* Sidebar Column */}
            <div className="space-y-4">
              {/* Progress Summary Card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-sm p-4 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono">
                  Package Progress
                </h3>
                <div className="space-y-2">
                  {[
                    { name: 'Foundation & Footings', progress: 100 },
                    { name: 'Podium Structure L1–L3', progress: 100 },
                    { name: 'Tower Concrete L4–L14', progress: 72 },
                    { name: 'MEP Services Riser', progress: 31 },
                  ].map((p) => (
                    <div key={p.name}>
                      <div className="flex justify-between text-[11px] font-mono mb-1">
                        <span className="text-slate-600 dark:text-slate-400 truncate">
                          {p.name}
                        </span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {p.progress}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-sm overflow-hidden">
                        <div
                          className="h-full bg-orange-600 rounded-sm"
                          style={{ width: `${p.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: RFIs */}
        {activeTab === 'rfis' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <p className="text-xs font-mono text-slate-500">
                Total {rfis.length} RFIs · {rfis.filter((r) => r.status === 'OPEN').length} Open
              </p>
              <button
                onClick={() => setIsRfiModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-orange-700 hover:bg-orange-600 text-white rounded-sm"
              >
                <Plus className="h-3.5 w-3.5" /> Submit RFI
              </button>
            </div>
            <RfisTable rfis={rfis} />
          </div>
        )}

        {/* Tab 3: Documents */}
        {activeTab === 'documents' && <DocumentsTable documents={documents} />}

        {/* Tab 4: Team */}
        {activeTab === 'team' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-sm overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="text-left px-4 py-2.5 font-bold uppercase tracking-wider text-slate-500 text-[10px]">
                    Member
                  </th>
                  <th className="text-left px-3 py-2.5 font-bold uppercase tracking-wider text-slate-500 text-[10px]">
                    Role
                  </th>
                  <th className="text-left px-3 py-2.5 font-bold uppercase tracking-wider text-slate-500 text-[10px]">
                    Trade / Speciality
                  </th>
                  <th className="text-right px-4 py-2.5 font-bold uppercase tracking-wider text-slate-500 text-[10px]">
                    Contact
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {TEAM_MEMBERS.map((m) => (
                  <tr key={m.name} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                    <td className="px-4 py-2.5 font-medium text-slate-900 dark:text-slate-100">
                      {m.name}
                    </td>
                    <td className="px-3 py-2.5 text-slate-600 dark:text-slate-400 font-mono">
                      {m.role}
                    </td>
                    <td className="px-3 py-2.5 text-slate-500">{m.trade}</td>
                    <td className="px-4 py-2.5 text-right font-mono text-slate-500">{m.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
