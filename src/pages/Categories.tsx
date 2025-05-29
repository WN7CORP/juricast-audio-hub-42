
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';
import AreaCard from '@/components/podcast/AreaCard';
import CategoryCard from '@/components/podcast/CategoryCard';
import { getAllAreas } from '@/lib/podcast-service';
import { AreaCard as AreaCardType } from '@/lib/types';
import { BookOpen, GraduationCap, Grid3x3 } from 'lucide-react';

const Categories = () => {
  const [areas, setAreas] = useState<AreaCardType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const areasData = await getAllAreas();
        setAreas(areasData);
      } catch (error) {
        console.error('Error fetching areas:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAreas();
  }, []);

  // Separate areas by category
  const juridicoAreas = areas.filter(area => area.category === 'juridico');
  const educativoAreas = areas.filter(area => area.category === 'educativo');

  // Calculate totals
  const juridicoTotal = juridicoAreas.reduce((sum, area) => sum + area.episodeCount, 0);
  const educativoTotal = educativoAreas.reduce((sum, area) => sum + area.episodeCount, 0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="space-y-8">
          <div className="animate-pulse">
            <div className="h-8 bg-juricast-card rounded w-1/3 mb-4"></div>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="h-48 bg-juricast-card rounded-lg"></div>
              <div className="h-48 bg-juricast-card rounded-lg"></div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <motion.div
        className="space-y-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header */}
        <motion.section variants={itemVariants}>
          <div className="text-center space-y-4 mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-juricast-accent to-juricast-accent/80 rounded-xl">
                <Grid3x3 className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-juricast-accent to-juricast-text bg-clip-text text-transparent">
              Categorias
            </h1>
            <p className="text-juricast-muted text-lg max-w-2xl mx-auto">
              Explore todo o conteúdo jurídico organizado por área de conhecimento e tipo de conteúdo
            </p>
          </div>
        </motion.section>

        {/* Category Overview Cards */}
        <motion.section variants={itemVariants}>
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <CategoryCard
              title="Áreas do Direito"
              description="Conteúdo jurídico especializado dividido por áreas de atuação profissional"
              episodeCount={juridicoTotal}
              type="juridico"
              href="#areas-direito"
            />
            <CategoryCard
              title="Educação Jurídica"
              description="Conteúdo educativo, dicas práticas e desenvolvimento profissional"
              episodeCount={educativoTotal}
              type="educativo"
              href="#educacao-juridica"
            />
          </div>
        </motion.section>

        {/* Áreas do Direito */}
        {juridicoAreas.length > 0 && (
          <motion.section id="areas-direito" variants={itemVariants}>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-blue-600 rounded-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-juricast-text">
                  Áreas do Direito
                </h2>
                <p className="text-juricast-muted">
                  {juridicoTotal} episódios em {juridicoAreas.length} áreas especializadas
                </p>
              </div>
            </div>

            <motion.div
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              variants={containerVariants}
            >
              {juridicoAreas.map((area) => (
                <motion.div key={area.name} variants={itemVariants}>
                  <AreaCard
                    name={area.name}
                    episodeCount={area.episodeCount}
                    slug={area.slug}
                  />
                </motion.div>
              ))}
            </motion.div>
          </motion.section>
        )}

        {/* Educação Jurídica */}
        {educativoAreas.length > 0 && (
          <motion.section id="educacao-juridica" variants={itemVariants}>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-emerald-600 rounded-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-juricast-text">
                  Educação Jurídica
                </h2>
                <p className="text-juricast-muted">
                  {educativoTotal} episódios em {educativoAreas.length} áreas educativas
                </p>
              </div>
            </div>

            <motion.div
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              variants={containerVariants}
            >
              {educativoAreas.map((area) => (
                <motion.div key={area.name} variants={itemVariants}>
                  <AreaCard
                    name={area.name}
                    episodeCount={area.episodeCount}
                    slug={area.slug}
                  />
                </motion.div>
              ))}
            </motion.div>
          </motion.section>
        )}

        {/* Statistics */}
        <motion.section variants={itemVariants}>
          <div className="bg-gradient-to-r from-juricast-card/50 to-juricast-card/30 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Total de Conteúdo</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-3xl font-bold text-juricast-accent mb-2">
                  {areas.length}
                </div>
                <div className="text-juricast-muted">Áreas Disponíveis</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-juricast-accent mb-2">
                  {juridicoTotal + educativoTotal}
                </div>
                <div className="text-juricast-muted">Total de Episódios</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-juricast-accent mb-2">
                  2
                </div>
                <div className="text-juricast-muted">Categorias Principais</div>
              </div>
            </div>
          </div>
        </motion.section>
      </motion.div>
    </MainLayout>
  );
};

export default Categories;
