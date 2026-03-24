import { useState, useEffect } from 'react';
import { UploadCloud, Sun, Moon, Palette, Check } from 'lucide-react';
import './Settings.css';

const THEMES = [
  { id: 'light', label: 'Light Mode', icon: Sun },
  { id: 'dark', label: 'Dark Mode', icon: Moon },
];

const BRAND_COLORS = [
  { id: 'orange', value: '#FF6A3D', label: 'Coral Orange' },
  { id: 'blue', value: '#3B82F6', label: 'Ocean Blue' },
  { id: 'emerald', value: '#10B981', label: 'Emerald Green' },
  { id: 'purple', value: '#8B5CF6', label: 'Amethyst' },
  { id: 'slate', value: '#64748B', label: 'Slate Gray' },
];

export default function Settings() {
  const [theme, setTheme] = useState(() => localStorage.getItem('app-theme') || 'light');
  const [brandColor, setBrandColor] = useState(() => localStorage.getItem('app-brand-color') || '#FF6A3D');
  
  // Apply theme to DOM
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  // Apply brand color to CSS Variables
  useEffect(() => {
    document.documentElement.style.setProperty('--brand-primary', brandColor);
    localStorage.setItem('app-brand-color', brandColor);
  }, [brandColor]);

  return (
    <div className="settings-wrapper animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-secondary mb-2">Personalization</h2>
          <div className="text-xl font-bold">App Settings</div>
        </div>
      </div>

      <div className="settings-layout">
        
        {/* Company Profile Card */}
        <div className="card">
          <h3 className="card-title mb-6">Company Profile</h3>
          <div className="flex flex-col gap-6">
            <div className="log-input-group">
               <label>Company Name</label>
               <input type="text" defaultValue="Alx Residential Builders" />
            </div>
            
            <div className="log-input-group">
               <label>Company Logo</label>
               <div className="upload-zone flex flex-col items-center justify-center p-8 border-2 border-dashed border-color rounded-2xl bg-bg-tertiary cursor-pointer hover:border-brand-primary transition-colors">
                  <UploadCloud size={32} className="text-secondary mb-2" />
                  <span className="font-semibold text-sm">Click or drag logo here</span>
                  <span className="text-xs text-secondary mt-1">SVG, PNG, JPG (max. 2MB)</span>
               </div>
            </div>
            
            <button className="btn btn-primary w-full justify-center">Save Profile Details</button>
          </div>
        </div>

        {/* Theme & Appearance Card */}
        <div className="card">
          <h3 className="card-title mb-6">Appearance</h3>
          
          <div className="mb-8">
             <label className="text-xs font-bold uppercase tracking-wide text-secondary mb-3 inline-block">App Theme</label>
             <div className="theme-toggle-group flex gap-4">
                {THEMES.map(t => (
                  <button 
                    key={t.id} 
                    className={`theme-btn flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${theme === t.id ? 'border-brand-primary bg-brand-tertiary' : 'border-color bg-bg-tertiary'}`}
                    onClick={() => setTheme(t.id)}
                  >
                    <t.icon size={24} className={theme === t.id ? 'text-brand-primary' : 'text-secondary'} />
                    <span className="font-semibold text-sm">{t.label}</span>
                  </button>
                ))}
             </div>
          </div>

          <div>
             <label className="text-xs font-bold uppercase tracking-wide text-secondary mb-3 flex items-center gap-2">
               <Palette size={14} /> Brand Color Theme
             </label>
             <div className="flex flex-wrap gap-4">
                {BRAND_COLORS.map(color => (
                  <button 
                    key={color.id}
                    onClick={() => setBrandColor(color.value)}
                    className="color-swatch-btn rounded-full flex items-center justify-center transition-transform hover:scale-110"
                    style={{ backgroundColor: color.value, width: '48px', height: '48px', boxShadow: brandColor === color.value ? `0 0 0 3px var(--bg-primary), 0 0 0 6px ${color.value}` : 'none' }}
                  >
                    {brandColor === color.value && <Check strokeWidth={3} className="text-white" size={20} />}
                  </button>
                ))}
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
