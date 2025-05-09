
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import AudioPlayer from '@/components/audio/AudioPlayer';
import { getEpisodeById } from '@/lib/mock-data';
import { Heart, MessageSquare, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

const PodcastDetails = () => {
  const { id } = useParams<{id: string}>();
  const episode = getEpisodeById(parseInt(id || '0'));
  
  const [activeTab, setActiveTab] = useState<'visualizacao' | 'detalhes' | 'comentarios'>('visualizacao');
  const [isFavorite, setIsFavorite] = useState(episode?.favorito || false);
  
  if (!episode) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <h2 className="text-2xl font-bold mb-4">Episódio não encontrado</h2>
          <Link to="/" className="text-juricast-accent hover:underline">
            Voltar para a página inicial
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mb-6 flex items-center">
        <Link to="/" className="mr-4 p-2 hover:bg-juricast-card rounded-full transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold">{episode.titulo}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-juricast-card rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold">{episode.titulo}</h2>
                <p className="text-juricast-accent">{episode.area}</p>
              </div>
              <button 
                onClick={() => setIsFavorite(!isFavorite)}
                className={cn(
                  "p-2 rounded-full transition-colors",
                  isFavorite ? "text-red-500" : "text-juricast-muted hover:text-red-500"
                )}
              >
                <Heart size={24} fill={isFavorite ? "currentColor" : "none"} />
              </button>
            </div>

            <div className="flex border-b border-juricast-background mb-6">
              <button 
                className={cn(
                  "px-6 py-3 border-b-2 transition-colors font-medium",
                  activeTab === 'visualizacao' ? "border-juricast-accent text-juricast-accent" : "border-transparent text-juricast-muted"
                )}
                onClick={() => setActiveTab('visualizacao')}
              >
                Visualização
              </button>
              <button 
                className={cn(
                  "px-6 py-3 border-b-2 transition-colors font-medium",
                  activeTab === 'detalhes' ? "border-juricast-accent text-juricast-accent" : "border-transparent text-juricast-muted"
                )}
                onClick={() => setActiveTab('detalhes')}
              >
                Detalhes
              </button>
              <button 
                className={cn(
                  "px-6 py-3 border-b-2 transition-colors font-medium",
                  activeTab === 'comentarios' ? "border-juricast-accent text-juricast-accent" : "border-transparent text-juricast-muted"
                )}
                onClick={() => setActiveTab('comentarios')}
              >
                Comentários
              </button>
            </div>

            {activeTab === 'visualizacao' && (
              <div>
                <img 
                  src={episode.imagem_miniatura} 
                  alt={episode.titulo}
                  className="w-full aspect-video object-cover rounded-lg mb-6"
                />
              </div>
            )}

            {activeTab === 'detalhes' && (
              <div>
                <p className="mb-4">{episode.descricao}</p>
                <div className="mb-4">
                  <h3 className="font-medium mb-2">Tags:</h3>
                  <div className="flex flex-wrap gap-2">
                    {episode.tag.map((tag, index) => (
                      <span 
                        key={index}
                        className="bg-juricast-background px-3 py-1 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Data de publicação:</h3>
                  <p className="text-juricast-muted">{episode.data_publicacao}</p>
                </div>
              </div>
            )}

            {activeTab === 'comentarios' && (
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <MessageSquare size={20} className="text-juricast-accent" />
                  <span className="font-medium">{episode.comentarios} comentários</span>
                </div>
                
                {episode.comentarios > 0 ? (
                  <div className="space-y-4">
                    {[...Array(2)].map((_, index) => (
                      <div key={index} className="bg-juricast-background p-4 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-full bg-juricast-card"></div>
                          <div>
                            <p className="font-medium">Usuário {index + 1}</p>
                            <p className="text-xs text-juricast-muted">Há {index + 1} dias</p>
                          </div>
                        </div>
                        <p className="text-juricast-muted">
                          Excelente conteúdo! Ajudou muito nos meus estudos para concurso.
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-juricast-muted">Seja o primeiro a comentar neste episódio.</p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <AudioPlayer 
            src={episode.url_audio}
            title={episode.titulo}
            thumbnail={episode.imagem_miniatura}
          />

          <div className="mt-6 bg-juricast-card rounded-lg p-4">
            <h3 className="font-medium mb-4">Informações do Episódio</h3>
            <ul className="space-y-3">
              <li className="flex justify-between">
                <span className="text-juricast-muted">Área:</span>
                <span>{episode.area}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-juricast-muted">Publicado em:</span>
                <span>{episode.data_publicacao}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-juricast-muted">Curtidas:</span>
                <span>{episode.curtidas}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-juricast-muted">Comentários:</span>
                <span>{episode.comentarios}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PodcastDetails;
