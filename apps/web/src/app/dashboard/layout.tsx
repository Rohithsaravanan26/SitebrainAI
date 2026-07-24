'use client';

import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { cn } from '@/lib/utils';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  // Derive activeItem from pathname
  const activeItem = React.useMemo(() => {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length === 1) return 'overview';
    return segments[segments.length - 1];
  }, [pathname]);

  const handleNavigate = (id: string, href: string) => {
    router.push(href);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100 dark:bg-slate-950">
      {/* Fixed Sidebar */}
      <DashboardSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((c) => !c)}
        activeItem={activeItem}
        onNavigate={handleNavigate}
      />

      {/* Main content wrapper */}
      <div
        className={cn(
          'flex flex-col flex-1 min-w-0 transition-all duration-200',
          sidebarCollapsed ? 'ml-14' : 'ml-60'
        )}
      >
        {/* Fixed Header */}
        <DashboardHeader sidebarCollapsed={sidebarCollapsed} />

        {/* Page Content — scrollable */}
        <main className="flex-1 overflow-y-auto pt-12">
          <div className="p-4 lg:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
