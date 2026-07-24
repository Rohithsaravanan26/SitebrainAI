import * as React from 'react';
import type { PurchaseOrder, POStatus } from '@sitebrain/types';
import { StatusBadge } from '@/components/dashboard/shared/StatusBadge';
import type { StatusVariant } from '@/components/dashboard/shared/StatusBadge';

const POS: PurchaseOrder[] = [
  { id: 'po1', poNumber: 'PO-2026-0041', supplierId: 's3', supplierName: 'Holcim Australia',        status: 'DELIVERED',          totalAmount: 14800, expectedDelivery: '2026-07-24T06:00:00Z', createdAt: '2026-07-21T00:00:00Z', updatedAt: '2026-07-24T08:30:00Z' },
  { id: 'po2', poNumber: 'PO-2026-0042', supplierId: 's1', supplierName: 'BlueScope Steel',          status: 'ORDERED',            totalAmount: 27640, expectedDelivery: '2026-07-26T08:00:00Z', createdAt: '2026-07-22T00:00:00Z', updatedAt: '2026-07-22T00:00:00Z' },
  { id: 'po3', poNumber: 'PO-2026-0043', supplierId: 's2', supplierName: 'Boral Timber & Products',  status: 'PARTIALLY_RECEIVED', totalAmount: 12240, expectedDelivery: '2026-07-25T07:00:00Z', createdAt: '2026-07-22T00:00:00Z', updatedAt: '2026-07-24T14:00:00Z' },
  { id: 'po4', poNumber: 'PO-2026-0044', supplierId: 's4', supplierName: 'Safety HQ',               status: 'DRAFT',              totalAmount: 3840,  expectedDelivery: '2026-07-30T09:00:00Z', createdAt: '2026-07-24T00:00:00Z', updatedAt: '2026-07-24T00:00:00Z' },
  { id: 'po5', poNumber: 'PO-2026-0039', supplierId: 's5', supplierName: 'Ramset Australia',         status: 'DELIVERED',          totalAmount: 1330,  expectedDelivery: '2026-07-20T08:00:00Z', createdAt: '2026-07-18T00:00:00Z', updatedAt: '2026-07-20T10:00:00Z' },
  { id: 'po6', poNumber: 'PO-2026-0040', supplierId: 's6', supplierName: 'Parchem Construction',     status: 'ORDERED',            totalAmount: 2352,  expectedDelivery: '2026-07-27T07:00:00Z', createdAt: '2026-07-23T00:00:00Z', updatedAt: '2026-07-23T00:00:00Z' },
];

const statusMap: Record<POStatus, StatusVariant> = {
  DRAFT:              'not-started',
  ORDERED:            'in-progress',
  PARTIALLY_RECEIVED: 'at-risk',
  DELIVERED:          'complete',
  CANCELLED:          'inactive',
};

const statusLabel: Record<POStatus, string> = {
  DRAFT:              'Draft',
  ORDERED:            'Ordered',
  PARTIALLY_RECEIVED: 'Part Rcvd',
  DELIVERED:          'Delivered',
  CANCELLED:          'Cancelled',
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' });
}

function fmtCurrency(n: number) {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(n);
}

export const PurchaseOrdersTable: React.FC = () => {
  const totalValue = POS.reduce((s, p) => s + p.totalAmount, 0);

  return (
    <div className="space-y-3">
      {/* Summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total POs',   value: String(POS.length) },
          { label: 'Open Orders', value: String(POS.filter(p => p.status === 'ORDERED').length) },
          { label: 'Awaiting',    value: String(POS.filter(p => p.status === 'PARTIALLY_RECEIVED').length) },
          { label: 'Total Value', value: fmtCurrency(totalValue) },
        ].map((s) => (
          <div key={s.label} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-sm px-4 py-2.5">
            <p className="text-base font-bold font-mono text-slate-900 dark:text-slate-100">{s.value}</p>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">{s.label}</p>
          </div>
        ))}
      </div>

      {/* PO Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-sm overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="text-left px-4 py-2.5 font-bold uppercase tracking-wider text-slate-500 text-[10px]">PO Number</th>
              <th className="text-left px-3 py-2.5 font-bold uppercase tracking-wider text-slate-500 text-[10px] hidden sm:table-cell">Supplier</th>
              <th className="text-left px-3 py-2.5 font-bold uppercase tracking-wider text-slate-500 text-[10px]">Status</th>
              <th className="text-right px-3 py-2.5 font-bold uppercase tracking-wider text-slate-500 text-[10px] hidden md:table-cell">Value</th>
              <th className="text-right px-4 py-2.5 font-bold uppercase tracking-wider text-slate-500 text-[10px] hidden lg:table-cell">Expected Delivery</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {POS.map((po) => {
              const isOverdue = po.status !== 'DELIVERED' && po.status !== 'CANCELLED' && new Date(po.expectedDelivery) < new Date();
              return (
                <tr key={po.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer">
                  <td className="px-4 py-2.5">
                    <p className="font-mono font-semibold text-orange-700 dark:text-orange-400">{po.poNumber}</p>
                    <p className="text-[10px] font-mono text-slate-400">Created {fmtDate(po.createdAt)}</p>
                  </td>
                  <td className="px-3 py-2.5 text-slate-700 dark:text-slate-300 hidden sm:table-cell">{po.supplierName}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <StatusBadge status={statusMap[po.status]} label={statusLabel[po.status]} />
                      {isOverdue && (
                        <span className="text-[9px] font-bold font-mono text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 px-1 py-px rounded-sm">OVERDUE</span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono font-semibold text-slate-800 dark:text-slate-200 hidden md:table-cell">
                    {fmtCurrency(po.totalAmount)}
                  </td>
                  <td className={`px-4 py-2.5 text-right font-mono text-[11px] hidden lg:table-cell ${isOverdue ? 'text-red-600 dark:text-red-400 font-semibold' : 'text-slate-500'}`}>
                    {fmtDate(po.expectedDelivery)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
