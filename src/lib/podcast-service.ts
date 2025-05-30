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

// Get all podcast episodes from JURIFY table - ORDERED BY SEQUENCIA (NUMERIC)
export async function getAllEpisodes(): Promise<PodcastEpisode[]> {
  try {
    const { data, error } = await supabase
      .from('JURIFY')
      .select('*')
      .order('sequencia', { ascending: true, nullsLast: true });
    
    if (error) {
      console.error("Error fetching episodes:", error);
      throw error;
    }

    // Sort numerically by sequencia to ensure proper ordering
    const sortedData = (data || []).sort((a, b) => {
      const seqA = parseInt(a.sequencia) || 0;
      const seqB = parseInt(b.sequencia) || 0;
      return seqA - seqB;
    });

    return formatEpisodes(ensureTagsAreArrays(sortedData));
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

// Get episodes by area (category) - ORDERED BY SEQUENCIA (NUMERIC)
export async function getEpisodesByArea(area: string): Promise<PodcastEpisode[]> {
  try {
    if (!area) return [];
    
    console.log("🔍 Searching for area:", area);
    
    // Convert slug back to possible area names with better matching
    const areaVariations = [
      area,
      area.replace(/-/g, ' '),
      area.replace(/[-_]/g, ' '),
      area.charAt(0).toUpperCase() + area.slice(1).replace(/-/g, ' '),
      area.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      // Add specific mappings for known areas
      area === 'direito-medico' ? 'Direito Médico' : '',
      area === 'direito-do-trabalho' ? 'Direito do Trabalho' : '',
      area === 'filosofia-do-direito' ? 'Filosofia do Direito' : '',
      area === 'direito-constitucional' ? 'Direito Constitucional' : '',
      area === 'direito-penal' ? 'Direito Penal' : '',
      area === 'processo-penal' ? 'Processo Penal' : '',
      area === 'processo-civil' ? 'Processo Civil' : '',
      area === 'dicas-oab' ? 'Dicas OAB' : '',
      area === 'artigos-comentados' ? 'Artigos Comentados' : '',
      area === 'juridico' ? '' : '', // Special case for "Jurídico" category
      // Additional variations for problematic cases
      area.includes('juridico') ? 'Direito' : '',
      area.includes('juridico') ? 'Civil' : '',
      area.includes('juridico') ? 'Penal' : '',
      area.includes('juridico') ? 'Constitucional' : ''
    ].filter(Boolean);
    
    let data = null;
    let error = null;
    
    // If searching for "juridico", get all legal areas
    if (area === 'juridico' || area.includes('juridico')) {
      console.log("🏛️ Searching for all juridical areas");
      
      const result = await supabase
        .from('JURIFY')
        .select('*')
        .not('area', 'ilike', '%artigos comentados%')
        .not('area', 'ilike', '%dicas oab%')
        .order('sequencia', { ascending: true, nullsLast: true });
      
      data = result.data;
      error = result.error;
    } else {
      // Try each variation using ILIKE for flexible matching
      for (const variation of areaVariations) {
        console.log("🔍 Trying variation:", variation);
        
        const result = await supabase
          .from('JURIFY')
          .select('*')
          .ilike('area', `%${variation}%`)
          .order('sequencia', { ascending: true, nullsLast: true });
        
        if (result.data?.length) {
          data = result.data;
          error = result.error;
          console.log(`✅ Found ${data.length} episodes for variation: ${variation}`);
          break;
        }
      }
    }
    
    if (error) {
      console.error(`❌ Error fetching episodes for area ${area}:`, error);
      throw error;
    }

    // Sort numerically by sequencia to ensure proper ordering
    const sortedData = (data || []).sort((a, b) => {
      const seqA = parseInt(a.sequencia) || 0;
      const seqB = parseInt(b.sequencia) || 0;
      return seqA - seqB;
    });

    console.log(`📊 Total episodes found for ${area}:`, sortedData.length);
    return formatEpisodes(ensureTagsAreArrays(sortedData));
  } catch (error) {
    console.error(`❌ Error in getEpisodesByArea for ${area}:`, error);
    return [];
  }
}

// Get episodes by theme - ORDERED BY SEQUENCIA (NUMERIC)
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
      .order('sequencia', { ascending: true, nullsLast: true });
    
    if (error) {
      console.error(`Error fetching episodes for theme ${theme}:`, error);
      throw error;
    }

    // Sort numerically by sequencia
    const sortedData = (data || []).sort((a, b) => {
      const seqA = parseInt(a.sequencia) || 0;
      const seqB = parseInt(b.sequencia) || 0;
      return seqA - seqB;
    });

    console.log(`Found ${sortedData.length} episodes for theme ${formattedTheme}`);
    return formatEpisodes(ensureTagsAreArrays(sortedData));
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
    
    console.log("📊 Areas found:", Array.from(areasMap.keys()));
    
    // Convert to array of area cards with categorization
    const areas: AreaCard[] = Array.from(areasMap.entries()).map(([name, count], index) => ({
      id: index + 1,
      name,
      episodeCount: count,
      slug: createSlugFromAreaName(name),
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

// Helper function to create slug from area name
function createSlugFromAreaName(areaName: string): string {
  return areaName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ç]/g, 'c')
    .replace(/[ñ]/g, 'n')
    .replace(/[^a-z0-9-]/g, '');
}

// Helper function to categorize areas
function getCategoryForArea(areaName: string): 'juridico' | 'educativo' | 'pratico' {
  const educativeAreas = [
    'Artigos comentados', 
    'Artigos Comentados', 
    'Dicas OAB', 
    'Dicas para OAB',
    'Artigos comentados',
    'artigos comentados',
    'ARTIGOS COMENTADOS'
  ];
  
  return educativeAreas.some(area => 
    areaName.toLowerCase().includes(area.toLowerCase())
  ) ? 'educativo' : 'juridico';
}

// Get all themes for a specific area - ORDERED BY SEQUENCIA
export async function getThemesByArea(area: string): Promise<ThemeCard[]> {
  try {
    // Convert slug back to possible area names using same logic as getEpisodesByArea
    const areaVariations = [
      area,
      area.replace(/-/g, ' '),
      area.replace(/[-_]/g, ' '),
      area.charAt(0).toUpperCase() + area.slice(1).replace(/-/g, ' '),
      area.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      // Add specific mappings for known areas
      area === 'direito-medico' ? 'Direito Médico' : '',
      area === 'direito-do-trabalho' ? 'Direito do Trabalho' : '',
      area === 'filosofia-do-direito' ? 'Filosofia do Direito' : '',
      area === 'direito-constitucional' ? 'Direito Constitucional' : '',
      area === 'direito-penal' ? 'Direito Penal' : '',
      area === 'processo-penal' ? 'Processo Penal' : '',
      area === 'processo-civil' ? 'Processo Civil' : '',
      area === 'dicas-oab' ? 'Dicas OAB' : '',
      area === 'artigos-comentados' ? 'Artigos Comentados' : ''
    ].filter(Boolean);
    
    let data = null;
    let error = null;
    
    // Try each variation using ILIKE for flexible matching
    for (const variation of areaVariations) {
      const result = await supabase
        .from('JURIFY')
        .select('tema, area')
        .ilike('area', `%${variation}%`);
      
      if (result.data?.length) {
        data = result.data;
        error = result.error;
        break;
      }
    }
    
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
      area: info.area, // Use the actual area name from database
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

// Get featured episodes (most recent from each area) - ORDERED BY SEQUENCIA
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
    
    // Get the first episode from each area (they're already ordered by sequencia)
    const featuredEpisodes = Object.values(episodesByArea)
      .map(areaEpisodes => areaEpisodes[0])
      .slice(0, 6);
      
    return featuredEpisodes;
  });
}

// Get recent episodes - ORDERED BY DATA (most recent first)
export async function getRecentEpisodes(): Promise<PodcastEpisode[]> {
  try {
    const { data, error } = await supabase
      .from('JURIFY')
      .select('*')
      .not('data', 'is', null)
      .order('data', { ascending: false, nullsLast: true })
      .limit(20);
    
    if (error) {
      console.error("Error fetching recent episodes:", error);
      throw error;
    }

    // Additional sort by date to ensure proper ordering
    const sortedData = (data || []).sort((a, b) => {
      const dateA = new Date(a.data || '1900-01-01');
      const dateB = new Date(b.data || '1900-01-01');
      return dateB.getTime() - dateA.getTime();
    });

    console.log("📅 Recent episodes ordered by date:", sortedData.length);
    return formatEpisodes(ensureTagsAreArrays(sortedData));
  } catch (error) {
    console.error("Error in getRecentEpisodes:", error);
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
