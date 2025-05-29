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
    return type === 'juridico' ? 'from-blue-600 to-blue-800' : 'from-emerald-600 to-emerald-800';
  };
  const Icon = getIcon();
  return <motion.div whileHover={{
    scale: 1.02,
    y: -5
  }} whileTap={{
    scale: 0.98
  }} className="w-full">
      <Link to={href}>
        
      </Link>
    </motion.div>;
};
export default CategoryCard;