
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import MainLayout from '@/components/layout/MainLayout';
import PlaylistItem from '@/components/podcast/PlaylistItem';
import ThemeCard from '@/components/podcast/ThemeCard';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Play } from 'lucide-react';
import { getEpisodesByArea, getThemesByArea } from '@/lib/podcast-service';
import { PodcastEpisode, ThemeCard as ThemeCardType } from '@/lib/types';

const Category = () => {
  const { slug } = useParams<{ slug: string }>();
  const [showAllEpisodes, setShowAllEpisodes] = useState(false);
  
  console.log("🔍 Category page - slug:", slug);

  // Convert slug to display name
  const getDisplayName = (slug: string) => {
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
      .replace(/medico/i, 'Médico')
      .replace(/tributario/i, 'Tributário')
      .replace(/filosofia/i, 'Filosofia');
  };

  const categoryName = slug ? getDisplayName(slug) : '';
  console.log("📝 Display name:", categoryName);

  const { data: episodes = [], isLoading: loadingEpisodes } = useQuery({
    queryKey: ['episodesByArea', slug],
    queryFn: () => getEpisodesByArea(slug || ''),
    enabled: !!slug
  });

  const { data: themes = [], isLoading: loadingThemes } = useQuery({
    queryKey: ['themesByArea', slug],
    queryFn: () => getThemesByArea(slug || ''),
    enabled: !!slug
  });

  console.log("📊 Episodes found:", episodes.length);
  console.log("📊 Themes found:", themes.length);

  useEffect(() => {
    console.log("🔄 Category useEffect - slug changed:", slug);
    console.log("📊 Current episodes:", episodes.length);
    console.log("📊 Current themes:", themes.length);
  }, [slug, episodes.length, themes.length]);

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

  if (!slug) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <h2 className="text-2xl font-bold mb-4">Categoria não encontrada</h2>
          <Link to="/" className="text-juricast-accent hover:underline">
            Voltar para a página inicial
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center gap-4 mb-6">
          <Link
            to="/"
            className="p-2 hover:bg-juricast-card rounded-full transition-colors"
          >
            <ArrowLeft size={24} />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-juricast-accent to-juricast-accent/80 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{categoryName}</h1>
              <p className="text-juricast-muted">
                {loadingEpisodes 
                  ? 'Carregando episódios...' 
                  : `${episodes.length} episódio${episodes.length !== 1 ? 's' : ''} disponível${episodes.length !== 1 ? 'eis' : ''}`}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Debug Info (only in development) */}
        {process.env.NODE_ENV === 'development' && (
          <motion.div variants={itemVariants} className="bg-gray-100 p-4 rounded-lg text-sm">
            <p><strong>Debug Info:</strong></p>
            <p>Slug: {slug}</p>
            <p>Display Name: {categoryName}</p>
            <p>Episodes Loading: {loadingEpisodes ? 'Yes' : 'No'}</p>
            <p>Episodes Found: {episodes.length}</p>
            <p>Themes Found: {themes.length}</p>
          </motion.div>
        )}

        {/* Themes Section */}
        {themes.length > 0 && (
          <motion.section variants={itemVariants}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Temas em {categoryName}</h2>
              <span className="text-sm text-juricast-muted">{themes.length} temas</span>
            </div>
            
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              variants={containerVariants}
            >
              {themes.map((theme, index) => (
                <motion.div key={theme.name} variants={itemVariants}>
                  <ThemeCard 
                    name={theme.name}
                    episodeCount={theme.episodeCount}
                    slug={theme.slug}
                    area={slug}
                  />
                </motion.div>
              ))}
            </motion.div>
          </motion.section>
        )}

        {/* Episodes Section */}
        <motion.section variants={itemVariants}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              {themes.length > 0 ? 'Todos os Episódios' : 'Episódios'}
            </h2>
            {episodes.length > 5 && (
              <button
                onClick={() => setShowAllEpisodes(!showAllEpisodes)}
                className="text-juricast-accent hover:underline text-sm"
              >
                {showAllEpisodes ? 'Ver menos' : `Ver todos (${episodes.length})`}
              </button>
            )}
          </div>

          <motion.div className="space-y-3" variants={containerVariants}>
            {loadingEpisodes ? (
              [...Array(5)].map((_, i) => (
                <div key={i} className="bg-juricast-card animate-pulse rounded-lg h-16"></div>
              ))
            ) : episodes.length > 0 ? (
              (showAllEpisodes ? episodes : episodes.slice(0, 5)).map((episode, index) => (
                <motion.div key={episode.id} variants={itemVariants}>
                  <PlaylistItem
                    episode={episode}
                    index={index + 1}
                    showProgress={true}
                  />
                </motion.div>
              ))
            ) : (
              <motion.div 
                className="text-center py-12"
                variants={itemVariants}
              >
                <div className="w-16 h-16 bg-juricast-card rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play size={24} className="text-juricast-muted" />
                </div>
                <h3 className="text-xl font-medium text-juricast-muted mb-2">
                  Nenhum episódio encontrado
                </h3>
                <p className="text-juricast-muted mb-6">
                  Não foram encontrados episódios para "{categoryName}".
                </p>
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 text-juricast-accent hover:underline"
                >
                  <ArrowLeft size={16} />
                  Voltar para explorar outras áreas
                </Link>
              </motion.div>
            )}
          </motion.div>
        </motion.section>
      </motion.div>
    </MainLayout>
  );
};

export default Category;
