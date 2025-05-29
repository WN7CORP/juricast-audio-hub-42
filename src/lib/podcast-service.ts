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

// IMPROVED: Better slug generation that preserves accents
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-áàâãéèêíìîóòôõúùûç]/g, '') // Keep accents and ç
    .replace(/--+/g, '-')
    .trim();
}

// IMPROVED: Convert slug back to proper name format
function normalizeAreaName(area: string): string {
  // Handle slug format (direito-medico -> Direito Médico)
  if (area.includes('-')) {
    return area
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
      .replace(/medico/i, 'Médico')
      .replace(/filosofia/i, 'Filosofia')
      .replace(/tributario/i, 'Tributário')
      .replace(/penal/i, 'Penal')
      .replace(/constitucional/i, 'Constitucional');
  }
  return area;
}

// Get all podcast episodes from JURIFY table
export async function getAllEpisodes(): Promise<PodcastEpisode[]> {
  try {
    const { data, error } = await supabase
      .from('JURIFY')
      .select('*')
      .order('data_publicacao', { ascending: false })
      .order('sequencia', { ascending: false });
    
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

// IMPROVED: Get episodes by area with flexible search
export async function getEpisodesByArea(area: string): Promise<PodcastEpisode[]> {
  try {
    if (!area) return [];
    
    console.log("🔍 Searching for area:", area);
    
    // Convert slug to proper name format
    const normalizedArea = normalizeAreaName(area);
    console.log("🔄 Normalized area:", normalizedArea);
    
    // Multiple search strategies
    const searchTerms = [
      area,
      normalizedArea,
      area.replace(/-/g, ' '),
      area.replace(/[-_]/g, ' '),
      area.charAt(0).toUpperCase() + area.slice(1).replace(/-/g, ' '),
      area.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    ];
    
    // Add specific mappings for known problematic areas
    const areaMapping: Record<string, string[]> = {
      'direito-medico': ['Direito Médico', 'Direito Mdico'],
      'direito-do-trabalho': ['Direito do Trabalho', 'Direito Trabalhista'],
      'filosofia-do-direito': ['Filosofia do Direito', 'Filosofia Jurídica'],
      'direito-tributario': ['Direito Tributário', 'Direito Fiscal'],
      'direito-penal': ['Direito Penal', 'Criminal'],
      'direito-constitucional': ['Direito Constitucional', 'Constitucional']
    };
    
    if (areaMapping[area]) {
      searchTerms.push(...areaMapping[area]);
    }
    
    console.log("🎯 Search terms:", searchTerms);
    
    let foundEpisodes: any[] = [];
    
    // Try each search term until we find results
    for (const searchTerm of searchTerms) {
      console.log(`🔍 Trying search term: "${searchTerm}"`);
      
      const { data, error } = await supabase
        .from('JURIFY')
        .select('*')
        .ilike('area', `%${searchTerm}%`)
        .order('data_publicacao', { ascending: false })
        .order('sequencia', { ascending: false });
      
      if (error) {
        console.error(`❌ Error searching for "${searchTerm}":`, error);
        continue;
      }
      
      if (data && data.length > 0) {
        console.log(`✅ Found ${data.length} episodes for "${searchTerm}"`);
        foundEpisodes = data;
        break;
      } else {
        console.log(`❌ No episodes found for "${searchTerm}"`);
      }
    }
    
    console.log(`📊 Total episodes found for area ${area}:`, foundEpisodes.length);
    return formatEpisodes(ensureTagsAreArrays(foundEpisodes));
  } catch (error) {
    console.error(`❌ Error in getEpisodesByArea for ${area}:`, error);
    return [];
  }
}

// IMPROVED: Get episodes by theme with flexible search
export async function getEpisodesByTheme(theme: string, area: string): Promise<PodcastEpisode[]> {
  try {
    const normalizedTheme = theme
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

    const normalizedArea = normalizeAreaName(area);
    
    console.log("🔍 Searching for theme:", normalizedTheme, "in area:", normalizedArea);
    
    const { data, error } = await supabase
      .from('JURIFY')
      .select('*')
      .ilike('tema', `%${normalizedTheme}%`)
      .ilike('area', `%${normalizedArea}%`)
      .order('data_publicacao', { ascending: false })
      .order('sequencia', { ascending: false });
    
    if (error) {
      console.error(`❌ Error fetching episodes for theme ${theme}:`, error);
      throw error;
    }

    console.log(`📊 Found ${data?.length || 0} episodes for theme ${normalizedTheme}`);
    return formatEpisodes(ensureTagsAreArrays(data || []));
  } catch (error) {
    console.error(`❌ Error in getEpisodesByTheme for ${theme}:`, error);
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
      console.error(`❌ Error fetching episode with id ${id}:`, error);
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
    console.error(`❌ Error in getEpisodeById for ${id}:`, error);
    return null;
  }
}

// IMPROVED: Get all unique areas with proper slug generation
export async function getAllAreas(): Promise<AreaCard[]> {
  try {
    const { data, error } = await supabase
      .from('JURIFY')
      .select('area');
    
    if (error) {
      console.error("❌ Error fetching areas:", error);
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
    
    console.log("📊 Areas found:", Array.from(areasMap.keys()));
    
    // Convert to array of area cards with proper categorization
    const areas: AreaCard[] = Array.from(areasMap.entries()).map(([name, count], index) => ({
      id: index + 1,
      name,
      episodeCount: count,
      slug: generateSlug(name), // Use improved slug generation
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
    console.error("❌ Error in getAllAreas:", error);
    return [];
  }
}

// IMPROVED: Helper function to categorize areas
function getCategoryForArea(areaName: string): 'juridico' | 'educativo' | 'pratico' {
  const educativeKeywords = [
    'artigos comentados', 
    'dicas oab', 
    'dicas para oab',
    'educação',
    'ensino',
    'aprendizagem'
  ];
  
  const lowerAreaName = areaName.toLowerCase();
  return educativeKeywords.some(keyword => 
    lowerAreaName.includes(keyword)
  ) ? 'educativo' : 'juridico';
}

// IMPROVED: Get all themes for a specific area with flexible search
export async function getThemesByArea(area: string): Promise<ThemeCard[]> {
  try {
    const normalizedArea = normalizeAreaName(area);
    console.log("🔍 Getting themes for area:", normalizedArea);
    
    const { data, error } = await supabase
      .from('JURIFY')
      .select('tema, area')
      .ilike('area', `%${normalizedArea}%`);
    
    if (error) {
      console.error(`❌ Error fetching themes for area ${area}:`, error);
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
    
    console.log(`📊 Found ${themesMap.size} themes for area ${normalizedArea}`);
    
    // Convert to array of theme cards
    const themes: ThemeCard[] = Array.from(themesMap.entries()).map(([name, info]) => ({
      name,
      episodeCount: info.count,
      slug: generateSlug(name),
      area: normalizedArea,
      image: getThemeImage(name)
    }));
    
    return themes.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error(`❌ Error in getThemesByArea for ${area}:`, error);
    return [];
  }
}

// Helper function to get representative image for an area
function getAreaImage(areaName: string): string {
  return '/placeholder.svg';
}

// Helper function to get representative image for a theme
function getThemeImage(themeName: string): string {
  return '/placeholder.svg';
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
      .sort((a, b) => {
        // Sort by date first, then by sequencia
        if (a.data_publicacao && b.data_publicacao) {
          return new Date(b.data_publicacao).getTime() - new Date(a.data_publicacao).getTime();
        }
        return (b.sequencia || '').localeCompare(a.sequencia || '');
      })
      .slice(0, 6);
      
    return featuredEpisodes;
  });
}

// IMPROVED: Get recent episodes with proper date sorting
export async function getRecentEpisodes(): Promise<PodcastEpisode[]> {
  try {
    const { data, error } = await supabase
      .from('JURIFY')
      .select('*')
      .order('data_publicacao', { ascending: false })
      .order('sequencia', { ascending: false })
      .limit(20);
    
    if (error) {
      console.error("❌ Error fetching recent episodes:", error);
      throw error;
    }

    console.log(`📊 Found ${data?.length || 0} recent episodes`);
    return formatEpisodes(ensureTagsAreArrays(data || []));
  } catch (error) {
    console.error("❌ Error in getRecentEpisodes:", error);
    return [];
  }
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
