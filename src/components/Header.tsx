import { Bell, Search, Sparkles } from 'lucide-react';
import './Header.css';

export default function Header() {
  return (
    <header className="main-header">
      <div className="header-greeting desktop-hide">
        <h2 className="greeting-text">Good morning, Alx</h2>
        <p className="greeting-sub">Let's check on your projects</p>
      </div>

      <div className="header-search mobile-hide">
        <div className="search-bar">
          <Search size={20} className="search-icon" />
          <input type="text" placeholder="Search projects, tasks, or personnel..." />
          <span className="search-shortcut">⌘K</span>
        </div>
      </div>

        <div className="header-actions">
          <button className="btn-icon mobile-hide">
            <Bell size={18} />
          </button>
          
          <button className="btn btn-primary try-ai-btn" onClick={() => window.dispatchEvent(new Event('toggle-ai-chat'))}>
            <Sparkles size={16} />
            <span className="mobile-hide">Try AI</span>
            <span className="desktop-hide">AI</span>
          </button>
        </div>
    </header>
  );
}
