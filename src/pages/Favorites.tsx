
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import MainLayout from '@/components/layout/MainLayout';
import PlaylistItem from '@/components/podcast/PlaylistItem';
import { getFavoriteEpisodesByArea } from '@/lib/podcast-service';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ChevronDown, ChevronRight, Scale } from 'lucide-react';
import { cn } from '@/lib/utils';

const Favorites = () => {
  const [expandedAreas, setExpandedAreas] = useState<Record<string, boolean>>({});
  
  const { data: favoritesByArea = {}, isLoading } = useQuery({
    queryKey: ['favoriteEpisodesByArea'],
    queryFn: getFavoriteEpisodesByArea,
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
    cacheTime: 5 * 60 * 1000 // Keep in cache for 5 minutes
  });

  // Auto-expand first area when data loads
  useEffect(() => {
    if (Object.keys(favoritesByArea).length > 0 && Object.keys(expandedAreas).length === 0) {
      const firstArea = Object.keys(favoritesByArea)[0];
      setExpandedAreas({ [firstArea]: true });
    }
  }, [favoritesByArea, expandedAreas]);

  const toggleArea = (area: string) => {
    setExpandedAreas(prev => ({
      ...prev,
      [area]: !prev[area]
    }));
  };

  // Calculate total favorites
  const totalFavorites = Object.values(favoritesByArea).reduce((sum, episodes) => sum + episodes.length, 0);

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

  return (
    <MainLayout>
      <motion.div
        className="space-y-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div 
          className="flex items-center gap-3"
          variants={itemVariants}
        >
          <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
            <Heart className="w-4 h-4 text-white fill-current" />
          </div>
          <h1 className="text-2xl font-bold">Favoritos</h1>
          {totalFavorites > 0 && (
            <span className="bg-juricast-accent/10 text-juricast-accent px-3 py-1 rounded-full text-sm font-medium">
              {totalFavorites} episódios
            </span>
          )}
        </motion.div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-juricast-card animate-pulse rounded-lg p-4">
                <div className="h-4 bg-juricast-background rounded w-1/4 mb-3"></div>
                <div className="space-y-2">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="h-16 bg-juricast-background rounded"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : Object.keys(favoritesByArea).length > 0 ? (
          <motion.div className="space-y-4" variants={containerVariants}>
            {Object.entries(favoritesByArea).map(([area, episodes]) => (
              <motion.div
                key={area}
                className="bg-juricast-card rounded-lg overflow-hidden"
                variants={itemVariants}
              >
                <button
                  onClick={() => toggleArea(area)}
                  className="w-full p-4 flex items-center justify-between hover:bg-juricast-card/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Scale className="w-5 h-5 text-juricast-accent" />
                    <h3 className="font-semibold text-left">{area}</h3>
                    <span className="bg-juricast-accent/10 text-juricast-accent px-2 py-1 rounded-full text-xs">
                      {episodes.length}
                    </span>
                  </div>
                  {expandedAreas[area] ? (
                    <ChevronDown className="w-5 h-5 text-juricast-muted" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-juricast-muted" />
                  )}
                </button>
                
                <AnimatePresence>
                  {expandedAreas[area] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 space-y-3 border-t border-juricast-card/20">
                        <div className="pt-3"></div>
                        {episodes.map((episode, index) => (
                          <PlaylistItem
                            key={episode.id}
                            episode={episode}
                            index={index + 1}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            className="flex flex-col items-center justify-center h-64 bg-juricast-card rounded-lg p-6"
            variants={itemVariants}
          >
            <div className="w-16 h-16 bg-juricast-accent/10 rounded-full flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 text-juricast-accent" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Nenhum favorito ainda</h2>
            <p className="text-juricast-muted text-center mb-4">
              Você ainda não adicionou nenhum episódio aos seus favoritos.
            </p>
            <p className="text-sm text-juricast-muted text-center">
              Clique no ❤️ ao lado dos episódios para favoritá-los
            </p>
          </motion.div>
        )}
      </motion.div>
    </MainLayout>
  );
};

export default Favorites;
