
import React from 'react';
import { motion } from 'framer-motion';
import { PodcastEpisode } from '@/lib/types';
import PlaylistItem from './PlaylistItem';
import { useAudioPlayer } from '@/context/AudioPlayerContext';

interface RelatedEpisodesProps {
  episodes: PodcastEpisode[];
  currentEpisodeId: number;
}

const RelatedEpisodes: React.FC<RelatedEpisodesProps> = ({ episodes, currentEpisodeId }) => {
  const { play, addToQueue } = useAudioPlayer();
  
  // Filter out the current episode and limit to max 5 related episodes
  const relatedEpisodes = episodes
    .filter(episode => episode.id !== currentEpisodeId)
    .slice(0, 5);
  
  if (relatedEpisodes.length === 0) {
    return null;
  }

  return (
    <motion.div 
      className="bg-juricast-card rounded-lg p-6 border border-juricast-card/30"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-semibold mb-4">Episódios Relacionados</h2>
      
      <div className="space-y-3">
        {relatedEpisodes.map((episode, index) => (
          <PlaylistItem 
            key={episode.id}
            episode={episode}
            index={index + 1}
            onPlay={() => play(episode)}
          />
        ))}
      </div>
      
      {relatedEpisodes.length > 0 && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => relatedEpisodes.forEach(episode => addToQueue(episode))}
          className="mt-4 w-full py-2 bg-juricast-accent/10 text-juricast-accent rounded-md text-sm hover:bg-juricast-accent/20 transition-colors"
        >
          Adicionar todos à fila
        </motion.button>
      )}
    </motion.div>
  );
};

export default RelatedEpisodes;
