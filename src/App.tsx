import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/next';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Budget from './pages/Budget';
import Schedule from './pages/Schedule';
import DailyLogs from './pages/DailyLogs';
import ClientPortal from './pages/ClientPortal';
import Settings from './pages/Settings';
import AIChat from './components/AIChat';

function App() {
  useEffect(() => {
    // Initialize user preferences on app boot
    const savedTheme = localStorage.getItem('app-theme') || 'light';
    const savedColor = localStorage.getItem('app-brand-color') || '#FF6A3D';
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.documentElement.style.setProperty('--brand-primary', savedColor);
  }, []);

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/logs" element={<DailyLogs />} />
          <Route path="/client" element={<ClientPortal />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
        <AIChat />
        <Analytics />
      </Layout>
    </BrowserRouter>
  );
}

export default App;
