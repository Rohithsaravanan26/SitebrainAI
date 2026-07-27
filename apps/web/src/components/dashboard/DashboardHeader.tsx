'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Bell, ChevronDown, HardHat, LogOut, Search, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const PROJECTS = [
  { id: 'p1', name: 'Harbor City Tower — Block C' },
  { id: 'p2', name: 'Westfield Metro Station' },
  { id: 'p3', name: 'Riverside Industrial Park' },
];

export const DashboardHeader: React.FC<{ sidebarCollapsed: boolean }> = ({ sidebarCollapsed }) => {
  const router = useRouter();
  const [selectedProject, setSelectedProject] = React.useState(PROJECTS[0]);
  const [projectOpen, setProjectOpen] = React.useState(false);
  const [notificationCount] = React.useState(7);

  return (
    <header
      className={cn(
        'fixed top-0 right-0 z-30 h-12 bg-slate-900 border-b border-slate-800 flex items-center px-4 gap-3 transition-all duration-200',
        sidebarCollapsed ? 'left-14' : 'left-60'
      )}
    >
      {/* Project Selector */}
      <div className="relative">
        <button
          onClick={() => setProjectOpen((o) => !o)}
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-sm text-xs font-medium text-white transition-colors"
        >
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
          <span className="max-w-[220px] truncate">{selectedProject.name}</span>
          <ChevronDown className="h-3 w-3 text-slate-400 shrink-0" />
        </button>

        {projectOpen && (
          <div className="absolute left-0 top-full mt-1 w-72 bg-slate-900 border border-slate-700 rounded-sm shadow-lg z-50 py-1">
            {PROJECTS.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setSelectedProject(p);
                  setProjectOpen(false);
                }}
                className={cn(
                  'w-full text-left px-3 py-2 text-xs hover:bg-slate-800 transition-colors',
                  p.id === selectedProject.id ? 'text-orange-400 font-semibold' : 'text-slate-300'
                )}
              >
                {p.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-md hidden md:flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-sm px-3 py-1.5">
        <Search className="h-3.5 w-3.5 text-slate-500 shrink-0" />
        <input
          type="text"
          placeholder="Search projects, workers, documents..."
          className="flex-1 bg-transparent text-xs text-slate-300 placeholder:text-slate-500 focus:outline-none"
        />
        <kbd className="text-[10px] font-mono text-slate-500 bg-slate-700 px-1.5 py-0.5 rounded-sm">
          ⌘K
        </kbd>
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* Notification Bell */}
        <button className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-sm transition-colors">
          <Bell className="h-4 w-4" />
          {notificationCount > 0 && (
            <span className="absolute top-1 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-orange-600 text-[9px] font-bold text-white font-mono">
              {notificationCount > 9 ? '9+' : notificationCount}
            </span>
          )}
        </button>

        {/* User Menu */}
        <div className="flex items-center gap-2 border-l border-slate-800 pl-3 ml-1">
          <div className="flex items-center gap-2 px-2 py-1 hover:bg-slate-800 rounded-sm cursor-pointer transition-colors">
            <div className="flex h-6 w-6 items-center justify-center rounded-sm bg-orange-700 text-white shrink-0">
              <User className="h-3.5 w-3.5" />
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-[11px] font-semibold text-white leading-tight">M. Vance</p>
              <p className="text-[10px] text-slate-400 font-mono leading-tight">Project Manager</p>
            </div>
            <ChevronDown className="h-3 w-3 text-slate-500 hidden lg:block" />
          </div>
          <button
            onClick={() => router.push('/auth/login')}
            className="p-2 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-sm transition-colors"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
