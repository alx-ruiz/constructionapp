import { useState } from 'react';
import { Plus, TrendingDown, Receipt, Camera, X, Trash2 } from 'lucide-react';
import Modal from '../components/Modal';
import { showToast } from '../components/Toast';
import { getExpenses, addExpense, deleteExpense, getProjects, formatCurrency } from '../data/dataStore';
import type { Expense } from '../data/dataStore';
import './Budget.css';

const EXPENSE_TYPES: Expense['type'][] = ['Material', 'Labor', 'Admin', 'Equipment', 'Other'];

export default function Budget() {
  const [expenses, setExpenses] = useState(getExpenses);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);

  // Form state
  const [form, setForm] = useState({ title: '', projectId: '', amount: '', type: 'Material' as Expense['type'] });

  const projects = getProjects();
  const refresh = () => setExpenses(getExpenses());

  // Compute live totals
  const totalBudget = projects.reduce((s, p) => s + p.budget, 0);
  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
  const remaining = totalBudget - totalSpent;
  const percentSpent = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  const visibleExpenses = showAll ? expenses : expenses.slice(0, 6);

  const formatDate = (d: string) => {
    const date = new Date(d);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffDays === 0) return `Today, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    if (diffDays === 1) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleSubmit = () => {
    if (!form.title.trim() || !form.amount) {
      showToast('Title and amount are required.', 'error');
      return;
    }
    const project = projects.find(p => p.id === form.projectId);
    addExpense({
      title: form.title,
      projectId: form.projectId,
      projectName: project?.name || 'General',
      amount: Number(form.amount),
      date: new Date().toISOString(),
      type: form.type,
    });
    showToast(`Expense of $${Number(form.amount).toFixed(2)} logged.`);
    setForm({ title: '', projectId: '', amount: '', type: 'Material' });
    setIsModalOpen(false);
    refresh();
  };

  const handleDelete = (exp: typeof expenses[0]) => {
    if (confirm(`Delete "${exp.title}"?`)) {
      deleteExpense(exp.id);
      showToast('Expense deleted.', 'info');
      refresh();
    }
  };

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
          <div className="text-4xl font-bold mb-2">{formatCurrency(totalBudget)}</div>
          <div className="pill bg-white/20 text-white w-fit">
            Across {projects.length} Project{projects.length !== 1 ? 's' : ''}
          </div>
        </div>

        <div className="card overview-card">
          <div className="flex justify-between items-start mb-6">
             <div className="meta-label">Total Spent</div>
             <TrendingDown size={24} className="text-danger" />
          </div>
          <div className="text-4xl font-bold mb-2">{formatCurrency(totalSpent)}</div>
          <div className={`pill ${percentSpent <= 50 ? 'success' : percentSpent <= 80 ? 'warning' : 'danger'} w-fit`}>
            {percentSpent <= 50 ? '↓' : '↑'} {percentSpent}% of Budget
          </div>
        </div>

        <div className="card overview-card">
          <div className="flex justify-between items-start mb-6">
             <div className="meta-label">Remaining to Complete</div>
          </div>
          <div className="text-4xl font-bold mb-2 text-brand">{formatCurrency(Math.max(0, remaining))}</div>
          <div className="progress-bar-container mt-4">
            <div className="progress-bar-fill" style={{ width: `${percentSpent}%`, backgroundColor: 'var(--brand-primary)' }}></div>
          </div>
          <div className="flex justify-between text-sm text-secondary mt-2">
            <span>{percentSpent}% Spent</span>
            <span>100%</span>
          </div>
        </div>

      </div>

      <div className="card list-card p-0">
        <div className="p-6 border-b border-color flex justify-between items-center">
           <h3 className="card-title">Recent Transactions</h3>
           <button className="btn-icon bg-bg-tertiary" onClick={() => setShowAll(!showAll)}>
             {showAll ? 'Show Less' : `View All (${expenses.length})`}
           </button>
        </div>

        <div className="transaction-list">
          {visibleExpenses.length === 0 && (
            <div className="p-8 text-center text-secondary">No expenses logged yet. Click "Log Expense" to add one.</div>
          )}
          {visibleExpenses.map(exp => (
            <div key={exp.id} className="transaction-item">
               <div className="flex items-center gap-4">
                 <div className="icon-circle bg-bg-secondary">
                   <Receipt size={20} className="text-secondary" />
                 </div>
                 <div>
                   <div className="font-semibold mb-1">{exp.title}</div>
                   <div className="text-sm text-secondary flex items-center gap-2">
                     <span className="truncate max-w-[150px] inline-block">{exp.projectName}</span> • <span>{formatDate(exp.date)}</span>
                   </div>
                 </div>
               </div>
               
               <div className="text-right flex items-center gap-4">
                  <div className="mobile-hide">
                    <span className="pill bg-bg-tertiary text-text-secondary font-medium">{exp.type}</span>
                  </div>
                  <div className="font-bold text-[16px]">${exp.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                  <button className="btn-icon bg-transparent border-none text-secondary hover:text-danger" onClick={() => handleDelete(exp)}>
                    <Trash2 size={16} />
                  </button>
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

      {/* Expense Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log Expense">
        <div className="form-group">
          <label>Expense Title *</label>
          <input type="text" value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} placeholder="e.g. Lumber Supply - Home Depot" />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Amount ($) *</label>
            <input type="number" step="0.01" value={form.amount} onChange={e => setForm(f => ({...f, amount: e.target.value}))} placeholder="0.00" />
          </div>
          <div className="form-group">
            <label>Type</label>
            <select value={form.type} onChange={e => setForm(f => ({...f, type: e.target.value as Expense['type']}))}>
              {EXPENSE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label>Project</label>
          <select value={form.projectId} onChange={e => setForm(f => ({...f, projectId: e.target.value}))}>
            <option value="">General / No Project</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div className="form-actions">
          <button className="btn bg-bg-tertiary border border-color" onClick={() => setIsModalOpen(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit}>Save Expense</button>
        </div>
      </Modal>

    </div>
  );
}
