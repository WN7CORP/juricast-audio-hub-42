
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, GraduationCap } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import CategoryCard from '@/components/podcast/CategoryCard';
import AreaCard from '@/components/podcast/AreaCard';
import { getAllAreas } from '@/lib/podcast-service';
import { AreaCard as AreaCardType } from '@/lib/types';

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

  // Calculate totals for category cards
  const juridicoTotal = juridicoAreas.reduce((sum, area) => sum + (area.episodeCount || 0), 0);
  const educativoTotal = educativoAreas.reduce((sum, area) => sum + (area.episodeCount || 0), 0);

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
    <MainLayout>
      <motion.div
        className="space-y-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Hero Section */}
        <motion.section variants={itemVariants}>
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-juricast-accent to-juricast-text bg-clip-text text-transparent">
              Categorias de Conteúdo
            </h1>
            <p className="text-juricast-muted text-lg max-w-2xl mx-auto">
              Explore nosso conteúdo jurídico organizado por categorias especializadas
            </p>
          </div>
        </motion.section>

        {/* Enhanced Category Cards */}
        <motion.section variants={itemVariants}>
          <motion.div className="grid md:grid-cols-2 gap-8 mb-12" variants={containerVariants}>
            <motion.div variants={itemVariants}>
              <CategoryCard
                title="Áreas do Direito"
                description="Conteúdo jurídico especializado dividido por áreas de atuação profissional"
                episodeCount={juridicoTotal}
                type="juridico"
                href="#areas-direito"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <CategoryCard
                title="Educação Jurídica"
                description="Conteúdo educativo, dicas práticas e desenvolvimento profissional"
                episodeCount={educativoTotal}
                type="educativo"
                href="#educacao-juridica"
              />
            </motion.div>
          </motion.div>
        </motion.section>

        {/* Áreas do Direito */}
        {juridicoAreas.length > 0 && (
          <motion.section id="areas-direito" variants={itemVariants}>
            <motion.div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                Áreas do Direito
              </h2>
            </motion.div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-juricast-card animate-pulse rounded-lg h-32"></div>
                ))}
              </div>
            ) : (
              <motion.div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" variants={containerVariants}>
                {juridicoAreas.map((area) => (
                  <motion.div key={area.name} variants={itemVariants}>
                    <AreaCard
                      name={area.name}
                      episodeCount={area.episodeCount || 0}
                      slug={area.slug}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.section>
        )}

        {/* Educação Jurídica */}
        {educativoAreas.length > 0 && (
          <motion.section id="educacao-juridica" variants={itemVariants}>
            <motion.div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-xl">
                  <GraduationCap className="w-7 h-7 text-white" />
                </div>
                Educação Jurídica
              </h2>
            </motion.div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-juricast-card animate-pulse rounded-lg h-32"></div>
                ))}
              </div>
            ) : (
              <motion.div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" variants={containerVariants}>
                {educativoAreas.map((area) => (
                  <motion.div key={area.name} variants={itemVariants}>
                    <AreaCard
                      name={area.name}
                      episodeCount={area.episodeCount || 0}
                      slug={area.slug}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.section>
        )}
      </motion.div>
    </MainLayout>
  );
};

export default Categories;
