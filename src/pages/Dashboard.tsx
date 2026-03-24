import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Calendar, CheckCircle2 } from 'lucide-react';
import { showToast } from '../components/Toast';
import { getProjects, getExpenses, getSchedule, getActionItems, completeActionItem, formatCurrency } from '../data/dataStore';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const [actionItems, setActionItems] = useState(() => getActionItems().filter(a => a.status !== 'completed'));

  const projects = getProjects();
  const expenses = getExpenses();
  const schedule = getSchedule();

  // Computed stats
  const avgProgress = projects.length > 0 ? Math.round(projects.reduce((s, p) => s + p.progress, 0) / projects.length) : 0;
  const totalCrew = projects.reduce((s, p) => s + p.teamSize, 0);
  const onScheduleCount = projects.filter(p => p.status === 'On Schedule' || p.status === 'Completed').length;
  const crewPercent = projects.length > 0 ? Math.round((onScheduleCount / projects.length) * 100) : 0;
  const delayedCount = projects.filter(p => p.status === 'Delayed').length;
  const subPercent = projects.length > 0 ? Math.round(((projects.length - delayedCount) / projects.length) * 100) : 0;
  const completedTasks = schedule.filter(s => s.status === 'completed').length;
  const materialPercent = schedule.length > 0 ? Math.round((completedTasks / schedule.length) * 100) : 0;

  // Budget chart - monthly spending
  const monthlySpending = Array(12).fill(0);
  expenses.forEach(e => {
    const month = new Date(e.date).getMonth();
    monthlySpending[month] += e.amount;
  });
  const maxSpend = Math.max(...monthlySpending, 1);
  const totalBudget = projects.reduce((s, p) => s + p.budget, 0);
  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
  const budgetPercent = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;
  const currentMonth = new Date().getMonth();

  // Schedule-based indicators
  const indicators = schedule.slice(0, 3).map(s => ({
    name: s.task.length > 20 ? s.task.slice(0, 20) + '...' : s.task,
    status: s.status === 'completed' ? 'Complete' : s.status === 'in-progress' ? 'In Progress' : 'Pending',
    color: s.status === 'completed' ? 'var(--brand-primary)' : s.status === 'in-progress' ? 'var(--text-secondary)' : '#FF3D71',
    statusClass: s.status === 'completed' ? '' : s.status === 'in-progress' ? '' : 'text-danger',
  }));

  const overdueCount = actionItems.filter(a => a.status === 'overdue').length;

  const handleCompleteAction = (id: string) => {
    completeActionItem(id);
    setActionItems(prev => prev.filter(a => a.id !== id));
    showToast('Action item completed!');
  };

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  return (
    <div className="dashboard-wrapper animate-fade-in">
      
      {/* Top Row: Workforce Stats & Hero */}
      <div className="dashboard-top-row">
        
        {/* Workforce Overview Card */}
        <div className="card workforce-card relative">
          <div className="flex justify-between items-center mb-6">
            <h3 className="card-title">Workforce Details</h3>
            <button className="btn-icon" onClick={() => navigate('/projects')}><ArrowUpRight size={18} /></button>
          </div>
          
          <div className="stat-group">
            <div className="flex justify-between items-end mb-2">
              <span className="stat-label">On-site Crew</span>
              <span className={`pill ${crewPercent >= 75 ? 'success' : 'danger'}`}>{crewPercent >= 75 ? '↗' : '↘'} {crewPercent}%</span>
            </div>
            <div className="stat-value">{crewPercent} %</div>
            <div className="progress-bar-container mt-2">
              <div className="progress-bar-fill" style={{ width: `${crewPercent}%`, backgroundColor: 'var(--brand-primary)' }}></div>
            </div>
          </div>
          
          <div className="divider my-5"></div>

          <div className="stat-group">
            <div className="flex justify-between items-end mb-2">
              <span className="stat-label">Subcontractors</span>
              <span className={`pill ${subPercent >= 75 ? 'success' : 'danger'}`}>{subPercent >= 75 ? '↗' : '↘'} {subPercent}%</span>
            </div>
            <div className="stat-value">{subPercent} %</div>
            <div className="progress-bar-container mt-2">
              <div className="progress-bar-fill" style={{ width: `${subPercent}%`, backgroundColor: '#FF3D71' }}></div>
            </div>
          </div>

          <div className="divider my-5"></div>

          <div className="stat-group">
            <div className="flex justify-between items-end mb-2">
              <span className="stat-label">Tasks Completed</span>
              <span className={`pill ${materialPercent >= 50 ? 'success' : 'warning'}`}>↗ {materialPercent}%</span>
            </div>
            <div className="stat-value">{materialPercent} %</div>
            <div className="progress-bar-container mt-2">
              <div className="progress-bar-fill" style={{ width: `${materialPercent}%`, backgroundColor: 'var(--status-success)' }}></div>
            </div>
          </div>
        </div>

        {/* Hero Illustration */}
        <div className="hero-card">
          <img src="/hero-bg.png" alt="Construction Site" className="hero-image" />
          <div className="hero-pill">
            <Calendar size={16} className="text-brand" />
            <span>{projects.length} Active Project{projects.length !== 1 ? 's' : ''} • {totalCrew} Crew</span>
          </div>
        </div>
      </div>

      {/* Bottom Row: Budget & Project Indicators */}
      <div className="dashboard-bottom-row mt-6">
        
        {/* Budget Chart container */}
        <div className="card budget-card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="card-title">Live Budget Tracking</h3>
            <button className="btn-icon bg-bg-tertiary" onClick={() => navigate('/budget')}>View Details</button>
          </div>
          
          <div className="flex items-end gap-4 mb-8">
            <div className="stat-value text-gradient" style={{ fontSize: '32px' }}>{budgetPercent} %</div>
            <span className={`pill ${budgetPercent <= 50 ? 'success' : budgetPercent <= 80 ? 'warning' : 'danger'} mb-2`}>
              {budgetPercent <= 50 ? '↗ Under' : '↘ Over'} Budget
            </span>
          </div>

          <div className="chart-placeholder">
            {monthlySpending.map((h, i) => (
              <div 
                key={i} 
                className={`chart-bar ${i === currentMonth ? 'active' : ''}`} 
                style={{ height: `${Math.max(4, (h / maxSpend) * 100)}%` }}
              >
                {i === currentMonth && h > 0 && (
                  <div className="chart-tooltip">
                    <span className="dot"></span> {months[i]}: {formatCurrency(h)}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="chart-labels">
            {months.map((m, i) => (
              <span key={m} className={i === currentMonth ? 'active-label' : ''}>{m}</span>
            ))}
          </div>
        </div>

        {/* Project Indicators Gauge */}
        <div className="card indicators-card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="card-title">Project Health</h3>
            <button className="btn-icon bg-bg-tertiary" onClick={() => navigate('/projects')}>View All</button>
          </div>

            <div className="relative h-32 w-full mt-4 flex items-center justify-center">
              <svg viewBox="0 0 100 55" className="w-full h-full overflow-visible drop-shadow-xl">
                 <defs>
                   <linearGradient id="healthGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                     <stop offset="0%" stopColor="#ef4444" />
                     <stop offset="30%" stopColor="#f59e0b" />
                     <stop offset="70%" stopColor="#10b981" />
                     <stop offset="100%" stopColor="#3b82f6" />
                   </linearGradient>
                   <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                     <feGaussianBlur stdDeviation="3" result="blur" />
                     <feComposite in="SourceGraphic" in2="blur" operator="over" />
                   </filter>
                 </defs>
                 
                 {/* Background Track */}
                 <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="var(--bg-tertiary)" strokeWidth="8" strokeLinecap="round" />
                 
                 {/* Gradient Foreground */}
                 <path 
                   d="M 10 50 A 40 40 0 0 1 90 50" 
                   fill="none" 
                   stroke="url(#healthGrad)" 
                   strokeWidth="8" 
                   strokeLinecap="round" 
                   strokeDasharray="125.6" 
                   strokeDashoffset={125.6 * (1 - avgProgress / 100)} 
                   filter="url(#glow)"
                   className="gauge-progress animate-pulse-slow"
                 />
                 
                 {/* Dial Markings */}
                 <path d="M 10 50 L 14 50" stroke="var(--text-secondary)" strokeWidth="1.5" strokeLinecap="round" />
                 <path d="M 50 10 L 50 14" stroke="var(--text-secondary)" strokeWidth="1.5" strokeLinecap="round" />
                 <path d="M 90 50 L 86 50" stroke="var(--text-secondary)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <div className="absolute bottom-4 flex flex-col items-center">
                <span className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-blue-500" style={{ backgroundImage: 'linear-gradient(to right, #10b981, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{avgProgress}%</span>
                <span className="text-[10px] text-secondary font-bold uppercase tracking-wider mt-1">Average Progress</span>
              </div>
            </div>

          <div className="indicator-list mt-8">
            {indicators.length === 0 && (
              <div className="text-center text-sm text-secondary">No scheduled tasks to display.</div>
            )}
            {indicators.map((ind, i) => (
              <div key={i} className="indicator-item">
                <div className="flex items-center gap-2"><span className="dot" style={{background: ind.color}}></span> {ind.name}</div>
                <span className={`font-semibold ${ind.statusClass}`}>{ind.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Third Row: Action Items */}
      <div className="dashboard-action-row mt-6">
        <div className="card list-card p-0">
          <div className="p-6 border-b border-color flex flex-wrap gap-4 justify-between items-center">
            <h3 className="card-title text-danger flex items-center gap-2 shrink-0">
              <CheckCircle2 size={20} /> Outstanding Action Items
            </h3>
            {overdueCount > 0 && <span className="pill danger shrink-0">{overdueCount} Overdue</span>}
          </div>
          <div className="p-2">
            {actionItems.length === 0 && (
              <div className="p-8 text-center text-secondary">
                <CheckCircle2 size={32} className="text-success" style={{ margin: '0 auto 8px' }} />
                <div className="font-semibold">All caught up!</div>
              </div>
            )}
            {actionItems.map(item => (
              <div key={item.id} className="flex justify-between items-center p-4 border-b border-color hover:bg-bg-tertiary transition-colors cursor-pointer" onClick={() => handleCompleteAction(item.id)}>
                 <div className="flex items-start gap-3">
                   <div className="mt-1 w-5 h-5 rounded border-2 border-color flex-shrink-0 hover:border-brand-primary transition-colors"></div>
                   <div>
                     <div className="font-semibold text-sm mb-1">{item.text}</div>
                     <div className="text-xs text-secondary">{item.project}</div>
                   </div>
                 </div>
                 <span className={`pill ${item.status === 'overdue' ? 'danger' : 'warning'}`}>
                   {item.status.toUpperCase()}
                 </span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
