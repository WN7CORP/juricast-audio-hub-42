import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import MainLayout from '@/components/layout/MainLayout';
import AudioPlayer from '@/components/audio/AudioPlayer';
import { getEpisodeById, toggleFavorite, saveUserIP } from '@/lib/podcast-service';
import { Heart, ArrowLeft, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { useAudioPlayer } from '@/context/AudioPlayerContext';

const PodcastDetails = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const queryClient = useQueryClient();
  const {
    play
  } = useAudioPlayer();
  const episodeId = parseInt(id || '0');
  const {
    data: episode,
    isLoading
  } = useQuery({
    queryKey: ['episode', episodeId],
    queryFn: () => getEpisodeById(episodeId),
    enabled: !!episodeId
  });
  const [isFavorite, setIsFavorite] = useState(false);

  // Save user IP on first load for persistent data
  useEffect(() => {
    saveUserIP();
  }, []);
  useEffect(() => {
    if (episode) {
      setIsFavorite(episode.favorito || false);
    }
  }, [episode]);

  // Play the episode when it loads
  useEffect(() => {
    if (episode) {
      play(episode);
    }
  }, [episode, play]);
  const handleToggleFavorite = () => {
    if (!episode) return;
    const newStatus = toggleFavorite(episode.id);
    setIsFavorite(newStatus);

    // Invalidate queries to refresh data
    queryClient.invalidateQueries({
      queryKey: ['favoriteEpisodes']
    });
    queryClient.invalidateQueries({
      queryKey: ['episode', episodeId]
    });
    toast({
      title: newStatus ? "Adicionado aos favoritos" : "Removido dos favoritos",
      description: newStatus ? "Este episódio foi adicionado à sua lista de favoritos." : "Este episódio foi removido da sua lista de favoritos."
    });
  };
  const handleShareEpisode = () => {
    if (!episode) return;

    // Try to use Web Share API if available
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
        // Fallback to copy to clipboard
        copyToClipboard();
      });
    } else {
      // Fallback for browsers that don't support Web Share API
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
    return <MainLayout>
      <div className="animate-pulse space-y-8">
        <div className="h-8 bg-juricast-card w-3/4 rounded"></div>
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-juricast-card rounded-lg p-6 h-96"></div>
          <div className="bg-juricast-card rounded-lg p-6 h-64"></div>
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
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };
  return <MainLayout>
      <motion.div initial="hidden" animate="visible" variants={fadeIn}>
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <motion.div whileHover={{
            scale: 1.1
          }} whileTap={{
            scale: 0.9
          }}>
              <Link to="/" className="mr-4 p-2 bg-juricast-card hover:bg-juricast-accent hover:text-white rounded-full transition-all">
                <ArrowLeft size={20} />
              </Link>
            </motion.div>
            <h1 className="text-2xl font-bold truncate">{episode.titulo}</h1>
          </div>
          
          
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Audio Player First */}
          <AudioPlayer src={episode.url_audio} title={episode.titulo} thumbnail={episode.imagem_miniatura} episodeId={episode.id} />
          
          {/* Episode Details Second */}
          <motion.div className="bg-juricast-card rounded-lg p-6 mb-6 border border-juricast-card/30" initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.4
        }}>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold">{episode.titulo}</h2>
                <p className="text-juricast-accent">{episode.area} - {episode.tema}</p>
              </div>
              <div className="flex gap-2">
                <motion.button onClick={handleToggleFavorite} className={cn("p-2 rounded-full transition-colors", isFavorite ? "text-juricast-accent" : "text-juricast-muted hover:text-juricast-accent")} whileHover={{
                scale: 1.2
              }} whileTap={{
                scale: 0.9
              }}>
                  <Heart size={24} fill={isFavorite ? "currentColor" : "none"} />
                </motion.button>
              </div>
            </div>

            <motion.div initial={{
            opacity: 0,
            y: 10
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5
          }}>
              <h3 className="font-medium mb-2">Detalhes:</h3>
              <p className="mb-4">{episode.descricao}</p>
              
              <div className="mb-4">
                <h3 className="font-medium mb-2">Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(episode.tag) && episode.tag.map((tag: string, index: number) => <motion.span key={index} className="bg-juricast-background/50 px-3 py-1 rounded-full text-sm border border-juricast-card/30" initial={{
                  opacity: 0,
                  scale: 0.8
                }} animate={{
                  opacity: 1,
                  scale: 1
                }} transition={{
                  duration: 0.3,
                  delay: index * 0.1
                }} whileHover={{
                  scale: 1.05,
                  backgroundColor: "rgba(229, 9, 20, 0.1)"
                }}>
                      {tag}
                    </motion.span>)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-juricast-muted">Área:</span>
                  <p>{episode.area}</p>
                </div>
                <div>
                  <span className="text-juricast-muted">Tema:</span>
                  <p>{episode.tema}</p>
                </div>
                <div>
                  <span className="text-juricast-muted">Sequência:</span>
                  <p>{episode.sequencia || 'Não informada'}</p>
                </div>
                <div>
                  <span className="text-juricast-muted">Data:</span>
                  <p>{episode.data_publicacao || 'Não informada'}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </MainLayout>;
};
export default PodcastDetails;
