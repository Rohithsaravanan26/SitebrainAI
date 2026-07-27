'use client';

import * as React from 'react';
import { X, FolderPlus } from 'lucide-react';
import type { Project, ProjectStatus } from '@sitebrain/types';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (project: Project) => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onCreated,
}) => {
  const [code, setCode] = React.useState('');
  const [name, setName] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [budget, setBudget] = React.useState('');
  const [status, setStatus] = React.useState<ProjectStatus>('ACTIVE');
  const [startDate, setStartDate] = React.useState('2026-08-01');
  const [endDate, setEndDate] = React.useState('2027-11-30');
  const [description, setDescription] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!code.trim() || !name.trim() || !location.trim()) {
      setError('Code, Project Name, and Location are required.');
      return;
    }

    setLoading(true);

    try {
      // API payload construction
      const payload = {
        code: code.trim().toUpperCase(),
        name: name.trim(),
        description: description.trim() || undefined,
        location: location.trim(),
        status,
        start_date: new Date(startDate).toISOString(),
        end_date: new Date(endDate).toISOString(),
        budget: parseFloat(budget) || 0.0,
      };

      // Call API if server available, fallback to mock object for UI reactivity
      const res = await fetch('/api/v1/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      let createdProj: Project;
      if (res.ok) {
        createdProj = await res.json();
      } else {
        // Fallback for offline demo state
        createdProj = {
          id: `p-${Date.now()}`,
          code: payload.code,
          name: payload.name,
          description: payload.description,
          location: payload.location,
          status: payload.status,
          startDate: payload.start_date,
          endDate: payload.end_date,
          budget: payload.budget,
          progressPercent: 0,
          openRfiCount: 0,
          projectManagerName: 'M. Vance',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }

      onCreated(createdProj);
      onClose();
    } catch {
      // Network fallback
      const createdProj: Project = {
        id: `p-${Date.now()}`,
        code: code.trim().toUpperCase(),
        name: name.trim(),
        description: description.trim() || undefined,
        location: location.trim(),
        status,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        budget: parseFloat(budget) || 0.0,
        progressPercent: 0,
        openRfiCount: 0,
        projectManagerName: 'M. Vance',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      onCreated(createdProj);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-sm w-full max-w-lg shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <FolderPlus className="h-4 w-4 text-orange-600" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Create New Construction Project
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-sm"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono mb-1 block">
                Project Code
              </label>
              <input
                type="text"
                placeholder="e.g. HCT-C"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-sm px-2.5 py-1.5 text-xs text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:border-orange-500"
              />
            </div>
            <div className="col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono mb-1 block">
                Project Name
              </label>
              <input
                type="text"
                placeholder="e.g. Harbor City Tower — Block C"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-sm px-2.5 py-1.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono mb-1 block">
                Site Location
              </label>
              <input
                type="text"
                placeholder="e.g. Sydney CBD"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-sm px-2.5 py-1.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono mb-1 block">
                Initial Budget (AUD)
              </label>
              <input
                type="number"
                placeholder="e.g. 45000000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-sm px-2.5 py-1.5 text-xs text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono mb-1 block">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-sm px-2.5 py-1.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-orange-500"
              >
                <option value="ACTIVE font-mono">Active</option>
                <option value="PLANNING">Planning</option>
                <option value="ON_HOLD">On Hold</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono mb-1 block">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-sm px-2.5 py-1.5 text-xs text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono mb-1 block">
                Target Completion
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-sm px-2.5 py-1.5 text-xs text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono mb-1 block">
              Project Scope Description
            </label>
            <textarea
              placeholder="Brief summary of work packages and structural specifications"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-sm px-2.5 py-1.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-orange-500 resize-none"
            />
          </div>

          {error && <p className="text-xs text-red-600 font-mono">{error}</p>}

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-orange-700 hover:bg-orange-600 text-white text-xs font-semibold py-2 rounded-sm transition-colors"
            >
              {loading ? 'Creating Project…' : 'Create Project'}
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
