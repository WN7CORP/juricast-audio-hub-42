

// Fix the formatEpisodes function at the bottom of the file to handle proper types

import { supabase } from "@/integrations/supabase/client";
import { PodcastEpisode, UserProgress, UserFavorite, AreaCard, ThemeCard, SupabaseEpisode } from "./types";

// Local storage keys
const PROGRESS_STORAGE_KEY = 'juricast_progress';
const FAVORITES_STORAGE_KEY = 'juricast_favorites';
const USER_IP_KEY = 'juricast_user_ip';

// Get IP to identify users without authentication
export async function saveUserIP() {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    localStorage.setItem(USER_IP_KEY, data.ip);
    return data.ip;
  } catch (error) {
    console.error("Error fetching IP:", error);
    return null;
  }
}

export function getUserIP() {
  return localStorage.getItem(USER_IP_KEY) || 'anonymous';
}

// Get all podcast episodes from JURIFY table
export async function getAllEpisodes(): Promise<PodcastEpisode[]> {
  try {
    const { data, error } = await supabase
      .from('JURIFY')
      .select('*')
      .order('sequencia', { ascending: true });
    
    if (error) {
      console.error("Error fetching episodes:", error);
      throw error;
    }

    return formatEpisodes(ensureTagsAreArrays(data || []));
  } catch (error) {
    console.error("Error in getAllEpisodes:", error);
    return [];
  }
}

// Helper function to ensure tags are arrays
function ensureTagsAreArrays(episodes: any[]): SupabaseEpisode[] {
  return episodes.map(episode => ({
    ...episode,
    tag: Array.isArray(episode.tag) ? episode.tag : episode.tag ? [episode.tag] : []
  }));
}

// Get episodes by area (category)
export async function getEpisodesByArea(area: string): Promise<PodcastEpisode[]> {
  try {
    if (!area) return [];
    
    // Format the area string to match how it might be stored in the database
    // First letter capitalized, spaces restored from dashes
    const formattedArea = area
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
    
    console.log("Searching for area:", formattedArea);
    
    const { data, error } = await supabase
      .from('JURIFY')
      .select('*')
      .ilike('area', `%${formattedArea}%`)
      .order('sequencia', { ascending: true });
    
    if (error) {
      console.error(`Error fetching episodes for area ${area}:`, error);
      throw error;
    }

    console.log(`Found ${data?.length || 0} episodes for area ${formattedArea}`);
    return formatEpisodes(ensureTagsAreArrays(data || []));
  } catch (error) {
    console.error(`Error in getEpisodesByArea for ${area}:`, error);
    return [];
  }
}

// Get episodes by theme
export async function getEpisodesByTheme(theme: string, area: string): Promise<PodcastEpisode[]> {
  try {
    // Format the theme string to match how it might be stored in the database
    const formattedTheme = theme
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

    const formattedArea = area
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
    
    console.log("Searching for theme:", formattedTheme, "in area:", formattedArea);
    
    const { data, error } = await supabase
      .from('JURIFY')
      .select('*')
      .ilike('tema', `%${formattedTheme}%`)
      .ilike('area', `%${formattedArea}%`)
      .order('sequencia', { ascending: true });
    
    if (error) {
      console.error(`Error fetching episodes for theme ${theme}:`, error);
      throw error;
    }

    console.log(`Found ${data?.length || 0} episodes for theme ${formattedTheme}`);
    return formatEpisodes(ensureTagsAreArrays(data || []));
  } catch (error) {
    console.error(`Error in getEpisodesByTheme for ${theme}:`, error);
    return [];
  }
}

// Get episode by ID
export async function getEpisodeById(id: number): Promise<PodcastEpisode | null> {
  try {
    const { data, error } = await supabase
      .from('JURIFY')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching episode with id ${id}:`, error);
      throw error;
    }

    if (!data) return null;
    
    // Format the episode data with proper handling of optional properties
    const episode = {
      ...data,
      tag: Array.isArray(data.tag) ? data.tag : data.tag ? [data.tag] : [],
      progresso: getUserProgress(data.id)?.progress || 0,
      favorito: getUserFavorite(data.id)?.isFavorite || false,
      comentarios: (data as any).comentarios || 0,
      curtidas: (data as any).curtidas || 0,
      data_publicacao: (data as any).data_publicacao || new Date().toLocaleDateString('pt-BR'),
    };
    
    return episode;
  } catch (error) {
    console.error(`Error in getEpisodeById for ${id}:`, error);
    return null;
  }
}

// Get all unique areas with episode counts and categorization
export async function getAllAreas(): Promise<AreaCard[]> {
  try {
    const { data, error } = await supabase
      .from('JURIFY')
      .select('area');
    
    if (error) {
      console.error("Error fetching areas:", error);
      throw error;
    }

    const areasMap = new Map<string, number>();
    
    // Count episodes per area
    data?.forEach(episode => {
      if (episode.area) {
        const count = areasMap.get(episode.area) || 0;
        areasMap.set(episode.area, count + 1);
      }
    });
    
    // Convert to array of area cards with categorization
    const areas: AreaCard[] = Array.from(areasMap.entries()).map(([name, count], index) => ({
      id: index + 1,
      name,
      episodeCount: count,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      image: getAreaImage(name),
      category: getCategoryForArea(name)
    }));
    
    return areas.sort((a, b) => {
      // Sort by category first (juridico first), then by name
      if (a.category !== b.category) {
        if (a.category === 'juridico') return -1;
        if (b.category === 'juridico') return 1;
        if (a.category === 'educativo') return -1;
        if (b.category === 'educativo') return 1;
      }
      return a.name.localeCompare(b.name);
    });
  } catch (error) {
    console.error("Error in getAllAreas:", error);
    return [];
  }
}

// Helper function to categorize areas
function getCategoryForArea(areaName: string): 'juridico' | 'educativo' | 'pratico' {
  const educativeAreas = ['Artigos comentados', 'Dicas OAB'];
  return educativeAreas.includes(areaName) ? 'educativo' : 'juridico';
}

// Get all themes for a specific area
export async function getThemesByArea(area: string): Promise<ThemeCard[]> {
  try {
    const formattedArea = area
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
    
    const { data, error } = await supabase
      .from('JURIFY')
      .select('tema, area')
      .eq('area', formattedArea);
    
    if (error) {
      console.error(`Error fetching themes for area ${area}:`, error);
      throw error;
    }

    const themesMap = new Map<string, {count: number, area: string}>();
    
    // Count episodes per theme
    data?.forEach(episode => {
      if (episode.tema) {
        const current = themesMap.get(episode.tema) || {count: 0, area: episode.area};
        themesMap.set(episode.tema, {
          count: current.count + 1,
          area: episode.area
        });
      }
    });
    
    // Convert to array of theme cards
    const themes: ThemeCard[] = Array.from(themesMap.entries()).map(([name, info]) => ({
      name,
      episodeCount: info.count,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      area: formattedArea,
      image: getThemeImage(name)
    }));
    
    return themes.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error(`Error in getThemesByArea for ${area}:`, error);
    return [];
  }
}

// Helper function to get representative image for an area
function getAreaImage(areaName: string): string {
  // Try to find an episode with this area to use its image
  return '/placeholder.svg'; // Fallback to placeholder
}

// Helper function to get representative image for a theme
function getThemeImage(themeName: string): string {
  // Try to find an episode with this theme to use its image
  return '/placeholder.svg'; // Fallback to placeholder
}

// Get featured episodes (most recent from each area)
export async function getFeaturedEpisodes(): Promise<PodcastEpisode[]> {
  return getAllEpisodes().then(episodes => {
    // Group episodes by area
    const episodesByArea = episodes.reduce<Record<string, PodcastEpisode[]>>((acc, episode) => {
      if (!acc[episode.area]) {
        acc[episode.area] = [];
      }
      acc[episode.area].push(episode);
      return acc;
    }, {});
    
    // Get the most recent episode from each area
    const featuredEpisodes = Object.values(episodesByArea)
      .map(areaEpisodes => areaEpisodes[0])
      .sort((a, b) => (b.sequencia || '').localeCompare(a.sequencia || ''))
      .slice(0, 6);
      
    return featuredEpisodes;
  });
}

// Get recent episodes
export async function getRecentEpisodes(): Promise<PodcastEpisode[]> {
  return getAllEpisodes().then(episodes => 
    episodes
      .sort((a, b) => (b.sequencia || '').localeCompare(a.sequencia || ''))
      .slice(0, 6)
  );
}

// Local storage for progress management
export function saveEpisodeProgress(episodeId: number, progress: number, position: number = 0): void {
  try {
    const progressData = getProgressData();
    progressData[episodeId] = { 
      episodeId, 
      progress, 
      lastPosition: position 
    };
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progressData));
  } catch (error) {
    console.error("Error saving episode progress:", error);
  }
}

export function getUserProgress(episodeId: number): UserProgress | null {
  try {
    const progressData = getProgressData();
    return progressData[episodeId] || null;
  } catch (error) {
    console.error("Error getting user progress:", error);
    return null;
  }
}

export function getInProgressEpisodes(): Promise<PodcastEpisode[]> {
  try {
    const progressData = getProgressData();
    const episodeIds = Object.keys(progressData).map(Number);
    
    return getAllEpisodes().then(episodes => 
      episodes.filter(episode => 
        episodeIds.includes(episode.id) && 
        progressData[episode.id].progress > 0 && 
        progressData[episode.id].progress < 100
      )
    );
  } catch (error) {
    console.error("Error getting in-progress episodes:", error);
    return Promise.resolve([]);
  }
}

export function getCompletedEpisodes(): Promise<PodcastEpisode[]> {
  try {
    const progressData = getProgressData();
    const episodeIds = Object.keys(progressData).map(Number);
    
    return getAllEpisodes().then(episodes => 
      episodes.filter(episode => 
        episodeIds.includes(episode.id) && 
        progressData[episode.id].progress === 100
      )
    );
  } catch (error) {
    console.error("Error getting completed episodes:", error);
    return Promise.resolve([]);
  }
}

// Local storage for favorites management
export function toggleFavorite(episodeId: number): boolean {
  try {
    const favoritesData = getFavoritesData();
    const isFavorite = favoritesData[episodeId]?.isFavorite || false;
    
    favoritesData[episodeId] = { 
      episodeId, 
      isFavorite: !isFavorite 
    };
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoritesData));
    
    return !isFavorite;
  } catch (error) {
    console.error("Error toggling favorite:", error);
    return false;
  }
}

export function getUserFavorite(episodeId: number): UserFavorite | null {
  try {
    const favoritesData = getFavoritesData();
    return favoritesData[episodeId] || null;
  } catch (error) {
    console.error("Error getting user favorite:", error);
    return null;
  }
}

export function getFavoriteEpisodes(): Promise<PodcastEpisode[]> {
  try {
    const favoritesData = getFavoritesData();
    const favoriteIds = Object.keys(favoritesData)
      .map(Number)
      .filter(id => favoritesData[id].isFavorite);
    
    return getAllEpisodes().then(episodes => 
      episodes.filter(episode => favoriteIds.includes(episode.id))
    );
  } catch (error) {
    console.error("Error getting favorite episodes:", error);
    return Promise.resolve([]);
  }
}

// Helper functions
function getProgressData(): Record<number, UserProgress> {
  try {
    const data = localStorage.getItem(PROGRESS_STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

function getFavoritesData(): Record<number, UserFavorite> {
  try {
    const data = localStorage.getItem(FAVORITES_STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

// Format episodes with additional client-side data
function formatEpisodes(episodes: SupabaseEpisode[]): PodcastEpisode[] {
  return episodes.map(episode => ({
    ...episode,
    tag: Array.isArray(episode.tag) ? episode.tag : episode.tag ? [episode.tag] : [],
    progresso: getUserProgress(episode.id)?.progress || 0,
    favorito: getUserFavorite(episode.id)?.isFavorite || false,
    comentarios: episode.comentarios || 0,
    curtidas: episode.curtidas || 0,
    data_publicacao: episode.data_publicacao || new Date().toLocaleDateString('pt-BR'),
  }));
}

