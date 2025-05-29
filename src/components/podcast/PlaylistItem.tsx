import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Heart, Pause, Gavel, Book, Scale, File, Check } from 'lucide-react';
import { PodcastEpisode } from '@/lib/types';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toggleFavorite } from '@/lib/podcast-service';
interface PlaylistItemProps {
  episode: PodcastEpisode;
  index: number;
  isPlaying?: boolean;
  onPlay?: () => void;
}
const PlaylistItem: React.FC<PlaylistItemProps> = ({
  episode,
  index,
  isPlaying = false,
  onPlay
}) => {
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(episode.id);
  };
  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onPlay) onPlay();
  };

  // Helper function to return appropriate area icon
  const getAreaIcon = () => {
    const areaLower = episode.area.toLowerCase();
    if (areaLower.includes('civil')) return <Book size={16} className="text-juricast-accent" />;
    if (areaLower.includes('penal') || areaLower.includes('criminal')) return <Gavel size={16} className="text-juricast-accent" />;
    if (areaLower.includes('constituc')) return <Scale size={16} className="text-juricast-accent" />;
    return <File size={16} className="text-juricast-accent" />;
  };

  // Check if episode is completed (100%)
  const isCompleted = episode.progresso === 100;

  // Animation variants
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3
      }
    }
  };
  return <motion.div variants={itemVariants} whileHover={{
    scale: 1.01
  }} className="bg-juricast-card hover:bg-juricast-card/80 rounded-lg overflow-hidden">
      
    </motion.div>;
};
export default PlaylistItem;