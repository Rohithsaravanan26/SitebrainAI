'use client';

import * as React from 'react';
import { X, HelpCircle } from 'lucide-react';
import type { RFI, RfiPriority } from '@sitebrain/types';

interface CreateRfiModalProps {
  projectId: string;
  projectCode: string;
  isOpen: boolean;
  onClose: () => void;
  onCreated: (rfi: RFI) => void;
}

export const CreateRfiModal: React.FC<CreateRfiModalProps> = ({
  projectId,
  projectCode,
  isOpen,
  onClose,
  onCreated,
}) => {
  const [title, setTitle] = React.useState('');
  const [question, setQuestion] = React.useState('');
  const [priority, setPriority] = React.useState<RfiPriority>('HIGH');
  const [dueDate, setDueDate] = React.useState('2026-08-05');
  const [error, setError] = React.useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !question.trim()) {
      setError('Title and Question are required.');
      return;
    }

    const newRfi: RFI = {
      id: `rfi-${Date.now()}`,
      projectId,
      rfiNumber: `RFI-${projectCode}-0${Math.floor(Math.random() * 90 + 10)}`,
      title: title.trim(),
      question: question.trim(),
      status: 'OPEN',
      priority,
      authorName: 'M. Vance',
      dueDate: new Date(dueDate).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onCreated(newRfi);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-sm w-full max-w-lg shadow-xl">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-orange-600" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Submit Request for Information (RFI)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-sm"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono mb-1 block">
              RFI Title / Subject
            </label>
            <input
              type="text"
              placeholder="e.g. Footing setdown discrepancy at grid G-12"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-sm px-2.5 py-1.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono mb-1 block">
                Priority Level
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as RfiPriority)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-sm px-2.5 py-1.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-orange-500"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">URGENT</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono mb-1 block">
                Response Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-sm px-2.5 py-1.5 text-xs text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono mb-1 block">
              Detailed RFI Question
            </label>
            <textarea
              placeholder="Detail the technical query, drawing references, and impact on construction schedule"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={4}
              required
              className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-sm px-2.5 py-1.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-orange-500 resize-none"
            />
          </div>

          {error && <p className="text-xs text-red-600 font-mono">{error}</p>}

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 bg-orange-700 hover:bg-orange-600 text-white text-xs font-semibold py-2 rounded-sm transition-colors"
            >
              Submit RFI
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
