
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Heart, Pause, Gavel, Book, Scale, File, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { PodcastEpisode } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toggleFavorite } from '@/lib/podcast-service';

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
  const [showDescription, setShowDescription] = useState(false);
  const [isFavorite, setIsFavorite] = useState(episode.favorito || false);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newFavoriteState = toggleFavorite(episode.id);
    setIsFavorite(newFavoriteState);
  };

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onPlay) onPlay();
  };

  const toggleDescription = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDescription(!showDescription);
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
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
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
          {/* Header Section */}
          <div className="flex items-start gap-4">
            {/* Episode Image */}
            <div className="relative flex-shrink-0">
              <img 
                src={episode.imagem_miniatura} 
                alt={episode.titulo}
                className="w-16 h-16 rounded-lg object-cover"
              />
              {/* Play Button Overlay */}
              <motion.button
                onClick={handlePlay}
                className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-lg opacity-0 hover:opacity-100 transition-opacity"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 text-white" />
                ) : (
                  <Play className="w-6 h-6 text-white" />
                )}
              </motion.button>
              
              {/* Episode Number */}
              <div className="absolute -top-2 -left-2 bg-juricast-accent text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {index}
              </div>
            </div>

            {/* Episode Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-juricast-text line-clamp-2 pr-2">
                  {episode.titulo}
                </h3>
                
                {/* Action Buttons */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <motion.button
                    onClick={handleToggleFavorite}
                    className={cn(
                      "p-1.5 rounded-full transition-colors",
                      isFavorite 
                        ? "bg-red-100 text-red-600 hover:bg-red-200" 
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    )}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Heart size={14} className={isFavorite ? "fill-current" : ""} />
                  </motion.button>
                  
                  <motion.button
                    onClick={toggleDescription}
                    className="p-1.5 rounded-full bg-juricast-accent/10 text-juricast-accent hover:bg-juricast-accent/20 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {showDescription ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </motion.button>
                </div>
              </div>

              {/* Episode Meta */}
              <div className="flex items-center gap-3 text-sm text-juricast-muted mb-2">
                <div className="flex items-center gap-1">
                  {getAreaIcon()}
                  <span>{episode.area}</span>
                </div>
                
                {episode.tema && (
                  <div className="flex items-center gap-1">
                    <span>•</span>
                    <span className="truncate">{episode.tema}</span>
                  </div>
                )}
                
                {isCompleted && (
                  <div className="flex items-center gap-1 text-green-600">
                    <Check size={14} />
                    <span className="text-xs font-medium">Concluído</span>
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              {episode.progresso && episode.progresso > 0 && (
                <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
                  <div 
                    className="bg-juricast-accent h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${episode.progresso}%` }}
                  />
                </div>
              )}

              {/* Tags */}
              {episode.tag && episode.tag.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {episode.tag.slice(0, 3).map((tag, tagIndex) => (
                    <span 
                      key={tagIndex}
                      className="inline-block bg-juricast-accent/10 text-juricast-accent text-xs px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                  {episode.tag.length > 3 && (
                    <span className="text-xs text-juricast-muted">
                      +{episode.tag.length - 3} mais
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Expandable Description */}
          <AnimatePresence>
            {showDescription && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mt-4 pt-4 border-t border-juricast-card/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Book size={16} className="text-juricast-accent" />
                    <span className="font-medium text-juricast-text">Mostrar Conteúdo</span>
                  </div>
                  <p className="text-sm text-juricast-muted leading-relaxed">
                    {episode.descricao || "Descrição não disponível para este episódio."}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Link>
    </motion.div>
  );
};

export default PlaylistItem;
