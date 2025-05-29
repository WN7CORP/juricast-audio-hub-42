
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';

interface AreaCardProps {
  name: string;
  episodeCount: number;
  slug: string;
  image?: string;
}

const AreaCard: React.FC<AreaCardProps> = ({
  name,
  episodeCount,
  slug,
  image
}) => {
  // Generate a consistent gradient background based on the name
  const generateGradient = (name: string) => {
    // Simple hash function to generate a number from a string
    const hash = name.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    // Use the hash to generate a hue value
    const hue = Math.abs(hash) % 360;
    
    return `linear-gradient(135deg, 
      hsl(${hue}, 80%, 40%) 0%, 
      hsl(${(hue + 40) % 360}, 70%, 30%) 100%)`;
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      className="rounded-lg overflow-hidden"
    >
      <Link to={`/categoria/${slug}`}>
        <div 
          className="aspect-square relative flex items-end"
          style={{ 
            background: generateGradient(name)
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          <div className="absolute top-4 left-4">
            <div className="p-2 bg-white/10 backdrop-blur-sm rounded-full">
              <BookOpen size={18} className="text-white" />
            </div>
          </div>
          
          <div className="p-4 relative z-10">
            <h3 className="font-bold text-lg text-white">{name}</h3>
            <p className="text-white/80 text-sm">{episodeCount} episódios</p>
          </div>
          
          <motion.div 
            className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors"
            whileHover={{ opacity: 1 }}
            initial={{ opacity: 0 }}
          >
            <div className="w-full h-full flex items-center justify-center">
              <motion.div 
                className="bg-juricast-accent/90 p-3 rounded-full"
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1, opacity: 1 }}
              >
                <BookOpen size={24} className="text-white" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
};

export default AreaCard;
