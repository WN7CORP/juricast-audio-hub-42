
import React from 'react';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
import { Play, Pause, SkipForward, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

const MiniPlayer = () => {
  const { state, play, pause, resume, skipForward, closeMiniPlayer } = useAudioPlayer();
  const { currentEpisode, isPlaying, showMiniPlayer, currentTime, duration } = state;
  const location = useLocation();
  
  // Don't show mini player if we're already on the podcast detail page for the current episode
  const isOnEpisodePage = location.pathname.startsWith('/podcast/') && 
                          currentEpisode && 
                          location.pathname === `/podcast/${currentEpisode.id}`;
  
  if (!showMiniPlayer || !currentEpisode || isOnEpisodePage) return null;
  
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  
  const formatTime = (time: number) => {
    if (isNaN(time)) return '00:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      resume();
    }
  };

  const handleClosePlayer = () => {
    closeMiniPlayer();
  };

  return (
    <AnimatePresence>
      {showMiniPlayer && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-juricast-card border-t border-juricast-card/30"
        >
          <div className="relative">
            {/* Progress bar at the top of mini player */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-juricast-background/30">
              <motion.div
                className="h-full bg-juricast-accent"
                style={{ width: `${progress}%` }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "linear" }}
              />
            </div>
            
            <div className="flex items-center pt-1 p-3">
              <Link to={`/podcast/${currentEpisode.id}`} className="flex-shrink-0">
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  src={currentEpisode.imagem_miniatura}
                  alt={currentEpisode.titulo}
                  className="w-12 h-12 rounded object-cover mr-3"
                />
              </Link>
              
              <div className="flex-grow min-w-0">
                <Link to={`/podcast/${currentEpisode.id}`} className="block">
                  <h4 className="text-sm font-medium truncate">{currentEpisode.titulo}</h4>
                  <p className="text-xs text-juricast-muted truncate">{formatTime(currentTime)} / {formatTime(duration)}</p>
                </Link>
              </div>
              
              <div className="flex items-center gap-1">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-full hover:bg-juricast-background/30"
                  onClick={handlePlayPause}
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </motion.button>
                
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-full hover:bg-juricast-background/30"
                  onClick={() => skipForward(10)}
                  aria-label="Skip forward 10 seconds"
                >
                  <SkipForward size={20} />
                </motion.button>
                
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-full hover:bg-juricast-background/30"
                  onClick={handleClosePlayer}
                  aria-label="Close player"
                >
                  <X size={20} />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MiniPlayer;
