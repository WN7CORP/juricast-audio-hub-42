
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { cn } from '@/lib/utils';
import { saveEpisodeProgress, getUserProgress } from '@/lib/podcast-service';
import { useQueryClient } from '@tanstack/react-query';

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
  const [waveformData, setWaveformData] = useState<number[]>([]);
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
    <div className="p-4 bg-juricast-card rounded-lg">
      <div className="flex flex-col items-center mb-4">
        <div className="relative w-full max-w-xs aspect-square mb-4">
          <img 
            src={thumbnail || 'public/placeholder.svg'} 
            alt={title}
            className="w-full h-full object-cover rounded-lg"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <button 
              onClick={handlePlayPause}
              className="w-16 h-16 flex items-center justify-center rounded-full bg-juricast-accent/90 text-white hover:bg-juricast-accent transition-colors"
            >
              {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
            </button>
          </div>
        </div>
      </div>

      <div className="waveform mb-2">
        {waveformData.map((value, index) => (
          <div 
            key={index} 
            className="waveform-bar"
            style={{ 
              height: `${value * 0.3}%`, 
              opacity: currentTime / duration > index / waveformData.length ? 1 : 0.5 
            }} 
          />
        ))}
      </div>

      <div className="flex justify-between text-juricast-muted text-sm mb-4">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      <div className="flex justify-center items-center gap-4">
        <button 
          onClick={handleSkipBackward}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-juricast-card/50 transition-colors"
        >
          <SkipBack size={20} />
        </button>
        <button 
          onClick={handlePlayPause}
          className="w-14 h-14 flex items-center justify-center rounded-full bg-juricast-accent text-white hover:bg-juricast-accent/90 transition-colors"
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
        </button>
        <button 
          onClick={handleSkipForward}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-juricast-card/50 transition-colors"
        >
          <SkipForward size={20} />
        </button>
      </div>

      <audio 
        ref={audioRef} 
        src={src} 
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleAudioEnded}
        className="hidden"
      />
    </div>
  );
};

export default AudioPlayer;
