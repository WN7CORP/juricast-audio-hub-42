import React from 'react';
import Sidebar from './Sidebar';
import TopNavigation from './TopNavigation';
import { useIsMobile } from '@/hooks/use-mobile';
import { AnimatePresence, motion } from 'framer-motion';
interface MainLayoutProps {
  children: React.ReactNode;
}
const MainLayout: React.FC<MainLayoutProps> = ({
  children
}) => {
  const isMobile = useIsMobile();
  return <div className="flex min-h-screen bg-juricast-background text-juricast-text overflow-hidden">
      {!isMobile && <Sidebar />}
      
      <main className="flex-1 flex flex-col w-full max-w-full">
        <TopNavigation />
        
        <motion.div
      // Add padding at the bottom for MiniPlayer
      initial={{
        opacity: 0,
        y: 10
      }} animate={{
        opacity: 1,
        y: 0
      }} exit={{
        opacity: 0,
        y: 10
      }} transition={{
        duration: 0.3
      }} className="flex-1 p-3 md:p-6 overflow-y-auto overflow-x-hidden pb-20 px-0 py-0">
          <AnimatePresence mode="wait">
            {children}
          </AnimatePresence>
        </motion.div>
      </main>
    </div>;
};
export default MainLayout;