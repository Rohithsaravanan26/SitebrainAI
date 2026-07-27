import * as React from 'react';
import { AlertTriangle, ShoppingCart } from 'lucide-react';
import { INVENTORY_ITEMS } from './StockOverviewTable';
import type { InventoryItem } from '@sitebrain/types';

interface LowStockAlertsWidgetProps {
  onReorder?: (item: InventoryItem) => void;
}

export const LowStockAlertsWidget: React.FC<LowStockAlertsWidgetProps> = ({ onReorder }) => {
  const criticalItems = INVENTORY_ITEMS.filter((i) => i.currentStock <= i.reorderLevel * 0.5);
  const lowItems = INVENTORY_ITEMS.filter(
    (i) => i.currentStock > i.reorderLevel * 0.5 && i.currentStock <= i.reorderLevel
  );
  const allAlerts = [...criticalItems, ...lowItems];

  if (allAlerts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-500">
        <AlertTriangle className="h-8 w-8 mb-2 text-slate-300 dark:text-slate-700" />
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">No stock alerts</p>
        <p className="text-xs text-slate-400 font-mono mt-0.5">
          All materials are above reorder threshold
        </p>
      </div>
    );
  }

  const pct = (i: InventoryItem) => Math.round((i.currentStock / i.reorderLevel) * 100);

  return (
    <div className="space-y-3">
      {/* Summary Banner */}
      <div
        className={`flex items-start gap-3 px-4 py-3 rounded-sm border ${
          criticalItems.length > 0
            ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900'
            : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900'
        }`}
      >
        <AlertTriangle
          className={`h-5 w-5 shrink-0 mt-0.5 ${criticalItems.length > 0 ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'}`}
        />
        <div>
          <p
            className={`text-sm font-bold ${criticalItems.length > 0 ? 'text-red-800 dark:text-red-300' : 'text-amber-800 dark:text-amber-300'}`}
          >
            {criticalItems.length > 0
              ? `${criticalItems.length} item${criticalItems.length > 1 ? 's' : ''} at critical stock level — immediate action required`
              : `${lowItems.length} item${lowItems.length > 1 ? 's' : ''} below reorder threshold`}
          </p>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Raise purchase orders to avoid site disruption.
          </p>
        </div>
      </div>

      {/* Alert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {allAlerts.map((item) => {
          const isCritical = item.currentStock <= item.reorderLevel * 0.5;
          const shortage = item.reorderLevel - item.currentStock;
          return (
            <div
              key={item.id}
              className={`bg-white dark:bg-slate-900 border rounded-sm p-4 ${
                isCritical
                  ? 'border-red-300 dark:border-red-900'
                  : 'border-amber-300 dark:border-amber-900'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                    {item.name}
                  </p>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-px rounded-sm">
                    {item.sku}
                  </span>
                </div>
                <span
                  className={`text-[9px] font-bold font-mono shrink-0 px-1.5 py-0.5 rounded-sm ${
                    isCritical
                      ? 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900'
                      : 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900'
                  }`}
                >
                  {isCritical ? 'CRITICAL' : 'LOW'}
                </span>
              </div>

              {/* Stock bar */}
              <div className="flex items-center gap-2 mb-2.5">
                <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-sm overflow-hidden">
                  <div
                    className={`h-full rounded-sm ${isCritical ? 'bg-red-600' : 'bg-amber-500'}`}
                    style={{ width: `${Math.min(100, pct(item))}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono text-slate-500 shrink-0">
                  {pct(item)}% of threshold
                </span>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-2 text-center mb-3">
                {[
                  {
                    label: 'In Stock',
                    value: `${item.currentStock} ${item.unit}`,
                    bold: true,
                    danger: true,
                  },
                  {
                    label: 'Reorder',
                    value: `${item.reorderLevel} ${item.unit}`,
                    bold: false,
                    danger: false,
                  },
                  {
                    label: 'Shortage',
                    value: `${Math.max(0, shortage).toFixed(1)} ${item.unit}`,
                    bold: true,
                    danger: true,
                  },
                ].map((m) => (
                  <div
                    key={m.label}
                    className="bg-slate-50 dark:bg-slate-800/50 rounded-sm py-1.5 px-1"
                  >
                    <p
                      className={`text-[11px] font-mono ${m.bold && m.danger ? (isCritical ? 'text-red-700 dark:text-red-400 font-bold' : 'text-amber-700 dark:text-amber-400 font-bold') : 'text-slate-700 dark:text-slate-300'}`}
                    >
                      {m.value}
                    </p>
                    <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wide">
                      {m.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <p className="text-[10px] font-mono text-slate-400">{item.supplierName}</p>
                <button
                  onClick={() => onReorder?.(item)}
                  className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold font-mono bg-orange-700 hover:bg-orange-600 text-white rounded-sm transition-colors"
                >
                  <ShoppingCart className="h-3 w-3" />
                  Reorder
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
