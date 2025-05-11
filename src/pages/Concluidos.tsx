
import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import MainLayout from '@/components/layout/MainLayout';
import { getAllEpisodes } from '@/lib/podcast-service';
import { motion } from 'framer-motion';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
import PlaylistItem from '@/components/podcast/PlaylistItem';
import { Link } from 'react-router-dom';

const Concluidos = () => {
  const { data: allEpisodes = [], isLoading } = useQuery({
    queryKey: ['allEpisodes'],
    queryFn: getAllEpisodes
  });
  
  const { playEpisode, currentEpisode } = useAudioPlayer();
  
  // Filter for completed episodes (progress >= 95%)
  const completedEpisodes = allEpisodes.filter(episode => 
    episode.progresso && episode.progresso >= 95
  );
  
  const handlePlay = (episodeId: number) => {
    const episode = completedEpisodes.find(ep => ep.id === episodeId);
    if (episode) {
      playEpisode(episode, true);
    }
  };

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold mb-6">Episódios Concluídos</h1>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-juricast-card animate-pulse rounded-lg h-24"></div>
            ))}
          </div>
        ) : completedEpisodes.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {completedEpisodes.map((episode, index) => (
              <PlaylistItem
                key={episode.id}
                episode={episode}
                index={index + 1}
                isPlaying={currentEpisode?.id === episode.id}
                onPlay={() => handlePlay(episode.id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 bg-juricast-card rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">Nenhum episódio concluído</h2>
            <p className="text-juricast-muted text-center mb-4">
              Você ainda não completou nenhum episódio.
            </p>
            <Link 
              to="/"
              className="px-4 py-2 bg-juricast-accent text-white rounded-md hover:bg-juricast-accent/80 transition-colors"
            >
              Explorar episódios
            </Link>
          </div>
        )}
      </motion.div>
    </MainLayout>
  );
};

export default Concluidos;
