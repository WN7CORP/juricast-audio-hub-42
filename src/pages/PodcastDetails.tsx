import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import MainLayout from '@/components/layout/MainLayout';
import AudioPlayer from '@/components/audio/AudioPlayer';
import SupportContent from '@/components/podcast/SupportContent';
import { getEpisodeById, toggleFavorite, saveUserIP, getEpisodesByArea } from '@/lib/podcast-service';
import { Heart, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
import { useIsMobile } from '@/hooks/use-mobile';
import RelatedEpisodes from '@/components/podcast/RelatedEpisodes';
import { PodcastEpisode } from '@/lib/types';
const PodcastDetails = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    state,
    play
  } = useAudioPlayer();
  const isMobile = useIsMobile();
  const episodeId = parseInt(id || '0');
  const {
    data: episode,
    isLoading
  } = useQuery({
    queryKey: ['episode', episodeId],
    queryFn: () => getEpisodeById(episodeId),
    enabled: !!episodeId
  });

  // Fetch related episodes based on current episode's area
  const {
    data: relatedEpisodes = [],
    isLoading: relatedLoading
  } = useQuery({
    queryKey: ['relatedEpisodes', episode?.area],
    queryFn: () => getEpisodesByArea(episode?.area || ''),
    enabled: !!episode?.area
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

  // Play the episode only if it's not already playing
  useEffect(() => {
    if (episode && state.currentEpisode?.id !== episode.id) {
      play(episode);
    }
  }, [episode, play, state.currentEpisode?.id]);
  const handleToggleFavorite = () => {
    if (!episode) return;
    const newStatus = toggleFavorite(episode.id);
    setIsFavorite(newStatus);
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
  const handleBackNavigation = () => {
    if (episode?.area) {
      // Convert area name to slug
      const areaSlug = episode.area.toLowerCase().replace(/\s+/g, '-').replace(/[àáâãäå]/g, 'a').replace(/[èéêë]/g, 'e').replace(/[ìíîï]/g, 'i').replace(/[òóôõö]/g, 'o').replace(/[ùúûü]/g, 'u').replace(/[ç]/g, 'c');
      navigate(`/categoria/${areaSlug}`);
    } else {
      navigate('/');
    }
  };
  const handleNextEpisode = () => {
    if (relatedEpisodes.length > 0) {
      const currentIndex = relatedEpisodes.findIndex(ep => ep.id === episode?.id);
      const nextIndex = (currentIndex + 1) % relatedEpisodes.length;
      const nextEpisode = relatedEpisodes[nextIndex];
      if (nextEpisode) {
        navigate(`/podcast/${nextEpisode.id}`);
        play(nextEpisode);
      }
    }
  };
  if (isLoading) {
    return <MainLayout>
        <div className="animate-pulse space-y-8 px-4 md:px-0">
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
        <div className="flex flex-col items-center justify-center h-[60vh] px-4 md:px-0">
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
      <motion.div initial="hidden" animate="visible" variants={fadeIn} className="md:px-0 px-0">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <motion.div whileHover={{
            scale: 1.1
          }} whileTap={{
            scale: 0.9
          }}>
              <button onClick={handleBackNavigation} className="mr-4 p-3 md:p-4 bg-juricast-card hover:bg-juricast-accent hover:text-white rounded-full transition-all flex items-center justify-center" aria-label="Voltar">
                <ArrowLeft size={isMobile ? 20 : 24} />
              </button>
            </motion.div>
            <h1 className={cn("font-bold truncate", isMobile ? "text-xl" : "text-2xl")}>
              {episode.titulo}
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Audio Player First */}
          <AudioPlayer src={episode.url_audio} title={episode.titulo} thumbnail={episode.imagem_miniatura} episodeId={episode.id} onNextEpisode={relatedEpisodes.length > 1 ? handleNextEpisode : undefined} />
          
          {/* Support Content Button */}
          <SupportContent description={episode.descricao || ''} episode={episode} />
          
          {/* Episode Details */}
          
          
          {/* Related Episodes Section */}
          {!relatedLoading && relatedEpisodes?.length > 1 && <RelatedEpisodes episodes={relatedEpisodes as PodcastEpisode[]} currentEpisodeId={episode.id} />}
        </div>
      </motion.div>
    </MainLayout>;
};
export default PodcastDetails;