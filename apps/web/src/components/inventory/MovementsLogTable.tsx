import * as React from 'react';
import { ArrowDownCircle, ArrowUpCircle, Package, RotateCcw } from 'lucide-react';
import type { MovementType } from '@sitebrain/types';

export interface MovementRecord {
  id: string;
  itemName: string;
  itemSku: string;
  movementType: MovementType;
  quantity: number;
  unit: string;
  referenceNo: string;
  notes?: string;
  performedBy: string;
  createdAt: string;
}

const SEED_MOVEMENTS: MovementRecord[] = [
  {
    id: 'm1',
    itemName: 'N16 Steel Rebar 12m',
    itemSku: 'STL-N16-12M',
    movementType: 'INCOMING',
    quantity: 20.0,
    unit: 'tonne',
    referenceNo: 'DEL-2026-0147',
    notes: 'BlueScope delivery docket #4821',
    performedBy: 'O. Fischer',
    createdAt: new Date(Date.now() - 8 * 3600000).toISOString(),
  },
  {
    id: 'm2',
    itemName: 'Formwork Plywood 17mm',
    itemSku: 'FRM-PLY-17MM',
    movementType: 'OUTGOING',
    quantity: 40.0,
    unit: 'sheet',
    referenceNo: 'REQ-L14-007',
    notes: 'Dispatched to Level 14 slab area',
    performedBy: 'M. Vance',
    createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),
  },
  {
    id: 'm3',
    itemName: 'Safety Helmet Class C',
    itemSku: 'PPE-HLM-C3',
    movementType: 'OUTGOING',
    quantity: 5.0,
    unit: 'unit',
    referenceNo: 'REQ-PPE-019',
    notes: 'Issued to new crane crew',
    performedBy: 'J. Chen',
    createdAt: new Date(Date.now() - 3 * 3600000).toISOString(),
  },
  {
    id: 'm4',
    itemName: 'N20 Steel Rebar 12m',
    itemSku: 'STL-N20-12M',
    movementType: 'INCOMING',
    quantity: 8.0,
    unit: 'tonne',
    referenceNo: 'DEL-2026-0148',
    notes: 'Partial delivery — balance due Fri',
    performedBy: 'O. Fischer',
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: 'm5',
    itemName: 'M25 Ready Mix Concrete',
    itemSku: 'CON-M25-RMX',
    movementType: 'INCOMING',
    quantity: 40.0,
    unit: 'm³',
    referenceNo: 'PO-0041',
    notes: 'Holcim L14 pour batch 1',
    performedBy: 'T. Nakamura',
    createdAt: new Date(Date.now() - 1 * 3600000).toISOString(),
  },
  {
    id: 'm6',
    itemName: 'Acrow Prop Adjustable',
    itemSku: 'FRM-JCK-PRP',
    movementType: 'RETURN',
    quantity: 30.0,
    unit: 'unit',
    referenceNo: 'RTN-L12-004',
    notes: 'Returned from L12 after strip',
    performedBy: 'D. Kowalski',
    createdAt: new Date(Date.now() - 0.5 * 3600000).toISOString(),
  },
  {
    id: 'm7',
    itemName: 'Power Cable 2C+E 4mm²',
    itemSku: 'ELC-CAB-2C4',
    movementType: 'ADJUSTMENT',
    quantity: 320,
    unit: 'metre',
    referenceNo: 'ADJ-STOCKTAKE',
    notes: 'Physical stocktake correction',
    performedBy: 'M. Vance',
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
];

const TYPE_CONFIG: Record<
  MovementType,
  { label: string; icon: React.ReactNode; color: string; bg: string }
> = {
  INCOMING: {
    label: 'Delivery',
    icon: <ArrowDownCircle className="h-3.5 w-3.5" />,
    color: 'text-emerald-700 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
  },
  OUTGOING: {
    label: 'Dispatch',
    icon: <ArrowUpCircle className="h-3.5 w-3.5" />,
    color: 'text-orange-700 dark:text-orange-400',
    bg: 'bg-orange-50 dark:bg-orange-950/40',
  },
  ADJUSTMENT: {
    label: 'Adjustment',
    icon: <Package className="h-3.5 w-3.5" />,
    color: 'text-blue-700 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-950/40',
  },
  RETURN: {
    label: 'Return',
    icon: <RotateCcw className="h-3.5 w-3.5" />,
    color: 'text-slate-700 dark:text-slate-400',
    bg: 'bg-slate-100 dark:bg-slate-800',
  },
};

function fmt(iso: string) {
  return new Date(iso).toLocaleString('en-AU', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

interface MovementsLogTableProps {
  extra?: MovementRecord[];
}

export const MovementsLogTable: React.FC<MovementsLogTableProps> = ({ extra = [] }) => {
  const all = [...extra, ...SEED_MOVEMENTS].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-sm overflow-hidden">
      <table className="w-full text-xs">
        <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800">
          <tr>
            <th className="text-left px-4 py-2.5 font-bold uppercase tracking-wider text-slate-500 text-[10px]">
              Type
            </th>
            <th className="text-left px-3 py-2.5 font-bold uppercase tracking-wider text-slate-500 text-[10px]">
              Material
            </th>
            <th className="text-right px-3 py-2.5 font-bold uppercase tracking-wider text-slate-500 text-[10px]">
              Qty
            </th>
            <th className="text-left px-3 py-2.5 font-bold uppercase tracking-wider text-slate-500 text-[10px] hidden md:table-cell">
              Reference
            </th>
            <th className="text-left px-3 py-2.5 font-bold uppercase tracking-wider text-slate-500 text-[10px] hidden lg:table-cell">
              Performed By
            </th>
            <th className="text-right px-4 py-2.5 font-bold uppercase tracking-wider text-slate-500 text-[10px] hidden sm:table-cell">
              Date / Time
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {all.map((m) => {
            const cfg = TYPE_CONFIG[m.movementType];
            return (
              <tr
                key={m.id}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
              >
                <td className="px-4 py-2.5">
                  <div
                    className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-sm text-[10px] font-semibold font-mono ${cfg.color} ${cfg.bg}`}
                  >
                    {cfg.icon}
                    {cfg.label}
                  </div>
                </td>
                <td className="px-3 py-2.5">
                  <p className="font-medium text-slate-900 dark:text-slate-100 truncate max-w-[160px]">
                    {m.itemName}
                  </p>
                  <p className="text-[10px] font-mono text-slate-400">{m.itemSku}</p>
                </td>
                <td className="px-3 py-2.5 text-right font-mono font-semibold text-slate-800 dark:text-slate-200">
                  {m.movementType === 'OUTGOING' ? '-' : '+'}
                  {m.quantity}
                  <span className="text-slate-400 font-normal ml-0.5 text-[10px]">{m.unit}</span>
                </td>
                <td className="px-3 py-2.5 hidden md:table-cell">
                  <p className="font-mono text-slate-700 dark:text-slate-300 text-[11px]">
                    {m.referenceNo}
                  </p>
                  {m.notes && (
                    <p className="text-slate-400 text-[10px] truncate max-w-[180px]">{m.notes}</p>
                  )}
                </td>
                <td className="px-3 py-2.5 font-mono text-slate-500 text-[11px] hidden lg:table-cell">
                  {m.performedBy}
                </td>
                <td className="px-4 py-2.5 text-right font-mono text-slate-500 text-[11px] hidden sm:table-cell">
                  {fmt(m.createdAt)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export { SEED_MOVEMENTS };
