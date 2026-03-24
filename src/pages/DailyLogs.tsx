import { useState, useRef } from 'react';
import { CloudSun, Users, CheckSquare, AlertTriangle, Plus, Camera, Send } from 'lucide-react';
import { showToast } from '../components/Toast';
import { getDailyLogs, addDailyLog } from '../data/dataStore';
import './DailyLogs.css';

export default function DailyLogs() {
  const [logs, setLogs] = useState(getDailyLogs);
  const [visibleCount, setVisibleCount] = useState(5);
  const formRef = useRef<HTMLDivElement>(null);

  // Form state
  const [weather, setWeather] = useState('');
  const [crew, setCrew] = useState('');
  const [notes, setNotes] = useState('');
  const [issues, setIssues] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);

  const refresh = () => setLogs(getDailyLogs());

  const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const handlePhotoUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (!files) return;
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPhotos(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    };
    input.click();
  };

  const handleSubmit = () => {
    if (!notes.trim()) {
      showToast('Please describe what work was completed.', 'error');
      return;
    }
    const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
    addDailyLog({
      date: dateStr,
      weather: weather || 'Not recorded',
      crew: crew || 'Not recorded',
      notes,
      issues: issues || 'None',
      photos,
    });
    showToast('Daily log submitted successfully!');
    setWeather('');
    setCrew('');
    setNotes('');
    setIssues('');
    setPhotos([]);
    refresh();
  };

  const visibleLogs = logs.slice(0, visibleCount);

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
        <div className="card log-entry-card shadow-lg shadow-brand/10" ref={formRef}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="card-title">Today's Entry</h3>
            <span className="pill brand bg-brand-tertiary text-brand font-bold">{today}</span>
          </div>

          <div className="log-grid mb-6">
             <div className="log-input-group">
                <label><CloudSun size={16} /> Site Conditions</label>
                <input type="text" placeholder="e.g. Sunny, 72°F, Dry" value={weather} onChange={e => setWeather(e.target.value)} />
             </div>
             <div className="log-input-group">
                <label><Users size={16} /> Crew On-Site</label>
                <input type="text" placeholder="e.g. 3 Carpenters, 2 Electricians" value={crew} onChange={e => setCrew(e.target.value)} />
             </div>
          </div>

          <div className="log-input-group mb-6">
            <label><CheckSquare size={16} /> Work Completed *</label>
            <textarea placeholder="What got done today?" rows={3} value={notes} onChange={e => setNotes(e.target.value)}></textarea>
          </div>

          <div className="log-input-group mb-6">
            <label className="text-danger"><AlertTriangle size={16} /> Issues or Delays (Optional)</label>
            <textarea placeholder="Report any roadblocks..." rows={2} value={issues} onChange={e => setIssues(e.target.value)}></textarea>
          </div>

          {photos.length > 0 && (
            <div className="photo-preview-grid mb-6">
              {photos.map((src, i) => (
                <div key={i} className="photo-thumb">
                  <img src={src} alt={`Photo ${i + 1}`} />
                  <button className="photo-remove" onClick={() => setPhotos(p => p.filter((_, j) => j !== i))}>×</button>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between items-center mt-4">
            <button className="btn-icon bg-bg-tertiary border-dashed border-2 px-4 hover:border-brand-primary" onClick={handlePhotoUpload}>
              <Camera size={18} /> Add Photos {photos.length > 0 && `(${photos.length})`}
            </button>
            <button className="btn btn-primary" onClick={handleSubmit}>
              <Send size={16} /> Submit Log
            </button>
          </div>
        </div>

        {/* Previous Logs */}
        <div className="previous-logs">
          <h3 className="card-title mb-6">Recent Reports ({logs.length})</h3>
          
          <div className="log-feed">
             {logs.length === 0 && (
               <div className="card p-8 text-center text-secondary">No logs yet. Submit today's entry to get started!</div>
             )}
             {visibleLogs.map(log => (
               <div key={log.id} className="card p-0 mb-4 overflow-hidden border-l-4" style={{borderLeftColor: log.issues !== 'None' && log.issues ? 'var(--status-danger)' : 'var(--status-success)'}}>
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
                   {log.issues && log.issues !== 'None' && (
                     <div className="flex items-start gap-3">
                       <AlertTriangle size={16} className="text-danger shrink-0 mt-1" />
                       <div className="text-sm text-danger">{log.issues}</div>
                     </div>
                   )}
                   {log.photos && log.photos.length > 0 && (
                     <div className="photo-preview-grid mt-3">
                       {log.photos.map((src, i) => (
                         <div key={i} className="photo-thumb">
                           <img src={src} alt={`Photo ${i + 1}`} />
                         </div>
                       ))}
                     </div>
                   )}
                 </div>
               </div>
             ))}
             {logs.length > visibleCount && (
               <button className="btn bg-bg-secondary w-full border border-color" onClick={() => setVisibleCount(v => v + 5)}>
                 View Older Logs ({logs.length - visibleCount} more)
               </button>
             )}
          </div>
        </div>

      </div>

      {/* Floating Action Button for Mobile Quick Entry */}
      <div className="fab desktop-hide">
         <button className="fab-btn" onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth' })}>
           <Plus size={24} />
         </button>
      </div>
    </div>
  );
}
