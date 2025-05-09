
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
