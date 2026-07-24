import * as React from 'react';
import { Wrench } from 'lucide-react';
import { WidgetShell } from '../shared/WidgetShell';
import { StatusBadge } from '../shared/StatusBadge';

interface Equipment {
  id: string;
  name: string;
  type: string;
  operator: string;
  utilisation: number;
  lastService: string;
  nextService: string;
  status: 'active' | 'inactive' | 'at-risk' | 'critical';
}

const EQUIPMENT: Equipment[] = [
  { id: 'e1', name: 'Liebherr 280 EC-H Tower Crane', type: 'Tower Crane',      operator: 'P. Dawson',  utilisation: 92, lastService: '01 Jul 2026', nextService: '01 Oct 2026', status: 'active'   },
  { id: 'e2', name: 'Schwing BP 4000 Concrete Pump', type: 'Concrete Pump',   operator: 'R. Hassan',  utilisation: 74, lastService: '15 Jun 2026', nextService: '15 Sep 2026', status: 'active'   },
  { id: 'e3', name: 'Manitowoc MLC300 Crawler Crane', type: 'Mobile Crane',    operator: 'C. Wu',      utilisation: 41, lastService: '10 May 2026', nextService: '10 Aug 2026', status: 'at-risk'  },
  { id: 'e4', name: 'Caterpillar 323 Excavator',      type: 'Excavator',       operator: 'O. Fischer', utilisation:  0, lastService: '20 Jun 2026', nextService: '20 Sep 2026', status: 'inactive' },
  { id: 'e5', name: 'Somero S-22E Laser Screed',      type: 'Concrete Tool',   operator: 'L. Mbeki',   utilisation: 65, lastService: '25 Jun 2026', nextService: '25 Sep 2026', status: 'active'   },
];

export const EquipmentWidget: React.FC = () => {
  return (
    <WidgetShell
      title="Plant & Equipment"
      subtitle={`${EQUIPMENT.filter(e => e.status === 'active').length} of ${EQUIPMENT.length} units operational`}
      noPadding
      action={
        <span className="flex items-center gap-1 text-[10px] font-mono text-slate-500 dark:text-slate-400">
          <Wrench className="h-3 w-3" />
          Service Schedule
        </span>
      }
    >
      <table className="w-full text-xs">
        <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800">
          <tr>
            <th className="text-left px-4 py-2 font-bold uppercase tracking-wider text-slate-500 text-[10px]">Equipment</th>
            <th className="text-right px-3 py-2 font-bold uppercase tracking-wider text-slate-500 text-[10px] hidden sm:table-cell">Util.</th>
            <th className="text-left px-3 py-2 font-bold uppercase tracking-wider text-slate-500 text-[10px]">Status</th>
            <th className="text-right px-4 py-2 font-bold uppercase tracking-wider text-slate-500 text-[10px] hidden md:table-cell">Next Service</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {EQUIPMENT.map((eq) => (
            <tr key={eq.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
              <td className="px-4 py-2.5">
                <p className="font-medium text-slate-900 dark:text-slate-100 truncate max-w-[180px]">{eq.name}</p>
                <p className="text-[11px] text-slate-400 font-mono">{eq.type} · {eq.operator}</p>
              </td>
              <td className="px-3 py-2.5 text-right hidden sm:table-cell">
                <div className="flex items-center justify-end gap-1.5">
                  <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-sm overflow-hidden">
                    <div
                      className={`h-full rounded-sm ${eq.utilisation > 70 ? 'bg-orange-600' : eq.utilisation > 0 ? 'bg-slate-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                      style={{ width: `${eq.utilisation}%` }}
                    />
                  </div>
                  <span className="font-mono text-[11px] text-slate-600 dark:text-slate-400 w-7 text-right">{eq.utilisation}%</span>
                </div>
              </td>
              <td className="px-3 py-2.5">
                <StatusBadge status={eq.status} />
              </td>
              <td className="px-4 py-2.5 text-right font-mono text-[11px] text-slate-500 hidden md:table-cell">
                {eq.nextService}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </WidgetShell>
  );
};
