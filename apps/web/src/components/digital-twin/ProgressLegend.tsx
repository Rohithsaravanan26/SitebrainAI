import * as React from 'react';

export const ProgressLegend: React.FC = () => {
  const LEGEND = [
    { color: 'bg-emerald-500', label: 'Completed', note: 'L1 – L11' },
    { color: 'bg-orange-500', label: 'In Progress', note: 'L12 – L14' },
    { color: 'bg-slate-500 opacity-40', label: 'Remaining', note: 'L15 – L20 (wireframe)' },
    { color: 'bg-amber-500', label: 'RFI', note: 'Annotation' },
    { color: 'bg-red-500', label: 'Safety', note: 'Annotation' },
    { color: 'bg-purple-500', label: 'Defect', note: 'Annotation' },
    { color: 'bg-cyan-500', label: 'QA Check', note: 'Annotation' },
  ];

  return (
    <div className="bg-slate-900/95 border border-slate-700/80 rounded-sm px-3 py-2 min-w-[140px]">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono mb-2">
        Legend
      </p>
      <div className="space-y-1.5">
        {LEGEND.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-sm shrink-0 ${item.color}`} />
            <div>
              <span className="text-[11px] font-medium text-slate-300">{item.label}</span>
              <span className="text-[10px] text-slate-600 font-mono ml-1.5">{item.note}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
