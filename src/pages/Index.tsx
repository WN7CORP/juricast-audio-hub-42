
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import MainLayout from '@/components/layout/MainLayout';
import PodcastCard from '@/components/podcast/PodcastCard';
import { Grid, List } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getFeaturedEpisodes, getRecentEpisodes, getInProgressEpisodes } from '@/lib/podcast-service';
import { PodcastEpisode } from '@/lib/types';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Index = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const { data: featuredEpisodes = [], isLoading: loadingFeatured } = useQuery({
    queryKey: ['featuredEpisodes'],
    queryFn: getFeaturedEpisodes
  });
  
  const { data: recentEpisodes = [], isLoading: loadingRecent } = useQuery({
    queryKey: ['recentEpisodes'],
    queryFn: getRecentEpisodes
  });
  
  const { data: inProgressEpisodes = [], isLoading: loadingInProgress } = useQuery({
    queryKey: ['inProgressEpisodes'],
    queryFn: getInProgressEpisodes
  });

  const renderLoadingCards = (count: number) => {
    return Array(count).fill(0).map((_, index) => (
      <div key={index} className="bg-juricast-card animate-pulse rounded-lg h-64"></div>
    ));
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

  const sectionHeaderVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <MainLayout>
      <motion.div 
        className="space-y-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {inProgressEpisodes.length > 0 && (
          <motion.section variants={itemVariants}>
            <motion.div 
              className="flex justify-between items-center mb-4"
              variants={sectionHeaderVariants}
            >
              <h2 className="text-2xl font-bold bg-gradient-to-r from-juricast-accent to-juricast-text bg-clip-text text-transparent">
                Continue Ouvindo
              </h2>
              <Link to="/em-progresso" className="text-juricast-accent hover:underline text-sm">
                Ver todos
              </Link>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {loadingInProgress ? renderLoadingCards(2) :
                inProgressEpisodes.slice(0, 2).map((episode, index) => (
                  <motion.div
                    key={episode.id}
                    variants={itemVariants}
                    custom={index}
                    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                  >
                    <Link 
                      to={`/podcast/${episode.id}`}
                      className="bg-gradient-to-r from-juricast-card to-juricast-card/80 rounded-lg p-4 flex items-center gap-4 border border-juricast-card/30 transition-all"
                    >
                      <div className="relative">
                        <img
                          src={episode.imagem_miniatura}
                          alt={episode.titulo}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-md">
                          <div className="bg-juricast-accent/90 rounded-full p-1">
                            <List size={14} className="text-white" />
                          </div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium mb-1 line-clamp-1">{episode.titulo}</h3>
                        <p className="text-sm text-juricast-accent">{episode.area}</p>
                        <div className="mt-2">
                          <div className="w-full h-1.5 bg-juricast-background rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-juricast-accent rounded-full" 
                              style={{ width: `${episode.progresso || 0}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-juricast-muted mt-1">{episode.progresso || 0}% concluído</p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))
              }
            </div>
          </motion.section>
        )}

        <motion.section variants={itemVariants}>
          <motion.div 
            className="flex justify-between items-center mb-4"
            variants={sectionHeaderVariants}
          >
            <h2 className="text-2xl font-bold">Destaques</h2>
            <div className="flex items-center space-x-2">
              <motion.button 
                onClick={() => setViewMode('grid')}
                className={cn(
                  "p-2 rounded-md transition-all",
                  viewMode === 'grid' ? "bg-juricast-accent text-white" : "text-juricast-muted hover:bg-juricast-card"
                )}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Grid size={18} />
              </motion.button>
              <motion.button 
                onClick={() => setViewMode('list')}
                className={cn(
                  "p-2 rounded-md transition-all", 
                  viewMode === 'list' ? "bg-juricast-accent text-white" : "text-juricast-muted hover:bg-juricast-card"
                )}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <List size={18} />
              </motion.button>
            </div>
          </motion.div>

          <motion.div 
            className={cn(
              "grid gap-6",
              viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
            )}
          >
            {loadingFeatured ? renderLoadingCards(6) : 
              featuredEpisodes.map((episode: PodcastEpisode, index: number) => (
                <motion.div
                  key={episode.id}
                  variants={itemVariants}
                  custom={index}
                >
                  <PodcastCard
                    id={episode.id}
                    title={episode.titulo}
                    area={episode.area}
                    description={episode.descricao}
                    date={episode.data_publicacao || ''}
                    comments={episode.comentarios || 0}
                    likes={episode.curtidas || 0}
                    thumbnail={episode.imagem_miniatura}
                  />
                </motion.div>
              ))
            }
            {!loadingFeatured && featuredEpisodes.length === 0 && (
              <div className="col-span-full text-center p-10">
                <p className="text-juricast-muted">Nenhum episódio em destaque disponível.</p>
              </div>
            )}
          </motion.div>
        </motion.section>

        <motion.section variants={itemVariants}>
          <motion.div 
            className="flex justify-between items-center mb-4"
            variants={sectionHeaderVariants}
          >
            <h2 className="text-2xl font-bold">Recentes</h2>
            <Link to="/?sort=recent" className="text-juricast-accent hover:underline text-sm">
              Ver todos
            </Link>
          </motion.div>
          
          <motion.div 
            className={cn(
              "grid gap-6",
              viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
            )}
          >
            {loadingRecent ? renderLoadingCards(6) : 
              recentEpisodes.map((episode: PodcastEpisode, index: number) => (
                <motion.div
                  key={episode.id}
                  variants={itemVariants}
                  custom={index}
                >
                  <PodcastCard
                    id={episode.id}
                    title={episode.titulo}
                    area={episode.area}
                    description={episode.descricao}
                    date={episode.data_publicacao || ''}
                    comments={episode.comentarios || 0}
                    likes={episode.curtidas || 0}
                    thumbnail={episode.imagem_miniatura}
                  />
                </motion.div>
              ))
            }
            {!loadingRecent && recentEpisodes.length === 0 && (
              <div className="col-span-full text-center p-10">
                <p className="text-juricast-muted">Nenhum episódio recente disponível.</p>
              </div>
            )}
          </motion.div>
        </motion.section>
      </motion.div>
    </MainLayout>
  );
};

export default Index;
