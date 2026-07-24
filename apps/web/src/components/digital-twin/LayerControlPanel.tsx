import * as React from 'react';
import { Layers, EyeOff, Eye, Pin } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LayerVisibility } from './DigitalTwinCanvas';

interface LayerControlPanelProps {
  layers: LayerVisibility;
  onChange: (layers: LayerVisibility) => void;
}

const LAYER_DEFS: {
  key: keyof LayerVisibility;
  label: string;
  sub: string;
  color: string;
  count: number;
}[] = [
  { key: 'completed',  label: 'Completed',   sub: 'L1 – L11 · 184 elements',  color: 'bg-emerald-500',  count: 184 },
  { key: 'inProgress', label: 'In Progress',  sub: 'L12 – L14 · 48 elements',  color: 'bg-orange-500',   count: 48  },
  { key: 'remaining',  label: 'Remaining',    sub: 'L15 – L20 · 52 elements',  color: 'bg-slate-500',    count: 52  },
  { key: 'annotations',label: 'Annotations',  sub: 'RFIs · Safety · Defects',  color: 'bg-amber-500',    count: 0   },
];

export const LayerControlPanel: React.FC<LayerControlPanelProps> = ({ layers, onChange }) => {
  const toggle = (key: keyof LayerVisibility) => {
    onChange({ ...layers, [key]: !layers[key] });
  };

  const allVisible = Object.values(layers).every(Boolean);
  const toggleAll = () => {
    const next = !allVisible;
    onChange({ completed: next, inProgress: next, remaining: next, annotations: next });
  };

  return (
    <div className="bg-slate-900/95 border border-slate-700/80 rounded-sm w-56">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800">
        <div className="flex items-center gap-1.5">
          <Layers className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 font-mono">Layers</span>
        </div>
        <button
          onClick={toggleAll}
          className="flex items-center gap-1 text-[10px] font-mono text-slate-500 hover:text-slate-300 transition-colors"
        >
          {allVisible ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
          {allVisible ? 'Hide All' : 'Show All'}
        </button>
      </div>

      {/* Layer Rows */}
      <div className="divide-y divide-slate-800/60">
        {LAYER_DEFS.map((def) => {
          const isVisible = layers[def.key];
          return (
            <button
              key={def.key}
              onClick={() => toggle(def.key)}
              className={cn(
                'w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors',
                isVisible ? 'hover:bg-slate-800/50' : 'opacity-40 hover:bg-slate-800/30'
              )}
            >
              {/* Color chip */}
              <span className={cn('w-2.5 h-2.5 rounded-sm shrink-0', def.color, !isVisible && 'opacity-40')} />
              <div className="flex-1 min-w-0">
                <p className={cn('text-[11px] font-semibold leading-tight', isVisible ? 'text-slate-200' : 'text-slate-500')}>
                  {def.layer = undefined, def.label}
                </p>
                <p className="text-[10px] text-slate-500 font-mono leading-tight">{def.sub}</p>
              </div>
              <div className="shrink-0">
                {isVisible
                  ? <Eye className="h-3.5 w-3.5 text-slate-400" />
                  : <EyeOff className="h-3.5 w-3.5 text-slate-600" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* BIM Model Info */}
      <div className="px-3 py-2 border-t border-slate-800 bg-slate-950/60">
        <p className="text-[10px] font-mono text-slate-500 leading-tight">
          Harbor City Tower — Block C
        </p>
        <p className="text-[10px] font-mono text-slate-600 leading-tight">BIM-REV-12 · 284 elements total</p>
      </div>
    </div>
  );
};
