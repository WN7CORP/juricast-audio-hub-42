
import React from 'react';
import Sidebar from './Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu } from 'lucide-react';
import { useState } from 'react';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  return (
    <div className="flex min-h-screen bg-juricast-background text-juricast-text">
      {!isMobile && <Sidebar />}
      
      {isMobile && showMobileSidebar && (
        <div className="fixed inset-0 z-50 bg-black/80" onClick={() => setShowMobileSidebar(false)}>
          <div className="absolute left-0 top-0 h-full w-64" onClick={e => e.stopPropagation()}>
            <Sidebar />
          </div>
        </div>
      )}
      
      <main className="flex-1">
        {isMobile && (
          <div className="sticky top-0 z-10 bg-juricast-background p-4 flex justify-between items-center border-b border-juricast-card">
            <h1 className="text-xl font-bold text-juricast-accent">JuriCast</h1>
            <button 
              onClick={() => setShowMobileSidebar(true)}
              className="p-2 rounded-md hover:bg-juricast-card"
            >
              <Menu size={24} />
            </button>
          </div>
        )}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
