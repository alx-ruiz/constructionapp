import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Budget from './pages/Budget';
import Schedule from './pages/Schedule';
import DailyLogs from './pages/DailyLogs';
import ClientPortal from './pages/ClientPortal';

function App() {
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
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
