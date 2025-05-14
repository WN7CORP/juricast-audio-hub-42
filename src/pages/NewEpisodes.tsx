
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import MainLayout from '@/components/layout/MainLayout';
import PlaylistItem from '@/components/podcast/PlaylistItem';
import { motion } from 'framer-motion';
import { getRecentEpisodes } from '@/lib/podcast-service';

const NewEpisodes = () => {
  const {
    data: recentEpisodes = [],
    isLoading
  } = useQuery({
    queryKey: ['recentEpisodes'],
    queryFn: getRecentEpisodes
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
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
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-juricast-accent to-juricast-text bg-clip-text text-transparent">
            Episódios Recentes
          </h1>
          
          <p className="text-juricast-muted mb-6">
            Confira os últimos lançamentos do JuriCast. Atualizamos nossa biblioteca regularmente com novos conteúdos.
          </p>
        </motion.div>

        <motion.div 
          className="space-y-3"
          variants={containerVariants}
        >
          {isLoading
            ? [...Array(10)].map((_, i) => (
                <div key={i} className="bg-juricast-card animate-pulse rounded-lg h-16"></div>
              ))
            : recentEpisodes.map((episode, index) => (
                <motion.div
                  key={episode.id}
                  variants={itemVariants}
                >
                  <PlaylistItem
                    episode={episode}
                    index={index + 1}
                  />
                </motion.div>
              ))
          }
          
          {recentEpisodes.length === 0 && !isLoading && (
            <motion.div 
              className="text-center py-12"
              variants={itemVariants}
            >
              <h3 className="text-xl font-medium text-juricast-muted">
                Nenhum episódio recente encontrado
              </h3>
              <p className="mt-2 text-juricast-muted">
                Novos episódios serão exibidos aqui quando disponíveis
              </p>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </MainLayout>
  );
};

export default NewEpisodes;
