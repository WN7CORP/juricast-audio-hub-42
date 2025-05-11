
import React from 'react';
import Sidebar from './Sidebar';
import TopNavigation from './TopNavigation';
import BottomNavigation from './BottomNavigation';
import MiniPlayer from '@/components/audio/MiniPlayer';
import { useIsMobile } from '@/hooks/use-mobile';
import { AnimatePresence, motion } from 'framer-motion';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex min-h-screen bg-juricast-background text-juricast-text overflow-hidden">
      {!isMobile && <Sidebar />}
      
      <main className="flex-1 flex flex-col pb-32 md:pb-12 w-full max-w-full">
        <TopNavigation />
        
        <motion.div 
          className="flex-1 p-3 md:p-6 overflow-y-auto overflow-x-hidden"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
        >
          <AnimatePresence mode="wait">
            {children}
          </AnimatePresence>
        </motion.div>
        
        <MiniPlayer />
        {isMobile && <BottomNavigation />}
      </main>
    </div>
  );
};

export default MainLayout;
