
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import MainLayout from '@/components/layout/MainLayout';
import ThemeCard from '@/components/podcast/ThemeCard';
import { getThemesByArea, getEpisodesByArea } from '@/lib/podcast-service';
import { motion } from 'framer-motion';

const Category = () => {
  const { category } = useParams<{category: string}>();
  
  // Convert category slug to proper title case with accent restoration
  const categoryTitle = category
    ? getCategoryDisplayName(category)
    : '';
  
  console.log("🔍 Category page - slug:", category);
  console.log("📝 Display name:", categoryTitle);
  
  const { data: themes = [], isLoading } = useQuery({
    queryKey: ['themesByCategory', category],
    queryFn: () => getThemesByArea(category || ''),
    enabled: !!category
  });

  // Also fetch episodes to verify the area exists and has content
  const { data: episodes = [] } = useQuery({
    queryKey: ['episodesByCategory', category],
    queryFn: () => getEpisodesByArea(category || ''),
    enabled: !!category
  });

  console.log("📊 Episodes found:", episodes.length);
  console.log("📊 Themes found:", themes.length);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <MainLayout>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full px-1 md:px-4"
      >
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-xl md:text-2xl font-bold truncate">{categoryTitle}</h1>
          <span className="text-juricast-accent text-xs md:text-sm bg-juricast-accent/10 px-2 py-0.5 rounded-full whitespace-nowrap">
            {themes.length} temas
          </span>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-juricast-card animate-pulse rounded-lg h-32"></div>
            ))}
          </div>
        ) : themes.length > 0 ? (
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-20"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {themes.map((theme) => (
              <ThemeCard
                key={theme.slug}
                name={theme.name}
                episodeCount={theme.episodeCount}
                slug={theme.slug}
                area={theme.area}
                image={theme.image}
              />
            ))}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 bg-juricast-card rounded-lg p-4 md:p-6 mb-20">
            <h2 className="text-xl font-semibold mb-2 text-center">Nenhum tema encontrado</h2>
            <p className="text-juricast-muted text-center mb-4">
              Não encontramos temas na categoria {categoryTitle}.
            </p>
            {episodes.length > 0 && (
              <p className="text-sm text-juricast-muted text-center">
                (Área encontrada com {episodes.length} episódios, mas sem temas específicos)
              </p>
            )}
          </div>
        )}
      </motion.div>
    </MainLayout>
  );
};

// Helper function to get proper display name with accents restored
function getCategoryDisplayName(slug: string): string {
  const displayNameMap: Record<string, string> = {
    'direito-medico': 'Direito Médico',
    'direito-do-trabalho': 'Direito do Trabalho',
    'filosofia-do-direito': 'Filosofia do Direito',
    'direito-constitucional': 'Direito Constitucional',
    'direito-penal': 'Direito Penal',
    'processo-penal': 'Processo Penal',
    'processo-civil': 'Processo Civil',
    'dicas-oab': 'Dicas OAB',
    'artigos-comentados': 'Artigos Comentados'
  };
  
  // Return mapped name if available, otherwise convert slug to title case
  return displayNameMap[slug] || slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export default Category;
