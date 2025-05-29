
import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Play, ArrowRight } from 'lucide-react';
import { getInProgressEpisodes } from '@/lib/podcast-service';
import PlaylistItem from '@/components/podcast/PlaylistItem';

const InProgressSection = () => {
  const { data: inProgressEpisodes = [], isLoading } = useQuery({
    queryKey: ['inProgressEpisodes'],
    queryFn: getInProgressEpisodes
  });

  if (inProgressEpisodes.length === 0 && !isLoading) {
    return null;
  }

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
          <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
            <Play className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-juricast-text">
              Continue Ouvindo
            </h2>
            <p className="text-juricast-muted text-sm">
              Episódios que você começou a ouvir
            </p>
          </div>
        </div>
        
        <Link 
          to="/em-progresso" 
          className="text-juricast-accent hover:text-juricast-accent/80 text-sm font-medium flex items-center gap-1 group"
        >
          Ver todos
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>
      
      <motion.div variants={containerVariants} className="space-y-4">
        {isLoading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="bg-juricast-card animate-pulse rounded-lg h-20" />
          ))
        ) : (
          inProgressEpisodes.slice(0, 3).map((episode, index) => (
            <motion.div key={episode.id} variants={itemVariants}>
              <PlaylistItem episode={episode} index={index + 1} />
            </motion.div>
          ))
        )}
      </motion.div>
    </motion.section>
  );
};

export default InProgressSection;
