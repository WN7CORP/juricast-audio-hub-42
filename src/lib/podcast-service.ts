
import { supabase } from "@/integrations/supabase/client";
import { PodcastEpisode, UserProgress, UserFavorite, AreaCard, SupabaseEpisode } from "./types";

// Local storage keys
const PROGRESS_STORAGE_KEY = 'juricast_progress';
const FAVORITES_STORAGE_KEY = 'juricast_favorites';

// Get all podcast episodes
export async function getAllEpisodes(): Promise<PodcastEpisode[]> {
  try {
    const { data, error } = await supabase
      .from('podcast_tabela')
      .select('*');
    
    if (error) {
      console.error("Error fetching episodes:", error);
      throw error;
    }

    return formatEpisodes(data || []);
  } catch (error) {
    console.error("Error in getAllEpisodes:", error);
    return [];
  }
}

// Get episodes by area (category)
export async function getEpisodesByArea(area: string): Promise<PodcastEpisode[]> {
  try {
    // Format the area string to match how it might be stored in the database
    // First letter capitalized, spaces restored from dashes
    const formattedArea = area
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
    
    console.log("Searching for area:", formattedArea);
    
    const { data, error } = await supabase
      .from('podcast_tabela')
      .select('*')
      .ilike('area', `%${formattedArea}%`);
    
    if (error) {
      console.error(`Error fetching episodes for area ${area}:`, error);
      throw error;
    }

    console.log(`Found ${data?.length || 0} episodes for area ${formattedArea}`);
    return formatEpisodes(data || []);
  } catch (error) {
    console.error(`Error in getEpisodesByArea for ${area}:`, error);
    return [];
  }
}

// Get episode by ID
export async function getEpisodeById(id: number): Promise<PodcastEpisode | null> {
  try {
    const { data, error } = await supabase
      .from('podcast_tabela')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching episode with id ${id}:`, error);
      throw error;
    }

    if (!data) return null;
    
    // Use a proper cast to handle the type mismatch
    const episode = data as unknown as SupabaseEpisode;
    
    return {
      ...episode,
      tag: Array.isArray(episode.tag) ? episode.tag : [episode.tag],
      progresso: getUserProgress(episode.id)?.progress || 0,
      favorito: getUserFavorite(episode.id)?.isFavorite || false,
      comentarios: episode.comentarios || 0,
      curtidas: episode.curtidas || 0,
      data_publicacao: episode.data_publicacao || new Date().toLocaleDateString('pt-BR'),
      imagem_miniatura: episode.imagem_miniatuta // Map from database field to interface field
    };
  } catch (error) {
    console.error(`Error in getEpisodeById for ${id}:`, error);
    return null;
  }
}

// Get all unique areas with episode counts
export async function getAllAreas(): Promise<AreaCard[]> {
  try {
    const { data, error } = await supabase
      .from('podcast_tabela')
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
    
    // Convert to array of area cards
    const areas: AreaCard[] = Array.from(areasMap.entries()).map(([name, count]) => ({
      name,
      episodeCount: count,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      image: getAreaImage(name)
    }));
    
    return areas.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error("Error in getAllAreas:", error);
    return [];
  }
}

// Helper function to get representative image for an area
function getAreaImage(areaName: string): string {
  // Try to find an episode with this area to use its image
  return '/placeholder.svg'; // Fallback to placeholder
}

// Get featured episodes (most liked)
export function getFeaturedEpisodes(): Promise<PodcastEpisode[]> {
  return getAllEpisodes().then(episodes => 
    episodes
      .sort((a, b) => (b.curtidas || 0) - (a.curtidas || 0))
      .slice(0, 6)
  );
}

// Get recent episodes
export function getRecentEpisodes(): Promise<PodcastEpisode[]> {
  return getAllEpisodes().then(episodes => 
    episodes
      .sort((a, b) => {
        const dateA = a.data_publicacao ? new Date(a.data_publicacao).getTime() : 0;
        const dateB = b.data_publicacao ? new Date(b.data_publicacao).getTime() : 0;
        return dateB - dateA;
      })
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
function formatEpisodes(episodes: any[]): PodcastEpisode[] {
  return episodes.map(episode => ({
    ...episode,
    tag: Array.isArray(episode.tag) ? episode.tag : episode.tag ? [episode.tag] : [],
    progresso: getUserProgress(episode.id)?.progress || 0,
    favorito: getUserFavorite(episode.id)?.isFavorite || false,
    comentarios: episode.comentarios || 0,
    curtidas: episode.curtidas || 0,
    data_publicacao: episode.data_publicacao || new Date().toLocaleDateString('pt-BR'),
    imagem_miniatura: episode.imagem_miniatuta // Map from database field to our interface field
  }));
}
