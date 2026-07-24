'use client';

import type { Metadata } from 'next';
import * as React from 'react';
import {
  Package,
  ArrowDownUp,
  Building2,
  ShoppingCart,
  AlertTriangle,
  Search,
  Plus,
  Filter,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { InventoryItem, MovementType } from '@sitebrain/types';
import { StockOverviewTable, INVENTORY_ITEMS } from '@/components/inventory/StockOverviewTable';
import { StockMovementModal }    from '@/components/inventory/StockMovementModal';
import { MovementsLogTable, SEED_MOVEMENTS, type MovementRecord } from '@/components/inventory/MovementsLogTable';
import { SuppliersTable }        from '@/components/inventory/SuppliersTable';
import { PurchaseOrdersTable }   from '@/components/inventory/PurchaseOrdersTable';
import { LowStockAlertsWidget }  from '@/components/inventory/LowStockAlertsWidget';
import { QrCodeModal }           from '@/components/inventory/QrCodeModal';

// ─── Tab Config ─────────────────────────────────────────────────
type Tab = 'stock' | 'movements' | 'suppliers' | 'purchase-orders' | 'alerts';

const TABS: { id: Tab; label: string; icon: React.ReactNode; badge?: number }[] = [
  { id: 'stock',           label: 'Stock',           icon: <Package className="h-3.5 w-3.5" />    },
  { id: 'movements',       label: 'Movements',       icon: <ArrowDownUp className="h-3.5 w-3.5" /> },
  { id: 'suppliers',       label: 'Suppliers',       icon: <Building2 className="h-3.5 w-3.5" />  },
  { id: 'purchase-orders', label: 'Purchase Orders', icon: <ShoppingCart className="h-3.5 w-3.5" />},
  { id: 'alerts',          label: 'Alerts',          icon: <AlertTriangle className="h-3.5 w-3.5" />,
    badge: INVENTORY_ITEMS.filter((i) => i.currentStock <= i.reorderLevel).length },
];

const CATEGORIES = Array.from(new Set(INVENTORY_ITEMS.map((i) => i.category))).sort();

// ─── KPIs ────────────────────────────────────────────────────────
function kpis() {
  const total     = INVENTORY_ITEMS.length;
  const lowStock  = INVENTORY_ITEMS.filter((i) => i.currentStock <= i.reorderLevel).length;
  const critical  = INVENTORY_ITEMS.filter((i) => i.currentStock <= i.reorderLevel * 0.5).length;
  const totalValue= INVENTORY_ITEMS.reduce((s, i) => s + i.currentStock * i.unitCost, 0);
  return { total, lowStock, critical, totalValue };
}

function fmtCurrency(n: number) {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(n);
}

// ─── Page ────────────────────────────────────────────────────────
export default function InventoryPage() {
  const [activeTab, setActiveTab] = React.useState<Tab>('stock');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState('');
  const [lowStockOnly, setLowStockOnly] = React.useState(false);
  const [movementItem, setMovementItem] = React.useState<InventoryItem | null>(null);
  const [qrItem, setQrItem] = React.useState<InventoryItem | null>(null);
  const [movements, setMovements] = React.useState<MovementRecord[]>([]);

  const { total, lowStock, critical, totalValue } = kpis();

  const handleMovementConfirm = (
    movementType: MovementType,
    quantity: number,
    referenceNo: string,
    notes: string
  ) => {
    if (!movementItem) return;
    const newRecord: MovementRecord = {
      id: `m-${Date.now()}`,
      itemName: movementItem.name,
      itemSku: movementItem.sku,
      movementType,
      quantity,
      unit: movementItem.unit,
      referenceNo,
      notes,
      performedBy: 'M. Vance',
      createdAt: new Date().toISOString(),
    };
    setMovements((prev) => [newRecord, ...prev]);
  };

  return (
    <>
      {/* ── Modals ──────────────────────────────────────────── */}
      <StockMovementModal
        item={movementItem}
        onClose={() => setMovementItem(null)}
        onConfirm={handleMovementConfirm}
      />
      <QrCodeModal item={qrItem} onClose={() => setQrItem(null)} />

      <div className="space-y-4">
        {/* ── Page Header ────────────────────────────────────── */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">Inventory Management</h1>
            <p className="text-xs font-mono text-slate-500 mt-0.5">
              Harbor City Tower — Block C · Material stock, movements & procurement
            </p>
          </div>
          <button
            onClick={() => { setActiveTab('stock'); setMovementItem(INVENTORY_ITEMS[0] ?? null); }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-orange-700 hover:bg-orange-600 text-white rounded-sm transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            Log Movement
          </button>
        </div>

        {/* ── KPI Strip ──────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total Items',    value: String(total),             sub: 'Tracked materials',           color: 'text-slate-900 dark:text-slate-100' },
            { label: 'Low Stock',      value: String(lowStock),          sub: `${critical} critical`,         color: lowStock > 0 ? 'text-amber-700 dark:text-amber-400' : 'text-slate-900 dark:text-slate-100' },
            { label: 'Critical Items', value: String(critical),          sub: 'Below 50% threshold',         color: critical > 0 ? 'text-red-700 dark:text-red-400' : 'text-slate-900 dark:text-slate-100' },
            { label: 'Stock Value',    value: fmtCurrency(totalValue),   sub: 'Current on-hand valuation',   color: 'text-slate-900 dark:text-slate-100' },
          ].map((kpi) => (
            <div key={kpi.label} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-sm px-4 py-3">
              <p className={`text-xl font-bold font-mono leading-tight ${kpi.color}`}>{kpi.value}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono mt-0.5">{kpi.label}</p>
              <p className="text-[10px] text-slate-400 font-mono">{kpi.sub}</p>
            </div>
          ))}
        </div>

        {/* ── Tab Bar ────────────────────────────────────────── */}
        <div className="flex items-center gap-0 border-b border-slate-200 dark:border-slate-800">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap',
                activeTab === tab.id
                  ? 'border-orange-600 text-orange-700 dark:text-orange-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              )}
            >
              {tab.icon}
              {tab.label}
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className={cn(
                  'text-[9px] font-bold font-mono px-1.5 py-px rounded-sm',
                  tab.id === 'alerts'
                    ? 'bg-red-700 text-white'
                    : 'bg-orange-700 text-white'
                )}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Tab Content ────────────────────────────────────── */}

        {/* STOCK TAB */}
        {activeTab === 'stock' && (
          <div className="space-y-3">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-sm px-3 py-1.5 flex-1 min-w-[200px]">
                <Search className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search SKU or material name…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <Filter className="h-3.5 w-3.5 text-slate-400" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-sm px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:border-orange-500"
                >
                  <option value="">All Categories</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={lowStockOnly}
                  onChange={(e) => setLowStockOnly(e.target.checked)}
                  className="rounded-sm border-slate-300 accent-orange-600"
                />
                <span className="text-xs text-slate-600 dark:text-slate-400 font-mono">Low stock only</span>
              </label>
            </div>

            <StockOverviewTable
              searchQuery={searchQuery}
              categoryFilter={categoryFilter}
              lowStockOnly={lowStockOnly}
              onQrClick={setQrItem}
              onMovementClick={setMovementItem}
            />
          </div>
        )}

        {/* MOVEMENTS TAB */}
        {activeTab === 'movements' && (
          <MovementsLogTable extra={movements} />
        )}

        {/* SUPPLIERS TAB */}
        {activeTab === 'suppliers' && <SuppliersTable />}

        {/* PURCHASE ORDERS TAB */}
        {activeTab === 'purchase-orders' && <PurchaseOrdersTable />}

        {/* ALERTS TAB */}
        {activeTab === 'alerts' && (
          <LowStockAlertsWidget onReorder={setMovementItem} />
        )}
      </div>
    </>
  );
}
