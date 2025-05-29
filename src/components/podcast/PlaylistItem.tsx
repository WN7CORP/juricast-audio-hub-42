
import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Heart, Pause, Gavel, Book, Scale, File, Check, Clock } from 'lucide-react';
import { PodcastEpisode } from '@/lib/types';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toggleFavorite } from '@/lib/podcast-service';

interface PlaylistItemProps {
  episode: PodcastEpisode;
  index: number;
  isPlaying?: boolean;
  onPlay?: () => void;
  showProgress?: boolean;
  showDate?: boolean;
}

const PlaylistItem: React.FC<PlaylistItemProps> = ({
  episode,
  index,
  isPlaying = false,
  onPlay,
  showProgress = false,
  showDate = false
}) => {
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(episode.id);
  };

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onPlay) onPlay();
  };

  // Helper function to return appropriate area icon
  const getAreaIcon = () => {
    const areaLower = episode.area.toLowerCase();
    if (areaLower.includes('civil')) return <Book size={16} className="text-juricast-accent" />;
    if (areaLower.includes('penal') || areaLower.includes('criminal')) return <Gavel size={16} className="text-juricast-accent" />;
    if (areaLower.includes('constituc')) return <Scale size={16} className="text-juricast-accent" />;
    return <File size={16} className="text-juricast-accent" />;
  };

  // Check if episode is completed (100%)
  const isCompleted = episode.progresso === 100;

  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <motion.div 
      variants={itemVariants} 
      whileHover={{ scale: 1.01 }}
      className="bg-juricast-card hover:bg-juricast-card/80 rounded-lg overflow-hidden"
    >
      <Link to={`/podcast/${episode.id}`} className="flex items-center p-3 sm:p-4 gap-3 sm:gap-4">
        {/* Episode Number */}
        <div className="flex-shrink-0 w-8 h-8 bg-juricast-accent/10 rounded-full flex items-center justify-center">
          <span className="text-sm font-medium text-juricast-accent">{index}</span>
        </div>

        {/* Episode Image */}
        <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden">
          <img 
            src={episode.imagem_miniatura} 
            alt={episode.titulo}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Episode Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm sm:text-base line-clamp-2 text-juricast-text">
                {episode.titulo}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                {getAreaIcon()}
                <span className="text-xs sm:text-sm text-juricast-muted">{episode.area}</span>
                {showDate && episode.data_publicacao && (
                  <>
                    <span className="text-juricast-muted">•</span>
                    <span className="text-xs text-juricast-muted flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {episode.data_publicacao}
                    </span>
                  </>
                )}
              </div>
              
              {/* Progress Bar */}
              {(showProgress && episode.progresso && episode.progresso > 0) && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs text-juricast-muted mb-1">
                    <span>Progresso</span>
                    <span>{episode.progresso}%</span>
                  </div>
                  <div className="w-full bg-juricast-background rounded-full h-1">
                    <div 
                      className="bg-juricast-accent h-1 rounded-full transition-all"
                      style={{ width: `${episode.progresso}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              {isCompleted && (
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
              
              <button
                onClick={handlePlay}
                className="p-2 rounded-full hover:bg-juricast-accent/10 transition-colors"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 text-juricast-accent" />
                ) : (
                  <Play className="w-4 h-4 text-juricast-accent" />
                )}
              </button>

              <button
                onClick={handleToggleFavorite}
                className="p-2 rounded-full hover:bg-juricast-accent/10 transition-colors"
                aria-label="Toggle favorite"
              >
                <Heart 
                  className={cn(
                    "w-4 h-4 transition-colors",
                    episode.favorito ? "fill-red-500 text-red-500" : "text-juricast-muted"
                  )}
                />
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default PlaylistItem;
