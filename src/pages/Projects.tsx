import { MoreVertical, Calendar, User, MapPin, Building2, Plus, Search } from 'lucide-react';
import './Projects.css';

const MOCK_PROJECTS = [
  {
    id: 1,
    name: 'Modern Townhouse Dev',
    client: 'Alx Builder Corp',
    location: '124 Azure Way, Austin TX',
    progress: 78,
    status: 'On Schedule',
    deadline: 'Oct 12, 2026',
    budget: '$1.2M',
    type: 'Residential',
    teamSize: 12
  },
  {
    id: 2,
    name: 'Downtown Loft Renovation',
    client: 'Sarah Jenkins',
    location: '881 5th Ave, Austin TX',
    progress: 45,
    status: 'Delayed',
    deadline: 'Nov 30, 2026',
    budget: '$450K',
    type: 'Renovation',
    teamSize: 5
  },
  {
    id: 3,
    name: 'Lakeside Cabins (Phase 1)',
    client: 'Blue Water LLC',
    location: 'Lake Travis',
    progress: 92,
    status: 'Review',
    deadline: 'Sep 05, 2026',
    budget: '$2.1M',
    type: 'New Build',
    teamSize: 18
  },
  {
    id: 4,
    name: 'Suburban Extension',
    client: 'The Millers',
    location: '44 Oak Street, Round Rock TX',
    progress: 15,
    status: 'On Schedule',
    deadline: 'Jan 15, 2027',
    budget: '$180K',
    type: 'Extension',
    teamSize: 4
  }
];

export default function Projects() {
  return (
    <div className="projects-wrapper animate-fade-in">
      
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <div>
          <h2 className="text-secondary mb-2">Active Projects</h2>
          <div className="text-xl font-bold">4 Projects In Progress</div>
        </div>
        
        <div className="flex gap-4">
          <div className="search-box">
             <Search size={18} className="text-secondary" />
             <input type="text" placeholder="Filter projects..." />
          </div>
          <button className="btn btn-primary">
            <Plus size={18} /> New Project
          </button>
        </div>
      </div>

      <div className="projects-grid">
        {MOCK_PROJECTS.map(project => (
          <div key={project.id} className="card project-card">
            
            <div className="flex justify-between items-start mb-4">
              <div className="project-icon-box">
                <Building2 size={24} className="text-brand" />
              </div>
              <button className="btn-icon bg-transparent border-none">
                <MoreVertical size={18} />
              </button>
            </div>

            <h3 className="project-title mb-1">{project.name}</h3>
            <div className="flex items-center gap-1 text-secondary text-sm mb-6">
              <User size={14} /> {project.client}
            </div>

            <div className="progress-section mb-6">
              <div className="flex justify-between items-end mb-2">
                <span className="font-semibold">{project.progress}% completed</span>
                <span className={`pill ${project.status === 'On Schedule' ? 'success' : project.status === 'Delayed' ? 'danger' : 'warning'}`}>
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
                  <span className="meta-value">{project.deadline}</span>
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
                {/* Simulated team avatars overlap */}
                <img src={`https://i.pravatar.cc/150?u=${project.id}1`} alt="T" />
                <img src={`https://i.pravatar.cc/150?u=${project.id}2`} alt="T" />
                <img src={`https://i.pravatar.cc/150?u=${project.id}3`} alt="T" />
                {project.teamSize > 3 && (
                   <div className="avatar-more">+{project.teamSize - 3}</div>
                )}
              </div>
              <div className="font-bold">{project.budget}</div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
