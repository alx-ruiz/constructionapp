import { useState } from 'react';
import { Camera, CheckCircle2, CircleDashed, FileText, MessageSquare, AlertCircle, Send, X } from 'lucide-react';
import Modal from '../components/Modal';
import { showToast } from '../components/Toast';
import { getApprovals, updateApproval, getProjects, getDailyLogs } from '../data/dataStore';
import './ClientPortal.css';

export default function ClientPortal() {
  const [approvals, setApprovals] = useState(getApprovals);
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [docModalOpen, setDocModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState('');
  const [message, setMessage] = useState('');

  const projects = getProjects();
  const logs = getDailyLogs();
  const pendingApprovals = approvals.filter(a => a.status === 'pending');

  // Pick first project with highest progress for the portal display
  const featuredProject = projects.length > 0 
    ? projects.reduce((best, p) => p.progress > best.progress ? p : best, projects[0]) 
    : null;

  const refresh = () => setApprovals(getApprovals());

  const handleApprove = (id: string) => {
    updateApproval(id, 'approved');
    showToast('Approved successfully!');
    refresh();
  };

  const handleDecline = (id: string) => {
    updateApproval(id, 'declined');
    showToast('Declined.', 'info');
    refresh();
  };

  const handleSendMessage = () => {
    if (!message.trim()) {
      showToast('Please type a message.', 'error');
      return;
    }
    showToast('Message sent to builder!');
    setMessage('');
    setMessageModalOpen(false);
  };

  const openDocPreview = (name: string) => {
    setSelectedDoc(name);
    setDocModalOpen(true);
  };

  // Use photos from daily logs for the photo timeline
  const photoUpdates = logs
    .filter(l => l.photos && l.photos.length > 0)
    .slice(0, 4)
    .map((l, i) => ({ id: l.id, date: l.date, title: `Site Update - ${l.date}`, img: l.photos[0] }));

  // Fallback placeholder photos if no log photos exist
  const displayPhotos = photoUpdates.length > 0 ? photoUpdates : [
    { id: 'ph1', date: 'Oct 10, 2026', title: 'Foundation Completed', img: 'https://placehold.co/400x300/F8F9FA/FF6A3D?text=Foundation+Completed' },
    { id: 'ph2', date: 'Oct 05, 2026', title: 'Site Clearing', img: 'https://placehold.co/400x300/F8F9FA/FF6A3D?text=Site+Clearing' },
  ];

  return (
    <div className="client-wrapper animate-fade-in">
      
      <div className="client-header card shadow-sm mb-8">
        <div className="flex justify-between items-center mb-6">
           <div>
             <h2 className="text-secondary mb-1">Welcome back!</h2>
             <div className="text-2xl font-bold">{featuredProject?.name || 'No Active Projects'}</div>
           </div>
           <button className="btn btn-primary" onClick={() => setMessageModalOpen(true)}>
             <MessageSquare size={18} /> Message Builder
           </button>
        </div>
        
        {featuredProject && (
          <div className="progress-section">
            <div className="flex justify-between items-end mb-2">
              <span className="font-semibold">Project Progress: {featuredProject.progress}%</span>
              <span className="text-sm text-secondary">Deadline: {new Date(featuredProject.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </div>
            <div className="progress-bar-container h-3">
              <div className="progress-bar-fill bg-success" style={{ width: `${featuredProject.progress}%` }}></div>
            </div>
          </div>
        )}
      </div>

      <div className="client-layout">
        
        {/* Left Col: Photo Timeline */}
        <div className="timeline-col">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
             <Camera className="text-brand" size={24} /> Photo Updates
          </h3>
          
          <div className="photo-feed">
             {displayPhotos.map(photo => (
               <div key={photo.id} className="card p-0 overflow-hidden mb-6">
                 <img src={photo.img} alt={photo.title} className="w-full h-48 object-cover" />
                 <div className="p-4 flex justify-between items-center">
                    <div className="font-bold">{photo.title}</div>
                    <div className="text-sm text-secondary">{photo.date}</div>
                 </div>
               </div>
             ))}
          </div>
        </div>

        {/* Right Col: Action Required */}
        <div className="action-col">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-danger">
             <AlertCircle size={24} /> Action Required
          </h3>

          <div className="flex flex-col gap-4">
             {pendingApprovals.length === 0 && (
               <div className="card p-6 text-center text-secondary">
                 <CheckCircle2 size={32} className="text-success mx-auto mb-2" />
                 <div className="font-semibold">All caught up!</div>
                 <div className="text-sm">No pending approvals.</div>
               </div>
             )}
             {pendingApprovals.map(item => (
               <div key={item.id} className="card border-l-4 border-l-brand action-card">
                 <div className="flex flex-wrap gap-2 justify-between items-start mb-2">
                    <span className="pill bg-brand-tertiary text-brand shrink-0">{item.type}</span>
                    <span className="text-xs text-secondary shrink-0">{item.date}</span>
                 </div>
                 <div className="font-bold mb-1 text-[15px]">{item.title}</div>
                 <div className="text-sm text-secondary mb-4">{item.amount}</div>
                 
                 <div className="flex gap-2">
                    <button className="btn btn-primary flex-1 py-2 text-sm" onClick={() => handleApprove(item.id)}>Approve</button>
                    <button className="btn bg-bg-tertiary flex-1 py-2 text-sm border border-color hover:border-text-primary" onClick={() => handleDecline(item.id)}>Decline</button>
                 </div>
               </div>
             ))}
          </div>

          <div className="card mt-6 bg-bg-secondary border border-color">
            <h4 className="font-bold mb-4 flex items-center gap-2"><FileText size={18} /> Recent Documents</h4>
            <ul className="flex flex-col gap-3 text-sm">
              <li className="flex justify-between items-center cursor-pointer hover:text-brand-primary transition-colors" onClick={() => openDocPreview('Signed Contract.pdf')}>
                 <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-success" /> Signed Contract.pdf</div>
              </li>
              <li className="flex justify-between items-center cursor-pointer hover:text-brand-primary transition-colors" onClick={() => openDocPreview('Floorplan_v2.pdf')}>
                 <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-success" /> Floorplan_v2.pdf</div>
              </li>
              <li className="flex justify-between items-center text-secondary cursor-pointer hover:text-brand-primary transition-colors" onClick={() => openDocPreview('Final Invoice (Pending)')}>
                 <div className="flex items-center gap-2"><CircleDashed size={16} /> Final Invoice (Pending)</div>
              </li>
            </ul>
          </div>
        </div>

      </div>

      {/* Message Builder Modal */}
      <Modal isOpen={messageModalOpen} onClose={() => setMessageModalOpen(false)} title="Message Your Builder" size="sm">
        <div className="form-group">
          <label>Your Message</label>
          <textarea 
            value={message} 
            onChange={e => setMessage(e.target.value)} 
            placeholder="Type your question or update here..." 
            rows={4}
            style={{ padding: '12px 14px', borderRadius: '12px', border: '1.5px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', fontFamily: 'inherit', fontSize: '14px' }}
          />
        </div>
        <div className="form-actions">
          <button className="btn bg-bg-tertiary border border-color" onClick={() => setMessageModalOpen(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSendMessage}><Send size={16} /> Send</button>
        </div>
      </Modal>

      {/* Document Preview Modal */}
      <Modal isOpen={docModalOpen} onClose={() => setDocModalOpen(false)} title={selectedDoc} size="sm">
        <div className="text-center p-8">
          <FileText size={48} className="text-secondary mx-auto mb-4" style={{ margin: '0 auto 16px' }} />
          <div className="font-semibold mb-2">{selectedDoc}</div>
          <div className="text-sm text-secondary mb-4">This is a preview placeholder. In production, the actual document would be rendered here.</div>
          <button className="btn btn-primary" onClick={() => setDocModalOpen(false)}>Close</button>
        </div>
      </Modal>
    </div>
  );
}
