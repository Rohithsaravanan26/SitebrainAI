import * as React from 'react';
import { AlertTriangle, CheckCircle2, Package, FileText, Bell } from 'lucide-react';
import { WidgetShell } from '../shared/WidgetShell';

type NotificationType = 'safety' | 'delivery' | 'rfi' | 'approval' | 'system';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  detail: string;
  time: string;
  read: boolean;
}

const NOTIFICATIONS: Notification[] = [
  { id: 'n1', type: 'safety',   title: 'PPE Non-Compliance — Level 13',    detail: 'Camera #7 flagged 2 workers without helmets at grid G-12.',      time: '9m ago',   read: false },
  { id: 'n2', type: 'delivery', title: 'N16 Rebar Delivery Confirmed',      detail: 'BlueScope Steel delivery ETA: 14:30 today. Receive at Gate 3.',   time: '22m ago',  read: false },
  { id: 'n3', type: 'rfi',      title: 'RFI #247 — Structural Response',    detail: 'Tier 1 Structures responded to footing setdown query. Review.',   time: '1h ago',   read: false },
  { id: 'n4', type: 'approval', title: 'Submittal #89 Approved',            detail: 'Concrete mix design M25 has been approved by structural eng.',    time: '2h ago',   read: true  },
  { id: 'n5', type: 'safety',   title: 'Near-Miss Report — Scaffold Lvl 9',detail: 'Reported by J. Chen. Scaffold board dislodged. Review SWMS.',      time: '4h ago',   read: true  },
  { id: 'n6', type: 'system',   title: 'Daily Progress Report Generated',   detail: 'Automated progress report for 24 Jul 2026 is ready to review.',   time: '6h ago',   read: true  },
  { id: 'n7', type: 'delivery', title: 'Formwork Ply — Short Delivery',     detail: 'Boral Timber delivered 180/250 sheets. Raise purchase order.',    time: '8h ago',   read: true  },
];

const typeConfig: Record<NotificationType, { icon: React.ReactNode; accent: string }> = {
  safety:   { icon: <AlertTriangle className="h-3.5 w-3.5" />,  accent: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40'   },
  delivery: { icon: <Package className="h-3.5 w-3.5" />,        accent: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40' },
  rfi:      { icon: <FileText className="h-3.5 w-3.5" />,       accent: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40' },
  approval: { icon: <CheckCircle2 className="h-3.5 w-3.5" />,   accent: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40' },
  system:   { icon: <Bell className="h-3.5 w-3.5" />,           accent: 'text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800' },
};

export const NotificationsWidget: React.FC = () => {
  const unread = NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <WidgetShell
      title="Notifications"
      subtitle={`${unread} unread events`}
      noPadding
      action={
        unread > 0 ? (
          <span className="text-[10px] font-mono font-bold text-white bg-orange-600 px-2 py-0.5 rounded-sm">
            {unread} NEW
          </span>
        ) : null
      }
    >
      <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[360px] overflow-y-auto">
        {NOTIFICATIONS.map((notif) => {
          const config = typeConfig[notif.type];
          return (
            <div
              key={notif.id}
              className={`flex items-start gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer ${
                !notif.read ? 'bg-orange-50/40 dark:bg-orange-950/10' : ''
              }`}
            >
              {/* Type Icon */}
              <div className={`flex h-7 w-7 items-center justify-center rounded-sm shrink-0 mt-0.5 ${config.accent}`}>
                {config.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-xs truncate ${!notif.read ? 'font-semibold text-slate-900 dark:text-slate-100' : 'font-medium text-slate-700 dark:text-slate-300'}`}>
                    {notif.title}
                  </p>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0">{notif.time}</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug line-clamp-2">
                  {notif.detail}
                </p>
              </div>

              {/* Unread indicator */}
              {!notif.read && (
                <div className="w-1.5 h-1.5 rounded-full bg-orange-600 shrink-0 mt-1.5" />
              )}
            </div>
          );
        })}
      </div>
    </WidgetShell>
  );
};
