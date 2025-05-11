
import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { PodcastEpisode } from '@/lib/types';

interface AudioPlayerContextType {
  currentEpisode: PodcastEpisode | null;
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  playbackSpeed: number;
  volume: number;
  isMuted: boolean;
  audioRef: React.RefObject<HTMLAudioElement>;
  playEpisode: (episode: PodcastEpisode) => void;
  togglePlayPause: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  seek: (time: number) => void;
  skipForward: (seconds?: number) => void;
  skipBackward: (seconds?: number) => void;
  setPlaybackSpeed: (speed: number) => void;
  setSleepTimer: (minutes: number | null) => void;
  sleepTimerRemaining: number | null;
  showMiniPlayer: boolean;
  setShowMiniPlayer: (show: boolean) => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentEpisode, setCurrentEpisode] = useState<PodcastEpisode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [volume, setVolumeState] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showMiniPlayer, setShowMiniPlayer] = useState(false);
  const [sleepTimerRemaining, setSleepTimerRemaining] = useState<number | null>(null);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const sleepTimerRef = useRef<number | null>(null);
  const progressTrackingInterval = useRef<number | null>(null);

  useEffect(() => {
    // Clean up on unmount
    return () => {
      if (sleepTimerRef.current) {
        window.clearTimeout(sleepTimerRef.current);
      }
      if (progressTrackingInterval.current) {
        window.clearInterval(progressTrackingInterval.current);
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  const playEpisode = (episode: PodcastEpisode) => {
    setCurrentEpisode(episode);
    setIsPlaying(true);
    setShowMiniPlayer(true);

    // Reset sleep timer if there was one
    if (sleepTimerRef.current) {
      window.clearTimeout(sleepTimerRef.current);
      setSleepTimerRemaining(null);
    }

    // Start with a small delay to allow audio to load
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play().catch(error => {
          console.error("Error playing audio:", error);
          setIsPlaying(false);
          toast({
            title: "Erro na reprodução",
            description: "Não foi possível reproduzir o áudio. Tente novamente.",
            variant: "destructive"
          });
        });
      }
    }, 100);
  };

  const togglePlayPause = () => {
    if (!currentEpisode) return;

    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      audioRef.current?.play().catch(error => {
        console.error("Error playing audio:", error);
        toast({
          title: "Erro na reprodução",
          description: "Não foi possível reproduzir o áudio. Tente novamente.",
          variant: "destructive"
        });
      });
      setIsPlaying(true);
    }
  };

  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume);
    
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const skipForward = (seconds: number = 10) => {
    if (audioRef.current) {
      const newTime = Math.min(audioRef.current.duration, audioRef.current.currentTime + seconds);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const skipBackward = (seconds: number = 10) => {
    if (audioRef.current) {
      const newTime = Math.max(0, audioRef.current.currentTime - seconds);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const setSleepTimer = (minutes: number | null) => {
    // Clear any existing timer
    if (sleepTimerRef.current) {
      window.clearTimeout(sleepTimerRef.current);
      sleepTimerRef.current = null;
    }

    // Set new timer if minutes is provided
    if (minutes) {
      const milliseconds = minutes * 60 * 1000;
      setSleepTimerRemaining(milliseconds / 1000);
      
      // Create a countdown effect
      const countdownInterval = window.setInterval(() => {
        setSleepTimerRemaining(prev => {
          if (prev && prev > 1) {
            return prev - 1;
          } else {
            clearInterval(countdownInterval);
            return null;
          }
        });
      }, 1000);
      
      // Set the actual sleep timer
      sleepTimerRef.current = window.setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.pause();
          setIsPlaying(false);
        }
        toast({
          title: "Timer de sono",
          description: "Reprodução pausada pelo timer de sono."
        });
        setSleepTimerRemaining(null);
        sleepTimerRef.current = null;
      }, milliseconds);
    } else {
      // If no minutes provided, clear the timer
      setSleepTimerRemaining(null);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleDurationChange = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    // Optionally play next episode here
  };

  return (
    <AudioPlayerContext.Provider
      value={{
        currentEpisode,
        isPlaying,
        duration,
        currentTime,
        playbackSpeed,
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
        setSleepTimer,
        sleepTimerRemaining,
        showMiniPlayer,
        setShowMiniPlayer
      }}
    >
      {children}
      <audio
        ref={audioRef}
        src={currentEpisode?.url_audio}
        onTimeUpdate={handleTimeUpdate}
        onDurationChange={handleDurationChange}
        onEnded={handleEnded}
        style={{ display: 'none' }}
      />
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  
  if (context === undefined) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
  }
  
  return context;
};
