'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [preferences, setPreferences] = useState({
    notifications: true,
    emailAlerts: true,
    criticalAlerts: true,
    theme: 'light',
    language: 'english'
  });
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Get user data from localStorage
    const userRole = localStorage.getItem('userRole');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (!isLoggedIn) {
      router.push('/');
      return;
    }

    // Mock user data based on role
    const mockUserData = {
      researcher: {
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@research.org',
        role: 'Senior Researcher',
        organization: 'National Water Research Institute',
        phone: '+1 (555) 123-4567',
        joinDate: '2023-03-15',
        specialization: 'Groundwater Hydrology',
        avatar: '👩‍🔬'
      },
      admin: {
        name: 'Admin User',
        email: 'admin@watermonitoring.gov',
        role: 'System Administrator',
        organization: 'Water Resources Department',
        phone: '+1 (555) 987-6543',
        joinDate: '2022-01-10',
        specialization: 'System Management',
        avatar: '👨‍💼'
      },
      viewer: {
        name: 'Viewer Account',
        email: 'viewer@example.com',
        role: 'Data Viewer',
        organization: 'Public Access',
        phone: '+1 (555) 456-7890',
        joinDate: '2024-02-20',
        specialization: 'Data Analysis',
        avatar: '👤'
      }
    };

    setUser(mockUserData[userRole] || mockUserData.viewer);
  }, [router]);

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSavePreferences = () => {
    // Save preferences to localStorage
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
    setIsEditing(false);
    alert('Preferences saved successfully!');
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    router.push('/');
  };

  if (!user) {
    return <div className="profile-container">Loading...</div>;
  }

  return (
    <div className="profile-container">
      <Link href="/dashboard" className="back-link">
        ← Back to Dashboard
      </Link>

      <div className="profile-header">
        <div className="profile-avatar">
          <span className="avatar-icon">{user.avatar}</span>
        </div>
        <div className="profile-info">
          <h1>{user.name}</h1>
          <p className="profile-role">{user.role}</p>
          <p className="profile-organization">{user.organization}</p>
        </div>
      </div>

      <div className="profile-content">
        {/* Personal Information */}
        <div className="profile-section">
          <h2>Personal Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Full Name</label>
              <p>{user.name}</p>
            </div>
            <div className="info-item">
              <label>Email Address</label>
              <p>{user.email}</p>
            </div>
            <div className="info-item">
              <label>Phone Number</label>
              <p>{user.phone}</p>
            </div>
            <div className="info-item">
              <label>Role</label>
              <p>{user.role}</p>
            </div>
            <div className="info-item">
              <label>Organization</label>
              <p>{user.organization}</p>
            </div>
            <div className="info-item">
              <label>Specialization</label>
              <p>{user.specialization}</p>
            </div>
            <div className="info-item">
              <label>Member Since</label>
              <p>{new Date(user.joinDate).toLocaleDateString()}</p>
            </div>
            <div className="info-item">
              <label>User ID</label>
              <p>USR-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
            </div>
          </div>
        </div>

        {/* Preferences & Settings */}
        <div className="profile-section">
          <div className="section-header">
            <h2>Preferences & Settings</h2>
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="edit-btn"
            >
              {isEditing ? 'Cancel' : 'Edit Preferences'}
            </button>
          </div>

          <div className="preferences-grid">
            <div className="preference-item">
              <label>Email Notifications</label>
              <div className="preference-control">
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={preferences.notifications}
                    onChange={(e) => handlePreferenceChange('notifications', e.target.checked)}
                    disabled={!isEditing}
                  />
                  <span className="slider"></span>
                </label>
                <span className="preference-status">
                  {preferences.notifications ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>

            <div className="preference-item">
              <label>Email Alerts</label>
              <div className="preference-control">
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={preferences.emailAlerts}
                    onChange={(e) => handlePreferenceChange('emailAlerts', e.target.checked)}
                    disabled={!isEditing}
                  />
                  <span className="slider"></span>
                </label>
                <span className="preference-status">
                  {preferences.emailAlerts ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>

            <div className="preference-item">
              <label>Critical Alerts</label>
              <div className="preference-control">
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={preferences.criticalAlerts}
                    onChange={(e) => handlePreferenceChange('criticalAlerts', e.target.checked)}
                    disabled={!isEditing}
                  />
                  <span className="slider"></span>
                </label>
                <span className="preference-status">
                  {preferences.criticalAlerts ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>

            <div className="preference-item">
              <label>Theme</label>
              <div className="preference-control">
                <select
                  value={preferences.theme}
                  onChange={(e) => handlePreferenceChange('theme', e.target.value)}
                  disabled={!isEditing}
                  className="theme-select"
                >
                  <option value="light">Light Mode</option>
                  <option value="dark">Dark Mode</option>
                  <option value="auto">System Default</option>
                </select>
              </div>
            </div>

            <div className="preference-item">
              <label>Language</label>
              <div className="preference-control">
                <select
                  value={preferences.language}
                  onChange={(e) => handlePreferenceChange('language', e.target.value)}
                  disabled={!isEditing}
                  className="language-select"
                >
                  <option value="english">English</option>
                  <option value="spanish">Spanish</option>
                  <option value="french">French</option>
                  <option value="hindi">Hindi</option>
                </select>
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="preference-actions">
              <button onClick={handleSavePreferences} className="save-btn">
                Save Preferences
              </button>
            </div>
          )}
        </div>

        {/* Account Statistics */}
        <div className="profile-section">
          <h2>Account Statistics</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">142</div>
              <div className="stat-label">Stations Monitored</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">1,248</div>
              <div className="stat-label">Total Readings</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">23</div>
              <div className="stat-label">Alerts Received</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">15</div>
              <div className="stat-label">Reports Generated</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="profile-section">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button className="action-btn">
              <span className="action-icon">📊</span>
              Generate Report
            </button>
            <button className="action-btn">
              <span className="action-icon">📧</span>
              Contact Support
            </button>
            <button className="action-btn">
              <span className="action-icon">🔔</span>
              Notification Settings
            </button>
            <button className="action-btn" onClick={handleLogout}>
              <span className="action-icon">🚪</span>
              Logout
            </button>
          </div>
        </div>

        {/* System Information */}
        <div className="profile-section">
          <h2>System Information</h2>
          <div className="system-info">
            <div className="system-item">
              <label>App Version</label>
              <span>v2.1.0</span>
            </div>
            <div className="system-item">
              <label>Last Login</label>
              <span>{new Date().toLocaleString()}</span>
            </div>
            <div className="system-item">
              <label>Browser</label>
              <span>Chrome 120+</span>
            </div>
            <div className="system-item">
              <label>Status</label>
              <span className="status-active">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
