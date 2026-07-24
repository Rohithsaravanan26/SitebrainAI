'use client';

import * as React from 'react';
import { X, Package, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { InventoryItem, MovementType } from '@sitebrain/types';

const MOVEMENT_TYPES: { value: MovementType; label: string; icon: React.ReactNode; color: string }[] = [
  { value: 'INCOMING',   label: 'Incoming Delivery',   icon: <ArrowDownCircle className="h-4 w-4" />, color: 'text-emerald-600' },
  { value: 'OUTGOING',   label: 'Site Dispatch',       icon: <ArrowUpCircle className="h-4 w-4" />,  color: 'text-orange-600'  },
  { value: 'ADJUSTMENT', label: 'Stock Adjustment',    icon: <Package className="h-4 w-4" />,        color: 'text-blue-600'    },
  { value: 'RETURN',     label: 'Return to Yard',      icon: <ArrowDownCircle className="h-4 w-4" />,color: 'text-slate-600'   },
];

interface StockMovementModalProps {
  item: InventoryItem | null;
  onClose: () => void;
  onConfirm: (movementType: MovementType, quantity: number, referenceNo: string, notes: string) => void;
}

export const StockMovementModal: React.FC<StockMovementModalProps> = ({ item, onClose, onConfirm }) => {
  const [movementType, setMovementType] = React.useState<MovementType>('INCOMING');
  const [quantity, setQuantity] = React.useState('');
  const [referenceNo, setReferenceNo] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const [error, setError] = React.useState('');

  if (!item) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const qty = parseFloat(quantity);
    if (!qty || qty <= 0) { setError('Enter a valid positive quantity.'); return; }
    if (!referenceNo.trim()) { setError('Reference number is required.'); return; }
    if (movementType === 'OUTGOING' && qty > item.currentStock) {
      setError(`Cannot dispatch more than current stock (${item.currentStock} ${item.unit}).`);
      return;
    }
    onConfirm(movementType, qty, referenceNo.trim(), notes.trim());
    onClose();
  };

  const selected = MOVEMENT_TYPES.find((m) => m.value === movementType)!;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-sm w-full max-w-md shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Stock Movement</h2>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">{item.sku} — {item.name}</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-sm transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Current Stock Info */}
        <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800">
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { label: 'On Hand', value: `${item.currentStock} ${item.unit}`, color: 'text-slate-900 dark:text-slate-100' },
              { label: 'Allocated', value: `${item.allocatedStock} ${item.unit}`, color: 'text-amber-700 dark:text-amber-400' },
              { label: 'Available', value: `${Math.max(0, item.currentStock - item.allocatedStock)} ${item.unit}`, color: 'text-emerald-700 dark:text-emerald-400' },
            ].map((s) => (
              <div key={s.label}>
                <p className={`text-sm font-bold font-mono ${s.color}`}>{s.value}</p>
                <p className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-3.5">
          {/* Movement Type */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono mb-1.5 block">Movement Type</label>
            <div className="grid grid-cols-2 gap-1.5">
              {MOVEMENT_TYPES.map((mt) => (
                <button
                  key={mt.value}
                  type="button"
                  onClick={() => setMovementType(mt.value)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-sm border text-xs font-medium transition-colors text-left',
                    movementType === mt.value
                      ? 'border-orange-600 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  )}
                >
                  <span className={movementType === mt.value ? 'text-orange-600' : 'text-slate-400'}>{mt.icon}</span>
                  {mt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono mb-1 block">
              Quantity ({item.unit})
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder={`Enter quantity in ${item.unit}`}
              className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-sm px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Reference No. */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono mb-1 block">
              Reference No. (Docket / PO / RFI)
            </label>
            <input
              type="text"
              value={referenceNo}
              onChange={(e) => setReferenceNo(e.target.value)}
              placeholder="e.g. DEL-2026-0147 or PO-0041"
              className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-sm px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono mb-1 block">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Additional notes or reason for adjustment"
              className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-sm px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-orange-500 resize-none"
            />
          </div>

          {error && (
            <p className="text-xs text-red-600 dark:text-red-400 font-mono bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 px-3 py-2 rounded-sm">
              {error}
            </p>
          )}

          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              className="flex-1 bg-orange-700 hover:bg-orange-600 text-white text-sm font-semibold py-2 rounded-sm transition-colors"
            >
              Confirm Movement
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 text-sm text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
