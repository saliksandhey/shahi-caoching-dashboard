import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, FileDown, Settings, Sparkles, X, LogOut } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import './Sidebar.css';

interface SidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
  const navItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/' },
    { icon: Users, label: 'Students', path: '/students' },
    { icon: FileDown, label: 'Exports', path: '/exports' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <>
      <div className={`sidebar-overlay ${isMobileOpen ? 'open' : ''}`} onClick={onCloseMobile}></div>
      <aside className={`sidebar-container ${isMobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-inner card">
          <div className="sidebar-header">
            <div className="brand-logo">
              <div className="logo-icon">
                <Sparkles size={20} className="neon-icon" />
              </div>
              <div className="brand-text">
                <h1>Shahi Coaching</h1>
                <span>Pro Dashboard</span>
              </div>
            </div>
            {isMobileOpen && (
              <button className="icon-btn d-md-none" onClick={onCloseMobile}>
                <X size={20} />
              </button>
            )}
          </div>
          
          <nav className="sidebar-nav">
            <div className="nav-group">
              <span className="nav-group-label">Menu</span>
              {navItems.map((item) => (
                <NavLink 
                  key={item.path} 
                  to={item.path}
                  onClick={onCloseMobile}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  <item.icon size={18} className="nav-icon" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          </nav>
          
          <div className="sidebar-footer">
            <div className="system-status">
              <span className="status-dot online"></span>
              <span>System Online</span>
            </div>
            <button 
              onClick={async () => await supabase.auth.signOut()} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem', 
                color: 'var(--color-text-muted)', 
                background: 'transparent', 
                border: 'none', 
                cursor: 'pointer',
                fontSize: '0.875rem',
                width: '100%',
                marginTop: '1rem',
                padding: '0.5rem 0',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
            >
              <LogOut size={18} />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
