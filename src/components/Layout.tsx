import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Navigation from './Navigation';
import Header from './Header';

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="app-container">
      <Navigation />
      <main className="main-content">
        <Header />
        <div className="page-wrapper animate-fade-in" key={location.pathname}>
          {children}
        </div>
      </main>
    </div>
  );
}
