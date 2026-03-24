import { ArrowUpRight, Calendar, CheckCircle2 } from 'lucide-react';
import './Dashboard.css';

export default function Dashboard() {
  return (
    <div className="dashboard-wrapper animate-fade-in">
      
      {/* Top Row: Workforce Stats & Hero */}
      <div className="dashboard-top-row">
        
        {/* Workforce Overview Card */}
        <div className="card workforce-card relative">
          <div className="flex justify-between items-center mb-6">
            <h3 className="card-title">Workforce Details</h3>
            <button className="btn-icon"><ArrowUpRight size={18} /></button>
          </div>
          
          <div className="stat-group">
            <div className="flex justify-between items-end mb-2">
              <span className="stat-label">On-site Crew</span>
              <span className="pill success">↗ 7.3%</span>
            </div>
            <div className="stat-value">96.5 %</div>
            <div className="progress-bar-container mt-2">
              <div className="progress-bar-fill" style={{ width: '96.5%', backgroundColor: 'var(--brand-primary)' }}></div>
            </div>
          </div>
          
          <div className="divider my-5"></div>

          <div className="stat-group">
            <div className="flex justify-between items-end mb-2">
              <span className="stat-label">Subcontractors</span>
              <span className="pill danger">↘ 2.1%</span>
            </div>
            <div className="stat-value">64 %</div>
            <div className="progress-bar-container mt-2">
              <div className="progress-bar-fill" style={{ width: '64%', backgroundColor: '#FF3D71' }}></div>
            </div>
          </div>

          <div className="divider my-5"></div>

          <div className="stat-group">
            <div className="flex justify-between items-end mb-2">
              <span className="stat-label">Material Delivery</span>
              <span className="pill success">↗ 12%</span>
            </div>
            <div className="stat-value">45 %</div>
            <div className="progress-bar-container mt-2">
              <div className="progress-bar-fill" style={{ width: '45%', backgroundColor: 'var(--status-success)' }}></div>
            </div>
          </div>
        </div>

        {/* Hero Illustration */}
        <div className="hero-card">
          <img src="/hero-bg.png" alt="Construction Site" className="hero-image" />
          <div className="hero-pill">
            <Calendar size={16} className="text-brand" />
            <span>Time Estimate: 14 Days</span>
          </div>
        </div>
      </div>

      {/* Bottom Row: Budget & Project Indicators */}
      <div className="dashboard-bottom-row mt-6">
        
        {/* Budget Chart container */}
        <div className="card budget-card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="card-title">Live Budget Tracking</h3>
            <select className="select-dropdown">
              <option>Monthly</option>
              <option>Yearly</option>
            </select>
          </div>
          
          <div className="flex items-end gap-4 mb-8">
            <div className="stat-value text-gradient" style={{ fontSize: '32px' }}>76.3 %</div>
            <span className="pill success mb-2">↗ 7.3% vs Estimate</span>
          </div>

          <div className="chart-placeholder">
            {/* Simple CSS-based bar chart mockup */}
            {[50, 70, 40, 90, 60, 100, 80, 50, 70, 90, 60, 40].map((h, i) => (
              <div key={i} className={`chart-bar ${i === 6 ? 'active' : ''}`} style={{ height: `${h}%` }}>
                {i === 6 && (
                  <div className="chart-tooltip">
                    <span className="dot"></span> Jul: $56.3k
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="chart-labels">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
            <span className="active-label">Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
          </div>
        </div>

        {/* Project Indicators Gauge */}
        <div className="card indicators-card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="card-title">Project Health</h3>
            <button className="btn-icon">•••</button>
          </div>

            <div className="relative h-32 w-full mt-4 flex items-center justify-center">
              <svg viewBox="0 0 100 55" className="w-full h-full overflow-visible drop-shadow-xl">
                 <defs>
                   <linearGradient id="healthGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                     <stop offset="0%" stopColor="#ef4444" /> {/* Red */}
                     <stop offset="30%" stopColor="#f59e0b" /> {/* Amber */}
                     <stop offset="70%" stopColor="#10b981" /> {/* Emerald */}
                     <stop offset="100%" stopColor="#3b82f6" /> {/* Blue */}
                   </linearGradient>
                   <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                     <feGaussianBlur stdDeviation="3" result="blur" />
                     <feComposite in="SourceGraphic" in2="blur" operator="over" />
                   </filter>
                 </defs>
                 
                 {/* Background Track */}
                 <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="var(--bg-tertiary)" strokeWidth="8" strokeLinecap="round" />
                 
                 {/* Gradient Foreground (Length ~125.6, 96.5% filled = 4.4 offset) */}
                 <path 
                   d="M 10 50 A 40 40 0 0 1 90 50" 
                   fill="none" 
                   stroke="url(#healthGrad)" 
                   strokeWidth="8" 
                   strokeLinecap="round" 
                   strokeDasharray="125.6" 
                   strokeDashoffset="4.4" 
                   filter="url(#glow)"
                   className="gauge-progress animate-pulse-slow"
                 />
                 
                 {/* Dial Markings */}
                 <path d="M 10 50 L 14 50" stroke="var(--text-secondary)" strokeWidth="1.5" strokeLinecap="round" />
                 <path d="M 50 10 L 50 14" stroke="var(--text-secondary)" strokeWidth="1.5" strokeLinecap="round" />
                 <path d="M 90 50 L 86 50" stroke="var(--text-secondary)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <div className="absolute bottom-4 flex flex-col items-center">
                <span className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-blue-500" style={{ backgroundImage: 'linear-gradient(to right, #10b981, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>96.5%</span>
                <span className="text-[10px] text-secondary font-bold uppercase tracking-wider mt-1">Average Status</span>
              </div>
            </div>

          <div className="indicator-list mt-8">
            <div className="indicator-item">
              <div className="flex items-center gap-2"><span className="dot" style={{background: 'var(--brand-primary)'}}></span> Framing</div>
              <span className="font-semibold">Complete</span>
            </div>
            <div className="indicator-item">
               <div className="flex items-center gap-2"><span className="dot" style={{background: '#FF3D71'}}></span> Electrical</div>
               <span className="font-semibold text-danger">Delayed</span>
            </div>
            <div className="indicator-item">
               <div className="flex items-center gap-2"><span className="dot" style={{background: 'var(--text-secondary)'}}></span> Plumbing</div>
               <span className="font-semibold">In Progress</span>
            </div>
          </div>
        </div>
      </div>

      {/* Third Row: Action Items (from Research updates) */}
      <div className="dashboard-action-row mt-6">
        <div className="card list-card p-0">
          <div className="p-6 border-b border-color flex flex-wrap gap-4 justify-between items-center">
            <h3 className="card-title text-danger flex items-center gap-2 shrink-0">
              <CheckCircle2 size={20} /> Outstanding Action Items
            </h3>
            <span className="pill danger shrink-0">3 Overdue</span>
          </div>
          <div className="p-2">
            {[
              { id: 1, text: 'Renew building permit for Downtown Loft', project: 'Downtown Loft', status: 'overdue' },
              { id: 2, text: 'Approve Change Order #4', project: 'Modern Townhouse Dev', status: 'overdue' },
              { id: 3, text: 'Schedule final plumbing inspection', project: 'Lakeside Cabins', status: 'today' },
            ].map(item => (
              <div key={item.id} className="flex justify-between items-center p-4 border-b border-color hover:bg-bg-tertiary transition-colors cursor-pointer">
                 <div className="flex items-start gap-3">
                   <div className="mt-1 w-5 h-5 rounded border-2 border-color flex-shrink-0"></div>
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
