
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import PodcastCard from '@/components/podcast/PodcastCard';
import { getFavoriteEpisodes } from '@/lib/mock-data';

const Favorites = () => {
  const favoriteEpisodes = getFavoriteEpisodes();

  return (
    <MainLayout>
      <h1 className="text-2xl font-bold mb-6">Favoritos</h1>

      {favoriteEpisodes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteEpisodes.map(episode => (
            <PodcastCard
              key={episode.id}
              id={episode.id}
              title={episode.titulo}
              area={episode.area}
              description={episode.descricao}
              date={episode.data_publicacao}
              comments={episode.comentarios}
              likes={episode.curtidas}
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
