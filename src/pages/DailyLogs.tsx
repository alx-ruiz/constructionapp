import { CloudSun, Users, CheckSquare, AlertTriangle, Plus, Camera, Send } from 'lucide-react';
import './DailyLogs.css';

const PREVIOUS_LOGS = [
  { id: 1, date: 'Yesterday, Oct 11', weather: 'Partly Cloudy, 68°F', crew: '6 Workers (Framing, General)', notes: 'Completed 2nd floor joists. Waiting on inspection for plumbing rough-in.', issues: 'None' },
  { id: 2, date: 'Oct 10', weather: 'Sunny, 75°F', crew: '4 Workers (Concrete)', notes: 'Foundation poured and setting. No issues on site.', issues: 'Late cement truck' },
];

export default function DailyLogs() {
  return (
    <div className="logs-wrapper animate-fade-in">
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <div>
          <h2 className="text-secondary mb-2">Field Operations</h2>
          <div className="text-xl font-bold">Daily Logs</div>
        </div>
      </div>

      <div className="logs-layout">
        
        {/* Today's Entry Form */}
        <div className="card log-entry-card shadow-lg shadow-brand/10">
          <div className="flex justify-between items-center mb-6">
            <h3 className="card-title">Today's Entry</h3>
            <span className="pill brand bg-brand-tertiary text-brand font-bold">Oct 12</span>
          </div>

          <div className="log-grid mb-6">
             <div className="log-input-group">
                <label><CloudSun size={16} /> Site Conditions</label>
                <input type="text" placeholder="e.g. Sunny, 72°F, Dry" defaultValue="Sunny, 72°F" />
             </div>
             <div className="log-input-group">
                <label><Users size={16} /> Crew On-Site</label>
                <input type="text" placeholder="e.g. 3 Carpenters, 2 Electricians" />
             </div>
          </div>

          <div className="log-input-group mb-6">
            <label><CheckSquare size={16} /> Work Completed</label>
            <textarea placeholder="What got done today?" rows={3}></textarea>
          </div>

          <div className="log-input-group mb-6">
            <label className="text-danger"><AlertTriangle size={16} /> Issues or Delays (Optional)</label>
            <textarea placeholder="Report any roadblocks..." rows={2}></textarea>
          </div>

          <div className="flex justify-between items-center mt-4">
            <button className="btn-icon bg-bg-tertiary border-dashed border-2 px-4 hover:border-brand-primary">
              <Camera size={18} /> Add Photos
            </button>
            <button className="btn btn-primary">
              <Send size={16} /> Submit Log
            </button>
          </div>
        </div>

        {/* Previous Logs */}
        <div className="previous-logs">
          <h3 className="card-title mb-6">Recent Reports</h3>
          
          <div className="log-feed">
             {PREVIOUS_LOGS.map(log => (
               <div key={log.id} className="card p-0 mb-4 overflow-hidden border-l-4" style={{borderLeftColor: 'var(--status-success)'}}>
                 <div className="p-4 bg-bg-tertiary border-b border-color flex flex-wrap gap-2 justify-between items-center">
                   <div className="font-bold shrink-0">{log.date}</div>
                   <div className="text-sm text-secondary flex items-center gap-2 shrink-0"><CloudSun size={14} /> {log.weather}</div>
                 </div>
                 <div className="p-4">
                   <div className="flex items-start gap-3 mb-3">
                     <Users size={16} className="text-secondary shrink-0 mt-1" />
                     <div className="text-sm font-medium">{log.crew}</div>
                   </div>
                   <div className="flex items-start gap-3 mb-3">
                     <CheckSquare size={16} className="text-brand shrink-0 mt-1" />
                     <div className="text-sm">{log.notes}</div>
                   </div>
                   {log.issues !== 'None' && (
                     <div className="flex items-start gap-3">
                       <AlertTriangle size={16} className="text-danger shrink-0 mt-1" />
                       <div className="text-sm text-danger">{log.issues}</div>
                     </div>
                   )}
                 </div>
               </div>
             ))}
             <button className="btn bg-bg-secondary w-full border border-color">View Older Logs</button>
          </div>
        </div>

      </div>

      {/* Floating Action Button for Mobile Quick Entry */}
      <div className="fab desktop-hide">
         <button className="fab-btn">
           <Plus size={24} />
         </button>
      </div>
    </div>
  );
}
