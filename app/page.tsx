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

interface QATest {
  id: number;
  name: string;
  passed: boolean | null; // null = not tested, true = passed, false = failed
  notes?: string;
}

interface QASection {
  id: string;
  name: string;
  tests: QATest[];
}

interface QANote {
  id: number;
  section: string;
  testId?: number;
  text: string;
  type: 'bug' | 'improvement' | 'note';
  timestamp: string;
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
      { name: 'Deploy to cmpdcollective.com', done: true },
    ],
  },
];

const qaData: QASection[] = [
  {
    id: 'A',
    name: 'Super Admin Portal',
    tests: [
      { id: 1, name: 'Login with super admin account', passed: null },
      { id: 2, name: 'Session persists on refresh', passed: null },
      { id: 3, name: 'Logout works correctly', passed: null },
      { id: 4, name: "Can't access admin routes when logged out", passed: null },
      { id: 5, name: 'Dashboard loads without errors', passed: null },
      { id: 6, name: 'Total trainers count is accurate', passed: null },
      { id: 7, name: 'Total clients count is accurate', passed: null },
      { id: 8, name: 'Revenue/MRR displays correctly', passed: null },
      { id: 9, name: 'Recent activity feed shows events', passed: null },
      { id: 10, name: 'View all trainers list', passed: null },
      { id: 11, name: 'Search/filter trainers works', passed: null },
      { id: 12, name: "Can click into trainer's org and view data", passed: null },
    ],
  },
  {
    id: 'B',
    name: 'Trainer Signup & Onboarding',
    tests: [
      { id: 13, name: 'Sign up page loads', passed: null },
      { id: 14, name: 'Email validation works', passed: null },
      { id: 15, name: 'Password requirements enforced', passed: null },
      { id: 16, name: 'Sign up creates account successfully', passed: null },
      { id: 17, name: 'Email verification sent', passed: null },
      { id: 18, name: 'First login redirects to onboarding', passed: null },
      { id: 19, name: 'Organization name input works', passed: null },
      { id: 20, name: 'Slug input works (URL-safe validation)', passed: null },
      { id: 21, name: 'Slug uniqueness check works', passed: null },
      { id: 22, name: 'Can upload logo', passed: null },
      { id: 23, name: 'Onboarding completes successfully', passed: null },
      { id: 24, name: 'Dashboard shows Free Trial status', passed: null },
      { id: 25, name: 'Trial days remaining displays', passed: null },
      { id: 26, name: 'Core features accessible during trial', passed: null },
      { id: 27, name: 'Upgrade prompts visible', passed: null },
    ],
  },
  {
    id: 'C',
    name: 'Billing & Subscriptions',
    tests: [
      { id: 28, name: 'Billing page loads', passed: null },
      { id: 29, name: 'All 4 tiers displayed', passed: null },
      { id: 30, name: 'Correct pricing shown ($39/$79/$149/$299)', passed: null },
      { id: 31, name: 'Feature comparison accurate', passed: null },
      { id: 32, name: 'Subscribe opens Stripe Checkout', passed: null },
      { id: 33, name: 'Stripe Checkout completes successfully', passed: null },
      { id: 34, name: 'Redirect back to app after payment', passed: null },
      { id: 35, name: 'Subscription status updates immediately', passed: null },
      { id: 36, name: 'Current plan displayed correctly', passed: null },
      { id: 37, name: 'Manage Subscription opens Stripe Portal', passed: null },
      { id: 38, name: 'Can upgrade plan in portal', passed: null },
      { id: 39, name: 'Can downgrade plan in portal', passed: null },
      { id: 40, name: 'Can cancel subscription', passed: null },
      { id: 41, name: 'Cancellation reflects in app', passed: null },
    ],
  },
  {
    id: 'D',
    name: 'Trainer Portal - Clients',
    tests: [
      { id: 42, name: 'Clients page loads', passed: null },
      { id: 43, name: 'Empty state shows when no clients', passed: null },
      { id: 44, name: 'Client count accurate', passed: null },
      { id: 45, name: 'Search/filter clients works', passed: null },
      { id: 46, name: 'Add Client modal opens', passed: null },
      { id: 47, name: 'Email validation works', passed: null },
      { id: 48, name: 'Client created successfully', passed: null },
      { id: 49, name: 'Welcome email sent (Klaviyo)', passed: null },
      { id: 50, name: 'Client appears in list', passed: null },
      { id: 51, name: 'Invite link generated', passed: null },
      { id: 52, name: 'Can view individual client', passed: null },
      { id: 53, name: 'Can edit client details', passed: null },
    ],
  },
  {
    id: 'E',
    name: 'Trainer Portal - Programs',
    tests: [
      { id: 54, name: 'Programs page loads', passed: null },
      { id: 55, name: 'Empty state shows when no programs', passed: null },
      { id: 56, name: 'Program templates section visible', passed: null },
      { id: 57, name: 'Create Program opens builder', passed: null },
      { id: 58, name: 'Can name program', passed: null },
      { id: 59, name: 'Can set duration (weeks)', passed: null },
      { id: 60, name: 'Can add days to week', passed: null },
      { id: 61, name: 'Can add exercises to day', passed: null },
      { id: 62, name: 'Exercise search/autocomplete works', passed: null },
      { id: 63, name: 'Can set sets/reps/rest for exercise', passed: null },
      { id: 64, name: 'Can reorder exercises (drag & drop)', passed: null },
      { id: 65, name: 'Can save program as draft', passed: null },
      { id: 66, name: 'Can publish program', passed: null },
      { id: 67, name: 'Can save program as template', passed: null },
      { id: 68, name: 'Templates appear in template list', passed: null },
      { id: 69, name: 'Can create program from template', passed: null },
    ],
  },
  {
    id: 'F',
    name: 'Trainer Portal - Nutrition',
    tests: [
      { id: 70, name: 'Nutrition page loads (Pro+)', passed: null },
      { id: 71, name: 'Starter tier sees upgrade prompt', passed: null },
      { id: 72, name: 'Can create meal plan', passed: null },
      { id: 73, name: 'Can set macros/calories', passed: null },
      { id: 74, name: 'Can add meals', passed: null },
      { id: 75, name: 'Can assign to client', passed: null },
      { id: 76, name: 'Client sees nutrition plan', passed: null },
      { id: 77, name: 'Can save as template', passed: null },
    ],
  },
  {
    id: 'G',
    name: 'Trainer Portal - Settings',
    tests: [
      { id: 78, name: 'Settings page loads', passed: null },
      { id: 79, name: 'Can update org name', passed: null },
      { id: 80, name: 'Can update slug (uniqueness check)', passed: null },
      { id: 81, name: 'Can upload/change logo', passed: null },
      { id: 82, name: 'Can set brand colors', passed: null },
      { id: 83, name: 'Can set timezone', passed: null },
      { id: 84, name: 'Team page visible (Studio+)', passed: null },
      { id: 85, name: 'Can invite team member', passed: null },
      { id: 86, name: 'Team member receives invite', passed: null },
      { id: 87, name: 'Can set team member permissions', passed: null },
    ],
  },
  {
    id: 'H',
    name: 'Client App - Onboarding',
    tests: [
      { id: 88, name: 'Invite link opens signup page', passed: null },
      { id: 89, name: 'Client can create account', passed: null },
      { id: 90, name: 'Password requirements enforced', passed: null },
      { id: 91, name: 'First login shows welcome/setup', passed: null },
      { id: 92, name: 'Can set display name', passed: null },
      { id: 93, name: 'Can upload profile photo', passed: null },
      { id: 94, name: 'Can set units preference (kg/lb)', passed: null },
      { id: 95, name: 'Onboarding completes', passed: null },
    ],
  },
  {
    id: 'I',
    name: 'Client App - Workouts',
    tests: [
      { id: 96, name: 'Dashboard shows current program', passed: null },
      { id: 97, name: 'Program overview displays correctly', passed: null },
      { id: 98, name: 'Can view weekly schedule', passed: null },
      { id: 99, name: "Can view today's workout", passed: null },
      { id: 100, name: 'Exercise details display (sets/reps/rest)', passed: null },
      { id: 101, name: 'Exercise demo videos/images load', passed: null },
      { id: 102, name: 'Start Workout begins session', passed: null },
      { id: 103, name: 'Rest timer works', passed: null },
      { id: 104, name: 'Can log weight for each set', passed: null },
      { id: 105, name: 'Can log reps for each set', passed: null },
      { id: 106, name: 'Weight/rep picker works smoothly', passed: null },
      { id: 107, name: 'Can skip exercise', passed: null },
      { id: 108, name: 'Can add notes to exercise', passed: null },
      { id: 109, name: 'Workout completion saves correctly', passed: null },
      { id: 110, name: 'Workout summary shows after completion', passed: null },
      { id: 111, name: 'History page shows past workouts', passed: null },
      { id: 112, name: 'Can view individual workout details', passed: null },
      { id: 113, name: 'Calendar view works', passed: null },
    ],
  },
  {
    id: 'J',
    name: 'Client App - Progress',
    tests: [
      { id: 114, name: 'Progress page loads', passed: null },
      { id: 115, name: 'Can log body weight', passed: null },
      { id: 116, name: 'Weight history graph displays', passed: null },
      { id: 117, name: 'Can upload progress photo', passed: null },
      { id: 118, name: 'Progress photos display in grid', passed: null },
      { id: 119, name: 'Side-by-side photo comparison works', passed: null },
      { id: 120, name: 'PRs page shows all-time bests', passed: null },
      { id: 121, name: 'PRs auto-detect from workout logs', passed: null },
      { id: 122, name: 'PR badges/celebrations appear', passed: null },
      { id: 123, name: 'Estimated 1RMs calculated', passed: null },
      { id: 124, name: 'Current streak displays', passed: null },
      { id: 125, name: 'Streak updates after workout', passed: null },
    ],
  },
  {
    id: 'K',
    name: 'Client App - Nutrition',
    tests: [
      { id: 126, name: 'Nutrition tab shows assigned plan', passed: null },
      { id: 127, name: 'Daily calories/macros display', passed: null },
      { id: 128, name: 'Meal list shows correctly', passed: null },
      { id: 129, name: 'Can log meals eaten', passed: null },
      { id: 130, name: 'Daily progress bar updates', passed: null },
      { id: 131, name: 'Empty state if no plan assigned', passed: null },
    ],
  },
  {
    id: 'L',
    name: 'Client App - Settings',
    tests: [
      { id: 132, name: 'Settings page loads', passed: null },
      { id: 133, name: 'Can update profile info', passed: null },
      { id: 134, name: 'Can change password', passed: null },
      { id: 135, name: 'Dark/light mode toggle works', passed: null },
      { id: 136, name: 'Notification preferences work', passed: null },
      { id: 137, name: 'Logout works', passed: null },
    ],
  },
  {
    id: 'M',
    name: 'Cross-Platform & Edge Cases',
    tests: [
      { id: 138, name: 'Admin portal works on mobile', passed: null },
      { id: 139, name: 'Client app works on mobile', passed: null },
      { id: 140, name: 'Client app works on tablet', passed: null },
      { id: 141, name: 'Graceful error on network failure', passed: null },
      { id: 142, name: 'Form validation shows clear errors', passed: null },
      { id: 143, name: '404 page for invalid routes', passed: null },
      { id: 144, name: 'Empty states have proper messaging', passed: null },
      { id: 145, name: "Long text/names don't break layout", passed: null },
      { id: 146, name: 'Special characters handled correctly', passed: null },
      { id: 147, name: 'Session timeout handled gracefully', passed: null },
    ],
  },
];

const tiers = [
  { name: 'Starter', clients: 'Up to 10', price: 39 },
  { name: 'Pro', clients: 'Up to 30', price: 79 },
  { name: 'Studio', clients: 'Up to 75', price: 149 },
  { name: 'Gym', clients: 'Unlimited', price: 299 },
];

// Competitor data
const competitors = [
  {
    name: 'Trainerize',
    pricing: '$0-350/mo',
    strengths: ['Most feature-complete', 'Built-in video calls', 'Large exercise library', 'Challenges & gamification'],
    weaknesses: ['Expensive at scale', 'Custom app is costly add-on', 'Interface can feel cluttered'],
  },
  {
    name: 'TrueCoach',
    pricing: '$19-99/mo',
    strengths: ['Simple, clean interface', 'Lower price point', 'Excellent workout builder UX', 'Automated churn prediction'],
    weaknesses: ['Limited nutrition features', 'No built-in meal planning', 'No video calls'],
  },
  {
    name: 'PT Distinction',
    pricing: '$20-100+/mo',
    strengths: ['AI Program Generator', 'AI Meal Planner', 'Custom branded apps included', 'Automated workflows'],
    weaknesses: ['UK-focused', 'Less modern UI', 'Smaller market presence in AU/US'],
  },
  {
    name: 'Everfit',
    pricing: '$0-149/mo',
    strengths: ['Clean modern UI', 'AI-powered programming', 'Sport-specific tools', 'Good free tier'],
    weaknesses: ['Newer platform', 'Limited integrations', 'Smaller community'],
  },
];

// Feature comparison
const featureComparison = [
  { feature: 'Custom Branded App', cmpd: false, trainerize: true, truecoach: true, ptd: true, everfit: true },
  { feature: 'Program Builder', cmpd: true, trainerize: true, truecoach: true, ptd: true, everfit: true },
  { feature: 'Nutrition Plans', cmpd: true, trainerize: true, truecoach: true, ptd: true, everfit: true },
  { feature: 'AI Features', cmpd: false, trainerize: false, truecoach: false, ptd: true, everfit: true },
  { feature: 'In-App Messaging', cmpd: false, trainerize: true, truecoach: true, ptd: true, everfit: true },
  { feature: 'Habit Tracking', cmpd: false, trainerize: true, truecoach: true, ptd: true, everfit: true },
  { feature: 'Video Calls', cmpd: false, trainerize: true, truecoach: false, ptd: false, everfit: false },
  { feature: 'Wearable Integration', cmpd: false, trainerize: true, truecoach: true, ptd: true, everfit: true },
  { feature: 'Stripe Payments', cmpd: true, trainerize: true, truecoach: true, ptd: true, everfit: true },
  { feature: 'Progress Photos', cmpd: true, trainerize: true, truecoach: true, ptd: true, everfit: true },
  { feature: '1RM Tracking', cmpd: true, trainerize: true, truecoach: true, ptd: true, everfit: true },
  { feature: 'Group Training', cmpd: false, trainerize: true, truecoach: true, ptd: true, everfit: true },
];

// Future improvements
const futureImprovements = [
  { priority: 'high', name: 'In-App Messaging', desc: 'Real-time chat, push notifications, media sharing', reason: 'Every competitor has this - non-negotiable' },
  { priority: 'high', name: 'Habit Tracking', desc: 'Daily habits, streaks, custom habits', reason: 'Drives long-term client retention' },
  { priority: 'high', name: 'Native Mobile App', desc: 'iOS/Android app for clients', reason: 'Web-only is dealbreaker for many trainers' },
  { priority: 'high', name: 'Trainer-to-Client Payments', desc: 'Trainers receive payments from clients through app', reason: 'Monetization for trainers = stickiness' },
  { priority: 'high', name: 'Churn Prediction', desc: 'AI-powered detection of at-risk clients before they cancel', reason: 'Proactive retention saves revenue' },
  { priority: 'medium', name: 'AI Program Generator', desc: 'Generate programs based on goals/assessment', reason: 'AI is the future - early adopters win' },
  { priority: 'medium', name: 'Custom Branded Apps', desc: 'White-label iOS/Android apps', reason: 'Premium upsell for high-value trainers' },
  { priority: 'medium', name: 'Group Training/Challenges', desc: 'Group programs, leaderboards, challenges', reason: 'More clients per trainer = higher retention' },
  { priority: 'medium', name: 'Wearable Integrations', desc: 'Apple Watch, Garmin, WHOOP, Oura', reason: 'Data-driven training is expected now' },
  { priority: 'medium', name: 'Meal Planning & Macro Tracking', desc: 'Advanced nutrition with macro goals and meal logging', reason: 'Complete nutrition solution for clients' },
  { priority: 'low', name: 'Video Calls', desc: 'Built-in video consultations', reason: 'Nice-to-have for hybrid coaching' },
  { priority: 'low', name: 'Client Self-Booking', desc: 'Calendar integration, automated scheduling', reason: 'Convenience feature' },
];

// Build & QA Notes (added during testing sessions)
const buildNotes = [
  { date: '2026-02-06', type: 'roadmap', text: 'Future: Built-in video calls for trainer-client sessions' },
  { date: '2026-02-06', type: 'roadmap', text: 'Future: Challenges & gamification to boost engagement' },
  { date: '2026-02-06', type: 'roadmap', text: 'Future: Churn prediction using activity patterns' },
  { date: '2026-02-06', type: 'roadmap', text: 'Future: Advanced meal planning & macro tracking' },
  { date: '2026-02-06', type: 'roadmap', text: 'Future: In-app messaging (trainer ↔ client)' },
  { date: '2026-02-06', type: 'roadmap', text: 'Future: AI-powered features (program gen, meal plans)' },
  { date: '2026-02-06', type: 'roadmap', text: 'Future: Custom branded app (white-label)' },
  { date: '2026-02-06', type: 'roadmap', text: 'Future: Habit tracking & streaks' },
  { date: '2026-02-06', type: 'roadmap', text: 'Future: Wearable integration (Apple Watch, Fitbit, etc.)' },
  { date: '2026-02-06', type: 'roadmap', text: 'Future: Group training & team workouts' },
];

// Marketing phases
const marketingPhases = [
  {
    phase: 0,
    name: 'Pre-Launch',
    goal: 'Validate & prepare',
    mrr: '$0',
    trainers: '5-10 beta',
    timeline: 'Current',
    tactics: ['Complete QA testing', 'Founding Trainer beta program', 'Build email list', 'Create demo video'],
  },
  {
    phase: 1,
    name: 'Soft Launch',
    goal: 'Product-market fit',
    mrr: '$10K',
    trainers: '50-100',
    timeline: 'Month 1-3',
    tactics: ['50% lifetime discount for first 50', 'Direct outreach (20 DMs/day)', 'Instagram content', 'Referral program launch'],
  },
  {
    phase: 2,
    name: 'Growth',
    goal: 'Establish brand',
    mrr: '$50K',
    trainers: '250-400',
    timeline: 'Month 4-8',
    tactics: ['Content marketing ramp (blog, YouTube)', 'Facebook community building', 'Fitness Australia partnership', 'Paid ads test ($2-5K/mo)'],
  },
  {
    phase: 3,
    name: 'Scale',
    goal: 'Market presence',
    mrr: '$200K',
    trainers: '800-1500',
    timeline: 'Month 9-18',
    tactics: ['Scale paid ads ($15-30K/mo)', 'NZ & UK expansion', 'Enterprise/studio sales team', 'Affiliate program'],
  },
  {
    phase: 4,
    name: 'Dominance',
    goal: '#1 in Australia',
    mrr: '$1M+',
    trainers: '5000+',
    timeline: 'Month 18-36',
    tactics: ['Major event sponsorships', 'AI features as moat', 'M&A opportunities', 'Team of 20-30'],
  },
];

// Notes
const strategyNotes = [
  { type: 'feature', text: 'Trainers to receive payments from clients through app', priority: 'high' },
  { type: 'insight', text: 'Critical gaps vs competitors: in-app messaging, habit tracking, mobile app', priority: 'high' },
  { type: 'angle', text: 'Our positioning: "Simpler than Trainerize, built by Aussie trainers"', priority: 'medium' },
  { type: 'insight', text: 'Phase 1 goal: 50 trainers, $10K MRR via personal network', priority: 'medium' },
];

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'build' | 'qa' | 'strategy'>('qa');
  const [qaTests, setQaTests] = useState<QASection[]>(qaData);
  const [qaNotes, setQaNotes] = useState<QANote[]>([]);

  useEffect(() => {
    setMounted(true);
    // Load QA state from localStorage
    const saved = localStorage.getItem('cmpd-qa-tests');
    if (saved) {
      setQaTests(JSON.parse(saved));
    }
    // Fetch notes from server (managed by Henry)
    fetch('/qa-notes.json?' + Date.now())
      .then(res => res.json())
      .then(data => {
        if (data.notes && data.notes.length > 0) {
          setQaNotes(data.notes);
        }
      })
      .catch(() => {});
  }, []);

  // Save QA state to localStorage whenever it changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('cmpd-qa-tests', JSON.stringify(qaTests));
    }
  }, [qaTests, mounted]);

  // Note: Notes are managed by Henry via qa-notes.json
  // Delete just removes from current view (won't persist)
  const deleteNote = (noteId: number) => {
    setQaNotes(prev => prev.filter(n => n.id !== noteId));
  };

  const toggleTest = (sectionId: string, testId: number) => {
    setQaTests(prev => prev.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          tests: section.tests.map(test => {
            if (test.id === testId) {
              // Cycle through: null -> true -> false -> null
              const newPassed = test.passed === null ? true : test.passed === true ? false : null;
              return { ...test, passed: newPassed };
            }
            return test;
          }),
        };
      }
      return section;
    }));
  };

  const resetQA = () => {
    if (confirm('Reset all QA tests? This cannot be undone.')) {
      setQaTests(qaData);
      localStorage.removeItem('cmpd-qa-tests');
    }
  };

  // Build phase stats
  const totalTasks = phases.reduce((acc, phase) => acc + phase.tasks.length, 0);
  const completedTasks = phases.reduce(
    (acc, phase) => acc + phase.tasks.filter((t) => t.done).length,
    0
  );
  const buildProgressPercent = Math.round((completedTasks / totalTasks) * 100);

  // QA stats
  const totalTests = qaTests.reduce((acc, section) => acc + section.tests.length, 0);
  const passedTests = qaTests.reduce(
    (acc, section) => acc + section.tests.filter((t) => t.passed === true).length,
    0
  );
  const failedTests = qaTests.reduce(
    (acc, section) => acc + section.tests.filter((t) => t.passed === false).length,
    0
  );
  const untestedTests = totalTests - passedTests - failedTests;
  const qaProgressPercent = Math.round((passedTests / totalTests) * 100);

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

  const getSectionProgress = (section: QASection) => {
    const passed = section.tests.filter(t => t.passed === true).length;
    const failed = section.tests.filter(t => t.passed === false).length;
    const total = section.tests.length;
    return { passed, failed, total, percent: Math.round((passed / total) * 100) };
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
              <p className="text-xs text-zinc-500">Fitness Platform</p>
            </div>
          </div>
          
          {/* Tab Switcher */}
          <div className="flex bg-zinc-800 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('build')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'build' 
                  ? 'bg-yellow-500 text-zinc-900' 
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Build
            </button>
            <button
              onClick={() => setActiveTab('qa')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'qa' 
                  ? 'bg-yellow-500 text-zinc-900' 
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              QA Testing
            </button>
            <button
              onClick={() => setActiveTab('strategy')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'strategy' 
                  ? 'bg-yellow-500 text-zinc-900' 
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Strategy
            </button>
          </div>

          <div className="text-right">
            <p className="text-2xl font-bold text-yellow-500">
              {activeTab === 'build' ? `${buildProgressPercent}%` : activeTab === 'qa' ? `${qaProgressPercent}%` : '→$1M'}
            </p>
            <p className="text-xs text-zinc-500">
              {activeTab === 'build' ? 'Built' : activeTab === 'qa' ? 'Passed' : 'Goal'}
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {activeTab === 'build' && (
          <>
            {/* Build Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
                <p className="text-zinc-500 text-sm">Tasks</p>
                <p className="text-2xl font-bold">
                  {completedTasks} <span className="text-zinc-600">/ {totalTasks}</span>
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
                <p className="text-2xl font-bold text-green-500">Complete</p>
              </div>
              <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
                <p className="text-zinc-500 text-sm">Next</p>
                <p className="text-2xl font-bold text-yellow-500">QA Testing</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-10">
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-500 to-green-500 transition-all duration-500"
                  style={{ width: `${buildProgressPercent}%` }}
                />
              </div>
            </div>

            {/* Phase Timeline */}
            <div className="space-y-6 mb-12">
              {phases.map((phase) => (
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
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          phase.status === 'complete'
                            ? 'bg-green-500/20 text-green-400'
                            : phase.status === 'in-progress'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-zinc-800 text-zinc-500'
                        }`}
                      >
                        {phase.status === 'complete' ? 'Complete' : phase.status === 'in-progress' ? 'In Progress' : 'Pending'}
                      </span>
                    </div>

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
                              task.done ? 'bg-green-500 text-white' : 'border border-zinc-600'
                            }`}
                          >
                            {task.done && '✓'}
                          </div>
                          <span className={task.done ? 'text-green-400' : 'text-zinc-400'}>
                            {task.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="h-1 bg-zinc-800">
                    <div
                      className={`h-full ${getStatusColor(phase.status)}`}
                      style={{
                        width: `${(phase.tasks.filter((t) => t.done).length / phase.tasks.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'qa' && (
          <>
            {/* QA Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
                <p className="text-zinc-500 text-sm">Total Tests</p>
                <p className="text-2xl font-bold">{totalTests}</p>
              </div>
              <div className="bg-zinc-900 rounded-xl p-4 border border-green-500/50">
                <p className="text-zinc-500 text-sm">Passed</p>
                <p className="text-2xl font-bold text-green-500">{passedTests}</p>
              </div>
              <div className="bg-zinc-900 rounded-xl p-4 border border-red-500/50">
                <p className="text-zinc-500 text-sm">Failed</p>
                <p className="text-2xl font-bold text-red-500">{failedTests}</p>
              </div>
              <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
                <p className="text-zinc-500 text-sm">Untested</p>
                <p className="text-2xl font-bold text-zinc-500">{untestedTests}</p>
              </div>
            </div>

            {/* QA Progress Bar */}
            <div className="mb-6">
              <div className="h-3 bg-zinc-800 rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-green-500 transition-all duration-300"
                  style={{ width: `${(passedTests / totalTests) * 100}%` }}
                />
                <div
                  className="h-full bg-red-500 transition-all duration-300"
                  style={{ width: `${(failedTests / totalTests) * 100}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs text-zinc-500">
                <span>{passedTests} passed</span>
                <span>{failedTests} failed</span>
                <span>{untestedTests} remaining</span>
              </div>
            </div>

            {/* Reset Button */}
            <div className="flex justify-end mb-6">
              <button
                onClick={resetQA}
                className="px-4 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
              >
                Reset All Tests
              </button>
            </div>

            {/* QA Sections */}
            <div className="space-y-6">
              {qaTests.map((section) => {
                const progress = getSectionProgress(section);
                const isComplete = progress.passed === progress.total;
                const hasFailed = progress.failed > 0;
                
                return (
                  <div
                    key={section.id}
                    className={`bg-zinc-900 rounded-xl border-2 overflow-hidden ${
                      isComplete 
                        ? 'border-green-500' 
                        : hasFailed 
                        ? 'border-red-500' 
                        : 'border-zinc-700'
                    }`}
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                              isComplete 
                                ? 'bg-green-500 text-white' 
                                : hasFailed 
                                ? 'bg-red-500 text-white'
                                : 'bg-zinc-700 text-zinc-300'
                            }`}
                          >
                            {isComplete ? '✓' : section.id}
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold">{section.id}. {section.name}</h3>
                            <p className="text-zinc-500 text-sm">
                              {progress.passed}/{progress.total} passed
                              {progress.failed > 0 && ` • ${progress.failed} failed`}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            isComplete
                              ? 'bg-green-500/20 text-green-400'
                              : hasFailed
                              ? 'bg-red-500/20 text-red-400'
                              : progress.passed > 0
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-zinc-800 text-zinc-500'
                          }`}
                        >
                          {isComplete 
                            ? 'Complete' 
                            : hasFailed 
                            ? 'Has Issues' 
                            : progress.passed > 0 
                            ? 'In Progress' 
                            : 'Not Started'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                        {section.tests.map((test) => (
                          <button
                            key={test.id}
                            onClick={() => toggleTest(section.id, test.id)}
                            className={`flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                              test.passed === true
                                ? 'bg-green-500/10 hover:bg-green-500/20'
                                : test.passed === false
                                ? 'bg-red-500/10 hover:bg-red-500/20'
                                : 'bg-zinc-800/50 hover:bg-zinc-800'
                            }`}
                          >
                            <div
                              className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${
                                test.passed === true
                                  ? 'bg-green-500 text-white'
                                  : test.passed === false
                                  ? 'bg-red-500 text-white'
                                  : 'border-2 border-zinc-600 text-zinc-500'
                              }`}
                            >
                              {test.passed === true ? '✓' : test.passed === false ? '✗' : test.id}
                            </div>
                            <span
                              className={
                                test.passed === true
                                  ? 'text-green-400'
                                  : test.passed === false
                                  ? 'text-red-400'
                                  : 'text-zinc-400'
                              }
                            >
                              {test.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="h-1 bg-zinc-800 flex">
                      <div
                        className="h-full bg-green-500 transition-all duration-300"
                        style={{ width: `${(progress.passed / progress.total) * 100}%` }}
                      />
                      <div
                        className="h-full bg-red-500 transition-all duration-300"
                        style={{ width: `${(progress.failed / progress.total) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* QA Notes Section */}
            {qaNotes.length > 0 && (
              <div className="mt-8 bg-zinc-900 rounded-xl border-2 border-yellow-500/50 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <span className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center text-zinc-900 text-sm">📝</span>
                      QA Notes & Issues
                    </h3>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400">
                      {qaNotes.length} {qaNotes.length === 1 ? 'note' : 'notes'}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {qaNotes.map((note) => (
                      <div
                        key={note.id}
                        className={`p-4 rounded-lg border ${
                          note.type === 'bug' 
                            ? 'bg-red-500/10 border-red-500/30' 
                            : note.type === 'improvement' 
                            ? 'bg-blue-500/10 border-blue-500/30' 
                            : 'bg-zinc-800/50 border-zinc-700'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                                note.type === 'bug' 
                                  ? 'bg-red-500/20 text-red-400' 
                                  : note.type === 'improvement' 
                                  ? 'bg-blue-500/20 text-blue-400' 
                                  : 'bg-zinc-700 text-zinc-400'
                              }`}>
                                {note.type === 'bug' ? '🐛 Bug' : note.type === 'improvement' ? '✨ Improvement' : '📝 Note'}
                              </span>
                              <span className="text-xs text-zinc-500">{note.section}</span>
                              {note.testId && <span className="text-xs text-zinc-600">• Test #{note.testId}</span>}
                            </div>
                            <p className="text-zinc-300">{note.text}</p>
                            <p className="text-xs text-zinc-600 mt-2">{note.timestamp}</p>
                          </div>
                          <button
                            onClick={() => deleteNote(note.id)}
                            className="text-zinc-500 hover:text-red-400 transition-colors p-1"
                            title="Delete note"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Strategy Tab */}
        {activeTab === 'strategy' && (
          <>
            {/* Notes Banner */}
            <div className="bg-yellow-500/10 border-2 border-yellow-500/50 rounded-xl p-4 mb-8">
              <h3 className="font-semibold text-yellow-400 mb-3 flex items-center gap-2">
                <span>📝</span> Key Notes & Insights
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {strategyNotes.map((note, i) => (
                  <div key={i} className={`p-3 rounded-lg ${
                    note.priority === 'high' ? 'bg-red-500/10 border border-red-500/30' : 'bg-zinc-800/50 border border-zinc-700'
                  }`}>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded mr-2 ${
                      note.type === 'feature' ? 'bg-green-500/20 text-green-400' :
                      note.type === 'insight' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {note.type === 'feature' ? '🚀 Feature' : note.type === 'insight' ? '💡 Insight' : '🎯 Angle'}
                    </span>
                    <span className="text-zinc-300 text-sm">{note.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Marketing Roadmap */}
            <div className="mb-10">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-zinc-900 text-sm">💰</span>
                Marketing Roadmap: $0 → $1M MRR
              </h2>
              <div className="space-y-4">
                {marketingPhases.map((phase) => (
                  <div key={phase.phase} className={`bg-zinc-900 rounded-xl border-2 overflow-hidden ${
                    phase.phase === 0 ? 'border-yellow-500' : 'border-zinc-700'
                  }`}>
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${
                            phase.phase === 0 ? 'bg-yellow-500 text-zinc-900' : 'bg-zinc-700 text-white'
                          }`}>
                            {phase.phase}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold">{phase.name}</h3>
                            <p className="text-zinc-500 text-sm">{phase.goal} • {phase.timeline}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-green-400">{phase.mrr}</p>
                          <p className="text-xs text-zinc-500">{phase.trainers} trainers</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {phase.tactics.map((tactic, i) => (
                          <span key={i} className="px-3 py-1 bg-zinc-800 rounded-full text-xs text-zinc-300">
                            {tactic}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Competitor Analysis */}
            <div className="mb-10">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white text-sm">🔍</span>
                Competitor Analysis
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {competitors.map((comp) => (
                  <div key={comp.name} className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-lg">{comp.name}</h3>
                      <span className="text-yellow-400 text-sm font-medium">{comp.pricing}</span>
                    </div>
                    <div className="mb-3">
                      <p className="text-xs text-green-400 font-medium mb-1">STRENGTHS</p>
                      <ul className="space-y-1">
                        {comp.strengths.map((s, i) => (
                          <li key={i} className="text-sm text-zinc-400 flex items-center gap-2">
                            <span className="text-green-500">+</span> {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs text-red-400 font-medium mb-1">WEAKNESSES</p>
                      <ul className="space-y-1">
                        {comp.weaknesses.map((w, i) => (
                          <li key={i} className="text-sm text-zinc-400 flex items-center gap-2">
                            <span className="text-red-500">−</span> {w}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature Comparison Table */}
            <div className="mb-10">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center text-white text-sm">📊</span>
                Feature Comparison
              </h2>
              <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-zinc-800">
                        <th className="text-left p-4 text-zinc-400 font-medium">Feature</th>
                        <th className="p-4 text-center text-yellow-400 font-medium">CMPD</th>
                        <th className="p-4 text-center text-zinc-400 font-medium">Trainerize</th>
                        <th className="p-4 text-center text-zinc-400 font-medium">TrueCoach</th>
                        <th className="p-4 text-center text-zinc-400 font-medium">PT Dist.</th>
                        <th className="p-4 text-center text-zinc-400 font-medium">Everfit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {featureComparison.map((row, i) => (
                        <tr key={i} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                          <td className="p-4 text-zinc-300 text-sm">{row.feature}</td>
                          <td className="p-4 text-center">
                            {row.cmpd ? <span className="text-green-400">✓</span> : <span className="text-red-400">✗</span>}
                          </td>
                          <td className="p-4 text-center">
                            {row.trainerize ? <span className="text-green-400">✓</span> : <span className="text-zinc-600">✗</span>}
                          </td>
                          <td className="p-4 text-center">
                            {row.truecoach ? <span className="text-green-400">✓</span> : <span className="text-zinc-600">✗</span>}
                          </td>
                          <td className="p-4 text-center">
                            {row.ptd ? <span className="text-green-400">✓</span> : <span className="text-zinc-600">✗</span>}
                          </td>
                          <td className="p-4 text-center">
                            {row.everfit ? <span className="text-green-400">✓</span> : <span className="text-zinc-600">✗</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Future Improvements */}
            <div className="mb-10">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white text-sm">🚀</span>
                Recommended Future Improvements
              </h2>
              <div className="space-y-3">
                {futureImprovements.map((item, i) => (
                  <div key={i} className={`bg-zinc-900 rounded-xl border-2 p-4 ${
                    item.priority === 'high' ? 'border-red-500/50' :
                    item.priority === 'medium' ? 'border-yellow-500/50' : 'border-zinc-700'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                            item.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                            item.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-zinc-700 text-zinc-400'
                          }`}>
                            {item.priority.toUpperCase()}
                          </span>
                          <h3 className="font-semibold text-white">{item.name}</h3>
                        </div>
                        <p className="text-zinc-400 text-sm mb-1">{item.desc}</p>
                        <p className="text-zinc-500 text-xs italic">Why: {item.reason}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Pricing Tiers */}
        <div className="mt-12 mb-12">
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
              <p className="text-zinc-500 text-sm mt-1">Trainers manage clients, programs & billing</p>
              <p className="text-xs text-zinc-600 mt-2">eddytrains-admin.vercel.app</p>
            </div>
            <div className="text-center p-4 bg-zinc-800/50 rounded-lg">
              <div className="w-12 h-12 bg-green-500 rounded-lg mx-auto mb-3 flex items-center justify-center text-zinc-900 font-bold">
                C
              </div>
              <h3 className="font-semibold">Client App</h3>
              <p className="text-zinc-500 text-sm mt-1">End users view workouts & track progress</p>
              <p className="text-xs text-zinc-600 mt-2">app.cmpdcollective.com</p>
            </div>
            <div className="text-center p-4 bg-zinc-800/50 rounded-lg">
              <div className="w-12 h-12 bg-blue-500 rounded-lg mx-auto mb-3 flex items-center justify-center text-zinc-900 font-bold">
                DB
              </div>
              <h3 className="font-semibold">Supabase</h3>
              <p className="text-zinc-500 text-sm mt-1">Multi-tenant database with RLS policies</p>
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
