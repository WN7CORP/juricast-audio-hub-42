
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import MainLayout from '@/components/layout/MainLayout';
import PodcastCard from '@/components/podcast/PodcastCard';
import { getFavoriteEpisodes } from '@/lib/podcast-service';

const Favorites = () => {
  const { data: favoriteEpisodes = [], isLoading } = useQuery({
    queryKey: ['favoriteEpisodes'],
    queryFn: getFavoriteEpisodes
  });

  return (
    <MainLayout>
      <h1 className="text-2xl font-bold mb-6">Favoritos</h1>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-juricast-card animate-pulse rounded-lg h-64"></div>
          ))}
        </div>
      ) : favoriteEpisodes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteEpisodes.map(episode => (
            <PodcastCard
              key={episode.id}
              id={episode.id}
              title={episode.titulo}
              area={episode.area}
              description={episode.descricao}
              date={episode.data_publicacao || ''}
              comments={episode.comentarios || 0}
              likes={episode.curtidas || 0}
              thumbnail={episode.imagem_miniatura}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 bg-juricast-card rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Nenhum favorito ainda</h2>
          <p className="text-juricast-muted text-center mb-4">
            Você ainda não adicionou nenhum episódio aos seus favoritos.
          </p>
        </div>
      )}
    </MainLayout>
  );
};

export default Favorites;
