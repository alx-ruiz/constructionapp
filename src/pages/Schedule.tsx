import { useState } from 'react';
import { Clock, MapPin, Bell, UserCheck, Smartphone, CheckCircle2, Plus } from 'lucide-react';
import Modal from '../components/Modal';
import { showToast } from '../components/Toast';
import { getSchedule, addScheduleItem, updateScheduleItem, getProjects, getNotifications } from '../data/dataStore';
import type { ScheduleItem } from '../data/dataStore';
import './Schedule.css';

export default function Schedule() {
  const [schedule, setSchedule] = useState(getSchedule);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ time: '', location: '', task: '', crew: '' });

  const projects = getProjects();
  const notifications = getNotifications().slice(0, 5);
  const refresh = () => setSchedule(getSchedule());

  const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const toggleStatus = (item: ScheduleItem) => {
    const nextStatus: Record<string, ScheduleItem['status']> = {
      'pending': 'in-progress',
      'in-progress': 'completed',
      'completed': 'pending',
    };
    updateScheduleItem(item.id, { status: nextStatus[item.status] });
    showToast(`"${item.task}" → ${nextStatus[item.status].replace('-', ' ')}`);
    refresh();
  };

  const handleSubmit = () => {
    if (!form.task.trim() || !form.time.trim()) {
      showToast('Task and time are required.', 'error');
      return;
    }
    // Convert 24h input to 12h display
    const [h, m] = form.time.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    const timeStr = `${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`;

    addScheduleItem({
      time: timeStr,
      location: form.location,
      task: form.task,
      crew: form.crew || 'TBD',
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
    });
    showToast(`"${form.task}" scheduled for ${timeStr}.`);
    setForm({ time: '', location: '', task: '', crew: '' });
    setIsModalOpen(false);
    refresh();
  };

  return (
    <div className="schedule-wrapper animate-fade-in">
      
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <div>
          <h2 className="text-secondary mb-2">Workforce Management</h2>
          <div className="text-xl font-bold">Who needs to be where today?</div>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> New Task
        </button>
      </div>

      <div className="schedule-layout">
        
        {/* Timeline (Left) */}
        <div className="timeline-section card list-card p-0">
          <div className="p-6 border-b border-color flex justify-between items-center">
            <h3 className="card-title flex items-center gap-2"><Clock size={20}/> Today's Timeline</h3>
            <span className="pill brand bg-brand-tertiary text-brand font-bold">{today}</span>
          </div>
          
          <div className="p-6">
            {schedule.length === 0 && (
              <div className="text-center text-secondary p-8">No tasks scheduled. Click "New Task" to add one.</div>
            )}
            <div className="timeline-container">
              {schedule.map((item) => (
                <div key={item.id} className="timeline-item" onClick={() => toggleStatus(item)} style={{ cursor: 'pointer' }}>
                  <div className="timeline-time">{item.time}</div>
                  <div className={`timeline-dot ${item.status}`}></div>
                  <div className="timeline-content card">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-[15px]">{item.task}</h4>
                      {item.status === 'completed' && <CheckCircle2 size={16} className="text-success" />}
                      {item.status === 'in-progress' && <span className="pill warning" style={{ fontSize: '10px', padding: '2px 8px' }}>In Progress</span>}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-secondary mt-3">
                      <div className="flex items-center gap-1"><MapPin size={14}/> {item.location}</div>
                      <div className="flex items-center gap-1"><UserCheck size={14}/> {item.crew}</div>
                    </div>
                    <div className="text-xs text-secondary mt-2 italic">Tap to change status</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Notifications (Right) */}
        <div className="notifications-section">
          
          <div className="card list-card p-6 automation-card">
             <div className="flex items-start gap-4 mb-6">
               <div className="icon-circle bg-brand-primary text-white shadow-brand">
                 <Smartphone size={24} />
               </div>
               <div>
                 <h3 className="card-title mb-1">Activity Feed</h3>
                 <p className="text-sm text-secondary">
                   Recent actions and updates from your construction projects.
                 </p>
               </div>
             </div>

             <div className="divider my-4"></div>

             <div className="feed-container">
               {notifications.length === 0 && (
                 <div className="text-center text-secondary p-4">No recent activity.</div>
               )}
               {notifications.map(note => (
                 <div key={note.id} className="feed-item">
                    <div className="feed-icon">
                      {note.type === 'success' ? <CheckCircle2 size={14} className="text-success" /> : <Bell size={14} className="text-brand" />}
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-1">{note.text}</div>
                      <div className="text-xs text-secondary">{note.time}</div>
                    </div>
                 </div>
               ))}
             </div>
          </div>
          
        </div>

      </div>

      {/* Add Task Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Schedule New Task">
        <div className="form-row">
          <div className="form-group">
            <label>Time *</label>
            <input type="time" value={form.time} onChange={e => setForm(f => ({...f, time: e.target.value}))} />
          </div>
          <div className="form-group">
            <label>Location / Project</label>
            <select value={form.location} onChange={e => setForm(f => ({...f, location: e.target.value}))}>
              <option value="">Select project...</option>
              {projects.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label>Task Description *</label>
          <input type="text" value={form.task} onChange={e => setForm(f => ({...f, task: e.target.value}))} placeholder="e.g. Foundation Framing" />
        </div>
        <div className="form-group">
          <label>Crew / Assigned To</label>
          <input type="text" value={form.crew} onChange={e => setForm(f => ({...f, crew: e.target.value}))} placeholder="e.g. Framing Team (5)" />
        </div>
        <div className="form-actions">
          <button className="btn bg-bg-tertiary border border-color" onClick={() => setIsModalOpen(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit}>Schedule Task</button>
        </div>
      </Modal>
    </div>
  );
}
