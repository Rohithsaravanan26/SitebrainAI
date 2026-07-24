import * as React from 'react';
import { AlertTriangle } from 'lucide-react';
import { WidgetShell } from '../shared/WidgetShell';
import { StatusBadge } from '../shared/StatusBadge';

interface InventoryItem {
  id: string;
  material: string;
  unit: string;
  inStock: number;
  required: number;
  reorderLevel: number;
  supplier: string;
}

const INVENTORY: InventoryItem[] = [
  { id: 'i1', material: 'N16 Steel Rebar',        unit: 'tonne',  inStock: 48.5,  required: 60.0,  reorderLevel: 20,   supplier: 'BlueScope Steel' },
  { id: 'i2', material: 'N20 Steel Rebar',         unit: 'tonne',  inStock: 12.0,  required: 30.0,  reorderLevel: 15,   supplier: 'BlueScope Steel' },
  { id: 'i3', material: 'Formwork Plywood 17mm',   unit: 'sheet',  inStock: 210,   required: 250,   reorderLevel: 100,  supplier: 'Boral Timber'    },
  { id: 'i4', material: 'M25 Ready Mix Concrete',  unit: 'm³',     inStock: 80,    required: 120,   reorderLevel: 40,   supplier: 'Holcim Aust.'    },
  { id: 'i5', material: 'Safety Helmet (Class C)', unit: 'unit',   inStock: 18,    required: 60,    reorderLevel: 25,   supplier: 'Safety HQ'       },
  { id: 'i6', material: 'High-Vis Vest (Class 3)', unit: 'unit',   inStock: 32,    required: 60,    reorderLevel: 20,   supplier: 'Safety HQ'       },
  { id: 'i7', material: 'Anchor Bolts M24',         unit: 'box',    inStock: 14,    required: 14,    reorderLevel: 5,    supplier: 'Ramset Aust.'    },
];

export const InventoryWidget: React.FC = () => {
  const lowStockItems = INVENTORY.filter((i) => i.inStock <= i.reorderLevel);

  return (
    <WidgetShell
      title="Material Inventory"
      subtitle="Harbor City Tower — Block C"
      noPadding
      action={
        lowStockItems.length > 0 ? (
          <span className="flex items-center gap-1 text-[10px] font-mono font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 px-2 py-0.5 rounded-sm">
            <AlertTriangle className="h-3 w-3" />
            {lowStockItems.length} Low Stock
          </span>
        ) : null
      }
    >
      <table className="w-full text-xs">
        <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800">
          <tr>
            <th className="text-left px-4 py-2 font-bold uppercase tracking-wider text-slate-500 text-[10px]">Material</th>
            <th className="text-right px-3 py-2 font-bold uppercase tracking-wider text-slate-500 text-[10px]">In Stock</th>
            <th className="text-right px-3 py-2 font-bold uppercase tracking-wider text-slate-500 text-[10px] hidden sm:table-cell">Required</th>
            <th className="text-left px-4 py-2 font-bold uppercase tracking-wider text-slate-500 text-[10px] hidden md:table-cell">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {INVENTORY.map((item) => {
            const isLow = item.inStock <= item.reorderLevel;
            const isCritical = item.inStock < item.reorderLevel * 0.5;
            const pct = Math.min((item.inStock / item.required) * 100, 100);
            return (
              <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="px-4 py-2.5">
                  <p className="font-medium text-slate-900 dark:text-slate-100 truncate max-w-[160px]">{item.material}</p>
                  <p className="text-[11px] text-slate-400 font-mono">{item.supplier}</p>
                </td>
                <td className="px-3 py-2.5 text-right font-mono">
                  <span className={isCritical ? 'text-red-700 dark:text-red-400 font-bold' : isLow ? 'text-amber-700 dark:text-amber-400 font-bold' : 'text-slate-700 dark:text-slate-300'}>
                    {item.inStock}
                  </span>
                  <span className="text-slate-400 ml-0.5">{item.unit}</span>
                </td>
                <td className="px-3 py-2.5 text-right font-mono text-slate-500 hidden sm:table-cell">
                  {item.required} {item.unit}
                </td>
                <td className="px-4 py-2.5 hidden md:table-cell">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-sm overflow-hidden">
                      <div
                        className={`h-full rounded-sm ${isCritical ? 'bg-red-600' : isLow ? 'bg-amber-500' : 'bg-emerald-600'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <StatusBadge
                      status={isCritical ? 'critical' : isLow ? 'low-stock' : 'active'}
                      label={isCritical ? 'Critical' : isLow ? 'Low' : 'OK'}
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </WidgetShell>
  );
};
