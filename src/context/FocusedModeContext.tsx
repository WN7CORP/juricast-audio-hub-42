
import React, { createContext, useContext, useState, useCallback } from 'react';
import { PodcastEpisode } from '@/lib/types';

interface FocusedModeContextType {
  isFocusedMode: boolean;
  currentPlaylist: PodcastEpisode[];
  currentEpisodeIndex: number;
  autoPlayNext: boolean;
  enableFocusedMode: (playlist: PodcastEpisode[], startIndex?: number) => void;
  disableFocusedMode: () => void;
  goToNextEpisode: () => boolean;
  goToPreviousEpisode: () => boolean;
  setAutoPlayNext: (enabled: boolean) => void;
  addToPlaylist: (episode: PodcastEpisode) => void;
  removeFromPlaylist: (episodeId: number) => void;
  reorderPlaylist: (fromIndex: number, toIndex: number) => void;
}

const FocusedModeContext = createContext<FocusedModeContextType | undefined>(undefined);

export const useFocusedMode = () => {
  const context = useContext(FocusedModeContext);
  if (!context) {
    throw new Error('useFocusedMode must be used within a FocusedModeProvider');
  }
  return context;
};

export const FocusedModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isFocusedMode, setIsFocusedMode] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState<PodcastEpisode[]>([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [autoPlayNext, setAutoPlayNext] = useState(true);

  const enableFocusedMode = useCallback((playlist: PodcastEpisode[], startIndex = 0) => {
    setCurrentPlaylist(playlist);
    setCurrentEpisodeIndex(startIndex);
    setIsFocusedMode(true);
  }, []);

  const disableFocusedMode = useCallback(() => {
    setIsFocusedMode(false);
    setCurrentPlaylist([]);
    setCurrentEpisodeIndex(0);
  }, []);

  const goToNextEpisode = useCallback((): boolean => {
    if (currentEpisodeIndex < currentPlaylist.length - 1) {
      setCurrentEpisodeIndex(prev => prev + 1);
      return true;
    }
    return false;
  }, [currentEpisodeIndex, currentPlaylist.length]);

  const goToPreviousEpisode = useCallback((): boolean => {
    if (currentEpisodeIndex > 0) {
      setCurrentEpisodeIndex(prev => prev - 1);
      return true;
    }
    return false;
  }, [currentEpisodeIndex]);

  const addToPlaylist = useCallback((episode: PodcastEpisode) => {
    setCurrentPlaylist(prev => [...prev, episode]);
  }, []);

  const removeFromPlaylist = useCallback((episodeId: number) => {
    setCurrentPlaylist(prev => {
      const newPlaylist = prev.filter(ep => ep.id !== episodeId);
      const removedIndex = prev.findIndex(ep => ep.id === episodeId);
      
      if (removedIndex <= currentEpisodeIndex && currentEpisodeIndex > 0) {
        setCurrentEpisodeIndex(currentEpisodeIndex - 1);
      }
      
      return newPlaylist;
    });
  }, [currentEpisodeIndex]);

  const reorderPlaylist = useCallback((fromIndex: number, toIndex: number) => {
    setCurrentPlaylist(prev => {
      const newPlaylist = [...prev];
      const [removed] = newPlaylist.splice(fromIndex, 1);
      newPlaylist.splice(toIndex, 0, removed);
      
      // Adjust current index if needed
      if (fromIndex === currentEpisodeIndex) {
        setCurrentEpisodeIndex(toIndex);
      } else if (fromIndex < currentEpisodeIndex && toIndex >= currentEpisodeIndex) {
        setCurrentEpisodeIndex(currentEpisodeIndex - 1);
      } else if (fromIndex > currentEpisodeIndex && toIndex <= currentEpisodeIndex) {
        setCurrentEpisodeIndex(currentEpisodeIndex + 1);
      }
      
      return newPlaylist;
    });
  }, [currentEpisodeIndex]);

  const value: FocusedModeContextType = {
    isFocusedMode,
    currentPlaylist,
    currentEpisodeIndex,
    autoPlayNext,
    enableFocusedMode,
    disableFocusedMode,
    goToNextEpisode,
    goToPreviousEpisode,
    setAutoPlayNext,
    addToPlaylist,
    removeFromPlaylist,
    reorderPlaylist,
  };

  return (
    <FocusedModeContext.Provider value={value}>
      {children}
    </FocusedModeContext.Provider>
  );
};
