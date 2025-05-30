
import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import MainLayout from '@/components/layout/MainLayout';
import PlaylistItem from '@/components/podcast/PlaylistItem';
import { getFavoriteEpisodes } from '@/lib/podcast-service';
import { motion } from 'framer-motion';
import { Heart, BookOpen, GraduationCap, ChevronDown, ChevronRight } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useState } from 'react';

const Favorites = () => {
  const { data: favoriteEpisodes = [], isLoading } = useQuery({
    queryKey: ['favoriteEpisodes'],
    queryFn: getFavoriteEpisodes,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  // Group episodes by category
  const categorizedEpisodes = useMemo(() => {
    const juridico = favoriteEpisodes.filter(episode => {
      const area = episode.area.toLowerCase();
      return !area.includes('artigos comentados') && !area.includes('dicas oab');
    });

    const educativo = favoriteEpisodes.filter(episode => {
      const area = episode.area.toLowerCase();
      return area.includes('artigos comentados') || area.includes('dicas oab');
    });

    return {
      juridico: juridico.sort((a, b) => parseInt(a.sequencia || '0') - parseInt(b.sequencia || '0')),
      educativo: educativo.sort((a, b) => parseInt(a.sequencia || '0') - parseInt(b.sequencia || '0'))
    };
  }, [favoriteEpisodes]);

  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    juridico: true, // Juridico starts open
    educativo: false
  });

  const toggleCategory = (category: string) => {
    setOpenCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

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

  return (
    <MainLayout>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
            <Heart className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-juricast-accent to-juricast-text bg-clip-text text-transparent">
            Favoritos
          </h1>
          <span className="text-juricast-muted text-sm">
            ({favoriteEpisodes.length} episódios)
          </span>
        </motion.div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="bg-juricast-card animate-pulse rounded-lg h-16"></div>
            ))}
          </div>
        ) : favoriteEpisodes.length > 0 ? (
          <motion.div className="space-y-6" variants={containerVariants}>
            {/* Áreas do Direito Category */}
            {categorizedEpisodes.juridico.length > 0 && (
              <motion.div variants={itemVariants}>
                <Collapsible
                  open={openCategories.juridico}
                  onOpenChange={() => toggleCategory('juridico')}
                >
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-juricast-card rounded-lg hover:bg-juricast-card/80 transition-colors">
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-5 h-5 text-juricast-accent" />
                      <h2 className="text-lg font-semibold">Áreas do Direito</h2>
                      <span className="text-sm text-juricast-muted">
                        ({categorizedEpisodes.juridico.length} episódios)
                      </span>
                    </div>
                    {openCategories.juridico ? (
                      <ChevronDown className="w-5 h-5 text-juricast-muted" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-juricast-muted" />
                    )}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-3 mt-3">
                    {categorizedEpisodes.juridico.map((episode, index) => (
                      <motion.div
                        key={episode.id}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: index * 0.05 }}
                      >
                        <PlaylistItem
                          episode={episode}
                          index={index + 1}
                          showProgress={true}
                        />
                      </motion.div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              </motion.div>
            )}

            {/* Educação Jurídica Category */}
            {categorizedEpisodes.educativo.length > 0 && (
              <motion.div variants={itemVariants}>
                <Collapsible
                  open={openCategories.educativo}
                  onOpenChange={() => toggleCategory('educativo')}
                >
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-juricast-card rounded-lg hover:bg-juricast-card/80 transition-colors">
                    <div className="flex items-center gap-3">
                      <GraduationCap className="w-5 h-5 text-juricast-accent" />
                      <h2 className="text-lg font-semibold">Educação Jurídica</h2>
                      <span className="text-sm text-juricast-muted">
                        ({categorizedEpisodes.educativo.length} episódios)
                      </span>
                    </div>
                    {openCategories.educativo ? (
                      <ChevronDown className="w-5 h-5 text-juricast-muted" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-juricast-muted" />
                    )}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-3 mt-3">
                    {categorizedEpisodes.educativo.map((episode, index) => (
                      <motion.div
                        key={episode.id}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: index * 0.05 }}
                      >
                        <PlaylistItem
                          episode={episode}
                          index={index + 1}
                          showProgress={true}
                        />
                      </motion.div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            variants={itemVariants}
            className="flex flex-col items-center justify-center h-64 bg-juricast-card rounded-lg p-6"
          >
            <div className="w-16 h-16 bg-juricast-accent/10 rounded-full flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 text-juricast-accent" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Nenhum favorito ainda</h2>
            <p className="text-juricast-muted text-center mb-4">
              Você ainda não adicionou nenhum episódio aos seus favoritos.
            </p>
            <p className="text-sm text-juricast-muted text-center">
              Clique no ícone ❤️ em qualquer episódio para adicioná-lo aqui!
            </p>
          </motion.div>
        )}
      </motion.div>
    </MainLayout>
  );
};

export default Favorites;
