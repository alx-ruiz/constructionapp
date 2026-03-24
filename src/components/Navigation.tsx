import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, FolderKanban, Wallet, CalendarRange, Settings, ClipboardList, Users, HardHat, ArrowLeftToLine, ArrowRightToLine } from 'lucide-react';
import './Navigation.css';

export default function Navigation() {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Projects', path: '/projects', icon: FolderKanban },
    { name: 'Budget', path: '/budget', icon: Wallet },
    { name: 'Schedule', path: '/schedule', icon: CalendarRange },
    { name: 'Logs', path: '/logs', icon: ClipboardList },
    { name: 'Client View', path: '/client', icon: Users },
    { name: 'Crew', path: '/crew', icon: HardHat },
    { name: 'Settings', path: '/settings', icon: Settings, desktopOnly: true },
  ];

  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('sidebar-collapsed') === 'true';
  });

  useEffect(() => {
    if (isCollapsed) {
      document.body.classList.add('sidebar-collapsed');
    } else {
      document.body.classList.remove('sidebar-collapsed');
    }
  }, [isCollapsed]);

  const toggleSidebar = () => {
    setIsCollapsed(prev => {
      const newVal = !prev;
      localStorage.setItem('sidebar-collapsed', String(newVal));
      return newVal;
    });
  };

  return (
    <nav className="main-nav">
      <div className="nav-brand desktop-hide-brand">
        {!isCollapsed && (
          <div className="brand-logo shrink-0">
            <div className="brand-icon shrink-0">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="brand-text">BuildCommand</span>
          </div>
        )}
        <button className="btn-icon collapse-btn border-none hover:bg-bg-tertiary" onClick={toggleSidebar}>
          {isCollapsed ? <ArrowRightToLine size={18} /> : <ArrowLeftToLine size={18} />}
        </button>
      </div>
      
      <ul className="nav-list">
        {navItems.map((item) => {
          if (item.desktopOnly) {
            return (
              <li key={item.name} className="nav-item mobile-hide">
                <NavLink to={item.path} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  <item.icon className="nav-icon" size={24} />
                  <span className="nav-label">{item.name}</span>
                </NavLink>
              </li>
            );
          }
          return (
            <li key={item.name} className="nav-item">
              <NavLink to={item.path} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <item.icon className="nav-icon" size={24} />
                <span className="nav-label">{item.name}</span>
              </NavLink>
            </li>
          );
        })}
      </ul>
      
      <div className="nav-footer mobile-hide">
        <div className="user-profile-mini">
          <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User Avatar" className="avatar" />
          <div className="user-info">
            <span className="user-name">Alx Builder</span>
            <span className="user-role">Owner</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
