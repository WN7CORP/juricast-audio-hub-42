import React, { createContext, useState, useRef, useEffect, useContext } from 'react';
import { PodcastEpisode } from '@/lib/types';

interface AudioPlayerContextProps {
  currentEpisode: PodcastEpisode | null;
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  volume: number;
  isMuted: boolean;
  audioRef: React.RefObject<HTMLAudioElement>;
  playbackSpeed: number;
  showMiniPlayer: boolean;
  sleepTimerRemaining: number | null;
  progress: number; // Add progress property
  playEpisode: (episode: PodcastEpisode) => void;
  togglePlayPause: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  seek: (time: number) => void;
  skipForward: (seconds?: number) => void;
  skipBackward: (seconds?: number) => void;
  setPlaybackSpeed: (speed: number) => void;
  setShowMiniPlayer: (show: boolean) => void;
  setSleepTimer: (minutes: number | null) => void;
}

const defaultContextValue: AudioPlayerContextProps = {
  currentEpisode: null,
  isPlaying: false,
  duration: 0,
  currentTime: 0,
  volume: 0.5,
  isMuted: false,
  audioRef: { current: null },
  playbackSpeed: 1,
  showMiniPlayer: false,
  sleepTimerRemaining: null,
  progress: 0,
  playEpisode: () => {},
  togglePlayPause: () => {},
  setVolume: () => {},
  toggleMute: () => {},
  seek: () => {},
  skipForward: () => {},
  skipBackward: () => {},
  setPlaybackSpeed: () => {},
  setShowMiniPlayer: () => {},
  setSleepTimer: () => {},
};

const AudioPlayerContext = createContext<AudioPlayerContextProps>(defaultContextValue);

export const useAudioPlayer = () => useContext(AudioPlayerContext);

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentEpisode, setCurrentEpisode] = useState<PodcastEpisode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showMiniPlayer, setShowMiniPlayer] = useState(false);
  const [sleepTimerRemaining, setSleepTimerRemaining] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [timerIntervalId, setTimerIntervalId] = useState<NodeJS.Timeout | null>(null);

  // Add progress calculation
  const progress = duration > 0 ? currentTime / duration : 0;

  useEffect(() => {
    if (sleepTimerRemaining !== null && sleepTimerRemaining > 0) {
      const id = setInterval(() => {
        setSleepTimerRemaining(prev => {
          if (prev === null) {
            clearInterval(timerIntervalId!);
            return null;
          }
          const newValue = prev - 1;
          if (newValue <= 0) {
            setIsPlaying(false);
            clearInterval(id);
            return null;
          }
          return newValue;
        });
      }, 1000);
      setTimerIntervalId(id);

      return () => clearInterval(id);
    } else if (timerIntervalId) {
      clearInterval(timerIntervalId);
      setTimerIntervalId(null);
    }
  }, [sleepTimerRemaining]);

  const playEpisode = (episode: PodcastEpisode) => {
    setCurrentEpisode(episode);
    setIsPlaying(true);
    setShowMiniPlayer(true);
    if (audioRef.current) {
      audioRef.current.src = episode.arquivo;
      audioRef.current.load();
      audioRef.current.play().catch(error => {
        console.error("Playback failed:", error);
      });
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (audioRef.current) {
      isPlaying ? audioRef.current.pause() : audioRef.current.play();
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const skipForward = (seconds: number = 15) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(audioRef.current.currentTime + seconds, duration);
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const skipBackward = (seconds: number = 15) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(audioRef.current.currentTime - seconds, 0);
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const setSleepTimer = (minutes: number | null) => {
    if (minutes === null) {
      setSleepTimerRemaining(null);
    } else {
      setSleepTimerRemaining(minutes * 60);
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const contextValue = {
    currentEpisode,
    isPlaying,
    duration,
    currentTime,
    volume,
    isMuted,
    audioRef,
    playbackSpeed,
    showMiniPlayer,
    sleepTimerRemaining,
    progress, // Add progress to context value
    playEpisode,
    togglePlayPause,
    setVolume,
    toggleMute,
    seek,
    skipForward,
    skipBackward,
    setPlaybackSpeed,
    setShowMiniPlayer,
    setSleepTimer,
  };

  return (
    <AudioPlayerContext.Provider value={contextValue}>
      <audio
        ref={audioRef}
        src={currentEpisode ? currentEpisode.arquivo : ""}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => {
          console.log('Audio ended');
          setIsPlaying(false);
        }}
      />
      {children}
    </AudioPlayerContext.Provider>
  );
};
