import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';

interface SidebarProps {
  onLogout?: () => void;
  onCategorySelect?: (category: string | null) => void;
  activeCategory?: string | null;
  isMobileOpen?: boolean;
  onMobileToggle?: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout, onCategorySelect, activeCategory, isMobileOpen = false, onMobileToggle }) => {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState(activeCategory || 'all-notes');
  
  // Extract unique categories from notes
  const notes = useAppSelector((state) => state.notes.notes);
  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();
    notes.forEach((note) => {
      if (note.category && note.category.trim()) {
        uniqueCategories.add(note.category);
      }
    });
    return Array.from(uniqueCategories).sort();
  }, [notes]);

  const handleNavigation = (itemId: string, path?: string, category?: string | null) => {
    setActiveItem(itemId);
    if (path) {
      navigate(path);
    }
    if (onCategorySelect) {
      onCategorySelect(category !== undefined ? category : null);
    }
    if (onMobileToggle) {
      onMobileToggle(false); // Close sidebar on mobile after selection
    }
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    navigate('/logout');
  };

  // Icon mapping for common categories
  const getCategoryIcon = (category: string) => {
    const lowerCategory = category.toLowerCase();
    
    if (lowerCategory.includes('work')) {
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" fill="currentColor"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" fill="currentColor"/>
        </svg>
      );
    } else if (lowerCategory.includes('personal')) {
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" fill="currentColor"/>
        </svg>
      );
    } else if (lowerCategory.includes('idea')) {
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" fill="currentColor"/>
        </svg>
      );
    } else if (lowerCategory.includes('archive')) {
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" fill="currentColor"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" fill="currentColor"/>
        </svg>
      );
    }
    
    // Default folder icon
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" fill="currentColor"/>
      </svg>
    );
  };

  return (
    <aside className={`sidebar ${isMobileOpen ? 'sidebar-mobile-open' : ''}`}>
      <button 
        className="sidebar-close-btn" 
        onClick={() => onMobileToggle && onMobileToggle(false)}
        aria-label="Close sidebar"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      
      <div className="sidebar-header">
        <Logo />
      </div>

      <nav className="sidebar-nav">
        <button
          className={`sidebar-nav-item ${activeItem === 'all-notes' ? 'active' : ''}`}
          onClick={() => handleNavigation('all-notes', '/dashboard', null)}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" fill="currentColor"/>
          </svg>
          <span>All Notes</span>
        </button>

        {/* Dynamic categories with scrollable container */}
        <div className="sidebar-categories-container">
          {categories.map((category) => (
            <button
              key={category}
              className={`sidebar-nav-item ${activeItem === category ? 'active' : ''}`}
              onClick={() => handleNavigation(category, undefined, category)}
            >
              {getCategoryIcon(category)}
              <span>{category}</span>
            </button>
          ))}
        </div>
      </nav>

      <div className="sidebar-footer">
        <ThemeToggle />
        <button className="sidebar-logout-btn" onClick={handleLogout}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" fill="currentColor"/>
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
