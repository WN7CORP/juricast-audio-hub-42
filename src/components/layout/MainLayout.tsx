
import React from 'react';
import Sidebar from './Sidebar';
import TopNavigation from './TopNavigation';
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
      
      <main className="flex-1 flex flex-col w-full max-w-full">
        <TopNavigation />
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "flex-1 overflow-y-auto overflow-x-hidden",
            // Mobile optimizations
            isMobile 
              ? "p-2 pb-24" // Less padding on mobile, more bottom padding for mini player
              : "p-6 pb-20"  // Standard padding on desktop
          )}
        >
          <AnimatePresence mode="wait">
            <div className={cn(
              "max-w-full mx-auto",
              // Responsive container
              isMobile ? "px-1" : "px-0"
            )}>
              {children}
            </div>
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
};

export default MainLayout;
