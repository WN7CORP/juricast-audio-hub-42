
import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, SkipBack, SkipForward, Volume2, 
  VolumeX, Clock, Share, AudioWaveform
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
import { motion } from 'framer-motion';
import { toast } from '@/hooks/use-toast';
import { PodcastEpisode } from '@/lib/types';

interface AudioPlayerProps {
  episode: PodcastEpisode;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ episode }) => {
  const {
    currentEpisode,
    isPlaying,
    duration,
    currentTime,
    volume,
    isMuted,
    audioRef,
    playEpisode,
    togglePlayPause,
    setVolume,
    toggleMute,
    seek,
    skipForward,
    skipBackward,
    setPlaybackSpeed,
    playbackSpeed,
    setSleepTimer,
    sleepTimerRemaining
  } = useAudioPlayer();
  
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const [activeWaveIndex, setActiveWaveIndex] = useState(0);
  const [showSpeedOptions, setShowSpeedOptions] = useState(false);
  const [showSleepOptions, setShowSleepOptions] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  
  const isCurrentEpisode = currentEpisode?.id === episode.id;
  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
  const sleepOptions = [5, 10, 15, 30, 45, 60];

  // Generate waveform data for visualization
  useEffect(() => {
    const generateWaveformData = () => {
      const data = Array(40).fill(0).map(() => Math.random() * 80 + 20); // Values between 20 and 100
      setWaveformData(data);
    };
    generateWaveformData();
  }, [episode.id]);
  
  // Animate the active waveform bar
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setActiveWaveIndex(prev => (prev + 1) % waveformData.length);
      }, 200);
      return () => clearInterval(interval);
    }
  }, [isPlaying, waveformData.length]);

  // Start playing this episode if it's not already playing
  useEffect(() => {
    if (!isCurrentEpisode && audioRef.current) {
      playEpisode(episode);
    }
  }, []);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      seek(percent * duration);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: episode.titulo,
        text: `Ouça ${episode.titulo} sobre ${episode.area}`,
        url: window.location.href
      }).catch(err => {
        console.error('Error sharing:', err);
      });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href).then(() => {
        toast({
          title: "Link copiado",
          description: "O link foi copiado para a área de transferência."
        });
      });
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '00:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatSleepTimer = (seconds: number | null) => {
    if (!seconds) return '';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5, delay: 0.2 }} 
      className="p-4 bg-juricast-card rounded-lg border border-juricast-card/30 px-[28px] py-4"
    >
      <div className="flex flex-col items-center mb-4">
        {/* Audio visualization */}
        <div 
          className="relative w-full aspect-square max-w-xs mb-4 overflow-hidden rounded-lg bg-gradient-to-br from-juricast-card to-black/20 flex justify-center items-center p-4"
        >
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Central audio icon */}
            <motion.div 
              className="absolute z-10"
              animate={{ 
                scale: isPlaying ? [1, 1.1, 1] : 1,
                opacity: isPlaying ? [0.8, 1, 0.8] : 0.8
              }}
              transition={{ 
                repeat: isPlaying ? Infinity : 0, 
                duration: 1.5 
              }}
            >
              <AudioWaveform 
                size={80} 
                className={cn(
                  "text-juricast-accent opacity-80",
                  isPlaying ? "animate-pulse" : ""
                )} 
              />
            </motion.div>
            
            {/* Audio visualization waves */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full flex items-center justify-center">
                {waveformData.map((height, index) => (
                  <motion.div
                    key={index}
                    className={cn(
                      "mx-[1px] rounded-full",
                      "bg-gradient-to-t from-juricast-accent to-juricast-accent/50",
                      index === activeWaveIndex && isPlaying ? "opacity-100" : "opacity-60"
                    )}
                    style={{
                      height: `${isPlaying ? height : height * 0.4}%`,
                      width: '2%',
                    }}
                    initial={{ height: "10%" }}
                    animate={{ 
                      height: `${isPlaying ? height : height * 0.4}%`,
                      opacity: index === activeWaveIndex && isPlaying ? 1 : 0.6
                    }}
                    transition={{ duration: 0.2 }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <motion.button 
              onClick={togglePlayPause} 
              className="w-16 h-16 flex items-center justify-center rounded-full bg-juricast-accent/90 text-white hover:bg-juricast-accent transition-colors" 
              whileHover={{ scale: 1.1 }} 
              whileTap={{ scale: 0.9 }}
            >
              {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
            </motion.button>
          </div>
        </div>
      </div>

      <div className="mb-3">
        <h2 className="text-lg font-semibold text-center mb-1">{episode.titulo}</h2>
      </div>

      <div className="w-full h-2 bg-juricast-background rounded-full overflow-hidden mb-2 cursor-pointer" onClick={handleProgressClick} ref={progressRef}>
        <motion.div 
          className="h-full bg-juricast-accent" 
          style={{ width: `${(currentTime / duration) * 100}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${(currentTime / duration) * 100}%` }}
          transition={{ type: "tween" }}
        />
      </div>

      <div className="flex justify-between text-juricast-muted text-sm mb-4">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      <div className="flex justify-center items-center gap-4 mb-5">
        <motion.button 
          onClick={() => skipBackward()} 
          className="player-button w-10 h-10 flex items-center justify-center rounded-full hover:bg-juricast-background/30" 
          whileHover={{ scale: 1.1 }} 
          whileTap={{ scale: 0.9 }}
        >
          <SkipBack size={20} />
        </motion.button>
        <motion.button 
          onClick={togglePlayPause} 
          className="player-button w-14 h-14 flex items-center justify-center rounded-full bg-juricast-accent text-white hover:bg-juricast-accent/90" 
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.95 }}
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
        </motion.button>
        <motion.button 
          onClick={() => skipForward()} 
          className="player-button w-10 h-10 flex items-center justify-center rounded-full hover:bg-juricast-background/30" 
          whileHover={{ scale: 1.1 }} 
          whileTap={{ scale: 0.9 }}
        >
          <SkipForward size={20} />
        </motion.button>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <button 
          onClick={toggleMute} 
          className="text-juricast-muted hover:text-juricast-text"
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01" 
          value={isMuted ? 0 : volume} 
          onChange={handleVolumeChange} 
          className="w-full h-1 bg-juricast-background rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-juricast-accent" 
        />
      </div>

      <div className="grid grid-cols-3 gap-2 mb-2">
        {/* Playback speed button */}
        <div className="relative">
          <motion.button
            onClick={() => setShowSpeedOptions(!showSpeedOptions)}
            className={cn(
              "w-full py-2 px-3 text-xs rounded-lg border transition-colors",
              showSpeedOptions 
                ? "bg-juricast-accent/10 border-juricast-accent/20" 
                : "bg-juricast-background/50 border-transparent hover:bg-juricast-background"
            )}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="block font-medium">{playbackSpeed}x</span>
            <span className="block text-[10px] text-juricast-muted">Velocidade</span>
          </motion.button>
          
          {showSpeedOptions && (
            <motion.div
              className="absolute bottom-full left-0 mb-2 w-full bg-juricast-card border border-juricast-card/30 rounded-lg shadow-lg overflow-hidden z-30"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.2 }}
            >
              {speedOptions.map(speed => (
                <button
                  key={speed}
                  onClick={() => {
                    setPlaybackSpeed(speed);
                    setShowSpeedOptions(false);
                  }}
                  className={cn(
                    "w-full py-2 text-xs transition-colors",
                    playbackSpeed === speed 
                      ? "bg-juricast-accent/10 text-juricast-accent" 
                      : "hover:bg-juricast-background/50"
                  )}
                >
                  {speed}x
                </button>
              ))}
            </motion.div>
          )}
        </div>
        
        {/* Sleep timer button */}
        <div className="relative">
          <motion.button
            onClick={() => setShowSleepOptions(!showSleepOptions)}
            className={cn(
              "w-full py-2 px-3 text-xs rounded-lg border transition-colors",
              showSleepOptions || sleepTimerRemaining
                ? "bg-juricast-accent/10 border-juricast-accent/20" 
                : "bg-juricast-background/50 border-transparent hover:bg-juricast-background"
            )}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <div className="flex items-center justify-center gap-1">
              <Clock size={12} />
              <span className="font-medium">
                {sleepTimerRemaining ? formatSleepTimer(sleepTimerRemaining) : "Timer"}
              </span>
            </div>
            <span className="block text-[10px] text-juricast-muted">
              {sleepTimerRemaining ? "Ativo" : "Inativo"}
            </span>
          </motion.button>
          
          {showSleepOptions && (
            <motion.div
              className="absolute bottom-full left-0 mb-2 w-full bg-juricast-card border border-juricast-card/30 rounded-lg shadow-lg overflow-hidden z-30"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.2 }}
            >
              {sleepTimerRemaining && (
                <button
                  onClick={() => {
                    setSleepTimer(null);
                    setShowSleepOptions(false);
                  }}
                  className="w-full py-2 text-xs text-juricast-accent hover:bg-juricast-background/50"
                >
                  Cancelar timer
                </button>
              )}
              
              {sleepOptions.map(minutes => (
                <button
                  key={minutes}
                  onClick={() => {
                    setSleepTimer(minutes);
                    setShowSleepOptions(false);
                  }}
                  className="w-full py-2 text-xs hover:bg-juricast-background/50"
                >
                  {minutes} minutos
                </button>
              ))}
            </motion.div>
          )}
        </div>
        
        {/* Share button */}
        <motion.button
          onClick={handleShare}
          className="w-full py-2 px-3 text-xs rounded-lg bg-juricast-background/50 border border-transparent hover:bg-juricast-background transition-colors"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <div className="flex items-center justify-center gap-1">
            <Share size={12} />
            <span className="font-medium">Compartilhar</span>
          </div>
          <span className="block text-[10px] text-juricast-muted">Podcast</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default AudioPlayer;
