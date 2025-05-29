
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, GraduationCap, Scale, Users, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface CategoryCardProps {
  title: string;
  description: string;
  episodeCount: number;
  type: 'juridico' | 'educativo';
  href: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  title,
  description,
  episodeCount,
  type,
  href
}) => {
  const getIcon = () => {
    return type === 'juridico' ? BookOpen : GraduationCap;
  };

  const getGradient = () => {
    return type === 'juridico' 
      ? 'from-blue-600 to-blue-800' 
      : 'from-emerald-600 to-emerald-800';
  };

  const Icon = getIcon();

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      className="w-full"
    >
      <Link to={href}>
        <Card className="p-6 border-juricast-card/20 bg-gradient-to-br from-juricast-card to-juricast-card/50 hover:shadow-xl transition-all duration-300">
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-xl bg-gradient-to-r ${getGradient()} shadow-lg`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center gap-2 text-juricast-muted">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">{episodeCount} episódios</span>
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-juricast-text mb-2 group-hover:text-juricast-accent transition-colors">
            {title}
          </h3>
          
          <p className="text-juricast-muted text-sm leading-relaxed mb-4">
            {description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-juricast-accent">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">Explorar conteúdo</span>
            </div>
            <motion.div
              className="w-6 h-6 rounded-full bg-juricast-accent/20 flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
            >
              <Scale className="w-3 h-3 text-juricast-accent" />
            </motion.div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
};

export default CategoryCard;
