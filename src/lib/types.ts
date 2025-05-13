
export interface PodcastEpisode {
  id: number;
  titulo: string;
  area: string;
  descricao: string;
  url_audio: string;
  imagem_miniatura: string;
  tag: string[];
  tema: string;
  sequencia: string;
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

export interface ThemeCard {
  name: string;
  episodeCount: number;
  image?: string;
  slug: string;
  area: string;
}

// Interface for the type of return from Supabase
export interface SupabaseEpisode {
  id: number;
  titulo: string;
  area: string;
  descricao: string;
  url_audio: string;
  imagem_miniatura: string;
  tag: string | string[];
  tema: string;
  sequencia: string;
  data_publicacao?: string;
  comentarios?: number;
  curtidas?: number;
}

// Global audio player context
export interface AudioPlayerState {
  isPlaying: boolean;
  currentEpisode: PodcastEpisode | null;
  volume: number;
  isMuted: boolean;
  duration: number;
  currentTime: number;
  playbackRate: number;
  showMiniPlayer: boolean;
  queue: PodcastEpisode[];
}

export interface AudioPlayerContextType {
  state: AudioPlayerState;
  play: (episode: PodcastEpisode) => void;
  pause: () => void;
  resume: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  seekTo: (time: number) => void;
  setPlaybackRate: (rate: number) => void;
  skipForward: (seconds?: number) => void;
  skipBackward: (seconds?: number) => void;
  addToQueue: (episode: PodcastEpisode) => void;
  removeFromQueue: (episodeId: number) => void;
  clearQueue: () => void;
  closeMiniPlayer: () => void;
}
