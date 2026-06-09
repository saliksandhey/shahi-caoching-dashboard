import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { StudentDrawer } from '../StudentDrawer';
import { useStore } from '../../store/useStore';

export const Layout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isDrawerOpen, closeDrawer, selectedStudentForDrawer } = useStore();

  return (
    <div className="app-container">
      <Sidebar isMobileOpen={isMobileMenuOpen} onCloseMobile={() => setIsMobileMenuOpen(false)} />
      <div className="main-content">
        <Header onMenuToggle={() => setIsMobileMenuOpen(true)} />
        <main className="page-scroll-area">
          <Outlet />
        </main>
      </div>
      <StudentDrawer 
        isOpen={isDrawerOpen} 
        onClose={closeDrawer} 
        student={selectedStudentForDrawer} 
      />
    </div>
  );
};
