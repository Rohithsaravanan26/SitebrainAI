import * as React from 'react';
import { FileText, Download, FileScan, Image as ImageIcon } from 'lucide-react';
import type { ProjectDocument } from '@sitebrain/types';

function formatSize(bytes: number) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.round(bytes / 1024)} KB`;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-AU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

interface DocumentsTableProps {
  documents: ProjectDocument[];
}

export const DocumentsTable: React.FC<DocumentsTableProps> = ({ documents }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-sm overflow-hidden">
      <table className="w-full text-xs">
        <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800">
          <tr>
            <th className="text-left px-4 py-2.5 font-bold uppercase tracking-wider text-slate-500 text-[10px]">
              Document Title
            </th>
            <th className="text-left px-3 py-2.5 font-bold uppercase tracking-wider text-slate-500 text-[10px]">
              Format
            </th>
            <th className="text-right px-3 py-2.5 font-bold uppercase tracking-wider text-slate-500 text-[10px] hidden sm:table-cell">
              Size
            </th>
            <th className="text-left px-3 py-2.5 font-bold uppercase tracking-wider text-slate-500 text-[10px] hidden md:table-cell">
              Uploaded By
            </th>
            <th className="text-right px-4 py-2.5 font-bold uppercase tracking-wider text-slate-500 text-[10px]">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {documents.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-10 text-slate-400 font-mono text-xs">
                No documents registered for this project
              </td>
            </tr>
          ) : (
            documents.map((doc) => (
              <tr
                key={doc.id}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
              >
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-orange-600 shrink-0" />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">
                        {doc.title}
                      </p>
                      <p className="text-[10px] font-mono text-slate-400">
                        {fmtDate(doc.createdAt)}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2.5 font-mono text-[10px] uppercase text-slate-500">
                  <span className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded-sm">
                    {doc.fileType}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-right font-mono text-slate-500 text-[11px] hidden sm:table-cell">
                  {formatSize(doc.fileSizeBytes)}
                </td>
                <td className="px-3 py-2.5 font-mono text-slate-600 dark:text-slate-400 text-[11px] hidden md:table-cell">
                  {doc.uploadedByName || 'M. Vance'}
                </td>
                <td className="px-4 py-2.5 text-right">
                  <a
                    href={`/${doc.filePath}`}
                    download
                    className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-orange-600 hover:text-orange-700 bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900 px-2 py-1 rounded-sm"
                  >
                    <Download className="h-3 w-3" />
                    Download
                  </a>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
