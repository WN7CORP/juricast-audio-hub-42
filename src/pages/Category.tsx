
import React from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import PodcastCard from '@/components/podcast/PodcastCard';
import { getEpisodesByArea } from '@/lib/mock-data';

const Category = () => {
  const { category } = useParams<{category: string}>();
  const formattedCategory = category?.replace(/-/g, ' ');
  
  // Convert category slug to proper title case
  const categoryTitle = formattedCategory
    ?.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  const episodes = getEpisodesByArea(formattedCategory || '');

  return (
    <MainLayout>
      <h1 className="text-2xl font-bold mb-6">{categoryTitle}</h1>

      {episodes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {episodes.map(episode => (
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
          <h2 className="text-xl font-semibold mb-2">Nenhum episódio encontrado</h2>
          <p className="text-juricast-muted text-center mb-4">
            Não encontramos episódios na categoria {categoryTitle}.
          </p>
        </div>
      )}
    </MainLayout>
  );
};

export default Category;
