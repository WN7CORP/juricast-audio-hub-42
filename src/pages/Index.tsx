
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import PodcastCard from '@/components/podcast/PodcastCard';
import { getFeaturedEpisodes, getRecentEpisodes } from '@/lib/mock-data';
import { Grid, List } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const Index = () => {
  const featuredEpisodes = getFeaturedEpisodes();
  const recentEpisodes = getRecentEpisodes();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <MainLayout>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Destaques</h2>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setViewMode('grid')}
              className={cn(
                "p-2 rounded-md",
                viewMode === 'grid' ? "bg-juricast-accent text-white" : "text-juricast-muted hover:bg-juricast-card"
              )}
            >
              <Grid size={18} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={cn(
                "p-2 rounded-md", 
                viewMode === 'list' ? "bg-juricast-accent text-white" : "text-juricast-muted hover:bg-juricast-card"
              )}
            >
              <List size={18} />
            </button>
          </div>
        </div>

        <div className={cn(
          "grid gap-6",
          viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
        )}>
          {featuredEpisodes.map(episode => (
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
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Continue Ouvindo</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recentEpisodes.slice(0, 2).map(episode => (
            <div key={episode.id} className="bg-juricast-card rounded-lg p-4 flex items-center gap-4">
              <img
                src={episode.imagem_miniatura}
                alt={episode.titulo}
                className="w-16 h-16 object-cover rounded-md"
              />
              <div className="flex-1">
                <h3 className="font-medium mb-1 line-clamp-1">{episode.titulo}</h3>
                <p className="text-sm text-juricast-accent">{episode.area}</p>
                <div className="mt-2">
                  <div className="w-full h-1.5 bg-juricast-background rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-juricast-accent rounded-full" 
                      style={{ width: `${episode.progresso || 0}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-juricast-muted mt-1">{episode.progresso || 0}% concluído</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6">Recentes</h2>
        <div className={cn(
          "grid gap-6",
          viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
        )}>
          {recentEpisodes.map(episode => (
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
      </div>
    </MainLayout>
  );
};

export default Index;
