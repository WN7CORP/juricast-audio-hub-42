
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import MainLayout from '@/components/layout/MainLayout';
import PlaylistItem from '@/components/podcast/PlaylistItem';
import { getEpisodesByArea } from '@/lib/podcast-service';
import { motion } from 'framer-motion';

const Category = () => {
  const { category } = useParams<{category: string}>();
  const formattedCategory = category?.replace(/-/g, ' ');
  
  // Convert category slug to proper title case
  const categoryTitle = formattedCategory
    ?.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  const { data: episodes = [], isLoading } = useQuery({
    queryKey: ['episodesByCategory', formattedCategory],
    queryFn: () => getEpisodesByArea(formattedCategory || ''),
    enabled: !!formattedCategory
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <MainLayout>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full px-1 md:px-4"
      >
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-xl md:text-2xl font-bold truncate">{categoryTitle}</h1>
          <span className="text-juricast-accent text-xs md:text-sm bg-juricast-accent/10 px-2 py-0.5 rounded-full whitespace-nowrap">
            {episodes.length} episódios
          </span>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="bg-juricast-card animate-pulse rounded-lg h-20"></div>
            ))}
          </div>
        ) : episodes.length > 0 ? (
          <motion.div
            className="space-y-3 mb-20"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {episodes.map((episode, index) => (
              <PlaylistItem
                key={episode.id}
                episode={episode}
                index={index + 1}
              />
            ))}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 bg-juricast-card rounded-lg p-4 md:p-6 mb-20">
            <h2 className="text-xl font-semibold mb-2 text-center">Nenhum episódio encontrado</h2>
            <p className="text-juricast-muted text-center mb-4">
              Não encontramos episódios na categoria {categoryTitle}.
            </p>
          </div>
        )}
      </motion.div>
    </MainLayout>
  );
};

export default Category;
