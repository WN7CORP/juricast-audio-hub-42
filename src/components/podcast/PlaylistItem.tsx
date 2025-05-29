
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Heart, Pause, Gavel, Book, Scale, File, Check, Clock } from 'lucide-react';
import { PodcastEpisode } from '@/lib/types';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toggleFavorite } from '@/lib/podcast-service';
import ExpandableDescription from './ExpandableDescription';

interface PlaylistItemProps {
  episode: PodcastEpisode;
  index: number;
  isPlaying?: boolean;
  onPlay?: () => void;
}

const PlaylistItem: React.FC<PlaylistItemProps> = ({
  episode,
  index,
  isPlaying = false,
  onPlay
}) => {
  const [isFavorite, setIsFavorite] = useState(episode.favorito || false);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newStatus = toggleFavorite(episode.id);
    setIsFavorite(newStatus);
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
  const hasProgress = episode.progresso > 0;

  // Animation variants
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.01 }}
      className="bg-juricast-card hover:bg-juricast-card/80 rounded-lg overflow-hidden border border-juricast-card/20"
    >
      <Link to={`/podcast/${episode.id}`} className="block">
        <div className="p-4">
          {/* Header with play button and favorite */}
          <div className="flex items-start gap-3 mb-3">
            {/* Episode thumbnail and play button */}
            <div className="relative flex-shrink-0">
              <img 
                src={episode.imagem_miniatura || '/placeholder.svg'} 
                alt={episode.titulo}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <motion.button
                onClick={handlePlay}
                className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg opacity-0 hover:opacity-100 transition-opacity"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isPlaying ? (
                  <Pause size={20} className="text-white" />
                ) : (
                  <Play size={20} className="text-white ml-1" />
                )}
              </motion.button>
            </div>

            {/* Episode info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-semibold text-sm leading-tight line-clamp-2 flex-1">
                  {episode.titulo}
                </h3>
                <motion.button
                  onClick={handleToggleFavorite}
                  className={cn(
                    "p-1.5 rounded-full transition-colors flex-shrink-0",
                    isFavorite 
                      ? "text-juricast-accent bg-juricast-accent/10" 
                      : "text-juricast-muted hover:text-juricast-accent"
                  )}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
                </motion.button>
              </div>

              {/* Area and theme */}
              <div className="flex items-center gap-2 mb-2">
                {getAreaIcon()}
                <span className="text-xs text-juricast-accent font-medium">
                  {episode.area}
                </span>
                {episode.tema && (
                  <>
                    <span className="text-xs text-juricast-muted">•</span>
                    <span className="text-xs text-juricast-muted truncate">
                      {episode.tema}
                    </span>
                  </>
                )}
              </div>

              {/* Progress and status indicators */}
              <div className="flex items-center gap-2 text-xs">
                {hasProgress && (
                  <div className="flex items-center gap-1">
                    {isCompleted ? (
                      <Check size={12} className="text-green-500" />
                    ) : (
                      <Clock size={12} className="text-juricast-accent" />
                    )}
                    <span className={cn(
                      isCompleted ? "text-green-500" : "text-juricast-accent"
                    )}>
                      {isCompleted ? "Concluído" : `${episode.progresso}%`}
                    </span>
                  </div>
                )}
                
                {episode.sequencia && (
                  <>
                    {hasProgress && <span className="text-juricast-muted">•</span>}
                    <span className="text-juricast-muted">
                      #{episode.sequencia}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Progress bar */}
          {hasProgress && (
            <div className="w-full bg-juricast-background/50 rounded-full h-1.5 mb-3">
              <motion.div
                className={cn(
                  "h-full rounded-full",
                  isCompleted ? "bg-green-500" : "bg-juricast-accent"
                )}
                initial={{ width: 0 }}
                animate={{ width: `${episode.progresso}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          )}

          {/* Tags */}
          {Array.isArray(episode.tag) && episode.tag.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {episode.tag.slice(0, 3).map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  className="inline-block bg-juricast-background/50 px-2 py-1 rounded-full text-xs text-juricast-muted border border-juricast-card/30"
                >
                  {tag}
                </span>
              ))}
              {episode.tag.length > 3 && (
                <span className="inline-block bg-juricast-background/50 px-2 py-1 rounded-full text-xs text-juricast-muted border border-juricast-card/30">
                  +{episode.tag.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </Link>

      {/* Expandable Description - Outside of Link */}
      <div className="px-4 pb-4">
        <ExpandableDescription 
          description={episode.descricao}
          title="Mostrar Conteúdo"
        />
      </div>
    </motion.div>
  );
};

export default PlaylistItem;
