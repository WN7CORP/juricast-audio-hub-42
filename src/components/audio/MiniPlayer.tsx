
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Pause, X, SkipForward, SkipBack, Check } from 'lucide-react';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const MiniPlayer: React.FC = () => {
  const navigate = useNavigate();
  const { 
    currentEpisode, 
    isPlaying, 
    togglePlayPause, 
    skipForward, 
    skipBackward,
    showMiniPlayer,
    setShowMiniPlayer,
    progress
  } = useAudioPlayer();

  if (!currentEpisode || !showMiniPlayer) return null;

  const handleNavigateToEpisode = () => {
    navigate(`/podcast/${currentEpisode.id}`);
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMiniPlayer(false);
  };

  const isCompleted = progress >= 0.95; // Consider completed if 95% listened

  return (
    <AnimatePresence>
      {showMiniPlayer && (
        <motion.div 
          className="mini-player fixed left-1/2 -translate-x-1/2 bottom-20 md:bottom-4 w-[90%] max-w-md bg-juricast-card/90 backdrop-blur-lg border border-white/10 rounded-lg py-3 px-4 shadow-xl z-40"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 20 }}
          onClick={handleNavigateToEpisode}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center flex-1 min-w-0">
              <div 
                className="relative w-10 h-10 rounded-md overflow-hidden flex-shrink-0 mr-3"
              >
                <img 
                  src={currentEpisode.imagem_miniatura} 
                  alt={currentEpisode.titulo}
                  className="w-full h-full object-cover"
                />
                {isCompleted && (
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <Check size={10} className="text-white" />
                  </div>
                )}
              </div>
              
              <div className="truncate flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{currentEpisode.titulo}</p>
                <p className="text-xs text-juricast-muted truncate">{currentEpisode.area}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={(e) => { 
                  e.stopPropagation();
                  skipBackward();
                }} 
                className={cn(
                  "p-1 rounded-full hover:bg-juricast-card/50"
                )}
              >
                <SkipBack size={20} />
              </button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlayPause();
                }}
                className="w-8 h-8 flex items-center justify-center bg-juricast-accent rounded-full text-white"
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
              </motion.button>
              
              <button 
                onClick={(e) => { 
                  e.stopPropagation();
                  skipForward();
                }} 
                className={cn(
                  "p-1 rounded-full hover:bg-juricast-card/50"
                )}
              >
                <SkipForward size={20} />
              </button>
              
              <button 
                onClick={handleClose} 
                className="ml-1 p-1 rounded-full hover:bg-juricast-card/50"
              >
                <X size={18} />
              </button>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="w-full h-1 bg-juricast-background/30 rounded-full mt-2 overflow-hidden">
            <motion.div 
              className="h-full bg-juricast-accent"
              style={{ width: `${Math.min(progress * 100, 100)}%` }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MiniPlayer;
