'use client';

import * as React from 'react';
import { UserPlus, Mail, Shield, Trash2, X } from 'lucide-react';
import type { ProjectMember, UserRole } from '@sitebrain/types';

const SAMPLE_MEMBERS: ProjectMember[] = [
  {
    id: 'pm1',
    projectId: 'p1',
    userId: 'u1',
    fullName: 'M. Vance',
    email: 'm.vance@sitebrain.ai',
    role: 'PROJECT_MANAGER',
    roleInProject: 'Project Director',
    createdAt: '2026-01-10T00:00:00Z',
  },
  {
    id: 'pm2',
    projectId: 'p1',
    userId: 'u2',
    fullName: 'J. Chen',
    email: 'j.chen@sitebrain.ai',
    role: 'SITE_ENGINEER',
    roleInProject: 'Senior Structural Engineer',
    createdAt: '2026-01-12T00:00:00Z',
  },
  {
    id: 'pm3',
    projectId: 'p1',
    userId: 'u3',
    fullName: 'S. Okafor',
    email: 's.okafor@sitebrain.ai',
    role: 'SITE_ENGINEER',
    roleInProject: 'BIM / VDC Lead',
    createdAt: '2026-01-15T00:00:00Z',
  },
  {
    id: 'pm4',
    projectId: 'p1',
    userId: 'u4',
    fullName: 'T. Nakamura',
    email: 't.nakamura@sitebrain.ai',
    role: 'SUPERVISOR',
    roleInProject: 'Site Superintendent',
    createdAt: '2026-01-20T00:00:00Z',
  },
  {
    id: 'pm5',
    projectId: 'p1',
    userId: 'u5',
    fullName: 'L. Ferreira',
    email: 'l.ferreira@sitebrain.ai',
    role: 'SUPERVISOR',
    roleInProject: 'Safety & QA Officer',
    createdAt: '2026-02-01T00:00:00Z',
  },
];

export const ProjectMembersTable: React.FC = () => {
  const [members, setMembers] = React.useState<ProjectMember[]>(SAMPLE_MEMBERS);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [newEmail, setNewEmail] = React.useState('');
  const [newRoleInProject, setNewRoleInProject] = React.useState('');

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || !newRoleInProject.trim()) return;

    const newMember: ProjectMember = {
      id: `pm-${Date.now()}`,
      projectId: 'p1',
      userId: `u-${Date.now()}`,
      fullName: newEmail.split('@')[0].replace('.', ' '),
      email: newEmail.trim().toLowerCase(),
      role: 'SITE_ENGINEER',
      roleInProject: newRoleInProject.trim(),
      createdAt: new Date().toISOString(),
    };

    setMembers((prev) => [...prev, newMember]);
    setNewEmail('');
    setNewRoleInProject('');
    setIsModalOpen(false);
  };

  const handleRemoveMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div className="space-y-3">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-mono text-slate-500">
          {members.length} team members assigned to project
        </p>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-orange-700 hover:bg-orange-600 text-white rounded-sm transition-colors"
        >
          <UserPlus className="h-3.5 w-3.5" /> Add Member
        </button>
      </div>

      {/* Members Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-sm overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="text-left px-4 py-2.5 font-bold uppercase tracking-wider text-slate-500 text-[10px]">
                Name
              </th>
              <th className="text-left px-3 py-2.5 font-bold uppercase tracking-wider text-slate-500 text-[10px]">
                Project Role
              </th>
              <th className="text-left px-3 py-2.5 font-bold uppercase tracking-wider text-slate-500 text-[10px] hidden sm:table-cell">
                System Role
              </th>
              <th className="text-left px-3 py-2.5 font-bold uppercase tracking-wider text-slate-500 text-[10px] hidden md:table-cell">
                Email
              </th>
              <th className="text-right px-4 py-2.5 font-bold uppercase tracking-wider text-slate-500 text-[10px]">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {members.map((m) => (
              <tr
                key={m.id}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
              >
                <td className="px-4 py-2.5 font-semibold text-slate-900 dark:text-slate-100">
                  {m.fullName}
                </td>
                <td className="px-3 py-2.5 text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                  {m.roleInProject}
                </td>
                <td className="px-3 py-2.5 hidden sm:table-cell">
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded-sm text-slate-600 dark:text-slate-300">
                    <Shield className="h-3 w-3 text-slate-400" />
                    {m.role.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-3 py-2.5 hidden md:table-cell">
                  <a
                    href={`mailto:${m.email}`}
                    className="text-orange-600 hover:text-orange-700 font-mono text-[11px]"
                  >
                    {m.email}
                  </a>
                </td>
                <td className="px-4 py-2.5 text-right">
                  <button
                    onClick={() => handleRemoveMember(m.id)}
                    className="p-1 text-slate-400 hover:text-red-600 rounded-sm transition-colors"
                    title="Remove member"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Member Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-sm w-full max-w-md shadow-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Assign Team Member to Project
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono mb-1 block">
                  Member Email
                </label>
                <input
                  type="email"
                  placeholder="e.g. j.smith@sitebrain.ai"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-sm px-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-orange-500 font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono mb-1 block">
                  Project Role Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lead Quality Inspector"
                  value={newRoleInProject}
                  onChange={(e) => setNewRoleInProject(e.target.value)}
                  required
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-sm px-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-orange-700 hover:bg-orange-600 text-white text-xs font-semibold py-2 rounded-sm"
                >
                  Add Member
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 text-xs text-slate-600 bg-slate-100 dark:bg-slate-800 rounded-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
