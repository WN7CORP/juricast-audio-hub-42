
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { saveEpisodeProgress, getUserProgress } from '@/lib/podcast-service';
import { useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';

interface AudioPlayerProps {
  src: string;
  title: string;
  thumbnail?: string;
  episodeId?: number;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, title, thumbnail, episodeId }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const progressRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  
  // Progress tracking
  const progressTrackingInterval = useRef<number | null>(null);
  
  // Generate random waveform data for visualization
  useEffect(() => {
    const generateWaveformData = () => {
      const data = Array(40).fill(0).map(() => Math.random() * 100);
      setWaveformData(data);
    };

    generateWaveformData();
  }, [src]);
  
  // Load saved progress
  useEffect(() => {
    if (episodeId !== undefined) {
      const savedProgress = getUserProgress(episodeId);
      if (savedProgress && audioRef.current) {
        audioRef.current.currentTime = savedProgress.lastPosition;
      }
    }
  }, [episodeId]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const currentTime = audioRef.current.currentTime;
      const duration = audioRef.current.duration || 0;
      setCurrentTime(currentTime);
      
      // Save progress if we have an episodeId
      if (episodeId !== undefined) {
        const progressPercent = duration > 0 ? Math.floor((currentTime / duration) * 100) : 0;
        // Don't save continuously, only every 5 seconds
        if (Math.floor(currentTime) % 5 === 0) {
          saveEpisodeProgress(episodeId, progressPercent, currentTime);
          
          // Invalidate relevant queries
          queryClient.invalidateQueries({ queryKey: ['inProgressEpisodes'] });
        }
      }
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current && audioRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      audioRef.current.currentTime = percent * duration;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume || 1;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };
  
  // Set up progress tracking when playing
  useEffect(() => {
    if (isPlaying && episodeId !== undefined) {
      // Clear any existing interval
      if (progressTrackingInterval.current) {
        window.clearInterval(progressTrackingInterval.current);
      }
      
      // Set new interval
      progressTrackingInterval.current = window.setInterval(() => {
        if (audioRef.current) {
          const currentTime = audioRef.current.currentTime;
          const duration = audioRef.current.duration || 0;
          const progressPercent = duration > 0 ? Math.floor((currentTime / duration) * 100) : 0;
          saveEpisodeProgress(episodeId, progressPercent, currentTime);
        }
      }, 5000); // Save every 5 seconds
    } else if (progressTrackingInterval.current) {
      // Clear interval when not playing
      window.clearInterval(progressTrackingInterval.current);
    }
    
    // Cleanup on unmount
    return () => {
      if (progressTrackingInterval.current) {
        window.clearInterval(progressTrackingInterval.current);
      }
    };
  }, [isPlaying, episodeId]);

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSkipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
    }
  };

  const handleSkipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(
        audioRef.current.duration,
        audioRef.current.currentTime + 10
      );
    }
  };
  
  const handleAudioEnded = () => {
    setIsPlaying(false);
    if (episodeId !== undefined) {
      saveEpisodeProgress(episodeId, 100, audioRef.current?.duration || 0);
      queryClient.invalidateQueries({ queryKey: ['inProgressEpisodes'] });
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '00:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div 
      className="p-4 bg-juricast-card rounded-lg border border-juricast-card/30"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex flex-col items-center mb-4">
        <motion.div 
          className="relative w-full max-w-xs aspect-square mb-4 overflow-hidden rounded-lg"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <motion.img 
            src={thumbnail || 'public/placeholder.svg'} 
            alt={title}
            className="w-full h-full object-cover"
            animate={{ 
              rotate: isPlaying ? [0, 360] : 0 
            }}
            transition={{ 
              duration: 20, 
              ease: "linear", 
              repeat: Infinity 
            }}
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <motion.button 
              onClick={handlePlayPause}
              className="w-16 h-16 flex items-center justify-center rounded-full bg-juricast-accent/90 text-white hover:bg-juricast-accent transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
            </motion.button>
          </div>
        </motion.div>
      </div>

      <div className="mb-3">
        <h2 className="text-lg font-semibold text-center mb-1">{title}</h2>
      </div>

      <div 
        className="w-full h-2 bg-juricast-background rounded-full overflow-hidden mb-2 cursor-pointer" 
        onClick={handleProgressClick}
        ref={progressRef}
      >
        <div 
          className="h-full bg-juricast-accent"
          style={{ width: `${(currentTime / duration) * 100}%` }}
        ></div>
      </div>

      <div className="flex justify-between text-juricast-muted text-sm mb-4">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      <div className="waveform mb-4">
        {waveformData.map((value, index) => (
          <motion.div 
            key={index} 
            className="waveform-bar"
            initial={{ height: '2%' }}
            animate={{ 
              height: `${value * 0.3}%`, 
              opacity: currentTime / duration > index / waveformData.length ? 1 : 0.5 
            }}
            transition={{ duration: 0.5, delay: index * 0.02 }}
          />
        ))}
      </div>

      <div className="flex justify-center items-center gap-4 mb-4">
        <motion.button 
          onClick={handleSkipBackward}
          className="player-button w-10 h-10 flex items-center justify-center rounded-full hover:bg-juricast-background/30"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <SkipBack size={20} />
        </motion.button>
        <motion.button 
          onClick={handlePlayPause}
          className="player-button w-14 h-14 flex items-center justify-center rounded-full bg-juricast-accent text-white hover:bg-juricast-accent/90"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
        </motion.button>
        <motion.button 
          onClick={handleSkipForward}
          className="player-button w-10 h-10 flex items-center justify-center rounded-full hover:bg-juricast-background/30"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <SkipForward size={20} />
        </motion.button>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={toggleMute} className="text-juricast-muted hover:text-juricast-text">
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

      <audio 
        ref={audioRef} 
        src={src} 
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleAudioEnded}
        className="hidden"
      />
    </motion.div>
  );
};

export default AudioPlayer;
