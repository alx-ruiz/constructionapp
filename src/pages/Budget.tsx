import { useState } from 'react';
import { Plus, TrendingDown, Receipt, Camera, X } from 'lucide-react';
import './Budget.css';

const EXPENSES = [
  { id: 1, title: 'Lumber Supply - Home Depot', project: 'Modern Townhouse Dev', amount: '$4,250.00', date: 'Today, 10:30 AM', type: 'Material' },
  { id: 2, title: 'Permit Renewal Fee', project: 'Downtown Loft', amount: '$350.00', date: 'Yesterday', type: 'Admin' },
  { id: 3, title: 'Electrical Subcontractor Draw', project: 'Lakeside Cabins', amount: '$12,000.00', date: 'Oct 02, 2026', type: 'Labor' },
  { id: 4, title: 'Concrete Pouring - Foundation', project: 'Suburban Extension', amount: '$3,800.00', date: 'Oct 01, 2026', type: 'Material' },
];

export default function Budget() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="budget-wrapper animate-fade-in">
      
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <div>
          <h2 className="text-secondary mb-2">Company Financials</h2>
          <div className="text-xl font-bold">Am I on budget?</div>
        </div>
        
        <button className="btn btn-primary shadow-lg shadow-brand/30" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Log Expense
        </button>
      </div>

      <div className="budget-overview-grid mb-8">
        
        <div className="card overview-card bg-gradient-brand text-white">
          <div className="flex justify-between items-start mb-6">
             <div className="meta-label text-white/80">Total Budget (Active)</div>
             <Receipt size={24} className="text-white/60" />
          </div>
          <div className="text-4xl font-bold mb-2">$3.93M</div>
          <div className="pill bg-white/20 text-white w-fit">
            Across 4 Projects
          </div>
        </div>

        <div className="card overview-card">
          <div className="flex justify-between items-start mb-6">
             <div className="meta-label">Total Spent</div>
             <TrendingDown size={24} className="text-danger" />
          </div>
          <div className="text-4xl font-bold mb-2">$1.85M</div>
          <div className="pill success w-fit">
            ↓ 4.2% Under Estimate
          </div>
        </div>

        <div className="card overview-card">
          <div className="flex justify-between items-start mb-6">
             <div className="meta-label">Remaining to Complete</div>
          </div>
          <div className="text-4xl font-bold mb-2 text-brand">$2.08M</div>
          <div className="progress-bar-container mt-4">
            <div className="progress-bar-fill" style={{ width: '47%', backgroundColor: 'var(--brand-primary)' }}></div>
          </div>
          <div className="flex justify-between text-sm text-secondary mt-2">
            <span>47% Spent</span>
            <span>100%</span>
          </div>
        </div>

      </div>

      <div className="card list-card p-0">
        <div className="p-6 border-b border-color flex justify-between items-center">
           <h3 className="card-title">Recent Transactions</h3>
           <button className="btn-icon bg-bg-tertiary">View All</button>
        </div>

        <div className="transaction-list">
          {EXPENSES.map(exp => (
            <div key={exp.id} className="transaction-item">
               <div className="flex items-center gap-4">
                 <div className="icon-circle bg-bg-secondary">
                   <Receipt size={20} className="text-secondary" />
                 </div>
                 <div>
                   <div className="font-semibold mb-1">{exp.title}</div>
                   <div className="text-sm text-secondary flex items-center gap-2">
                     <span className="truncate max-w-[150px] inline-block">{exp.project}</span> • <span>{exp.date}</span>
                   </div>
                 </div>
               </div>
               
               <div className="text-right flex items-center gap-6">
                  <div className="mobile-hide">
                    <span className="pill bg-bg-tertiary text-text-secondary font-medium">{exp.type}</span>
                  </div>
                  <div className="font-bold text-[16px]">{exp.amount}</div>
               </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Action Button for Mobile */}
      <div className="fab desktop-hide">
         <button className="fab-btn" onClick={() => setIsModalOpen(true)}>
           <Camera size={24} />
         </button>
      </div>

      {/* Expense Capture Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
           <div className="modal-content card animate-fade-in" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="card-title">Quick Scanner</h3>
                <button className="btn-icon bg-transparent border-none" onClick={() => setIsModalOpen(false)}>
                  <X size={20} />
                </button>
              </div>
              <div className="camera-viewfinder border-dashed border-2 border-brand mb-6 flex flex-col items-center justify-center p-8 bg-brand-tertiary rounded-2xl cursor-pointer hover:bg-brand/20 transition-colors">
                 <Camera size={48} className="text-brand mb-4" />
                 <span className="font-bold text-brand mb-1">Tap to Scan Receipt</span>
                 <span className="text-sm text-brand/70 text-center">AI runs OCR to auto-extract amount, vendor, and project matching.</span>
              </div>
              <div className="log-input-group mb-6">
                 <label>Manual Entry Alternative</label>
                 <input type="text" placeholder="$0.00" className="text-2xl font-bold" />
              </div>
              <button className="btn btn-primary w-full justify-center" onClick={() => setIsModalOpen(false)}>Save Expense</button>
           </div>
        </div>
      )}

    </div>
  );
}
