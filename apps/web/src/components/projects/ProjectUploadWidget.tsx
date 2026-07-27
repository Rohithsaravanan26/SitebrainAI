'use client';

import * as React from 'react';
import { UploadCloud, FileText, CheckCircle2 } from 'lucide-react';
import type { ProjectDocument } from '@sitebrain/types';
import { DocumentsTable } from './DocumentsTable';

interface ProjectUploadWidgetProps {
  projectId: string;
  documents: ProjectDocument[];
  onDocumentUploaded: (doc: ProjectDocument) => void;
}

export const ProjectUploadWidget: React.FC<ProjectUploadWidgetProps> = ({
  projectId,
  documents,
  onDocumentUploaded,
}) => {
  const [dragActive, setDragActive] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [successMsg, setSuccessMsg] = React.useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setSuccessMsg('');

    const file = files[0];
    setTimeout(() => {
      const ext = file.name.split('.').pop()?.toUpperCase() || 'FILE';
      const newDoc: ProjectDocument = {
        id: `doc-${Date.now()}`,
        projectId,
        title: file.name,
        filePath: `storage/documents/${file.name}`,
        fileType: ext,
        fileSizeBytes: file.size,
        uploadedByName: 'M. Vance',
        createdAt: new Date().toISOString(),
      };

      onDocumentUploaded(newDoc);
      setUploading(false);
      setSuccessMsg(`Successfully registered ${file.name}`);
    }, 600);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Box */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragleave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-sm p-6 text-center cursor-pointer transition-colors ${
          dragActive
            ? 'border-orange-600 bg-orange-50/50 dark:bg-orange-950/20'
            : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-400 dark:hover:border-slate-600'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-orange-50 dark:bg-orange-950/40 text-orange-600 border border-orange-200 dark:border-orange-900">
            <UploadCloud className={`h-5 w-5 ${uploading ? 'animate-bounce' : ''}`} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              {uploading
                ? 'Uploading & Registering Document...'
                : 'Click to upload or drag and drop project files'}
            </p>
            <p className="text-[10px] font-mono text-slate-400 mt-0.5">
              PDF, DWG, BIM IFC, DOCX, XLSX up to 50MB
            </p>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-400 rounded-sm text-xs font-mono">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
          {successMsg}
        </div>
      )}

      {/* Document Register Table */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono mb-2">
          Project Document Register ({documents.length})
        </h4>
        <DocumentsTable documents={documents} />
      </div>
    </div>
  );
};
