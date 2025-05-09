
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { getInProgressEpisodes } from '@/lib/mock-data';
import { Link } from 'react-router-dom';

const InProgress = () => {
  const inProgressEpisodes = getInProgressEpisodes();

  return (
    <MainLayout>
      <h1 className="text-2xl font-bold mb-6">Em Progresso</h1>

      {inProgressEpisodes.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {inProgressEpisodes.map(episode => (
            <Link 
              key={episode.id} 
              to={`/podcast/${episode.id}`}
              className="bg-juricast-card rounded-lg p-4 flex items-center gap-4 hover:ring-1 hover:ring-juricast-accent/50 transition-all"
            >
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
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 bg-juricast-card rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Nada em progresso</h2>
          <p className="text-juricast-muted text-center mb-4">
            Você ainda não começou a ouvir nenhum episódio.
          </p>
        </div>
      )}
    </MainLayout>
  );
};

export default InProgress;
