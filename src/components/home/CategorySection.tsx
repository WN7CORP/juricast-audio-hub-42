
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, GraduationCap, ArrowRight } from 'lucide-react';
import CategoryCard from '@/components/podcast/CategoryCard';
import { AreaCard } from '@/lib/types';

interface CategorySectionProps {
  juridicoAreas: AreaCard[];
  educativoAreas: AreaCard[];
}

const CategorySection: React.FC<CategorySectionProps> = ({
  juridicoAreas,
  educativoAreas
}) => {
  const juridicoTotal = juridicoAreas.reduce((sum, area) => sum + area.episodeCount, 0);
  const educativoTotal = educativoAreas.reduce((sum, area) => sum + area.episodeCount, 0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="mb-12"
    >
      <motion.div variants={itemVariants} className="text-center space-y-4 mb-8">
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-juricast-accent to-juricast-text bg-clip-text text-transparent">
          Explore por Categoria
        </h2>
        <p className="text-juricast-muted text-lg max-w-3xl mx-auto leading-relaxed">
          Descubra conteúdo jurídico especializado organizado por área de conhecimento. 
          Cada categoria oferece episódios cuidadosamente selecionados por especialistas.
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        className="grid md:grid-cols-2 gap-8 mb-8"
      >
        <motion.div variants={itemVariants}>
          <CategoryCard
            title="Áreas do Direito"
            description="Conteúdo jurídico especializado dividido por áreas de atuação profissional. Doutrina, jurisprudência e casos práticos."
            episodeCount={juridicoTotal}
            type="juridico"
            href="/categorias#areas-direito"
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <CategoryCard
            title="Educação Jurídica"
            description="Conteúdo educativo, dicas práticas e desenvolvimento profissional. Artigos comentados e análises especializadas."
            episodeCount={educativoTotal}
            type="educativo"
            href="/categorias#educacao-juridica"
          />
        </motion.div>
      </motion.div>

      {/* Quick access to areas */}
      <motion.div variants={itemVariants} className="text-center">
        <Link
          to="/categorias"
          className="inline-flex items-center gap-2 text-juricast-accent hover:text-juricast-accent/80 font-medium group"
        >
          Ver todas as áreas
          <ArrowRight 
            size={16} 
            className="group-hover:translate-x-1 transition-transform" 
          />
        </Link>
      </motion.div>
    </motion.section>
  );
};

export default CategorySection;
