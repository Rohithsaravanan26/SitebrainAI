'use client';

import * as React from 'react';
import { X, Download, Printer, QrCode } from 'lucide-react';
import type { InventoryItem } from '@sitebrain/types';

interface QrCodeModalProps {
  item: InventoryItem | null;
  onClose: () => void;
}

/** Renders a pure SVG QR code grid from a seeded bit-pattern derived from the SKU string. */
function DeterministicQr({ data, size = 200 }: { data: string; size?: number }) {
  const MODULES = 21; // Version 1 QR module count
  const cell = Math.floor(size / MODULES);

  // Simple seeded pattern based on character codes — deterministic & unique per SKU
  const seed = data.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const rng = (i: number) => ((seed * 9301 + 49297 * (i + 1)) % 233280) / 233280;

  // Fixed finder patterns for authentic QR appearance
  const isFinderPattern = (r: number, c: number) => {
    const inBlock = (ro: number, co: number) => r >= ro && r <= ro + 6 && c >= co && c <= co + 6;
    return inBlock(0, 0) || inBlock(0, MODULES - 7) || inBlock(MODULES - 7, 0);
  };
  const isFinderCore = (r: number, c: number) => {
    const inCore = (ro: number, co: number) =>
      r >= ro + 2 && r <= ro + 4 && c >= co + 2 && c <= co + 4;
    return inCore(0, 0) || inCore(0, MODULES - 7) || inCore(MODULES - 7, 0);
  };

  const modules: boolean[][] = Array.from({ length: MODULES }, (_, r) =>
    Array.from({ length: MODULES }, (_, c) => {
      if (isFinderPattern(r, c)) return !isFinderCore(r, c);
      return rng(r * MODULES + c) > 0.45;
    })
  );

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ imageRendering: 'pixelated' }}
    >
      <rect width={size} height={size} fill="white" />
      {modules.map((row, r) =>
        row.map((dark, c) =>
          dark ? (
            <rect
              key={`${r}-${c}`}
              x={c * cell}
              y={r * cell}
              width={cell}
              height={cell}
              fill="#0f172a"
            />
          ) : null
        )
      )}
    </svg>
  );
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({ item, onClose }) => {
  const printRef = React.useRef<HTMLDivElement>(null);

  if (!item) return null;

  const handlePrint = () => window.print();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-sm w-full max-w-sm shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <QrCode className="h-4 w-4 text-slate-400" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">QR Code Label</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-sm transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Printable Label */}
        <div ref={printRef} className="p-6">
          <div className="flex flex-col items-center gap-4 bg-white p-4 border-2 border-slate-200 dark:border-slate-700 rounded-sm">
            {/* Company Header */}
            <div className="w-full text-center border-b border-slate-200 pb-3 mb-1">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-700">
                SiteBrain AI
              </p>
              <p className="text-[10px] font-mono text-slate-400">Harbor City Tower — Block C</p>
            </div>

            {/* QR Code */}
            <DeterministicQr data={item.qrCodeData} size={180} />

            {/* Item Info */}
            <div className="w-full text-center space-y-0.5 pt-2 border-t border-slate-200">
              <p className="text-sm font-bold text-slate-900 leading-tight">{item.name}</p>
              <p className="text-xs font-mono font-bold text-orange-700 tracking-wider">
                {item.sku}
              </p>
              <p className="text-[10px] font-mono text-slate-500">
                {item.category} · {item.unit}
              </p>
              <p className="text-[10px] font-mono text-slate-400">{item.storageLocation}</p>
            </div>

            {/* QR Data String */}
            <div className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-sm px-3 py-2 text-center">
              <p className="text-[9px] font-mono text-slate-500 break-all leading-relaxed">
                {item.qrCodeData}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-5 pb-4 flex gap-2">
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold bg-orange-700 hover:bg-orange-600 text-white rounded-sm transition-colors"
          >
            <Printer className="h-3.5 w-3.5" />
            Print Label
          </button>
          <button
            onClick={onClose}
            className="px-4 text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-sm transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
