import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, Menu, X } from 'lucide-react';
import { useStore } from '../../store/useStore';
import './Header.css';

interface HeaderProps {
  onMenuToggle?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { students, openDrawer } = useStore();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter students based on query
  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return students.filter(
      s => s.full_name.toLowerCase().includes(query) || 
           s.mobile_number.includes(query) ||
           s.city.toLowerCase().includes(query)
    ).slice(0, 5); // Limit to top 5
  }, [searchQuery, students]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        searchInputRef.current?.blur();
        setIsSearchFocused(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleResultClick = (student: any) => {
    setSearchQuery('');
    setIsSearchFocused(false);
    searchInputRef.current?.blur();
    openDrawer(student);
  };

  return (
    <div className="header-wrapper">
      <header className="top-header glass-header">
        <div className="header-left">
          <button className="mobile-menu-btn icon-btn d-lg-none" onClick={onMenuToggle}>
            <Menu size={20} />
          </button>
        </div>

        <div className={`global-search-container ${isSearchFocused ? 'focused' : ''}`}>
          <div className="global-search">
            <Search size={16} className="search-icon" />
            <input 
              ref={searchInputRef}
              type="text" 
              placeholder="Search students..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              // Use a slight delay on blur so we can click results
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            />
            {searchQuery && (
              <button className="icon-btn clear-search" onClick={() => setSearchQuery('')}>
                <X size={14} />
              </button>
            )}
            {!searchQuery && <div className="search-shortcut hide-on-mobile">⌘K</div>}
          </div>

          {/* Search Results Dropdown */}
          {isSearchFocused && searchQuery && (
            <div className="search-results-dropdown card">
              {searchResults.length > 0 ? (
                <div className="search-results-list">
                  <div className="search-group-label">Students</div>
                  {searchResults.map(student => (
                    <div 
                      key={student.id} 
                      className="search-result-item"
                      onClick={() => handleResultClick(student)}
                    >
                      <div className="search-avatar">
                        {student.full_name.charAt(0).toUpperCase()}
                      </div>
                      <div className="search-info">
                        <span className="search-name">{student.full_name}</span>
                        <span className="search-sub">{student.city} • {student.mobile_number}</span>
                      </div>
                      <span className={`status-badge status-${(student.status || 'New Lead').toLowerCase().replace(/\s+/g, '-')} clean-select`} style={{fontSize: '0.6rem', transform: 'scale(0.85)', transformOrigin: 'right center'}}>
                        {student.status || 'New Lead'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="search-empty">
                  No students found for "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>

        <div className="header-right">
          <button className="icon-btn notification-btn">
            <Bell size={18} />
            <span className="notification-dot"></span>
          </button>
          <div className="admin-profile">
            <div className="profile-avatar">A</div>
          </div>
        </div>
      </header>
    </div>
  );
};
