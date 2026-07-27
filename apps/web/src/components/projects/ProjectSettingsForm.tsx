'use client';

import * as React from 'react';
import { Settings, Save, AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { Project, ProjectStatus } from '@sitebrain/types';

interface ProjectSettingsFormProps {
  project: Project;
  onSaved: (updated: Project) => void;
}

export const ProjectSettingsForm: React.FC<ProjectSettingsFormProps> = ({ project, onSaved }) => {
  const [name, setName] = React.useState(project.name);
  const [location, setLocation] = React.useState(project.location);
  const [status, setStatus] = React.useState<ProjectStatus>(project.status);
  const [budget, setBudget] = React.useState(String(project.budget));
  const [progressPercent, setProgressPercent] = React.useState(String(project.progressPercent));
  const [description, setDescription] = React.useState(project.description || '');
  const [savedMsg, setSavedMsg] = React.useState('');
  const [saving, setSaving] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedMsg('');

    setTimeout(() => {
      const updated: Project = {
        ...project,
        name: name.trim(),
        location: location.trim(),
        status,
        budget: parseFloat(budget) || 0,
        progressPercent: parseFloat(progressPercent) || 0,
        description: description.trim() || undefined,
        updatedAt: new Date().toISOString(),
      };

      onSaved(updated);
      setSaving(false);
      setSavedMsg('Project settings saved successfully');
    }, 400);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-sm p-4 lg:p-5 max-w-3xl space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <Settings className="h-4 w-4 text-orange-600" />
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Project Configuration & Budget Governance
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono mb-1 block">
              Project Code
            </label>
            <input
              type="text"
              value={project.code}
              disabled
              className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-sm px-3 py-1.5 text-xs text-slate-500 font-mono"
            />
          </div>
          <div className="col-span-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono mb-1 block">
              Project Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-sm px-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-orange-500 font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono mb-1 block">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ProjectStatus)}
              className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-sm px-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-orange-500"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="PLANNING">PLANNING</option>
              <option value="ON_HOLD">ON HOLD</option>
              <option value="COMPLETED">COMPLETED</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono mb-1 block">
              Total Budget (AUD)
            </label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-sm px-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:border-orange-500"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono mb-1 block">
              Progress %
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={progressPercent}
              onChange={(e) => setProgressPercent(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-sm px-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono mb-1 block">
            Site Location
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-sm px-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-orange-500"
          />
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono mb-1 block">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-sm px-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-orange-500 resize-none"
          />
        </div>

        {savedMsg && (
          <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-400 rounded-sm text-xs font-mono">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
            {savedMsg}
          </div>
        )}

        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-1.5 bg-orange-700 hover:bg-orange-600 text-white text-xs font-semibold px-4 py-2 rounded-sm transition-colors"
          >
            <Save className="h-3.5 w-3.5" />
            {saving ? 'Saving Settings...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};
