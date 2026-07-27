import * as React from 'react';
import { BrainCircuit, TrendingDown, AlertTriangle, Clock } from 'lucide-react';
import { WidgetShell } from '../shared/WidgetShell';

interface InsightStub {
  id: string;
  category: string;
  insight: string;
  confidence: number;
  icon: React.ReactNode;
  severity: 'high' | 'medium' | 'info';
}

const INSIGHT_STUBS: InsightStub[] = [
  {
    id: 'i1',
    category: 'Schedule Risk',
    insight:
      'MEP package is running 9 days behind baseline. At current burn rate, final delivery may slip 3–4 weeks.',
    confidence: 84,
    icon: <TrendingDown className="h-4 w-4" />,
    severity: 'high',
  },
  {
    id: 'i2',
    category: 'Safety Pattern',
    insight:
      'Near-miss incident frequency increased by 40% on Level 12–14 slab pours over the last 14 days.',
    confidence: 91,
    icon: <AlertTriangle className="h-4 w-4" />,
    severity: 'high',
  },
  {
    id: 'i3',
    category: 'Productivity',
    insight:
      'Steel fixing crew productivity exceeds planned rate by 6%. Consider re-sequencing to accelerate structure.',
    confidence: 78,
    icon: <BrainCircuit className="h-4 w-4" />,
    severity: 'medium',
  },
  {
    id: 'i4',
    category: 'Material Forecast',
    insight:
      'N20 rebar stock will reach reorder threshold in approximately 11 working days at current consumption.',
    confidence: 95,
    icon: <Clock className="h-4 w-4" />,
    severity: 'medium',
  },
];

const severityStyles = {
  high: 'border-l-red-600 bg-red-50 dark:bg-red-950/30',
  medium: 'border-l-amber-500 bg-amber-50 dark:bg-amber-950/30',
  info: 'border-l-blue-500 bg-blue-50 dark:bg-blue-950/30',
};

const severityText = {
  high: 'text-red-700 dark:text-red-400',
  medium: 'text-amber-700 dark:text-amber-400',
  info: 'text-blue-700 dark:text-blue-400',
};

export const AiInsightsWidget: React.FC = () => {
  return (
    <WidgetShell
      title="AI Insights"
      subtitle="Computer vision & schedule analytics — model pending"
      action={
        <span className="text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-sm">
          MODEL NOT CONNECTED
        </span>
      }
    >
      <div className="space-y-2">
        {INSIGHT_STUBS.map((insight) => (
          <div
            key={insight.id}
            className={`border-l-2 pl-3 pr-3 py-2.5 rounded-sm border border-slate-200 dark:border-slate-800 ${severityStyles[insight.severity]}`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className={`${severityText[insight.severity]}`}>{insight.icon}</span>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider font-mono ${severityText[insight.severity]}`}
              >
                {insight.category}
              </span>
              <span className="ml-auto text-[10px] font-mono text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded-sm shrink-0">
                {insight.confidence}% conf.
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {insight.insight}
            </p>
          </div>
        ))}

        <div className="p-2.5 bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-300 dark:border-slate-700 rounded-sm text-[11px] text-slate-500 font-mono text-center">
          Connect PyTorch / ONNX computer vision pipeline to generate live field insights from drone
          footage and progress photos.
        </div>
      </div>
    </WidgetShell>
  );
};
