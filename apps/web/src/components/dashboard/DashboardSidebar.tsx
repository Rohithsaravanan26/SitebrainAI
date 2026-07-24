'use client';

import * as React from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Package,
  BarChart3,
  Truck,
  Cloud,
  BrainCircuit,
  BoxSelect,
  Bell,
  Upload,
  Settings,
  HardHat,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SidebarNavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: number;
  section?: string;
}

const NAV_ITEMS: SidebarNavItem[] = [
  { id: 'overview',      label: 'Overview',        icon: <LayoutDashboard className="h-4 w-4" />, href: '/dashboard',            section: 'MAIN' },
  { id: 'projects',      label: 'Projects',         icon: <FolderKanban className="h-4 w-4" />,   href: '/dashboard/projects',   section: 'MAIN' },
  { id: 'workers',       label: 'Workers',           icon: <Users className="h-4 w-4" />,          href: '/dashboard/workers',    section: 'FIELD' },
  { id: 'inventory',     label: 'Inventory',         icon: <Package className="h-4 w-4" />,        href: '/dashboard/inventory',  section: 'FIELD', badge: 3 },
  { id: 'progress',      label: 'Progress',          icon: <BarChart3 className="h-4 w-4" />,      href: '/dashboard/progress',   section: 'FIELD' },
  { id: 'equipment',     label: 'Equipment',         icon: <Truck className="h-4 w-4" />,          href: '/dashboard/equipment',  section: 'FIELD' },
  { id: 'weather',        label: 'Weather',           icon: <Cloud className="h-4 w-4" />,          href: '/dashboard/weather',       section: 'INTELLIGENCE' },
  { id: 'ai-insights',   label: 'AI Insights',       icon: <BrainCircuit className="h-4 w-4" />,   href: '/dashboard/ai-insights',   section: 'INTELLIGENCE', badge: 2 },
  { id: 'digital-twin',  label: 'Digital Twin',      icon: <BoxSelect className="h-4 w-4" />,      href: '/dashboard/digital-twin',  section: 'INTELLIGENCE' },
  { id: 'notifications', label: 'Notifications',     icon: <Bell className="h-4 w-4" />,           href: '/dashboard/notifications', section: 'ALERTS', badge: 7 },
  { id: 'uploads',       label: 'Site Uploads',      icon: <Upload className="h-4 w-4" />,         href: '/dashboard/uploads',   section: 'ALERTS' },
  { id: 'settings',      label: 'Settings',          icon: <Settings className="h-4 w-4" />,       href: '/dashboard/settings',  section: 'SYSTEM' },
];

const SECTIONS = ['MAIN', 'FIELD', 'INTELLIGENCE', 'ALERTS', 'SYSTEM'];

interface DashboardSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  activeItem?: string;
  onNavigate?: (id: string, href: string) => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  collapsed,
  onToggle,
  activeItem = 'overview',
  onNavigate,
}) => {
  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-full bg-slate-900 border-r border-slate-800 flex flex-col transition-all duration-200 select-none',
        collapsed ? 'w-14' : 'w-60'
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          'h-12 flex items-center border-b border-slate-800 shrink-0',
          collapsed ? 'justify-center px-0' : 'px-4 gap-2.5'
        )}
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-orange-600 shrink-0">
          <HardHat className="h-4 w-4 text-white" />
        </div>
        {!collapsed && (
          <div>
            <p className="text-xs font-bold text-white tracking-wider uppercase leading-tight">SiteBrain AI</p>
            <p className="text-[10px] text-slate-500 font-mono leading-tight">v0.1.0 — Field Ops</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2 space-y-4">
        {SECTIONS.map((section) => {
          const items = NAV_ITEMS.filter((n) => n.section === section);
          if (!items.length) return null;
          return (
            <div key={section}>
              {!collapsed && (
                <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-slate-600 font-mono">
                  {section}
                </p>
              )}
              <div className="space-y-0.5 px-2">
                {items.map((item) => {
                  const isActive = activeItem === item.id;
                  return (
                    <button
                      key={item.id}
                      title={collapsed ? item.label : undefined}
                      onClick={() => onNavigate?.(item.id, item.href)}
                      className={cn(
                        'w-full flex items-center rounded-sm py-1.5 text-xs font-medium transition-colors',
                        collapsed ? 'justify-center px-0' : 'px-2.5 gap-2.5',
                        isActive
                          ? 'bg-slate-800 text-white border-l-2 border-orange-500 pl-[9px]'
                          : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                      )}
                    >
                      <span className="shrink-0">{item.icon}</span>
                      {!collapsed && (
                        <>
                          <span className="flex-1 text-left truncate">{item.label}</span>
                          {item.badge !== undefined && (
                            <span className="ml-auto px-1.5 py-px text-[10px] font-mono bg-orange-700 text-white rounded-sm">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="border-t border-slate-800 p-2 shrink-0">
        <button
          onClick={onToggle}
          className={cn(
            'w-full flex items-center gap-2 px-2 py-1.5 text-xs text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-sm transition-colors',
            collapsed && 'justify-center'
          )}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span className="font-mono text-[10px]">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};
