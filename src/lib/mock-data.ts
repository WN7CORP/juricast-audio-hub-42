// This file is now deprecated as we're using Supabase directly.
// Keeping this file as a reference but all functionality has been moved to podcast-service.ts

import { PodcastEpisode } from './types';

export const mockPodcastEpisodes: PodcastEpisode[] = [];

export const getRecentEpisodes = () => {
  console.warn('Using mock function getRecentEpisodes. This should be replaced with podcast-service.');
  return [];
};

export const getPopularEpisodes = () => {
  console.warn('Using mock function getPopularEpisodes. This should be replaced with podcast-service.');
  return [];
};

export const getFeaturedEpisodes = () => {
  console.warn('Using mock function getFeaturedEpisodes. This should be replaced with podcast-service.');
  return [];
};

export const getInProgressEpisodes = () => {
  console.warn('Using mock function getInProgressEpisodes. This should be replaced with podcast-service.');
  return [];
};

export const getFavoriteEpisodes = () => {
  console.warn('Using mock function getFavoriteEpisodes. This should be replaced with podcast-service.');
  return [];
};

export const getEpisodesByArea = (area: string) => {
  console.warn('Using mock function getEpisodesByArea. This should be replaced with podcast-service.');
  return [];
};

export const getEpisodeById = (id: number) => {
  console.warn('Using mock function getEpisodeById. This should be replaced with podcast-service.');
  return null;
};
