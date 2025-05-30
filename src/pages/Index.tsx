
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import MainLayout from '@/components/layout/MainLayout';
import PodcastCard from '@/components/podcast/PodcastCard';
import AreaCard from '@/components/podcast/AreaCard';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Clock, BookOpen, GraduationCap, Star } from 'lucide-react';
import { getAllEpisodes, getPopularEpisodes, getRecentEpisodes, getAllAreas } from '@/lib/podcast-service';
import { cn } from '@/lib/utils';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'popular' | 'recent'>('all');

  const { data: allEpisodes = [], isLoading: loadingAll } = useQuery({
    queryKey: ['allEpisodes'],
    queryFn: getAllEpisodes,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  });

  const { data: popularEpisodes = [], isLoading: loadingPopular } = useQuery({
    queryKey: ['popularEpisodes'],
    queryFn: getPopularEpisodes,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  });

  const { data: recentEpisodes = [], isLoading: loadingRecent } = useQuery({
    queryKey: ['recentEpisodes'],
    queryFn: getRecentEpisodes,
    staleTime: 1 * 60 * 1000,
    gcTime: 5 * 60 * 1000
  });

  const { data: areas = [] } = useQuery({
    queryKey: ['areas'],
    queryFn: getAllAreas,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000
  });

  const juridicoAreas = areas.filter(area => area.category === 'juridico');
  const educativoAreas = areas.filter(area => area.category === 'educativo');

  const getCurrentEpisodes = () => {
    switch (activeTab) {
      case 'popular':
        return popularEpisodes;
      case 'recent':
        return recentEpisodes;
      default:
        return allEpisodes;
    }
  };

  const isLoading = () => {
    switch (activeTab) {
      case 'popular':
        return loadingPopular;
      case 'recent':
        return loadingRecent;
      default:
        return loadingAll;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const episodes = getCurrentEpisodes();

  return (
    <MainLayout>
      <motion.div
        className="space-y-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Welcome Section */}
        <motion.div className="text-center space-y-4" variants={itemVariants}>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-juricast-accent to-juricast-accent/80 bg-clip-text text-transparent">
            JuriCast
          </h1>
          <p className="text-juricast-muted max-w-2xl mx-auto text-lg">
            Explore os melhores podcasts jurídicos com conteúdo especializado para sua área de interesse
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
          variants={itemVariants}
        >
          <div className="bg-gradient-to-r from-juricast-card to-juricast-card/80 p-4 rounded-lg border border-juricast-card/40">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-5 h-5 text-juricast-accent" />
              <span className="text-sm text-juricast-muted">Total</span>
            </div>
            <p className="text-2xl font-bold">{allEpisodes.length}</p>
            <p className="text-xs text-juricast-muted">Episódios</p>
          </div>
          
          <div className="bg-gradient-to-r from-juricast-card to-juricast-card/80 p-4 rounded-lg border border-juricast-card/40">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-juricast-muted">Direito</span>
            </div>
            <p className="text-2xl font-bold">{juridicoAreas.length}</p>
            <p className="text-xs text-juricast-muted">Áreas</p>
          </div>
          
          <div className="bg-gradient-to-r from-juricast-card to-juricast-card/80 p-4 rounded-lg border border-juricast-card/40">
            <div className="flex items-center gap-2 mb-2">
              <GraduationCap className="w-5 h-5 text-green-400" />
              <span className="text-sm text-juricast-muted">Educação</span>
            </div>
            <p className="text-2xl font-bold">{educativoAreas.length}</p>
            <p className="text-xs text-juricast-muted">Áreas</p>
          </div>
          
          <div className="bg-gradient-to-r from-juricast-card to-juricast-card/80 p-4 rounded-lg border border-juricast-card/40">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="text-sm text-juricast-muted">Premium</span>
            </div>
            <p className="text-2xl font-bold">12</p>
            <p className="text-xs text-juricast-muted">Exclusivos</p>
          </div>
        </motion.div>

        {/* Episódios Section */}
        <motion.div className="space-y-6" variants={itemVariants}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-2xl font-bold">Episódios</h2>
            
            {/* Tabs */}
            <div className="flex bg-juricast-card/50 rounded-lg p-1 border border-juricast-card/30">
              <button
                onClick={() => setActiveTab('all')}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2",
                  activeTab === 'all' 
                    ? "bg-juricast-accent text-white shadow-lg" 
                    : "text-juricast-muted hover:text-juricast-text"
                )}
              >
                <BookOpen size={16} />
                Todos
              </button>
              <button
                onClick={() => setActiveTab('popular')}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2",
                  activeTab === 'popular' 
                    ? "bg-juricast-accent text-white shadow-lg" 
                    : "text-juricast-muted hover:text-juricast-text"
                )}
              >
                <TrendingUp size={16} />
                Populares
              </button>
              <button
                onClick={() => setActiveTab('recent')}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2",
                  activeTab === 'recent' 
                    ? "bg-juricast-accent text-white shadow-lg" 
                    : "text-juricast-muted hover:text-juricast-text"
                )}
              >
                <Clock size={16} />
                Recentes
              </button>
            </div>
          </div>

          {/* Episodes Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {isLoading() ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, index) => (
                    <div key={index} className="bg-juricast-card animate-pulse rounded-lg p-4">
                      <div className="aspect-video bg-juricast-background rounded-lg mb-4"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-juricast-background rounded w-3/4"></div>
                        <div className="h-3 bg-juricast-background rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {episodes.map((episode) => (
                    <PodcastCard key={episode.id} episode={episode} />
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Áreas do Direito */}
        {juridicoAreas.length > 0 && (
          <motion.div className="space-y-6" variants={itemVariants}>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-juricast-accent" />
                Áreas do Direito
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {juridicoAreas.slice(0, 6).map((area) => (
                <AreaCard key={area.id} area={area} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Educação Jurídica */}
        {educativoAreas.length > 0 && (
          <motion.div className="space-y-6" variants={itemVariants}>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <GraduationCap className="w-6 h-6 text-green-400" />
                Educação Jurídica
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {educativoAreas.slice(0, 6).map((area) => (
                <AreaCard key={area.id} area={area} />
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </MainLayout>
  );
};

export default Index;
