'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardWidgets from '../components/DashboardWidgets';
import BottomNavigation from '../components/BottomNavigation';

export default function Dashboard() {
  const [userRole, setUserRole] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState(3);
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const role = localStorage.getItem('userRole');
    
    if (!isLoggedIn) {
      router.push('/');
      return;
    }
    
    setUserRole(role);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    router.push('/');
  };

  if (!userRole) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <header className="dashboard-header">
        <div className="header-content">
          <div>
            <h1 className="header-title">Welcome, {userRole}!</h1>
            <p className="header-subtitle">Groundwater Monitoring Dashboard</p>
          </div>

          <div className="header-controls">
            <input
              type="text"
              placeholder="Search stations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />

            <button className="notification-button">
              🔔
              {notifications > 0 && (
                <span className="notification-badge">
                  {notifications}
                </span>
              )}
            </button>

            <button
              onClick={handleLogout}
              className="logout-button"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <DashboardWidgets searchQuery={searchQuery} />
      </main>

      <BottomNavigation />
    </div>
  );
}
