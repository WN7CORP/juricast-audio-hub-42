
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import MainLayout from '@/components/layout/MainLayout';
import AudioPlayer from '@/components/audio/AudioPlayer';
import { getEpisodeById } from '@/lib/podcast-service';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

const PodcastDetails = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const episodeId = parseInt(id || '0');
  
  const { data: episode, isLoading } = useQuery({
    queryKey: ['episode', episodeId],
    queryFn: () => getEpisodeById(episodeId),
    enabled: !!episodeId
  });
  
  const [activeTab, setActiveTab] = useState<'visualizacao' | 'detalhes'>('visualizacao');

  if (isLoading) {
    return <MainLayout>
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-juricast-card w-3/4 rounded"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-juricast-card rounded-lg p-6 h-96"></div>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-juricast-card rounded-lg p-6 h-64"></div>
            </div>
          </div>
        </div>
      </MainLayout>;
  }
  
  if (!episode) {
    return <MainLayout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <h2 className="text-2xl font-bold mb-4">Episódio não encontrado</h2>
          <Link to="/" className="text-juricast-accent hover:underline">
            Voltar para a página inicial
          </Link>
        </div>
      </MainLayout>;
  }
  
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
  
  return (
    <MainLayout>
      <motion.div initial="hidden" animate="visible" variants={fadeIn}>
        <div className="mb-6 flex items-center">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Link to="/" className="mr-4 p-2 bg-juricast-card hover:bg-juricast-accent hover:text-white rounded-full transition-all">
              <ArrowLeft size={20} />
            </Link>
          </motion.div>
          <h1 className="text-2xl font-bold">{episode.titulo}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <motion.div 
              className="bg-juricast-card rounded-lg p-6 mb-6 border border-juricast-card/30" 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.4 }}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-semibold">{episode.titulo}</h2>
                  <p className="text-juricast-accent">{episode.area}</p>
                </div>
              </div>

              <div className="flex border-b border-juricast-background mb-6">
                <button 
                  className={cn(
                    "px-6 py-3 border-b-2 transition-colors font-medium", 
                    activeTab === 'visualizacao' 
                      ? "border-juricast-accent text-juricast-accent" 
                      : "border-transparent text-juricast-muted"
                  )} 
                  onClick={() => setActiveTab('visualizacao')}
                >
                  Visualização
                </button>
                <button 
                  className={cn(
                    "px-6 py-3 border-b-2 transition-colors font-medium", 
                    activeTab === 'detalhes' 
                      ? "border-juricast-accent text-juricast-accent" 
                      : "border-transparent text-juricast-muted"
                  )} 
                  onClick={() => setActiveTab('detalhes')}
                >
                  Detalhes
                </button>
              </div>

              <AnimatedTabContent activeTab={activeTab} episode={episode} />
            </motion.div>
          </div>

          <div className="lg:col-span-1">
            {episode && <AudioPlayer episode={episode} />}

            <motion.div 
              className="mt-6 bg-juricast-card rounded-lg p-4 border border-juricast-card/30" 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <h3 className="font-medium mb-4">Informações do Episódio</h3>
              <ul className="space-y-3">
                <li className="flex justify-between">
                  <span className="text-juricast-muted">Área:</span>
                  <span>{episode.area}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-juricast-muted">Publicado em:</span>
                  <span>{episode.data_publicacao || 'Não informado'}</span>
                </li>
              </ul>
            </motion.div>

            <motion.div 
              className="mt-6" 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <h3 className="font-medium text-lg mb-2">Recomendados</h3>
              <div className="bg-gradient-to-r from-juricast-card to-juricast-card/70 p-4 rounded-lg border border-juricast-card/30">
                <p className="text-sm text-juricast-muted mb-3">
                  Conheça mais conteúdos sobre {episode.area}
                </p>
                <Link 
                  to={`/categoria/${episode.area.toLowerCase().replace(/\s+/g, '-')}`} 
                  className="block text-center py-2 px-4 bg-juricast-accent text-white rounded-md hover:bg-juricast-accent/80 transition-colors"
                >
                  Ver todos
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </MainLayout>
  );
};

interface AnimatedTabContentProps {
  activeTab: 'visualizacao' | 'detalhes';
  episode: any;
}

const AnimatedTabContent: React.FC<AnimatedTabContentProps> = ({ activeTab, episode }) => {
  return (
    <motion.div
      key={activeTab}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {activeTab === 'visualizacao' && (
        <div>
          <motion.div 
            className="bg-juricast-background/40 rounded-lg p-4 mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="font-semibold mb-2">Sobre este episódio</h3>
            <p className="text-juricast-muted">{episode.descricao}</p>
          </motion.div>
        </div>
      )}

      {activeTab === 'detalhes' && (
        <div>
          <motion.p className="mb-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {episode.descricao}
          </motion.p>
          
          <motion.div className="mb-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <h3 className="font-medium mb-2">Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(episode.tag) && episode.tag.map((tag: string, index: number) => (
                <motion.span
                  key={index}
                  className="bg-juricast-background/50 px-3 py-1 rounded-full text-sm border border-juricast-card/30"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(229, 9, 20, 0.1)" }}
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <h3 className="font-medium mb-2">Data de publicação:</h3>
            <p className="text-juricast-muted">{episode.data_publicacao || 'Não informada'}</p>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default PodcastDetails;
