import { Clock, MapPin, Bell, UserCheck, Smartphone, CheckCircle2 } from 'lucide-react';
import './Schedule.css';

const SCHEDULE = [
  { time: '07:00 AM', location: 'Modern Townhouse Dev', task: 'Site Opens & Safety Briefing', crew: 'All Crews', status: 'completed' },
  { time: '08:00 AM', location: 'Modern Townhouse Dev', task: 'Foundation Framing', crew: 'Framing Team (5)', status: 'in-progress' },
  { time: '10:30 AM', location: 'Lakeside Cabins', task: 'Electrical Rough-in', crew: 'Sparky Bros (2)', status: 'pending' },
  { time: '01:00 PM', location: 'Downtown Loft', task: 'Drywall Delivery', crew: 'Material Vendor', status: 'pending' },
];

const NOTIFICATIONS = [
  { id: 1, text: 'Sent schedule reminder to Sparky Bros for Lakeside Cabins.', time: '06:00 AM', type: 'auto' },
  { id: 2, text: 'Framing Team confirmed arrival at Modern Townhouse Dev.', time: '06:45 AM', type: 'response' },
  { id: 3, text: 'Alerted Material Vendor of gate access code for Downtown Loft.', time: '07:12 AM', type: 'auto' },
];

export default function Schedule() {
  return (
    <div className="schedule-wrapper animate-fade-in">
      
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <div>
          <h2 className="text-secondary mb-2">Workforce Management</h2>
          <div className="text-xl font-bold">Who needs to be where today?</div>
        </div>
      </div>

      <div className="schedule-layout">
        
        {/* Timeline (Left) */}
        <div className="timeline-section card list-card p-0">
          <div className="p-6 border-b border-color flex justify-between items-center">
            <h3 className="card-title flex items-center gap-2"><Clock size={20}/> Today's Timeline</h3>
            <span className="pill brand bg-brand-tertiary text-brand font-bold">Oct 12</span>
          </div>
          
          <div className="p-6">
            <div className="timeline-container">
              {SCHEDULE.map((item, index) => (
                <div key={index} className="timeline-item">
                  <div className="timeline-time">{item.time}</div>
                  <div className={`timeline-dot ${item.status}`}></div>
                  <div className="timeline-content card">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-[15px]">{item.task}</h4>
                      {item.status === 'completed' && <CheckCircle2 size={16} className="text-success" />}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-secondary mt-3">
                      <div className="flex items-center gap-1"><MapPin size={14}/> {item.location}</div>
                      <div className="flex items-center gap-1"><UserCheck size={14}/> {item.crew}</div>
                    </div>
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
                 <h3 className="card-title mb-1">Automatic Sub Notifications</h3>
                 <p className="text-sm text-secondary">
                   BuildCommand automatically texted your subcontractors last night and this morning.
                 </p>
               </div>
             </div>

             <div className="divider my-4"></div>

             <div className="feed-container">
               {NOTIFICATIONS.map(note => (
                 <div key={note.id} className="feed-item">
                    <div className="feed-icon">
                      {note.type === 'auto' ? <Bell size={14} className="text-brand" /> : <CheckCircle2 size={14} className="text-success" />}
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-1">{note.text}</div>
                      <div className="text-xs text-secondary">{note.time} • Automated SMS</div>
                    </div>
                 </div>
               ))}
             </div>
          </div>
          
        </div>

      </div>
    </div>
  );
}
