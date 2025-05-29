import React from 'react';
import { motion } from 'framer-motion';
import { PodcastEpisode } from '@/lib/types';
import PlaylistItem from './PlaylistItem';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
interface RelatedEpisodesProps {
  episodes: PodcastEpisode[];
  currentEpisodeId: number;
}
const RelatedEpisodes: React.FC<RelatedEpisodesProps> = ({
  episodes,
  currentEpisodeId
}) => {
  const {
    play,
    addToQueue
  } = useAudioPlayer();

  // Filter out the current episode and limit to max 5 related episodes
  const relatedEpisodes = episodes.filter(episode => episode.id !== currentEpisodeId).slice(0, 5);
  if (relatedEpisodes.length === 0) {
    return null;
  }
  return;
};
export default RelatedEpisodes;