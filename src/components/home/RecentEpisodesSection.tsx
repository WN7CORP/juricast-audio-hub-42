
import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Clock, TrendingUp } from 'lucide-react';
import { getRecentEpisodes } from '@/lib/podcast-service';
import EpisodeCarousel from './EpisodeCarousel';

const RecentEpisodesSection = () => {
  const { data: recentEpisodes = [], isLoading } = useQuery({
    queryKey: ['recentEpisodes'],
    queryFn: getRecentEpisodes
  });

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
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="mb-12"
    >
      <motion.div variants={itemVariants} className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-juricast-accent to-juricast-accent/80 rounded-lg">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-juricast-text">
              Episódios Recentes
            </h2>
            <p className="text-juricast-muted text-sm">
              Últimos conteúdos adicionados à plataforma
            </p>
          </div>
        </div>
        
        <Link 
          to="/episodios-novos" 
          className="text-juricast-accent hover:text-juricast-accent/80 text-sm font-medium flex items-center gap-1 group"
        >
          Ver todos
          <TrendingUp size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <EpisodeCarousel episodes={recentEpisodes} isLoading={isLoading} />
      </motion.div>
    </motion.section>
  );
};

export default RecentEpisodesSection;
