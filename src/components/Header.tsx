import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, Sparkles } from 'lucide-react';
import { getCompanyName, getProjects, getNotifications, markAllNotificationsRead } from '../data/dataStore';
import './Header.css';

export default function Header() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{name: string; path: string}[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(getNotifications);
  const searchRef = useRef<HTMLDivElement>(null);
  const notiRef = useRef<HTMLDivElement>(null);

  const companyName = getCompanyName();
  const ownerName = companyName.split(' ')[0] || 'Builder';

  // Dynamic greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSearch(false);
      if (notiRef.current && !notiRef.current.contains(e.target as Node)) setShowNotifications(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Keyboard shortcut ⌘K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(true);
        setTimeout(() => {
          const input = searchRef.current?.querySelector('input');
          input?.focus();
        }, 50);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    const q = query.toLowerCase();
    const projects = getProjects();
    const results: {name: string; path: string}[] = [];

    projects.forEach(p => {
      if (p.name.toLowerCase().includes(q) || p.client.toLowerCase().includes(q)) {
        results.push({ name: `📁 ${p.name}`, path: '/projects' });
      }
    });

    // Page search
    const pages = [
      { name: 'Dashboard', path: '/' },
      { name: 'Projects', path: '/projects' },
      { name: 'Budget & Expenses', path: '/budget' },
      { name: 'Schedule', path: '/schedule' },
      { name: 'Daily Logs', path: '/logs' },
      { name: 'Client Portal', path: '/client' },
      { name: 'Settings', path: '/settings' },
    ];
    pages.forEach(p => {
      if (p.name.toLowerCase().includes(q)) {
        results.push({ name: `📄 ${p.name}`, path: p.path });
      }
    });

    setSearchResults(results.slice(0, 8));
  };

  const navigateTo = (path: string) => {
    navigate(path);
    setShowSearch(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleOpenNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      setNotifications(getNotifications());
    }
  };

  const handleMarkAllRead = () => {
    markAllNotificationsRead();
    setNotifications(getNotifications());
  };

  return (
    <header className="main-header">
      <div className="header-greeting desktop-hide">
        <h2 className="greeting-text">{greeting}, {ownerName}</h2>
        <p className="greeting-sub">Let's check on your projects</p>
      </div>

      <div className="header-search mobile-hide" ref={searchRef}>
        <div className="search-bar" onClick={() => setShowSearch(true)}>
          <Search size={20} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search projects, tasks, or personnel..." 
            value={searchQuery}
            onChange={e => { handleSearch(e.target.value); setShowSearch(true); }}
            onFocus={() => setShowSearch(true)}
          />
          <span className="search-shortcut">⌘K</span>
        </div>
        {showSearch && searchResults.length > 0 && (
          <div className="search-dropdown animate-fade-in">
            {searchResults.map((r, i) => (
              <button key={i} className="search-result-item" onClick={() => navigateTo(r.path)}>
                {r.name}
              </button>
            ))}
          </div>
        )}
      </div>

        <div className="header-actions">
          <div className="noti-wrapper" ref={notiRef}>
            <button className="btn-icon mobile-hide noti-btn" onClick={handleOpenNotifications}>
              <Bell size={18} />
              {unreadCount > 0 && <span className="noti-badge">{unreadCount}</span>}
            </button>
            {showNotifications && (
              <div className="noti-dropdown animate-fade-in">
                <div className="noti-dropdown-header">
                  <span className="font-bold">Notifications</span>
                  {unreadCount > 0 && (
                    <button className="text-brand text-sm" style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', color: 'var(--brand-primary)' }} onClick={handleMarkAllRead}>Mark all read</button>
                  )}
                </div>
                <div className="noti-list">
                  {notifications.length === 0 && (
                    <div className="p-4 text-center text-secondary text-sm">No notifications</div>
                  )}
                  {notifications.slice(0, 10).map(n => (
                    <div key={n.id} className={`noti-item ${n.read ? 'read' : ''}`}>
                      <div className={`noti-dot ${n.type}`}></div>
                      <div>
                        <div className="text-sm">{n.text}</div>
                        <div className="text-xs text-secondary mt-1">{n.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <button className="btn btn-primary try-ai-btn" onClick={() => window.dispatchEvent(new Event('toggle-ai-chat'))}>
            <Sparkles size={16} />
            <span className="mobile-hide">Try AI</span>
            <span className="desktop-hide">AI</span>
          </button>
        </div>
    </header>
  );
}
