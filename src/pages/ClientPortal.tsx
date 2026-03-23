import { Camera, CheckCircle2, CircleDashed, FileText, MessageSquare, AlertCircle } from 'lucide-react';
import './ClientPortal.css';

const PENDING_APPROVALS = [
  { id: 1, type: 'Change Order', title: 'Upgrade Kitchen Cabinets to Solid Oak', amount: '+$3,250.00', date: 'Requested Oct 11' },
  { id: 2, type: 'Selection', title: 'Confirm Master Bath Tile Color', amount: 'No cost impact', date: 'Requested Oct 10' },
];

const PHOTO_UPDATE = [
  { id: 1, date: 'Oct 10, 2026', title: 'Foundation Completed', img: 'https://placehold.co/400x300/F8F9FA/FF6A3D?text=Foundation+Completed' },
  { id: 2, date: 'Oct 05, 2026', title: 'Site Clearing', img: 'https://placehold.co/400x300/F8F9FA/FF6A3D?text=Site+Clearing' },
];

export default function ClientPortal() {
  return (
    <div className="client-wrapper animate-fade-in">
      
      <div className="client-header card shadow-sm mb-8">
        <div className="flex justify-between items-center mb-6">
           <div>
             <h2 className="text-secondary mb-1">Welcome back, Sarah!</h2>
             <div className="text-2xl font-bold">Lakeside Cabins (Phase 1)</div>
           </div>
           <button className="btn btn-primary"><MessageSquare size={18} /> Message Builder</button>
        </div>
        
        <div className="progress-section">
          <div className="flex justify-between items-end mb-2">
            <span className="font-semibold">Project Progress: 92%</span>
            <span className="text-sm text-secondary">Est. Completion: Nov 15</span>
          </div>
          <div className="progress-bar-container h-3">
            <div className="progress-bar-fill bg-success" style={{ width: '92%' }}></div>
          </div>
        </div>
      </div>

      <div className="client-layout">
        
        {/* Left Col: Photo Timeline */}
        <div className="timeline-col">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
             <Camera className="text-brand" size={24} /> Photo Updates
          </h3>
          
          <div className="photo-feed">
             {PHOTO_UPDATE.map(photo => (
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
             {PENDING_APPROVALS.map(item => (
               <div key={item.id} className="card border-l-4 border-l-brand action-card">
                 <div className="flex flex-wrap gap-2 justify-between items-start mb-2">
                    <span className="pill bg-brand-tertiary text-brand shrink-0">{item.type}</span>
                    <span className="text-xs text-secondary shrink-0">{item.date}</span>
                 </div>
                 <div className="font-bold mb-1 text-[15px]">{item.title}</div>
                 <div className="text-sm text-secondary mb-4">{item.amount}</div>
                 
                 <div className="flex gap-2">
                    <button className="btn btn-primary flex-1 py-2 text-sm">Approve</button>
                    <button className="btn bg-bg-tertiary flex-1 py-2 text-sm border border-color hover:border-text-primary">Decline</button>
                 </div>
               </div>
             ))}
          </div>

          <div className="card mt-6 bg-bg-secondary border border-color">
            <h4 className="font-bold mb-4 flex items-center gap-2"><FileText size={18} /> Recent Documents</h4>
            <ul className="flex flex-col gap-3 text-sm">
              <li className="flex justify-between items-center cursor-pointer hover:text-brand-primary transition-colors">
                 <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-success" /> Signed Contract.pdf</div>
              </li>
              <li className="flex justify-between items-center cursor-pointer hover:text-brand-primary transition-colors">
                 <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-success" /> Floorplan_v2.pdf</div>
              </li>
              <li className="flex justify-between items-center text-secondary">
                 <div className="flex items-center gap-2"><CircleDashed size={16} /> Final Invoice (Pending)</div>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
