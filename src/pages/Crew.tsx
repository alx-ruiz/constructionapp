import { useState, useMemo } from 'react';
import { Users, Phone, Mail, MessageSquare, Star, ChevronDown, ChevronRight, Plus, Search, Trash2, Edit3, MoreVertical, DollarSign, StickyNote } from 'lucide-react';
import Modal from '../components/Modal';
import { showToast } from '../components/Toast';
import { getCrew, addCrewMember, updateCrewMember, deleteCrewMember, DEFAULT_TRADES, getCustomTrades, addCustomTrade } from '../data/dataStore';
import type { CrewMember } from '../data/dataStore';
import './Crew.css';

const STATUSES: CrewMember['status'][] = ['Available', 'On a Job', 'Unavailable'];

export default function Crew() {
  const [crew, setCrew] = useState(getCrew);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<CrewMember | null>(null);
  const [expandedTrades, setExpandedTrades] = useState<Set<string>>(new Set());
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [newTrade, setNewTrade] = useState('');
  const [showNewTrade, setShowNewTrade] = useState(false);

  const [form, setForm] = useState({
    name: '', trade: '', company: '', phone: '', email: '',
    rate: '', status: 'Available' as CrewMember['status'], notes: '', favorite: false,
  });

  const customTrades = getCustomTrades();
  const allTrades = [...DEFAULT_TRADES, ...customTrades];

  const refresh = () => setCrew(getCrew());

  // Filter by search
  const filtered = useMemo(() => {
    if (!search.trim()) return crew;
    const q = search.toLowerCase();
    return crew.filter(m =>
      m.name.toLowerCase().includes(q) ||
      m.trade.toLowerCase().includes(q) ||
      m.company.toLowerCase().includes(q) ||
      m.phone.includes(q) ||
      m.email.toLowerCase().includes(q)
    );
  }, [crew, search]);

  // Group by trade
  const grouped = useMemo(() => {
    const map = new Map<string, CrewMember[]>();
    filtered.forEach(m => {
      const list = map.get(m.trade) || [];
      list.push(m);
      map.set(m.trade, list);
    });
    // Sort: favorites first within each group
    map.forEach((members) => {
      members.sort((a, b) => (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0));
    });
    return map;
  }, [filtered]);

  // Stats
  const availableCount = crew.filter(c => c.status === 'Available').length;
  const onJobCount = crew.filter(c => c.status === 'On a Job').length;
  const tradeCount = new Set(crew.map(c => c.trade)).size;

  const toggleTrade = (trade: string) => {
    setExpandedTrades(prev => {
      const next = new Set(prev);
      next.has(trade) ? next.delete(trade) : next.add(trade);
      return next;
    });
  };

  const expandAll = () => setExpandedTrades(new Set(grouped.keys()));
  const collapseAll = () => setExpandedTrades(new Set());

  const openCreate = () => {
    setEditingMember(null);
    setForm({ name: '', trade: allTrades[0] || '', company: '', phone: '', email: '', rate: '', status: 'Available', notes: '', favorite: false });
    setIsModalOpen(true);
  };

  const openEdit = (m: CrewMember) => {
    setEditingMember(m);
    setForm({
      name: m.name, trade: m.trade, company: m.company, phone: m.phone,
      email: m.email, rate: m.rate, status: m.status, notes: m.notes, favorite: m.favorite,
    });
    setDropdownOpen(null);
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    if (!form.name.trim() || !form.trade.trim()) {
      showToast('Name and trade are required.', 'error');
      return;
    }
    if (editingMember) {
      updateCrewMember(editingMember.id, form);
      showToast(`"${form.name}" updated.`);
    } else {
      addCrewMember(form);
      showToast(`"${form.name}" added to ${form.trade}.`);
    }
    setIsModalOpen(false);
    refresh();
    // Auto-expand the trade
    setExpandedTrades(prev => new Set(prev).add(form.trade));
  };

  const handleDelete = (m: CrewMember) => {
    setDropdownOpen(null);
    if (confirm(`Remove "${m.name}" from your crew?`)) {
      deleteCrewMember(m.id);
      showToast(`"${m.name}" removed.`, 'info');
      refresh();
    }
  };

  const toggleFavorite = (m: CrewMember) => {
    updateCrewMember(m.id, { favorite: !m.favorite });
    refresh();
  };

  const handleAddCustomTrade = () => {
    if (!newTrade.trim()) return;
    if (allTrades.includes(newTrade.trim())) {
      showToast('That trade already exists.', 'error');
      return;
    }
    addCustomTrade(newTrade.trim());
    showToast(`Trade "${newTrade.trim()}" added!`);
    setNewTrade('');
    setShowNewTrade(false);
  };

  const statusColor = (s: CrewMember['status']) =>
    s === 'Available' ? 'success' : s === 'On a Job' ? 'warning' : 'danger';

  // Clean phone for tel: link
  const cleanPhone = (phone: string) => phone.replace(/[^0-9+]/g, '');

  return (
    <div className="crew-wrapper animate-fade-in">
      
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <div>
          <h2 className="text-secondary mb-2">Crew Directory</h2>
          <div className="text-xl font-bold">Your People, Organized by Trade</div>
        </div>
        <div className="flex gap-4">
          <div className="search-box">
            <Search size={18} className="text-secondary" />
            <input type="text" placeholder="Search crew..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button className="btn btn-primary" onClick={openCreate}>
            <Plus size={18} /> Add Contact
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="crew-stats-row mb-8">
        <div className="card crew-stat-card">
          <div className="stat-number">{crew.length}</div>
          <div className="stat-desc">Total Contacts</div>
        </div>
        <div className="card crew-stat-card">
          <div className="stat-number text-success">{availableCount}</div>
          <div className="stat-desc">Available</div>
        </div>
        <div className="card crew-stat-card">
          <div className="stat-number text-warning">{onJobCount}</div>
          <div className="stat-desc">On a Job</div>
        </div>
        <div className="card crew-stat-card">
          <div className="stat-number text-brand">{tradeCount}</div>
          <div className="stat-desc">Trade Categories</div>
        </div>
      </div>

      {/* Trade Actions */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <button className="btn-chip" onClick={expandAll}>Expand All</button>
        <button className="btn-chip" onClick={collapseAll}>Collapse All</button>
        <button className="btn-chip btn-chip-brand" onClick={() => setShowNewTrade(!showNewTrade)}>
          <Plus size={14} /> New Trade Category
        </button>
        {showNewTrade && (
          <div className="flex gap-2 items-center animate-fade-in">
            <input 
              type="text" 
              className="trade-input"
              placeholder="e.g. Tile Setting" 
              value={newTrade} 
              onChange={e => setNewTrade(e.target.value)} 
              onKeyDown={e => e.key === 'Enter' && handleAddCustomTrade()}
            />
            <button className="btn btn-primary py-2 px-4 text-sm" onClick={handleAddCustomTrade}>Add</button>
          </div>
        )}
      </div>

      {/* Accordion List */}
      <div className="crew-accordion">
        {grouped.size === 0 && (
          <div className="card p-8 text-center text-secondary">
            <Users size={40} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
            <div className="font-semibold mb-1">No crew members found</div>
            <div className="text-sm">Add your first contact to get started.</div>
          </div>
        )}

        {Array.from(grouped.entries()).map(([trade, members]) => {
          const isExpanded = expandedTrades.has(trade);
          const available = members.filter(m => m.status === 'Available').length;
          return (
            <div key={trade} className="trade-group card p-0 mb-4 overflow-hidden">
              {/* Trade Header */}
              <button className="trade-header" onClick={() => toggleTrade(trade)}>
                <div className="flex items-center gap-3">
                  {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                  <span className="trade-name">{trade}</span>
                  <span className="pill bg-bg-tertiary text-text-secondary">{members.length} contact{members.length !== 1 ? 's' : ''}</span>
                  {available > 0 && <span className="pill success">{available} available</span>}
                </div>
              </button>

              {/* Members */}
              {isExpanded && (
                <div className="trade-members animate-fade-in">
                  {members.map(member => (
                    <div key={member.id} className="crew-card">
                      <div className="crew-card-top">
                        <div className="crew-avatar">
                          <img src={`https://i.pravatar.cc/150?u=${member.id}`} alt={member.name} />
                          <span className={`status-dot ${statusColor(member.status)}`}></span>
                        </div>
                        <div className="crew-info">
                          <div className="flex items-center gap-2">
                            <h4 className="crew-name">{member.name}</h4>
                            {member.favorite && <Star size={14} className="text-warning" fill="currentColor" />}
                          </div>
                          <div className="crew-company">{member.company}</div>
                          <div className="crew-meta-row">
                            <span className={`pill ${statusColor(member.status)}`}>{member.status}</span>
                            <span className="crew-rate"><DollarSign size={12} />{member.rate}</span>
                          </div>
                        </div>

                        <div className="crew-actions">
                          <a href={`tel:${cleanPhone(member.phone)}`} className="action-circle call" title="Call">
                            <Phone size={16} />
                          </a>
                          <a href={`sms:${cleanPhone(member.phone)}`} className="action-circle text" title="Text">
                            <MessageSquare size={16} />
                          </a>
                          <a href={`mailto:${member.email}`} className="action-circle email" title="Email">
                            <Mail size={16} />
                          </a>
                          <div className="dropdown-wrapper">
                            <button className="action-circle more" onClick={() => setDropdownOpen(dropdownOpen === member.id ? null : member.id)}>
                              <MoreVertical size={16} />
                            </button>
                            {dropdownOpen === member.id && (
                              <div className="dropdown-menu animate-fade-in">
                                <button onClick={() => toggleFavorite(member)}>
                                  <Star size={14} /> {member.favorite ? 'Unfavorite' : 'Favorite'}
                                </button>
                                <button onClick={() => openEdit(member)}>
                                  <Edit3 size={14} /> Edit
                                </button>
                                <button className="text-danger" onClick={() => handleDelete(member)}>
                                  <Trash2 size={14} /> Remove
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Contact Details Row */}
                      <div className="crew-details">
                        <a href={`tel:${cleanPhone(member.phone)}`} className="detail-link">
                          <Phone size={13} /> {member.phone}
                        </a>
                        <a href={`mailto:${member.email}`} className="detail-link">
                          <Mail size={13} /> {member.email}
                        </a>
                      </div>

                      {member.notes && (
                        <div className="crew-notes">
                          <StickyNote size={13} className="text-secondary" />
                          <span>{member.notes}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingMember ? 'Edit Contact' : 'Add Crew Member'}>
        <div className="form-row">
          <div className="form-group">
            <label>Full Name *</label>
            <input type="text" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="e.g. Marco Rivera" />
          </div>
          <div className="form-group">
            <label>Trade *</label>
            <select value={form.trade} onChange={e => setForm(f => ({...f, trade: e.target.value}))}>
              {allTrades.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label>Company / Business Name</label>
          <input type="text" value={form.company} onChange={e => setForm(f => ({...f, company: e.target.value}))} placeholder="e.g. Rivera Framing Co." />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Phone Number</label>
            <input type="tel" value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} placeholder="(512) 555-0142" />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} placeholder="marco@email.com" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Rate / Price</label>
            <input type="text" value={form.rate} onChange={e => setForm(f => ({...f, rate: e.target.value}))} placeholder="e.g. $45/hr or $3,500/job" />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select value={form.status} onChange={e => setForm(f => ({...f, status: e.target.value as CrewMember['status']}))}>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label>Notes</label>
          <textarea value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))} placeholder="Anything worth remembering..." rows={2} />
        </div>
        <div className="form-actions">
          <button className="btn bg-bg-tertiary border border-color" onClick={() => setIsModalOpen(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit}>{editingMember ? 'Save Changes' : 'Add to Crew'}</button>
        </div>
      </Modal>
    </div>
  );
}
