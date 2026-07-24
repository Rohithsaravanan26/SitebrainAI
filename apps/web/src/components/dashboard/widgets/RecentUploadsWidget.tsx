import * as React from 'react';
import { Image, FileText, FileVideo, FileScan, ExternalLink } from 'lucide-react';
import { WidgetShell } from '../shared/WidgetShell';

type UploadType = 'photo' | 'document' | 'video' | 'drawing';

interface Upload {
  id: string;
  type: UploadType;
  filename: string;
  location: string;
  uploadedBy: string;
  time: string;
  sizeKb: number;
}

const UPLOADS: Upload[] = [
  { id: 'u1', type: 'photo',    filename: 'lvl14_pour_progress_0724.jpg',   location: 'Lvl 14 — Grid G-H',   uploadedBy: 'J. Chen',    time: '08:47',  sizeKb: 4821 },
  { id: 'u2', type: 'drawing',  filename: 'SK-STRUCT-C-187_Rev3.pdf',        location: 'Lvl 10–12 Transfer',  uploadedBy: 'S. Okafor',  time: '09:12',  sizeKb: 2340 },
  { id: 'u3', type: 'photo',    filename: 'crane_inspection_report.jpg',     location: 'Tower Crane #1',      uploadedBy: 'P. Dawson',  time: '09:31',  sizeKb: 1920 },
  { id: 'u4', type: 'document', filename: 'SWMS_concrete_pour_L14.pdf',      location: 'Site Office',         uploadedBy: 'M. Vance',   time: '09:45',  sizeKb: 340  },
  { id: 'u5', type: 'video',    filename: 'drone_ortho_240724_blockC.mp4',   location: 'Site Aerial',         uploadedBy: 'AutoDrone',  time: '10:02',  sizeKb: 94200 },
  { id: 'u6', type: 'photo',    filename: 'rebar_insp_lvl13_NE_corner.jpg',  location: 'Lvl 13 — NE Corner',  uploadedBy: 'T. Nakamura',time: '10:18',  sizeKb: 3640 },
  { id: 'u7', type: 'drawing',  filename: 'ITP-CIVIL-009_signed.pdf',         location: 'QA Records',          uploadedBy: 'L. Ferreira',time: '11:04',  sizeKb: 890  },
  { id: 'u8', type: 'document', filename: 'delivery_docket_bluescope_0724.pdf',location: 'Gate 3 Laydown',    uploadedBy: 'O. Fischer', time: '14:22',  sizeKb: 120  },
];

const typeConfig: Record<UploadType, { icon: React.ReactNode; label: string; bg: string; text: string }> = {
  photo:    { icon: <Image className="h-3.5 w-3.5" />,    label: 'PHOTO',    bg: 'bg-blue-50 dark:bg-blue-950/40',    text: 'text-blue-700 dark:text-blue-400'    },
  document: { icon: <FileText className="h-3.5 w-3.5" />, label: 'DOC',      bg: 'bg-slate-100 dark:bg-slate-800',    text: 'text-slate-600 dark:text-slate-400'  },
  video:    { icon: <FileVideo className="h-3.5 w-3.5" />,label: 'VIDEO',    bg: 'bg-purple-50 dark:bg-purple-950/40',text: 'text-purple-700 dark:text-purple-400'},
  drawing:  { icon: <FileScan className="h-3.5 w-3.5" />, label: 'DRAWING',  bg: 'bg-amber-50 dark:bg-amber-950/40',  text: 'text-amber-700 dark:text-amber-400'  },
};

function formatSize(kb: number): string {
  if (kb >= 1024) return `${(kb / 1024).toFixed(1)} MB`;
  return `${kb} KB`;
}

export const RecentUploadsWidget: React.FC = () => {
  return (
    <WidgetShell
      title="Recent Site Uploads"
      subtitle={`${UPLOADS.length} files uploaded today`}
      noPadding
      action={
        <button className="text-[11px] font-medium text-orange-600 hover:text-orange-700 flex items-center gap-1 font-mono">
          All Uploads <ExternalLink className="h-3 w-3" />
        </button>
      }
    >
      <table className="w-full text-xs">
        <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800">
          <tr>
            <th className="text-left px-4 py-2 font-bold uppercase tracking-wider text-slate-500 text-[10px]">File</th>
            <th className="text-left px-3 py-2 font-bold uppercase tracking-wider text-slate-500 text-[10px] hidden md:table-cell">Location</th>
            <th className="text-left px-3 py-2 font-bold uppercase tracking-wider text-slate-500 text-[10px] hidden sm:table-cell">Uploaded By</th>
            <th className="text-right px-3 py-2 font-bold uppercase tracking-wider text-slate-500 text-[10px] hidden lg:table-cell">Size</th>
            <th className="text-right px-4 py-2 font-bold uppercase tracking-wider text-slate-500 text-[10px]">Time</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {UPLOADS.map((upload) => {
            const config = typeConfig[upload.type];
            return (
              <tr key={upload.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer">
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className={`flex h-6 w-6 items-center justify-center rounded-sm shrink-0 ${config.bg} ${config.text}`}>
                      {config.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[180px] lg:max-w-[260px]">
                        {upload.filename}
                      </p>
                      <span className={`text-[9px] font-bold font-mono tracking-wider ${config.text}`}>
                        {config.label}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2.5 text-slate-500 font-mono text-[11px] truncate max-w-[140px] hidden md:table-cell">
                  {upload.location}
                </td>
                <td className="px-3 py-2.5 text-slate-600 dark:text-slate-400 font-mono text-[11px] hidden sm:table-cell">
                  {upload.uploadedBy}
                </td>
                <td className="px-3 py-2.5 text-right font-mono text-[11px] text-slate-400 hidden lg:table-cell">
                  {formatSize(upload.sizeKb)}
                </td>
                <td className="px-4 py-2.5 text-right font-mono text-[11px] text-slate-500">
                  {upload.time}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </WidgetShell>
  );
};
