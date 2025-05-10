
export interface PodcastEpisode {
  id: number;
  titulo: string;
  area: string;
  descricao: string;
  url_audio: string;
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

// Adicionar interface para o tipo de retorno do Supabase
export interface SupabaseEpisode {
  id: number;
  titulo: string;
  area: string;
  descricao: string;
  url_audio: string;
  imagem_miniatuta: string;  // Changed from imagem_miniatura to match database column name
  tag: string | string[];
  data_publicacao?: string;
  comentarios?: number;
  curtidas?: number;
}
