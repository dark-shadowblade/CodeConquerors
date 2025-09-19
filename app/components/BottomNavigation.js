'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function BottomNavigation() {
  const pathname = usePathname();

  const navItems = [
    { icon: '🏠', label: 'Home', path: '/dashboard' },
    { icon: '⚠️', label: 'Alerts', path: '/alerts' },
    { icon: '📊', label: 'Analytics', path: '/analytics' },
    { icon: '📋', label: 'Reports', path: '/reports' },
    { icon: '👤', label: 'Profile', path: '/profile' }
  ];

  return (
    <nav className="bottom-nav">
      <div className="nav-items">
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`nav-item ${pathname === item.path ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
