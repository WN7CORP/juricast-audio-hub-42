
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';
import HeroSection from '@/components/home/HeroSection';
import CategorySection from '@/components/home/CategorySection';
import RecentEpisodesSection from '@/components/home/RecentEpisodesSection';
import InProgressSection from '@/components/home/InProgressSection';
import FocusedModeSection from '@/components/home/FocusedModeSection';
import { getAllAreas, saveUserIP } from '@/lib/podcast-service';
import { AreaCard } from '@/lib/types';

const Index = () => {
  const [areas, setAreas] = useState<AreaCard[]>([]);

  // Save user IP on first load for persistent data
  useEffect(() => {
    saveUserIP();
  }, []);

  // Load areas
  useEffect(() => {
    const fetchAreas = async () => {
      const areasData = await getAllAreas();
      setAreas(areasData);
    };
    fetchAreas();
  }, []);

  // Separate areas by category
  const juridicoAreas = areas.filter(area => area.category === 'juridico');
  const educativoAreas = areas.filter(area => area.category === 'educativo');

  const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  return (
    <MainLayout>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={pageVariants}
        className="space-y-8"
      >
        <HeroSection />
        <CategorySection 
          juridicoAreas={juridicoAreas} 
          educativoAreas={educativoAreas} 
        />
        <RecentEpisodesSection />
        <InProgressSection />
        <FocusedModeSection />
      </motion.div>
    </MainLayout>
  );
};

export default Index;
