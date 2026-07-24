'use client';

import * as React from 'react';
import { Plus, Pin, AlertTriangle, FileText, CheckCircle2, X, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SpatialAnnotation, AnnotationCategory } from '@sitebrain/types';

// ─── Fixture data for initial state (before API connection) ───
const SAMPLE_ANNOTATIONS: SpatialAnnotation[] = [
  {
    id: 'ann-1',
    modelId: 'model-1',
    title: 'RFI #247 — Footing setdown depth discrepancy',
    description: 'Structural drawing SK-STRUCT-C-187 Rev3 conflicts with architectural drawings at grid G-12. Requires structural engineer review.',
    category: 'RFI',
    positionX: 4,
    positionY: 9,
    positionZ: 3,
    status: 'OPEN',
    createdBy: 'M. Vance',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ann-2',
    modelId: 'model-1',
    title: 'Safety Hazard — Unsecured scaffold planks',
    description: 'Scaffold boards on level 13 north elevation found unsecured. Risk of falling object. Barricade area pending fix.',
    category: 'SAFETY_HAZARD',
    positionX: -4,
    positionY: 33,
    positionZ: 4,
    status: 'OPEN',
    createdBy: 'J. Chen',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ann-3',
    modelId: 'model-1',
    title: 'Defect — Honeycombing in L10 slab soffit',
    description: 'Honeycombing observed in the soffit of L10 slab pour. Extent: 0.4m². Awaiting engineer assessment for repair methodology.',
    category: 'DEFECT',
    positionX: 2,
    positionY: 25,
    positionZ: -3,
    status: 'UNDER_REVIEW',
    createdBy: 'T. Nakamura',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ann-4',
    modelId: 'model-1',
    title: 'QA Inspection — Rebar cover check L12 columns',
    description: 'Rebar cover on L12 perimeter columns passed 40mm requirement. ITP signed off by Tier 1 inspector.',
    category: 'QUALITY_INSPECTION',
    positionX: -3,
    positionY: 30,
    positionZ: 3,
    status: 'RESOLVED',
    createdBy: 'L. Ferreira',
    createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
  },
];

type NewAnnotationForm = {
  title: string;
  description: string;
  category: AnnotationCategory;
  positionX: string;
  positionY: string;
  positionZ: string;
};

const CATEGORY_CONFIG: Record<AnnotationCategory, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
  RFI:                { label: 'RFI',           icon: <FileText className="h-3.5 w-3.5" />,       color: 'text-amber-600 dark:text-amber-400',   bg: 'bg-amber-50 dark:bg-amber-950/40'   },
  SAFETY_HAZARD:      { label: 'Safety',         icon: <AlertTriangle className="h-3.5 w-3.5" />,  color: 'text-red-600 dark:text-red-400',        bg: 'bg-red-50 dark:bg-red-950/40'       },
  DEFECT:             { label: 'Defect',         icon: <X className="h-3.5 w-3.5" />,              color: 'text-purple-600 dark:text-purple-400',  bg: 'bg-purple-50 dark:bg-purple-950/40' },
  QUALITY_INSPECTION: { label: 'QA Check',       icon: <CheckCircle2 className="h-3.5 w-3.5" />,   color: 'text-cyan-600 dark:text-cyan-400',      bg: 'bg-cyan-50 dark:bg-cyan-950/40'     },
};

const STATUS_CONFIG: Record<string, string> = {
  OPEN:         'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900',
  RESOLVED:     'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900',
  UNDER_REVIEW: 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900',
};

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const m = Math.floor(ms / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

interface AnnotationsListProps {
  annotations?: SpatialAnnotation[];
  selectedId?: string | null;
  onSelect?: (annotation: SpatialAnnotation) => void;
  onAdd?: (annotation: SpatialAnnotation) => void;
  onDismiss?: (id: string) => void;
}

export const AnnotationsList: React.FC<AnnotationsListProps> = ({
  annotations = SAMPLE_ANNOTATIONS,
  selectedId,
  onSelect,
  onAdd,
  onDismiss,
}) => {
  const [showForm, setShowForm] = React.useState(false);
  const [filter, setFilter] = React.useState<AnnotationCategory | 'ALL'>('ALL');
  const [form, setForm] = React.useState<NewAnnotationForm>({
    title: '',
    description: '',
    category: 'RFI',
    positionX: '0',
    positionY: '20',
    positionZ: '0',
  });

  const filtered = filter === 'ALL'
    ? annotations
    : annotations.filter((a) => a.category === filter);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    const newAnnotation: SpatialAnnotation = {
      id: `ann-${Date.now()}`,
      modelId: 'model-1',
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      category: form.category,
      positionX: parseFloat(form.positionX) || 0,
      positionY: parseFloat(form.positionY) || 0,
      positionZ: parseFloat(form.positionZ) || 0,
      status: 'OPEN',
      createdBy: 'M. Vance',
      createdAt: new Date().toISOString(),
    };
    onAdd?.(newAnnotation);
    setShowForm(false);
    setForm({ title: '', description: '', category: 'RFI', positionX: '0', positionY: '20', positionZ: '0' });
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border-l border-slate-800">
      {/* Panel Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-1.5">
          <Pin className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 font-mono">
            Annotations
          </span>
          <span className="text-[10px] font-mono font-bold bg-orange-700 text-white px-1.5 py-px rounded-sm ml-1">
            {annotations.filter((a) => a.status === 'OPEN').length} OPEN
          </span>
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium bg-orange-700 hover:bg-orange-600 text-white rounded-sm transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          Add
        </button>
      </div>

      {/* Add Annotation Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="border-b border-slate-800 p-3 bg-slate-950/60 space-y-2 shrink-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono mb-2">New Annotation</p>

          <select
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as AnnotationCategory }))}
            className="w-full bg-slate-800 border border-slate-700 rounded-sm px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-orange-600"
          >
            <option value="RFI">RFI</option>
            <option value="SAFETY_HAZARD">Safety Hazard</option>
            <option value="DEFECT">Defect</option>
            <option value="QUALITY_INSPECTION">QA Inspection</option>
          </select>

          <input
            type="text"
            placeholder="Title (required)"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            required
            className="w-full bg-slate-800 border border-slate-700 rounded-sm px-2 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-orange-600"
          />

          <textarea
            placeholder="Description (optional)"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            rows={2}
            className="w-full bg-slate-800 border border-slate-700 rounded-sm px-2 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-orange-600 resize-none"
          />

          <div className="grid grid-cols-3 gap-1">
            {(['positionX', 'positionY', 'positionZ'] as const).map((axis) => (
              <div key={axis}>
                <label className="text-[10px] font-mono text-slate-500 uppercase">{axis.replace('position', '')}</label>
                <input
                  type="number"
                  step="0.1"
                  value={form[axis]}
                  onChange={(e) => setForm((f) => ({ ...f, [axis]: e.target.value }))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-sm px-2 py-1 text-xs text-slate-200 font-mono focus:outline-none focus:border-orange-600"
                />
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-1">
            <button type="submit" className="flex-1 bg-orange-700 hover:bg-orange-600 text-white text-xs py-1.5 rounded-sm font-medium transition-colors">
              Place Pin
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-3 text-xs text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Category Filter */}
      <div className="flex items-center gap-1 px-2 py-2 border-b border-slate-800 shrink-0 overflow-x-auto">
        {(['ALL', 'RFI', 'SAFETY_HAZARD', 'DEFECT', 'QUALITY_INSPECTION'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={cn(
              'px-2 py-0.5 text-[10px] font-mono uppercase tracking-wide rounded-sm shrink-0 transition-colors border',
              filter === cat
                ? 'bg-slate-700 text-white border-slate-600'
                : 'text-slate-500 border-slate-800 hover:text-slate-300 hover:border-slate-700'
            )}
          >
            {cat === 'ALL' ? 'All' : cat === 'SAFETY_HAZARD' ? 'Safety' : cat === 'QUALITY_INSPECTION' ? 'QA' : cat}
          </button>
        ))}
      </div>

      {/* Annotations List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-slate-600">
            <Pin className="h-6 w-6 mb-1.5" />
            <p className="text-xs font-mono">No annotations in this category</p>
          </div>
        ) : (
          filtered.map((ann) => {
            const cat = CATEGORY_CONFIG[ann.category];
            const isSelected = ann.id === selectedId;
            return (
              <button
                key={ann.id}
                onClick={() => onSelect?.(ann)}
                className={cn(
                  'w-full text-left px-3 py-2.5 transition-colors',
                  isSelected ? 'bg-slate-800' : 'hover:bg-slate-800/50'
                )}
              >
                <div className="flex items-start gap-2">
                  <div className={cn('flex h-6 w-6 items-center justify-center rounded-sm shrink-0 mt-0.5', cat.bg, cat.color)}>
                    {cat.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <p className="text-[11px] font-semibold text-slate-200 leading-tight line-clamp-2 flex-1">
                        {ann.title}
                      </p>
                      {isSelected && <ChevronRight className="h-3.5 w-3.5 text-orange-500 shrink-0 mt-0.5" />}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      <span className={cn(
                        'text-[9px] font-bold font-mono uppercase tracking-wider px-1 py-px rounded-sm border',
                        STATUS_CONFIG[ann.status] ?? STATUS_CONFIG.OPEN
                      )}>
                        {ann.status.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">{timeAgo(ann.createdAt)}</span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        ({ann.positionX.toFixed(1)}, {ann.positionY.toFixed(1)}, {ann.positionZ.toFixed(1)})
                      </span>
                    </div>
                    {ann.description && (
                      <p className="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-snug">{ann.description}</p>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Footer stats */}
      <div className="px-3 py-2 border-t border-slate-800 bg-slate-950/60 shrink-0">
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            { label: 'Open',    value: annotations.filter((a) => a.status === 'OPEN').length,         color: 'text-red-400'     },
            { label: 'Review',  value: annotations.filter((a) => a.status === 'UNDER_REVIEW').length, color: 'text-amber-400'   },
            { label: 'Closed',  value: annotations.filter((a) => a.status === 'RESOLVED').length,     color: 'text-emerald-400' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className={cn('text-sm font-bold font-mono', stat.color)}>{stat.value}</p>
              <p className="text-[9px] font-mono text-slate-600 uppercase">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
