// ─── localStorage-backed data store for BuildCommand ───
// All entities are persisted to localStorage and seeded with defaults on first load.

export interface Project {
  id: string;
  name: string;
  client: string;
  location: string;
  progress: number;
  status: 'On Schedule' | 'Delayed' | 'Review' | 'Completed';
  deadline: string;
  budget: number;
  type: string;
  teamSize: number;
  createdAt: string;
}

export interface Expense {
  id: string;
  title: string;
  projectId: string;
  projectName: string;
  amount: number;
  date: string;
  type: 'Material' | 'Labor' | 'Admin' | 'Equipment' | 'Other';
}

export interface ScheduleItem {
  id: string;
  time: string;
  location: string;
  task: string;
  crew: string;
  status: 'completed' | 'in-progress' | 'pending';
  date: string;
}

export interface DailyLog {
  id: string;
  date: string;
  weather: string;
  crew: string;
  notes: string;
  issues: string;
  photos: string[];
}

export interface ActionItem {
  id: string;
  text: string;
  project: string;
  status: 'overdue' | 'today' | 'upcoming' | 'completed';
  completedAt?: string;
}

export interface ClientApproval {
  id: string;
  type: string;
  title: string;
  amount: string;
  date: string;
  status: 'pending' | 'approved' | 'declined';
}

export interface Notification {
  id: string;
  text: string;
  time: string;
  type: 'info' | 'success' | 'warning' | 'action';
  read: boolean;
  createdAt: string;
}

// ─── Keys ───
const KEYS = {
  projects: 'bc-projects',
  expenses: 'bc-expenses',
  schedule: 'bc-schedule',
  logs: 'bc-daily-logs',
  actions: 'bc-action-items',
  approvals: 'bc-approvals',
  notifications: 'bc-notifications',
  companyName: 'bc-company-name',
  companyLogo: 'bc-company-logo',
  seeded: 'bc-seeded',
};

// ─── UUID helper ───
export function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

// ─── Generic CRUD helpers ───
function getAll<T>(key: string): T[] {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch { return []; }
}

function setAll<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

// ─── Projects ───
export const getProjects = () => getAll<Project>(KEYS.projects);
export const addProject = (p: Omit<Project, 'id' | 'createdAt'>) => {
  const all = getProjects();
  const newP: Project = { ...p, id: uid(), createdAt: new Date().toISOString() };
  all.unshift(newP);
  setAll(KEYS.projects, all);
  addNotification({ text: `New project "${newP.name}" created.`, type: 'success' });
  return newP;
};
export const updateProject = (id: string, updates: Partial<Project>) => {
  const all = getProjects().map(p => p.id === id ? { ...p, ...updates } : p);
  setAll(KEYS.projects, all);
};
export const deleteProject = (id: string) => {
  setAll(KEYS.projects, getProjects().filter(p => p.id !== id));
};

// ─── Expenses ───
export const getExpenses = () => getAll<Expense>(KEYS.expenses);
export const addExpense = (e: Omit<Expense, 'id'>) => {
  const all = getExpenses();
  const newE: Expense = { ...e, id: uid() };
  all.unshift(newE);
  setAll(KEYS.expenses, all);
  addNotification({ text: `Expense "$${e.amount.toFixed(2)}" logged for ${e.projectName}.`, type: 'info' });
  return newE;
};
export const deleteExpense = (id: string) => {
  setAll(KEYS.expenses, getExpenses().filter(e => e.id !== id));
};

// ─── Schedule ───
export const getSchedule = () => getAll<ScheduleItem>(KEYS.schedule);
export const addScheduleItem = (s: Omit<ScheduleItem, 'id'>) => {
  const all = getSchedule();
  const newS: ScheduleItem = { ...s, id: uid() };
  all.push(newS);
  all.sort((a, b) => a.time.localeCompare(b.time));
  setAll(KEYS.schedule, all);
  addNotification({ text: `Scheduled "${newS.task}" at ${newS.time}.`, type: 'info' });
  return newS;
};
export const updateScheduleItem = (id: string, updates: Partial<ScheduleItem>) => {
  const all = getSchedule().map(s => s.id === id ? { ...s, ...updates } : s);
  setAll(KEYS.schedule, all);
};
export const deleteScheduleItem = (id: string) => {
  setAll(KEYS.schedule, getSchedule().filter(s => s.id !== id));
};

// ─── Daily Logs ───
export const getDailyLogs = () => getAll<DailyLog>(KEYS.logs);
export const addDailyLog = (l: Omit<DailyLog, 'id'>) => {
  const all = getDailyLogs();
  const newL: DailyLog = { ...l, id: uid() };
  all.unshift(newL);
  setAll(KEYS.logs, all);
  addNotification({ text: `Daily log submitted for ${l.date}.`, type: 'success' });
  return newL;
};

// ─── Action Items ───
export const getActionItems = () => getAll<ActionItem>(KEYS.actions);
export const addActionItem = (a: Omit<ActionItem, 'id'>) => {
  const all = getActionItems();
  const newA: ActionItem = { ...a, id: uid() };
  all.push(newA);
  setAll(KEYS.actions, all);
  return newA;
};
export const completeActionItem = (id: string) => {
  const all = getActionItems().map(a =>
    a.id === id ? { ...a, status: 'completed' as const, completedAt: new Date().toISOString() } : a
  );
  setAll(KEYS.actions, all);
};

// ─── Client Approvals ───
export const getApprovals = () => getAll<ClientApproval>(KEYS.approvals);
export const updateApproval = (id: string, status: 'approved' | 'declined') => {
  const all = getApprovals().map(a => a.id === id ? { ...a, status } : a);
  setAll(KEYS.approvals, all);
  const item = all.find(a => a.id === id);
  if (item) {
    addNotification({ text: `"${item.title}" was ${status}.`, type: status === 'approved' ? 'success' : 'warning' });
  }
};

// ─── Notifications ───
export const getNotifications = () => getAll<Notification>(KEYS.notifications);
export const addNotification = (n: Omit<Notification, 'id' | 'time' | 'read' | 'createdAt'>) => {
  const all = getNotifications();
  const now = new Date();
  const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const newN: Notification = { ...n, id: uid(), time, read: false, createdAt: now.toISOString() };
  all.unshift(newN);
  if (all.length > 50) all.pop();
  setAll(KEYS.notifications, all);
  return newN;
};
export const markNotificationRead = (id: string) => {
  const all = getNotifications().map(n => n.id === id ? { ...n, read: true } : n);
  setAll(KEYS.notifications, all);
};
export const markAllNotificationsRead = () => {
  const all = getNotifications().map(n => ({ ...n, read: true }));
  setAll(KEYS.notifications, all);
};

// ─── Company Settings ───
export const getCompanyName = () => localStorage.getItem(KEYS.companyName) || 'Alx Residential Builders';
export const setCompanyName = (name: string) => localStorage.setItem(KEYS.companyName, name);
export const getCompanyLogo = () => localStorage.getItem(KEYS.companyLogo) || '';
export const setCompanyLogo = (base64: string) => localStorage.setItem(KEYS.companyLogo, base64);

// ─── Formatting helpers ───
export function formatCurrency(amount: number): string {
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(2)}M`;
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(1)}K`;
  return `$${amount.toFixed(2)}`;
}

export function formatCurrencyFull(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

// ─── Seed data (runs once) ───
export function seedIfNeeded(): void {
  if (localStorage.getItem(KEYS.seeded)) return;

  const projects: Project[] = [
    { id: 'p1', name: 'Modern Townhouse Dev', client: 'Alx Builder Corp', location: '124 Azure Way, Austin TX', progress: 78, status: 'On Schedule', deadline: '2026-10-12', budget: 1_200_000, type: 'Residential', teamSize: 12, createdAt: '2026-01-15T00:00:00Z' },
    { id: 'p2', name: 'Downtown Loft Renovation', client: 'Sarah Jenkins', location: '881 5th Ave, Austin TX', progress: 45, status: 'Delayed', deadline: '2026-11-30', budget: 450_000, type: 'Renovation', teamSize: 5, createdAt: '2026-03-01T00:00:00Z' },
    { id: 'p3', name: 'Lakeside Cabins (Phase 1)', client: 'Blue Water LLC', location: 'Lake Travis', progress: 92, status: 'Review', deadline: '2026-09-05', budget: 2_100_000, type: 'New Build', teamSize: 18, createdAt: '2025-11-10T00:00:00Z' },
    { id: 'p4', name: 'Suburban Extension', client: 'The Millers', location: '44 Oak Street, Round Rock TX', progress: 15, status: 'On Schedule', deadline: '2027-01-15', budget: 180_000, type: 'Extension', teamSize: 4, createdAt: '2026-06-20T00:00:00Z' },
  ];

  const expenses: Expense[] = [
    { id: 'e1', title: 'Lumber Supply - Home Depot', projectId: 'p1', projectName: 'Modern Townhouse Dev', amount: 4250, date: '2026-10-12T10:30:00Z', type: 'Material' },
    { id: 'e2', title: 'Permit Renewal Fee', projectId: 'p2', projectName: 'Downtown Loft', amount: 350, date: '2026-10-11T09:00:00Z', type: 'Admin' },
    { id: 'e3', title: 'Electrical Subcontractor Draw', projectId: 'p3', projectName: 'Lakeside Cabins', amount: 12000, date: '2026-10-02T14:00:00Z', type: 'Labor' },
    { id: 'e4', title: 'Concrete Pouring - Foundation', projectId: 'p4', projectName: 'Suburban Extension', amount: 3800, date: '2026-10-01T08:00:00Z', type: 'Material' },
  ];

  const schedule: ScheduleItem[] = [
    { id: 's1', time: '07:00 AM', location: 'Modern Townhouse Dev', task: 'Site Opens & Safety Briefing', crew: 'All Crews', status: 'completed', date: '2026-10-12' },
    { id: 's2', time: '08:00 AM', location: 'Modern Townhouse Dev', task: 'Foundation Framing', crew: 'Framing Team (5)', status: 'in-progress', date: '2026-10-12' },
    { id: 's3', time: '10:30 AM', location: 'Lakeside Cabins', task: 'Electrical Rough-in', crew: 'Sparky Bros (2)', status: 'pending', date: '2026-10-12' },
    { id: 's4', time: '01:00 PM', location: 'Downtown Loft', task: 'Drywall Delivery', crew: 'Material Vendor', status: 'pending', date: '2026-10-12' },
  ];

  const logs: DailyLog[] = [
    { id: 'l1', date: 'Yesterday, Oct 11', weather: 'Partly Cloudy, 68°F', crew: '6 Workers (Framing, General)', notes: 'Completed 2nd floor joists. Waiting on inspection for plumbing rough-in.', issues: 'None', photos: [] },
    { id: 'l2', date: 'Oct 10', weather: 'Sunny, 75°F', crew: '4 Workers (Concrete)', notes: 'Foundation poured and setting. No issues on site.', issues: 'Late cement truck', photos: [] },
  ];

  const actions: ActionItem[] = [
    { id: 'a1', text: 'Renew building permit for Downtown Loft', project: 'Downtown Loft', status: 'overdue' },
    { id: 'a2', text: 'Approve Change Order #4', project: 'Modern Townhouse Dev', status: 'overdue' },
    { id: 'a3', text: 'Schedule final plumbing inspection', project: 'Lakeside Cabins', status: 'today' },
  ];

  const approvals: ClientApproval[] = [
    { id: 'ca1', type: 'Change Order', title: 'Upgrade Kitchen Cabinets to Solid Oak', amount: '+$3,250.00', date: 'Requested Oct 11', status: 'pending' },
    { id: 'ca2', type: 'Selection', title: 'Confirm Master Bath Tile Color', amount: 'No cost impact', date: 'Requested Oct 10', status: 'pending' },
  ];

  const notifications: Notification[] = [
    { id: 'n1', text: 'Framing Team confirmed arrival at Modern Townhouse Dev.', time: '06:45 AM', type: 'success', read: false, createdAt: '2026-10-12T06:45:00Z' },
    { id: 'n2', text: 'Sent schedule reminder to Sparky Bros for Lakeside Cabins.', time: '06:00 AM', type: 'info', read: false, createdAt: '2026-10-12T06:00:00Z' },
    { id: 'n3', text: '3 action items are overdue. Review now.', time: 'Yesterday', type: 'warning', read: true, createdAt: '2026-10-11T18:00:00Z' },
  ];

  setAll(KEYS.projects, projects);
  setAll(KEYS.expenses, expenses);
  setAll(KEYS.schedule, schedule);
  setAll(KEYS.logs, logs);
  setAll(KEYS.actions, actions);
  setAll(KEYS.approvals, approvals);
  setAll(KEYS.notifications, notifications);
  localStorage.setItem(KEYS.seeded, 'true');
}
