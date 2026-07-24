import * as React from 'react';
import { cn } from '@/lib/utils';
import type { InventoryItem } from '@sitebrain/types';
import { StatusBadge } from '@/components/dashboard/shared/StatusBadge';

// ─── Fixture data ──────────────────────────────────────────────
export const INVENTORY_ITEMS: InventoryItem[] = [
  { id: 'i1',  sku: 'STL-N16-12M', name: 'N16 Steel Rebar 12m',        category: 'Structural Steel',  unit: 'tonne',  currentStock: 48.5,  allocatedStock: 22.0, reorderLevel: 20,   targetStock: 80,   unitCost: 1240,  supplierName: 'BlueScope Steel',  storageLocation: 'Yard A — Bay 3',    qrCodeData: 'SITEBRAIN:SKU:STL-N16-12M', createdAt: '2026-06-01T00:00:00Z', updatedAt: '2026-07-24T00:00:00Z' },
  { id: 'i2',  sku: 'STL-N20-12M', name: 'N20 Steel Rebar 12m',        category: 'Structural Steel',  unit: 'tonne',  currentStock: 12.0,  allocatedStock: 10.0, reorderLevel: 15,   targetStock: 60,   unitCost: 1380,  supplierName: 'BlueScope Steel',  storageLocation: 'Yard A — Bay 4',    qrCodeData: 'SITEBRAIN:SKU:STL-N20-12M', createdAt: '2026-06-01T00:00:00Z', updatedAt: '2026-07-24T00:00:00Z' },
  { id: 'i3',  sku: 'FRM-PLY-17MM',name: 'Formwork Plywood 17mm',      category: 'Formwork',          unit: 'sheet',  currentStock: 210,   allocatedStock: 80,   reorderLevel: 100,  targetStock: 300,  unitCost: 68,    supplierName: 'Boral Timber',     storageLocation: 'Yard B — Rack 1',   qrCodeData: 'SITEBRAIN:SKU:FRM-PLY-17MM',createdAt: '2026-06-01T00:00:00Z', updatedAt: '2026-07-24T00:00:00Z' },
  { id: 'i4',  sku: 'CON-M25-RMX', name: 'M25 Ready Mix Concrete',     category: 'Concrete',          unit: 'm³',     currentStock: 80,    allocatedStock: 80,   reorderLevel: 40,   targetStock: 150,  unitCost: 185,   supplierName: 'Holcim Aust.',     storageLocation: 'On-Call Delivery',  qrCodeData: 'SITEBRAIN:SKU:CON-M25-RMX', createdAt: '2026-06-01T00:00:00Z', updatedAt: '2026-07-24T00:00:00Z' },
  { id: 'i5',  sku: 'PPE-HLM-C3',  name: 'Safety Helmet Class C',      category: 'Safety PPE',        unit: 'unit',   currentStock: 18,    allocatedStock: 18,   reorderLevel: 25,   targetStock: 80,   unitCost: 32,    supplierName: 'Safety HQ',        storageLocation: 'Site Office',       qrCodeData: 'SITEBRAIN:SKU:PPE-HLM-C3', createdAt: '2026-06-01T00:00:00Z', updatedAt: '2026-07-24T00:00:00Z' },
  { id: 'i6',  sku: 'PPE-VIS-C3',  name: 'Hi-Vis Vest Class 3',        category: 'Safety PPE',        unit: 'unit',   currentStock: 32,    allocatedStock: 32,   reorderLevel: 20,   targetStock: 80,   unitCost: 28,    supplierName: 'Safety HQ',        storageLocation: 'Site Office',       qrCodeData: 'SITEBRAIN:SKU:PPE-VIS-C3', createdAt: '2026-06-01T00:00:00Z', updatedAt: '2026-07-24T00:00:00Z' },
  { id: 'i7',  sku: 'BLT-ANC-M24', name: 'Anchor Bolts M24 x 300',     category: 'Fixings',           unit: 'box',    currentStock: 14,    allocatedStock: 14,   reorderLevel: 5,    targetStock: 30,   unitCost: 95,    supplierName: 'Ramset Aust.',     storageLocation: 'Yard A — Cage',     qrCodeData: 'SITEBRAIN:SKU:BLT-ANC-M24',createdAt: '2026-06-01T00:00:00Z', updatedAt: '2026-07-24T00:00:00Z' },
  { id: 'i8',  sku: 'FRM-JCK-PRP', name: 'Acrow Prop Adjustable',      category: 'Formwork',          unit: 'unit',   currentStock: 220,   allocatedStock: 180,  reorderLevel: 100,  targetStock: 300,  unitCost: 44,    supplierName: 'Boral Timber',     storageLocation: 'Yard B — Row 2',    qrCodeData: 'SITEBRAIN:SKU:FRM-JCK-PRP',createdAt: '2026-06-01T00:00:00Z', updatedAt: '2026-07-24T00:00:00Z' },
  { id: 'i9',  sku: 'CHM-CUR-A10', name: 'Curing Compound A10',        category: 'Chemicals',         unit: 'litre',  currentStock: 560,   allocatedStock: 200,  reorderLevel: 200,  targetStock: 800,  unitCost: 4.2,   supplierName: 'Parchem Constr.',  storageLocation: 'Hazmat Store',      qrCodeData: 'SITEBRAIN:SKU:CHM-CUR-A10',createdAt: '2026-06-01T00:00:00Z', updatedAt: '2026-07-24T00:00:00Z' },
  { id: 'i10', sku: 'ELC-CAB-2C4', name: 'Power Cable 2C+E 4mm²',      category: 'Electrical',        unit: 'metre',  currentStock: 320,   allocatedStock: 120,  reorderLevel: 200,  targetStock: 600,  unitCost: 3.8,   supplierName: 'Clipsal Elec.',    storageLocation: 'Electrical Store',  qrCodeData: 'SITEBRAIN:SKU:ELC-CAB-2C4',createdAt: '2026-06-01T00:00:00Z', updatedAt: '2026-07-24T00:00:00Z' },
];

interface StockOverviewTableProps {
  searchQuery: string;
  categoryFilter: string;
  lowStockOnly: boolean;
  onQrClick: (item: InventoryItem) => void;
  onMovementClick: (item: InventoryItem) => void;
}

export const StockOverviewTable: React.FC<StockOverviewTableProps> = ({
  searchQuery,
  categoryFilter,
  lowStockOnly,
  onQrClick,
  onMovementClick,
}) => {
  const filtered = INVENTORY_ITEMS.filter((item) => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || item.name.toLowerCase().includes(q) || item.sku.toLowerCase().includes(q);
    const matchCat = !categoryFilter || item.category === categoryFilter;
    const matchLow = !lowStockOnly || item.currentStock <= item.reorderLevel;
    return matchSearch && matchCat && matchLow;
  });

  const available = (item: InventoryItem) => Math.max(0, item.currentStock - item.allocatedStock);
  const pct = (item: InventoryItem) => Math.min(100, Math.round((item.currentStock / item.targetStock) * 100));
  const isLow = (item: InventoryItem) => item.currentStock <= item.reorderLevel;
  const isCritical = (item: InventoryItem) => item.currentStock <= item.reorderLevel * 0.5;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-sm overflow-hidden">
      <table className="w-full text-xs">
        <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800">
          <tr>
            <th className="text-left px-4 py-2.5 font-bold uppercase tracking-wider text-slate-500 text-[10px]">SKU / Material</th>
            <th className="text-right px-3 py-2.5 font-bold uppercase tracking-wider text-slate-500 text-[10px]">On Hand</th>
            <th className="text-right px-3 py-2.5 font-bold uppercase tracking-wider text-slate-500 text-[10px] hidden sm:table-cell">Allocated</th>
            <th className="text-right px-3 py-2.5 font-bold uppercase tracking-wider text-slate-500 text-[10px] hidden md:table-cell">Available</th>
            <th className="text-left px-3 py-2.5 font-bold uppercase tracking-wider text-slate-500 text-[10px] hidden lg:table-cell">Stock Level</th>
            <th className="text-left px-3 py-2.5 font-bold uppercase tracking-wider text-slate-500 text-[10px] hidden xl:table-cell">Location</th>
            <th className="text-right px-4 py-2.5 font-bold uppercase tracking-wider text-slate-500 text-[10px]">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center py-10 text-slate-400 font-mono text-xs">
                No items match the current filter
              </td>
            </tr>
          ) : (
            filtered.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="px-4 py-2.5">
                  <p className="font-medium text-slate-900 dark:text-slate-100">{item.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-px rounded-sm">{item.sku}</span>
                    <span className="text-[10px] text-slate-400">{item.category}</span>
                  </div>
                </td>
                <td className="px-3 py-2.5 text-right font-mono">
                  <span className={isCritical(item) ? 'text-red-700 dark:text-red-400 font-bold' : isLow(item) ? 'text-amber-700 dark:text-amber-400 font-bold' : 'text-slate-800 dark:text-slate-200'}>
                    {item.currentStock}
                  </span>
                  <span className="text-slate-400 ml-0.5 text-[10px]">{item.unit}</span>
                </td>
                <td className="px-3 py-2.5 text-right font-mono text-slate-500 text-[11px] hidden sm:table-cell">
                  {item.allocatedStock} {item.unit}
                </td>
                <td className="px-3 py-2.5 text-right font-mono text-slate-700 dark:text-slate-300 text-[11px] hidden md:table-cell">
                  {available(item)} {item.unit}
                </td>
                <td className="px-3 py-2.5 hidden lg:table-cell">
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-sm overflow-hidden">
                      <div
                        className={cn('h-full rounded-sm', isCritical(item) ? 'bg-red-600' : isLow(item) ? 'bg-amber-500' : 'bg-emerald-600')}
                        style={{ width: `${pct(item)}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 w-7">{pct(item)}%</span>
                    <StatusBadge
                      status={isCritical(item) ? 'critical' : isLow(item) ? 'low-stock' : 'active'}
                      label={isCritical(item) ? 'Critical' : isLow(item) ? 'Low' : 'OK'}
                    />
                  </div>
                </td>
                <td className="px-3 py-2.5 text-[11px] font-mono text-slate-500 hidden xl:table-cell truncate max-w-[140px]">
                  {item.storageLocation}
                </td>
                <td className="px-4 py-2.5 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onMovementClick(item)}
                      className="px-2 py-1 text-[10px] font-mono font-semibold bg-orange-700 hover:bg-orange-600 text-white rounded-sm transition-colors"
                    >
                      Adjust
                    </button>
                    <button
                      onClick={() => onQrClick(item)}
                      className="px-2 py-1 text-[10px] font-mono font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-sm transition-colors"
                    >
                      QR
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
