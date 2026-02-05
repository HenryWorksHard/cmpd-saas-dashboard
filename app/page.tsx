'use client';

import { useState, useEffect } from 'react';

interface Task {
  name: string;
  done: boolean;
}

interface Phase {
  id: number;
  name: string;
  description: string;
  estimatedDays: number;
  status: 'complete' | 'in-progress' | 'pending';
  tasks: Task[];
}

const phases: Phase[] = [
  {
    id: 1,
    name: 'Database Multi-tenancy',
    description: 'Set up organizations table, RLS policies, and link existing data',
    estimatedDays: 2,
    status: 'complete',
    tasks: [
      { name: 'Create organizations table', done: true },
      { name: 'Add organization_id to profiles', done: true },
      { name: 'Add organization_id to programs', done: true },
      { name: 'Add organization_id to nutrition_plans', done: true },
      { name: 'Create helper functions (get_user_org_id, is_super_admin)', done: true },
      { name: 'Set up RLS policies', done: true },
      { name: 'Create CMPD Fitness org', done: true },
      { name: 'Link existing data to CMPD org', done: true },
    ],
  },
  {
    id: 2,
    name: 'Stripe Billing',
    description: 'Payment processing, subscription tiers, and webhook handling',
    estimatedDays: 3,
    status: 'complete',
    tasks: [
      { name: 'Create Stripe account & products', done: true },
      { name: 'Set up subscription tiers (Starter/Pro/Studio/Gym)', done: true },
      { name: 'Build webhook endpoint', done: true },
      { name: 'Handle subscription lifecycle events', done: true },
      { name: 'Add billing page to admin portal', done: true },
      { name: 'Implement client limit enforcement', done: true },
    ],
  },
  {
    id: 3,
    name: 'Admin Portal Updates',
    description: 'Multi-tenant features, trainer signup, and super-admin tools',
    estimatedDays: 4,
    status: 'complete',
    tasks: [
      { name: 'Trainer signup/onboarding flow', done: true },
      { name: 'Organization settings page', done: true },
      { name: 'Billing & subscription management UI', done: true },
      { name: 'Platform Management section (super_admin)', done: true },
      { name: 'All trainers list view', done: true },
      { name: 'Revenue dashboard', done: true },
      { name: 'Impersonate trainer feature', done: true },
      { name: 'Role-based sidebar/permissions', done: true },
    ],
  },
  {
    id: 4,
    name: 'Client App Updates',
    description: 'Invite links, trainer branding, and data isolation',
    estimatedDays: 3,
    status: 'complete',
    tasks: [
      { name: 'Join via invite link flow', done: true },
      { name: 'Load trainer branding (logo, colors)', done: true },
      { name: 'Update queries for organization_id', done: true },
      { name: 'Test data isolation between orgs', done: true },
    ],
  },
  {
    id: 5,
    name: 'Landing Page',
    description: 'Marketing site with pricing and trainer signup',
    estimatedDays: 3,
    status: 'complete',
    tasks: [
      { name: 'Hero section & value prop', done: true },
      { name: 'Features showcase', done: true },
      { name: 'Pricing page with tier comparison', done: true },
      { name: 'Trainer signup CTA flow', done: true },
      { name: 'Deploy to cmpdcollective.com', done: false },
    ],
  },
];

const tiers = [
  { name: 'Starter', clients: 'Up to 10', price: 39 },
  { name: 'Pro', clients: 'Up to 30', price: 79 },
  { name: 'Studio', clients: 'Up to 75', price: 149 },
  { name: 'Gym', clients: 'Unlimited', price: 299 },
];

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalTasks = phases.reduce((acc, phase) => acc + phase.tasks.length, 0);
  const completedTasks = phases.reduce(
    (acc, phase) => acc + phase.tasks.filter((t) => t.done).length,
    0
  );
  const totalDays = phases.reduce((acc, phase) => acc + phase.estimatedDays, 0);
  const completedDays = phases
    .filter((p) => p.status === 'complete')
    .reduce((acc, phase) => acc + phase.estimatedDays, 0);
  const progressPercent = Math.round((completedTasks / totalTasks) * 100);

  const getStatusColor = (status: Phase['status']) => {
    switch (status) {
      case 'complete':
        return 'bg-green-500';
      case 'in-progress':
        return 'bg-yellow-500';
      default:
        return 'bg-zinc-700';
    }
  };

  const getStatusBorder = (status: Phase['status']) => {
    switch (status) {
      case 'complete':
        return 'border-green-500';
      case 'in-progress':
        return 'border-yellow-500';
      default:
        return 'border-zinc-700';
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center font-bold text-zinc-900">
              C
            </div>
            <div>
              <h1 className="font-semibold">CMPD SaaS</h1>
              <p className="text-xs text-zinc-500">Fitness Platform Conversion</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-yellow-500">{progressPercent}%</p>
            <p className="text-xs text-zinc-500">Complete</p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
            <p className="text-zinc-500 text-sm">Tasks</p>
            <p className="text-2xl font-bold">
              {completedTasks} <span className="text-zinc-600">/ {totalTasks}</span>
            </p>
          </div>
          <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
            <p className="text-zinc-500 text-sm">Days Est.</p>
            <p className="text-2xl font-bold">
              {completedDays} <span className="text-zinc-600">/ {totalDays}</span>
            </p>
          </div>
          <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
            <p className="text-zinc-500 text-sm">Phases</p>
            <p className="text-2xl font-bold">
              {phases.filter((p) => p.status === 'complete').length}{' '}
              <span className="text-zinc-600">/ {phases.length}</span>
            </p>
          </div>
          <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
            <p className="text-zinc-500 text-sm">Status</p>
            <p className="text-2xl font-bold text-yellow-500">Building</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-10">
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-500 to-green-500 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Phase Timeline */}
        <div className="space-y-6 mb-12">
          {phases.map((phase, index) => (
            <div
              key={phase.id}
              className={`bg-zinc-900 rounded-xl border-2 ${getStatusBorder(phase.status)} overflow-hidden`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl ${getStatusColor(phase.status)} flex items-center justify-center font-bold text-lg ${
                        phase.status === 'complete' ? 'text-white' : 'text-zinc-900'
                      }`}
                    >
                      {phase.status === 'complete' ? '✓' : phase.id}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">Phase {phase.id}: {phase.name}</h3>
                      <p className="text-zinc-500 text-sm">{phase.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        phase.status === 'complete'
                          ? 'bg-green-500/20 text-green-400'
                          : phase.status === 'in-progress'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-zinc-800 text-zinc-500'
                      }`}
                    >
                      {phase.status === 'complete'
                        ? 'Complete'
                        : phase.status === 'in-progress'
                        ? 'In Progress'
                        : 'Pending'}
                    </span>
                    <p className="text-zinc-600 text-xs mt-1">{phase.estimatedDays} days est.</p>
                  </div>
                </div>

                {/* Tasks */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                  {phase.tasks.map((task, taskIndex) => (
                    <div
                      key={taskIndex}
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        task.done ? 'bg-green-500/10' : 'bg-zinc-800/50'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center text-xs ${
                          task.done
                            ? 'bg-green-500 text-white'
                            : 'border border-zinc-600'
                        }`}
                      >
                        {task.done && '✓'}
                      </div>
                      <span
                        className={task.done ? 'text-green-400' : 'text-zinc-400'}
                      >
                        {task.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress within phase */}
              <div className="h-1 bg-zinc-800">
                <div
                  className={`h-full ${getStatusColor(phase.status)}`}
                  style={{
                    width: `${
                      (phase.tasks.filter((t) => t.done).length / phase.tasks.length) * 100
                    }%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Pricing Tiers Preview */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Subscription Tiers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 text-center"
              >
                <h3 className="font-semibold text-yellow-500">{tier.name}</h3>
                <p className="text-3xl font-bold my-2">${tier.price}</p>
                <p className="text-zinc-500 text-sm">{tier.clients} clients</p>
              </div>
            ))}
          </div>
        </div>

        {/* Architecture */}
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
          <h2 className="text-xl font-semibold mb-4">Architecture</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-zinc-800/50 rounded-lg">
              <div className="w-12 h-12 bg-yellow-500 rounded-lg mx-auto mb-3 flex items-center justify-center text-zinc-900 font-bold">
                A
              </div>
              <h3 className="font-semibold">Admin Portal</h3>
              <p className="text-zinc-500 text-sm mt-1">
                Trainers manage clients, programs & billing
              </p>
              <p className="text-xs text-zinc-600 mt-2">eddytrains-admin.vercel.app</p>
            </div>
            <div className="text-center p-4 bg-zinc-800/50 rounded-lg">
              <div className="w-12 h-12 bg-green-500 rounded-lg mx-auto mb-3 flex items-center justify-center text-zinc-900 font-bold">
                C
              </div>
              <h3 className="font-semibold">Client App</h3>
              <p className="text-zinc-500 text-sm mt-1">
                End users view workouts & track progress
              </p>
              <p className="text-xs text-zinc-600 mt-2">app.cmpdcollective.com</p>
            </div>
            <div className="text-center p-4 bg-zinc-800/50 rounded-lg">
              <div className="w-12 h-12 bg-blue-500 rounded-lg mx-auto mb-3 flex items-center justify-center text-zinc-900 font-bold">
                DB
              </div>
              <h3 className="font-semibold">Supabase</h3>
              <p className="text-zinc-500 text-sm mt-1">
                Multi-tenant database with RLS policies
              </p>
              <p className="text-xs text-zinc-600 mt-2">PostgreSQL + Auth + Storage</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 mt-12">
        <div className="max-w-6xl mx-auto px-6 py-4 text-center text-zinc-600 text-sm">
          Built by Henry • Last updated: {new Date().toLocaleDateString('en-AU', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </footer>
    </div>
  );
}
