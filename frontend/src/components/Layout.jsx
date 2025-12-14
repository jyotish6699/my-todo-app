import Sidebar from "../components/Sidebar";
import MainHeader from "../components/MainHeader";
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { customColor } = useTheme();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  
  // Close sidebar on mobile by default
  useState(() => {
      if (typeof window !== 'undefined' && window.innerWidth < 768) {
          setIsSidebarOpen(false);
      }
  });

  return (
    <div 
        className="flex h-screen bg-white dark:bg-dark-900 transition-colors duration-200"
        style={{ backgroundColor: customColor || undefined }}
    >
      <Sidebar isOpen={isSidebarOpen} toggle={toggleSidebar} />

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <MainHeader toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-hidden px-4 md:px-8 py-6 relative">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;
