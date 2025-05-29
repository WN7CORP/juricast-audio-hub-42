
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import MainLayout from '@/components/layout/MainLayout';
import AudioPlayer from '@/components/audio/AudioPlayer';
import { getEpisodeById, toggleFavorite, saveUserIP, getEpisodesByArea } from '@/lib/podcast-service';
import { Heart, ArrowLeft, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
import { useIsMobile } from '@/hooks/use-mobile';
import RelatedEpisodes from '@/components/podcast/RelatedEpisodes';
import { PodcastEpisode } from '@/lib/types';

const PodcastDetails = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { state, play } = useAudioPlayer();
  const isMobile = useIsMobile();
  
  const episodeId = parseInt(id || '0');
  
  const { data: episode, isLoading } = useQuery({
    queryKey: ['episode', episodeId],
    queryFn: () => getEpisodeById(episodeId),
    enabled: !!episodeId
  });

  const { data: relatedEpisodes = [], isLoading: relatedLoading } = useQuery({
    queryKey: ['relatedEpisodes', episode?.area],
    queryFn: () => getEpisodesByArea(episode?.area || ''),
    enabled: !!episode?.area
  });

  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    saveUserIP();
  }, []);

  useEffect(() => {
    if (episode) {
      setIsFavorite(episode.favorito || false);
    }
  }, [episode]);

  useEffect(() => {
    if (episode && state.currentEpisode?.id !== episode.id) {
      play(episode);
    }
  }, [episode, play, state.currentEpisode?.id]);

  const handleToggleFavorite = () => {
    if (!episode) return;
    const newStatus = toggleFavorite(episode.id);
    setIsFavorite(newStatus);

    queryClient.invalidateQueries({ queryKey: ['favoriteEpisodes'] });
    queryClient.invalidateQueries({ queryKey: ['episode', episodeId] });
    
    toast({
      title: newStatus ? "Adicionado aos favoritos" : "Removido dos favoritos",
      description: newStatus ? 
        "Este episódio foi adicionado à sua lista de favoritos." : 
        "Este episódio foi removido da sua lista de favoritos."
    });
  };

  const handleShareEpisode = () => {
    if (!episode) return;

    if (navigator.share) {
      navigator.share({
        title: episode.titulo,
        text: episode.descricao,
        url: window.location.href
      }).then(() => toast({
        title: "Compartilhado com sucesso",
        description: "O link do episódio foi compartilhado."
      })).catch(err => {
        console.error("Error sharing:", err);
        copyToClipboard();
      });
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href).then(() => toast({
      title: "Link copiado",
      description: "O link do episódio foi copiado para a área de transferência."
    })).catch(err => console.error("Failed to copy:", err));
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="animate-pulse space-y-8 px-4 md:px-0">
          <div className="h-8 bg-juricast-card w-3/4 rounded"></div>
          <div className="bg-juricast-card rounded-lg p-6 h-96"></div>
          <div className="bg-juricast-card rounded-lg p-6 h-64"></div>
        </div>
      </MainLayout>
    );
  }

  if (!episode) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] px-4 md:px-0">
          <h2 className="text-2xl font-bold mb-4">Episódio não encontrado</h2>
          <Link to="/" className="text-juricast-accent hover:underline">
            Voltar para a página inicial
          </Link>
        </div>
      </MainLayout>
    );
  }

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <MainLayout>
      <motion.div initial="hidden" animate="visible" variants={fadeIn} className="md:px-0 px-[6px]">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Link 
                to="/" 
                className="mr-4 p-3 md:p-4 bg-juricast-card hover:bg-juricast-accent hover:text-white rounded-full transition-all flex items-center justify-center" 
                aria-label="Voltar"
              >
                <ArrowLeft size={isMobile ? 20 : 24} />
              </Link>
            </motion.div>
            <h1 className={cn("font-bold truncate", isMobile ? "text-xl" : "text-2xl")}>
              {episode.titulo}
            </h1>
          </div>
          <div className="flex gap-2">
            <motion.button 
              whileHover={{ scale: 1.1 }} 
              whileTap={{ scale: 0.9 }} 
              onClick={handleShareEpisode} 
              className="p-3 rounded-full bg-juricast-card hover:bg-juricast-background/50 transition-colors" 
              aria-label="Compartilhar"
            >
              <Share2 size={isMobile ? 18 : 20} />
            </motion.button>
            <motion.button 
              onClick={handleToggleFavorite} 
              className={cn(
                "p-3 rounded-full transition-colors",
                isFavorite ? "text-juricast-accent bg-juricast-accent/10" : "text-juricast-muted hover:text-juricast-accent bg-juricast-card"
              )} 
              whileHover={{ scale: 1.1 }} 
              whileTap={{ scale: 0.9 }}
            >
              <Heart size={isMobile ? 18 : 20} fill={isFavorite ? "currentColor" : "none"} />
            </motion.button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Audio Player with Description */}
          <AudioPlayer 
            src={episode.url_audio} 
            title={episode.titulo} 
            thumbnail={episode.imagem_miniatura} 
            episodeId={episode.id}
            description={episode.descricao}
          />
          
          {/* Episode Details */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.4 }} 
            className="bg-juricast-card rounded-lg p-6 border border-juricast-card/30"
          >
            <div className="mb-6">
              <h2 className={cn("font-semibold mb-2", isMobile ? "text-lg" : "text-xl")}>
                Detalhes do Episódio
              </h2>
              <p className="text-juricast-accent font-medium">{episode.area} - {episode.tema}</p>
            </div>

            {/* Tags */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(episode.tag) && episode.tag.map((tag: string, index: number) => (
                  <motion.span 
                    key={index} 
                    className="bg-juricast-background/50 px-3 py-1.5 rounded-full text-xs md:text-sm border border-juricast-card/30" 
                    initial={{ opacity: 0, scale: 0.8 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    transition={{ duration: 0.3, delay: index * 0.1 }} 
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(229, 9, 20, 0.1)" }}
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-4 text-xs md:text-sm">
              <div>
                <span className="text-juricast-muted">Área:</span>
                <p className="font-medium">{episode.area}</p>
              </div>
              <div>
                <span className="text-juricast-muted">Tema:</span>
                <p className="font-medium">{episode.tema}</p>
              </div>
              <div>
                <span className="text-juricast-muted">Sequência:</span>
                <p className="font-medium">{episode.sequencia || 'Não informada'}</p>
              </div>
              <div>
                <span className="text-juricast-muted">Data:</span>
                <p className="font-medium">{episode.data_publicacao || 'Não informada'}</p>
              </div>
            </div>
          </motion.div>
          
          {/* Related Episodes */}
          {!relatedLoading && relatedEpisodes?.length > 1 && (
            <RelatedEpisodes 
              episodes={relatedEpisodes as PodcastEpisode[]} 
              currentEpisodeId={episode.id} 
            />
          )}
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default PodcastDetails;
