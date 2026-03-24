import { useState, useMemo } from 'react';
import { MoreVertical, Calendar, User, MapPin, Building2, Plus, Search, Trash2, Edit3 } from 'lucide-react';
import Modal from '../components/Modal';
import { showToast } from '../components/Toast';
import { getProjects, addProject, updateProject, deleteProject } from '../data/dataStore';
import type { Project } from '../data/dataStore';
import './Projects.css';

const PROJECT_TYPES = ['Residential', 'Renovation', 'New Build', 'Extension', 'Commercial', 'Other'];
const STATUSES: Project['status'][] = ['On Schedule', 'Delayed', 'Review', 'Completed'];

export default function Projects() {
  const [projects, setProjects] = useState(getProjects);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState({ name: '', client: '', location: '', budget: '', deadline: '', type: 'Residential', teamSize: '', status: 'On Schedule' as Project['status'], progress: '' });

  const refresh = () => setProjects(getProjects());

  const filtered = useMemo(() => {
    if (!search.trim()) return projects;
    const q = search.toLowerCase();
    return projects.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.client.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q) ||
      p.type.toLowerCase().includes(q)
    );
  }, [projects, search]);

  const openCreate = () => {
    setEditingProject(null);
    setForm({ name: '', client: '', location: '', budget: '', deadline: '', type: 'Residential', teamSize: '', status: 'On Schedule', progress: '' });
    setIsModalOpen(true);
  };

  const openEdit = (p: Project) => {
    setEditingProject(p);
    setForm({
      name: p.name, client: p.client, location: p.location,
      budget: String(p.budget), deadline: p.deadline, type: p.type,
      teamSize: String(p.teamSize), status: p.status, progress: String(p.progress)
    });
    setDropdownOpen(null);
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    if (!form.name.trim() || !form.client.trim()) {
      showToast('Project name and client are required.', 'error');
      return;
    }
    if (editingProject) {
      updateProject(editingProject.id, {
        name: form.name, client: form.client, location: form.location,
        budget: Number(form.budget) || 0, deadline: form.deadline, type: form.type,
        teamSize: Number(form.teamSize) || 1, status: form.status,
        progress: Math.min(100, Math.max(0, Number(form.progress) || 0)),
      });
      showToast(`"${form.name}" updated successfully.`);
    } else {
      addProject({
        name: form.name, client: form.client, location: form.location,
        budget: Number(form.budget) || 0, deadline: form.deadline, type: form.type,
        teamSize: Number(form.teamSize) || 1, status: form.status,
        progress: Math.min(100, Math.max(0, Number(form.progress) || 0)),
      });
      showToast(`"${form.name}" created successfully.`);
    }
    setIsModalOpen(false);
    refresh();
  };

  const handleDelete = (p: Project) => {
    setDropdownOpen(null);
    if (confirm(`Delete "${p.name}"? This cannot be undone.`)) {
      deleteProject(p.id);
      showToast(`"${p.name}" deleted.`, 'info');
      refresh();
    }
  };

  const formatBudget = (b: number) => {
    if (b >= 1_000_000) return `$${(b / 1_000_000).toFixed(1)}M`;
    if (b >= 1_000) return `$${(b / 1_000).toFixed(0)}K`;
    return `$${b}`;
  };

  return (
    <div className="projects-wrapper animate-fade-in">
      
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <div>
          <h2 className="text-secondary mb-2">Active Projects</h2>
          <div className="text-xl font-bold">{filtered.length} Project{filtered.length !== 1 ? 's' : ''} In Progress</div>
        </div>
        
        <div className="flex gap-4">
          <div className="search-box">
             <Search size={18} className="text-secondary" />
             <input type="text" placeholder="Filter projects..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button className="btn btn-primary" onClick={openCreate}>
            <Plus size={18} /> New Project
          </button>
        </div>
      </div>

      <div className="projects-grid">
        {filtered.map(project => (
          <div key={project.id} className="card project-card">
            
            <div className="flex justify-between items-start mb-4">
              <div className="project-icon-box">
                <Building2 size={24} className="text-brand" />
              </div>
              <div className="dropdown-wrapper">
                <button className="btn-icon bg-transparent border-none" onClick={() => setDropdownOpen(dropdownOpen === project.id ? null : project.id)}>
                  <MoreVertical size={18} />
                </button>
                {dropdownOpen === project.id && (
                  <div className="dropdown-menu animate-fade-in">
                    <button onClick={() => openEdit(project)}><Edit3 size={14} /> Edit</button>
                    <button className="text-danger" onClick={() => handleDelete(project)}><Trash2 size={14} /> Delete</button>
                  </div>
                )}
              </div>
            </div>

            <h3 className="project-title mb-1">{project.name}</h3>
            <div className="flex items-center gap-1 text-secondary text-sm mb-6">
              <User size={14} /> {project.client}
            </div>

            <div className="progress-section mb-6">
              <div className="flex justify-between items-end mb-2">
                <span className="font-semibold">{project.progress}% completed</span>
                <span className={`pill ${project.status === 'On Schedule' ? 'success' : project.status === 'Delayed' ? 'danger' : project.status === 'Completed' ? 'success' : 'warning'}`}>
                  {project.status}
                </span>
              </div>
              <div className="progress-bar-container">
                <div 
                  className="progress-bar-fill" 
                  style={{ 
                    width: `${project.progress}%`, 
                    backgroundColor: project.status === 'Delayed' ? 'var(--status-danger)' : 'var(--brand-primary)' 
                  }}
                ></div>
              </div>
            </div>

            <div className="project-meta">
              <div className="meta-item">
                <Calendar size={16} className="text-secondary" />
                <div className="meta-text">
                  <span className="meta-label">Deadline</span>
                  <span className="meta-value">{new Date(project.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>
              <div className="meta-item">
                <MapPin size={16} className="text-secondary" />
                <div className="meta-text">
                  <span className="meta-label">Location</span>
                  <span className="meta-value truncate">{project.location}</span>
                </div>
              </div>
            </div>

            <div className="divider my-4"></div>

            <div className="flex justify-between items-center">
              <div className="team-avatars">
                <img src={`https://i.pravatar.cc/150?u=${project.id}1`} alt="T" />
                <img src={`https://i.pravatar.cc/150?u=${project.id}2`} alt="T" />
                <img src={`https://i.pravatar.cc/150?u=${project.id}3`} alt="T" />
                {project.teamSize > 3 && (
                   <div className="avatar-more">+{project.teamSize - 3}</div>
                )}
              </div>
              <div className="font-bold">{formatBudget(project.budget)}</div>
            </div>

          </div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingProject ? 'Edit Project' : 'New Project'}>
        <div className="form-row">
          <div className="form-group">
            <label>Project Name *</label>
            <input type="text" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="e.g. Downtown Renovation" />
          </div>
          <div className="form-group">
            <label>Client *</label>
            <input type="text" value={form.client} onChange={e => setForm(f => ({...f, client: e.target.value}))} placeholder="Client name" />
          </div>
        </div>
        <div className="form-group">
          <label>Location</label>
          <input type="text" value={form.location} onChange={e => setForm(f => ({...f, location: e.target.value}))} placeholder="Address or site name" />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Budget ($)</label>
            <input type="number" value={form.budget} onChange={e => setForm(f => ({...f, budget: e.target.value}))} placeholder="e.g. 500000" />
          </div>
          <div className="form-group">
            <label>Deadline</label>
            <input type="date" value={form.deadline} onChange={e => setForm(f => ({...f, deadline: e.target.value}))} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Type</label>
            <select value={form.type} onChange={e => setForm(f => ({...f, type: e.target.value}))}>
              {PROJECT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Team Size</label>
            <input type="number" value={form.teamSize} onChange={e => setForm(f => ({...f, teamSize: e.target.value}))} placeholder="e.g. 8" />
          </div>
        </div>
        {editingProject && (
          <div className="form-row">
            <div className="form-group">
              <label>Status</label>
              <select value={form.status} onChange={e => setForm(f => ({...f, status: e.target.value as Project['status']}))}>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Progress (%)</label>
              <input type="number" min="0" max="100" value={form.progress} onChange={e => setForm(f => ({...f, progress: e.target.value}))} />
            </div>
          </div>
        )}
        <div className="form-actions">
          <button className="btn bg-bg-tertiary border border-color" onClick={() => setIsModalOpen(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit}>{editingProject ? 'Save Changes' : 'Create Project'}</button>
        </div>
      </Modal>

    </div>
  );
}
