
export interface PodcastEpisode {
  id: number;
  titulo: string;
  area: string;
  descricao: string;
  url_audio: string;
  arquivo: string; // Add this property that is being used in the context
  imagem_miniatura: string;
  tag: string[];
  data_publicacao?: string;
  comentarios?: number;
  curtidas?: number;
  progresso?: number;
  favorito?: boolean;
}

export interface UserProgress {
  episodeId: number;
  progress: number;
  lastPosition: number;
}

export interface UserFavorite {
  episodeId: number;
  isFavorite: boolean;
}

export interface AreaCard {
  name: string;
  episodeCount: number;
  image?: string;
  slug: string;
}

// Interface for the type of return from Supabase
export interface SupabaseEpisode {
  id: number;
  titulo: string;
  area: string;
  descricao: string;
  url_audio: string;
  imagem_miniatuta: string;  // Database column name
  tag: string | string[];
  data_publicacao?: string;
  comentarios?: number;
  curtidas?: number;
}
