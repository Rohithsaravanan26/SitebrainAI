import * as React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed = false, className, children, ...props }) => {
  return (
    <aside
      className={cn(
        'h-full bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col transition-all duration-200 select-none',
        isCollapsed ? 'w-14' : 'w-60',
        className
      )}
      {...props}
    >
      {children}
    </aside>
  );
};

export const SidebarSection: React.FC<{ title?: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="py-2 space-y-1">
    {title && (
      <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
        {title}
      </div>
    )}
    {children}
  </div>
);

export interface SidebarItemProps {
  icon?: React.ReactNode;
  label: string;
  badge?: string | number;
  isActive?: boolean;
  isCollapsed?: boolean;
  onClick?: () => void;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  badge,
  isActive = false,
  isCollapsed = false,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      title={isCollapsed ? label : undefined}
      className={cn(
        'w-full flex items-center px-3 py-1.5 text-xs font-medium transition-colors rounded-sm text-left',
        isActive
          ? 'bg-slate-800 text-white font-semibold border-l-2 border-orange-600'
          : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
      )}
    >
      {icon && <span className={cn('shrink-0', !isCollapsed && 'mr-2.5')}>{icon}</span>}
      {!isCollapsed && <span className="truncate flex-1">{label}</span>}
      {!isCollapsed && badge !== undefined && (
        <span className="ml-auto px-1.5 py-0.2 text-[10px] font-mono bg-slate-800 text-slate-300 rounded-sm">
          {badge}
        </span>
      )}
    </button>
  );
};
