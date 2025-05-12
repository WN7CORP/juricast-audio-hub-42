
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import MainLayout from '@/components/layout/MainLayout';
import PlaylistItem from '@/components/podcast/PlaylistItem';
import { motion } from 'framer-motion';
import { getCompletedEpisodes } from '@/lib/podcast-service';

const Completed = () => {
  const { data: completedEpisodes = [], isLoading } = useQuery({
    queryKey: ['completedEpisodes'],
    queryFn: getCompletedEpisodes
  });

  console.log("Completed episodes:", completedEpisodes);

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
        className="space-y-6"
      >
        <div>
          <h1 className="text-2xl font-bold mb-2">Concluídos</h1>
          <p className="text-juricast-muted">Episódios que você já terminou de ouvir</p>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-juricast-card animate-pulse rounded-lg h-16"></div>
            ))}
          </div>
        ) : completedEpisodes.length > 0 ? (
          <motion.div
            className="space-y-3 mb-20"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {completedEpisodes.map((episode, index) => (
              <motion.div key={episode.id} variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}>
                <PlaylistItem
                  episode={episode}
                  index={index + 1}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            className="flex flex-col items-center justify-center h-64 bg-juricast-card rounded-lg p-6"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-xl font-semibold mb-2">Nenhum episódio concluído</h2>
            <p className="text-juricast-muted text-center mb-4">
              Você ainda não concluiu nenhum episódio. Comece a ouvir e retorne aqui depois.
            </p>
          </motion.div>
        )}
      </motion.div>
    </MainLayout>
  );
};

export default Completed;
