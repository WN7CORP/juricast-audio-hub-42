
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import MainLayout from '@/components/layout/MainLayout';
import PlaylistItem from '@/components/podcast/PlaylistItem';
import { motion } from 'framer-motion';
import { getRecentEpisodes } from '@/lib/podcast-service';
import { Calendar, TrendingUp } from 'lucide-react';

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
        staggerChildren: 0.05
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
        className="space-y-6 px-4 sm:px-0"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-juricast-accent to-juricast-accent/80 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-juricast-accent to-juricast-text bg-clip-text text-transparent">
                Episódios Recentes
              </h1>
              <p className="text-juricast-muted text-sm flex items-center gap-1 mt-1">
                <Calendar className="w-4 h-4" />
                Ordenados por data de publicação
              </p>
            </div>
          </div>
          
          <p className="text-juricast-muted mb-6 text-sm sm:text-base">
            Confira os últimos lançamentos do JuriCast. Atualizamos nossa biblioteca regularmente com novos conteúdos.
          </p>
        </motion.div>

        <motion.div 
          className="space-y-3"
          variants={containerVariants}
        >
          {isLoading
            ? [...Array(10)].map((_, i) => (
                <motion.div 
                  key={i} 
                  className="bg-juricast-card animate-pulse rounded-lg h-16"
                  variants={itemVariants}
                />
              ))
            : recentEpisodes.map((episode, index) => (
                <motion.div
                  key={episode.id}
                  variants={itemVariants}
                >
                  <PlaylistItem
                    episode={episode}
                    index={index + 1}
                    showDate={true}
                  />
                </motion.div>
              ))
          }
          
          {recentEpisodes.length === 0 && !isLoading && (
            <motion.div 
              className="text-center py-12"
              variants={itemVariants}
            >
              <div className="w-16 h-16 bg-juricast-muted/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-juricast-muted" />
              </div>
              <h3 className="text-xl font-medium text-juricast-muted mb-2">
                Nenhum episódio recente encontrado
              </h3>
              <p className="text-juricast-muted">
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
