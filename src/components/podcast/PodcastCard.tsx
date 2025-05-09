
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Play } from 'lucide-react';
import { motion } from 'framer-motion';

interface PodcastCardProps {
  id: number;
  title: string;
  area: string;
  description: string;
  date: string;
  comments?: number;
  likes?: number;
  thumbnail: string;
}

const PodcastCard: React.FC<PodcastCardProps> = ({
  id,
  title,
  area,
  description,
  date,
  likes = 0,
  thumbnail
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ 
        scale: 1.05, 
        transition: { duration: 0.2 }
      }}
    >
      <Link to={`/podcast/${id}`} className="block">
        <div className="netflix-card group bg-juricast-card">
          <div className="relative overflow-hidden">
            <img 
              src={thumbnail} 
              alt={title} 
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-lg font-semibold mb-1 truncate">{title}</h3>
                <p className="text-juricast-accent text-sm">{area}</p>
              </div>
            </div>
            
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="flex items-center gap-1 bg-black/60 px-2 py-1 rounded-full text-xs">
                <Heart size={12} />
                {likes}
              </span>
            </div>
            
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
              <motion.div 
                className="w-12 h-12 bg-juricast-accent/90 rounded-full flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Play size={20} className="text-white ml-1" />
              </motion.div>
            </div>
          </div>
          
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-1 line-clamp-1 group-hover:text-juricast-accent transition-colors">{title}</h3>
            <p className="text-juricast-accent text-sm mb-2">{area}</p>
            <p className="text-juricast-muted text-sm line-clamp-2 mb-3">{description}</p>
            
            <div className="flex justify-between items-center">
              <span className="text-juricast-muted text-xs">{date}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default PodcastCard;
