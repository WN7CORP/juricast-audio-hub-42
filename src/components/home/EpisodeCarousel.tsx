
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Clock, Tag } from 'lucide-react';
import { PodcastEpisode } from '@/lib/types';
import { cn } from '@/lib/utils';

interface EpisodeCarouselProps {
  episodes: PodcastEpisode[];
  isLoading: boolean;
}

const EpisodeCarousel: React.FC<EpisodeCarouselProps> = ({ episodes, isLoading }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 }
  };

  if (isLoading) {
    return (
      <div className="overflow-x-auto pb-4">
        <div className="flex space-x-4 min-w-max">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-juricast-card animate-pulse rounded-xl h-64 w-80 flex-shrink-0" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      className="overflow-x-auto pb-4 scrollbar-hide"
    >
      <div className="flex space-x-6 min-w-max">
        {episodes.slice(0, 6).map((episode) => (
          <motion.div
            key={episode.id}
            variants={itemVariants}
            className="flex-shrink-0 w-80"
          >
            <Link to={`/podcast/${episode.id}`} className="block group">
              <div className="bg-juricast-card rounded-xl overflow-hidden border border-juricast-card/20 hover:border-juricast-accent/30 transition-all duration-300 hover:shadow-xl hover:shadow-juricast-accent/5">
                {/* Thumbnail with overlay */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={episode.imagem_miniatura}
                    alt={episode.titulo}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  {/* Play button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                      <Play size={24} className="text-white ml-1" />
                    </div>
                  </div>
                  
                  {/* Status badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="bg-juricast-accent/90 text-white text-xs px-3 py-1 rounded-full font-medium">
                      Novo
                    </span>
                    {episode.progresso > 0 && (
                      <span className="bg-blue-500/90 text-white text-xs px-3 py-1 rounded-full font-medium">
                        {episode.progresso}%
                      </span>
                    )}
                  </div>
                  
                  {/* Area badge */}
                  <div className="absolute bottom-3 left-3">
                    <span className="bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                      {episode.area}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <h3 className="font-semibold text-lg line-clamp-2 text-juricast-text group-hover:text-juricast-accent transition-colors">
                    {episode.titulo}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-sm text-juricast-muted">
                    <Clock size={14} />
                    <span>{episode.duracao || '~45 min'}</span>
                    {episode.tema && (
                      <>
                        <span>•</span>
                        <span className="truncate">{episode.tema}</span>
                      </>
                    )}
                  </div>
                  
                  {/* Tags */}
                  {episode.tag && episode.tag.length > 0 && (
                    <div className="flex items-center gap-1 flex-wrap">
                      <Tag size={12} className="text-juricast-muted" />
                      {episode.tag.slice(0, 2).map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs bg-juricast-background/50 px-2 py-1 rounded-full text-juricast-muted border border-juricast-card/30"
                        >
                          {tag}
                        </span>
                      ))}
                      {episode.tag.length > 2 && (
                        <span className="text-xs text-juricast-muted">+{episode.tag.length - 2}</span>
                      )}
                    </div>
                  )}
                  
                  {/* Progress bar */}
                  {episode.progresso > 0 && (
                    <div className="w-full bg-juricast-background/50 rounded-full h-1.5">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          episode.progresso === 100 ? "bg-green-500" : "bg-juricast-accent"
                        )}
                        style={{ width: `${episode.progresso}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default EpisodeCarousel;
