
import { PodcastEpisode } from './types';

export const mockPodcastEpisodes: PodcastEpisode[] = [
  {
    id: 1,
    titulo: "Crimes contra a família",
    area: "Direito Penal",
    descricao: "Neste episódio, discutimos em detalhes os crimes contra a família no Código Penal Brasileiro, análise jurisprudencial e casos emblemáticos.",
    url_audio: "https://ia801504.us.archive.org/13/items/30MinPodcastDemo/30MinPodcastDemo.mp3",
    imagem_miniatura: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
    tag: ["direito penal", "crimes", "família"],
    data_publicacao: "30 de abr. de 2025",
    comentarios: 12,
    curtidas: 1
  },
  {
    id: 2,
    titulo: "Bens no Código Civil e Classificação",
    area: "Direito Civil",
    descricao: "O texto fornece um resumo abrangente sobre bens no Código Civil Brasileiro, começando por uma análise detalhada dos conceitos fundamentais.",
    url_audio: "https://ia801504.us.archive.org/13/items/30MinPodcastDemo/30MinPodcastDemo.mp3",
    imagem_miniatura: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    tag: ["direito civil", "bens", "classificação"],
    data_publicacao: "30 de abr. de 2025",
    comentarios: 4,
    curtidas: 54,
    favorito: true
  },
  {
    id: 3,
    titulo: "Principais Crimes - OAB",
    area: "Direito Penal",
    descricao: "Revisão completa sobre os principais crimes cobrados nos exames da OAB, com foco nas questões mais recentes.",
    url_audio: "https://ia801504.us.archive.org/13/items/30MinPodcastDemo/30MinPodcastDemo.mp3",
    imagem_miniatura: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    tag: ["oab", "exame", "crimes"],
    data_publicacao: "28 de abr. de 2025",
    comentarios: 8,
    curtidas: 32,
    progresso: 65
  },
  {
    id: 4,
    titulo: "Concurso de Crimes - OAB",
    area: "Direito Penal",
    descricao: "Análise detalhada sobre o concurso de crimes e suas implicações para os exames da OAB e concursos públicos.",
    url_audio: "https://ia801504.us.archive.org/13/items/30MinPodcastDemo/30MinPodcastDemo.mp3",
    imagem_miniatura: "https://images.unsplash.com/photo-1505664194779-8beaceb93744",
    tag: ["oab", "exame", "concurso de crimes"],
    data_publicacao: "27 de abr. de 2025",
    comentarios: 6,
    curtidas: 45,
    progresso: 65
  },
  {
    id: 5,
    titulo: "Contratos no Direito Civil",
    area: "Direito Civil",
    descricao: "Uma análise completa sobre teoria geral dos contratos, princípios contratuais e as principais modalidades previstas no Código Civil.",
    url_audio: "https://ia801504.us.archive.org/13/items/30MinPodcastDemo/30MinPodcastDemo.mp3",
    imagem_miniatura: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    tag: ["direito civil", "contratos", "obrigações"],
    data_publicacao: "26 de abr. de 2025",
    comentarios: 15,
    curtidas: 67
  },
  {
    id: 6,
    titulo: "Princípios Constitucionais",
    area: "Direito Constitucional",
    descricao: "Discussão sobre os princípios fundamentais da Constituição Federal e sua aplicação prática no ordenamento jurídico brasileiro.",
    url_audio: "https://ia801504.us.archive.org/13/items/30MinPodcastDemo/30MinPodcastDemo.mp3",
    imagem_miniatura: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f",
    tag: ["direito constitucional", "princípios", "constituição"],
    data_publicacao: "25 de abr. de 2025",
    comentarios: 23,
    curtidas: 89,
    favorito: true
  }
];

export const getRecentEpisodes = () => {
  return [...mockPodcastEpisodes].sort((a, b) => {
    const dateA = new Date(a.data_publicacao).getTime();
    const dateB = new Date(b.data_publicacao).getTime();
    return dateB - dateA;
  });
};

export const getPopularEpisodes = () => {
  return [...mockPodcastEpisodes].sort((a, b) => b.curtidas - a.curtidas);
};

export const getFeaturedEpisodes = () => {
  return mockPodcastEpisodes.filter(episode => episode.curtidas > 30);
};

export const getInProgressEpisodes = () => {
  return mockPodcastEpisodes.filter(episode => episode.progresso && episode.progresso > 0);
};

export const getFavoriteEpisodes = () => {
  return mockPodcastEpisodes.filter(episode => episode.favorito);
};

export const getEpisodesByArea = (area: string) => {
  return mockPodcastEpisodes.filter(episode => 
    episode.area.toLowerCase() === area.toLowerCase()
  );
};

export const getEpisodeById = (id: number) => {
  return mockPodcastEpisodes.find(episode => episode.id === id);
};
