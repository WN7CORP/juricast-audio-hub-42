
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, GraduationCap, Scale, Users, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';
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
      ? 'from-blue-600 via-blue-700 to-blue-800' 
      : 'from-emerald-600 via-emerald-700 to-emerald-800';
  };

  const getAccentColor = () => {
    return type === 'juridico' ? 'text-blue-400' : 'text-emerald-400';
  };

  const Icon = getIcon();

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -8 }}
      whileTap={{ scale: 0.98 }}
      className="w-full h-full"
    >
      <Link to={href} className="block h-full">
        <Card className="relative p-8 border-0 bg-gradient-to-br from-juricast-card/80 to-juricast-card/40 hover:shadow-2xl transition-all duration-500 overflow-hidden h-full backdrop-blur-sm">
          {/* Background decoration */}
          <div className={`absolute inset-0 bg-gradient-to-br ${getGradient()} opacity-5`} />
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-juricast-accent/10 to-transparent rounded-full -translate-y-16 translate-x-16" />
          
          {/* Content */}
          <div className="relative z-10 h-full flex flex-col">
            <div className="flex items-start justify-between mb-6">
              <motion.div 
                className={`p-4 rounded-2xl bg-gradient-to-r ${getGradient()} shadow-lg`}
                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <Icon className="w-8 h-8 text-white" />
              </motion.div>
              <div className="flex items-center gap-2 text-juricast-muted">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-bold">{episodeCount}</span>
              </div>
            </div>
            
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-juricast-text mb-3 leading-tight">
                {title}
              </h3>
              
              <p className="text-juricast-muted text-sm leading-relaxed mb-6">
                {description}
              </p>
            </div>
            
            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-juricast-accent" />
                <span className={`text-sm font-semibold ${getAccentColor()}`}>
                  Explorar área
                </span>
              </div>
              
              <motion.div
                className="flex items-center gap-2 text-juricast-accent"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <span className="text-sm font-medium">Ver tudo</span>
                <ArrowRight className="w-4 h-4" />
              </motion.div>
            </div>

            {/* Hover indicator */}
            <motion.div 
              className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-juricast-accent to-juricast-accent/60"
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </Card>
      </Link>
    </motion.div>
  );
};

export default CategoryCard;
