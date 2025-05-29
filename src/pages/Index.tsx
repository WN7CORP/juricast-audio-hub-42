import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import MainLayout from '@/components/layout/MainLayout';
import PlaylistItem from '@/components/podcast/PlaylistItem';
import AreaCard from '@/components/podcast/AreaCard';
import CategoryCard from '@/components/podcast/CategoryCard';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, GraduationCap, BookOpen } from 'lucide-react';
import { getFeaturedEpisodes, getRecentEpisodes, getInProgressEpisodes, getAllAreas, saveUserIP } from '@/lib/podcast-service';
import { PodcastEpisode, AreaCard as AreaCardType } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useFocusedMode } from '@/context/FocusedModeContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const Index = () => {
  const [areas, setAreas] = useState<AreaCardType[]>([]);
  const { enableFocusedMode } = useFocusedMode();
  
  // Fetch all podcast areas
  const { data: inProgressEpisodes = [], isLoading: loadingInProgress } = useQuery({
    queryKey: ['inProgressEpisodes'],
    queryFn: getInProgressEpisodes
  });
  
  // Save user IP on first load for persistent data
  useEffect(() => {
    saveUserIP();
  }, []);
  
  // Load areas
  useEffect(() => {
    const fetchAreas = async () => {
      const areasData = await getAllAreas();
      setAreas(areasData);
    };
    
    fetchAreas();
  }, []);

  // Separate areas by category
  const juridicoAreas = areas.filter(area => area.category === 'juridico');
  const educativoAreas = areas.filter(area => area.category === 'educativo');

  // Calculate totals for category cards
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
        <motion.section variants={itemVariants}>
          <motion.div 
            className="flex justify-between items-center mb-4"
            variants={sectionHeaderVariants}
          >
            <h2 className="text-2xl font-bold bg-gradient-to-r from-juricast-accent to-juricast-text bg-clip-text text-transparent">
              Episódios Recentes
            </h2>
            <Link to="/episodios-novos" className="text-juricast-accent hover:underline text-sm">
              Ver todos
            </Link>
          </motion.div>
          
          <motion.div 
            className="space-y-3"
            variants={containerVariants}
          >
            <NewEpisodesCarousel />
          </motion.div>
        </motion.section>
        
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
            
            <motion.div 
              className="space-y-3"
              variants={containerVariants}
            >
              {loadingInProgress 
                ? [...Array(2)].map((_, i) => (
                    <div key={i} className="bg-juricast-card animate-pulse rounded-lg h-16"></div>
                  ))
                : inProgressEpisodes.slice(0, 3).map((episode, index) => (
                    <PlaylistItem
                      key={episode.id}
                      episode={episode}
                      index={index + 1}
                    />
                  ))
              }
            </motion.div>
          </motion.section>
        )}

        {/* Enhanced Category Cards */}
        <motion.section variants={itemVariants}>
          <motion.div 
            className="text-center space-y-4 mb-8"
            variants={sectionHeaderVariants}
          >
            <h2 className="text-3xl font-bold bg-gradient-to-r from-juricast-accent to-juricast-text bg-clip-text text-transparent">
              Explore por Categoria
            </h2>
            <p className="text-juricast-muted text-lg max-w-2xl mx-auto">
              Descubra conteúdo jurídico especializado organizado por área de conhecimento
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 gap-6 mb-8"
            variants={containerVariants}
          >
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

        {/* Focused Mode Section */}
        <motion.section variants={itemVariants}>
          <Card className="p-6 border-juricast-card/20 bg-gradient-to-r from-juricast-accent/10 to-juricast-accent/5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-juricast-accent to-juricast-accent/80 rounded-lg flex items-center justify-center">
                    <Play className="w-4 h-4 text-white" />
                  </div>
                  Modo Focado
                </h3>
                <p className="text-juricast-muted">
                  Ouça episódios em sequência sem interrupções para máximo foco no aprendizado
                </p>
              </div>
              <Link to="/modo-focado">
                <Button className="bg-gradient-to-r from-juricast-accent to-juricast-accent/90 hover:from-juricast-accent/90 hover:to-juricast-accent">
                  Experimentar
                </Button>
              </Link>
            </div>
          </Card>
        </motion.section>

        {/* Áreas do Direito - Only Juridico Areas */}
        {juridicoAreas.length > 0 && (
          <motion.section id="areas-direito" variants={itemVariants}>
            <motion.div 
              className="flex justify-between items-center mb-6"
              variants={sectionHeaderVariants}
            >
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-juricast-accent" />
                Áreas do Direito
              </h2>
              <Link to="/categoria/juridico" className="text-juricast-accent hover:underline text-sm">
                Ver todas
              </Link>
            </motion.div>

            <motion.div 
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              variants={containerVariants}
            >
              {juridicoAreas.slice(0, 8).map((area, index) => (
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

        {/* Educação Jurídica - Only Educativo Areas */}
        {educativoAreas.length > 0 && (
          <motion.section id="educacao-juridica" variants={itemVariants}>
            <motion.div 
              className="flex justify-between items-center mb-6"
              variants={sectionHeaderVariants}
            >
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-juricast-accent" />
                Educação Jurídica
              </h2>
              <Link to="/categoria/educativo" className="text-juricast-accent hover:underline text-sm">
                Ver todas
              </Link>
            </motion.div>

            <motion.div 
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              variants={containerVariants}
            >
              {educativoAreas.map((area, index) => (
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

        <RecentEpisodes />
      </motion.div>
    </MainLayout>
  );
};

const NewEpisodesCarousel = () => {
  const { data: recentEpisodes = [], isLoading } = useQuery({
    queryKey: ['recentEpisodes'],
    queryFn: getRecentEpisodes
  });

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
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div
      className="overflow-x-auto pb-4"
      variants={containerVariants}
    >
      <div className="flex space-x-4 min-w-max">
        {isLoading 
          ? [...Array(4)].map((_, i) => (
              <div key={i} className="bg-juricast-card animate-pulse rounded-lg h-48 w-64"></div>
            ))
          : recentEpisodes.slice(0, 5).map((episode) => (
              <motion.div
                key={episode.id}
                className="flex-shrink-0 w-64"
                variants={itemVariants}
              >
                <Link 
                  to={`/podcast/${episode.id}`}
                  className="block bg-juricast-card rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <div className="relative h-32">
                    <img 
                      src={episode.imagem_miniatura} 
                      alt={episode.titulo}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-2 left-2 right-2">
                      <span className="inline-block bg-juricast-accent/80 text-white text-xs px-2 py-1 rounded-full">Novo</span>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-sm line-clamp-2 mb-1">{episode.titulo}</h3>
                    <p className="text-xs text-juricast-muted">{episode.area}</p>
                  </div>
                </Link>
              </motion.div>
            ))
        }
      </div>
    </motion.div>
  );
};

const RecentEpisodes = () => {
  const { data: recentEpisodes = [], isLoading } = useQuery({
    queryKey: ['recentEpisodes'],
    queryFn: getRecentEpisodes
  });

  return (
    <motion.section variants={{
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { delay: 0.2 } }
    }}>
      <motion.div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Todos os episódios</h2>
      </motion.div>
      
      <motion.div 
        className="space-y-3"
        variants={{
          hidden: { opacity: 0 },
          visible: { 
            opacity: 1, 
            transition: { staggerChildren: 0.05, delayChildren: 0.2 } 
          }
        }}
      >
        {isLoading
          ? [...Array(5)].map((_, i) => (
              <div key={i} className="bg-juricast-card animate-pulse rounded-lg h-16"></div>
            ))
          : recentEpisodes.slice(0, 5).map((episode, index) => (
              <PlaylistItem
                key={episode.id}
                episode={episode}
                index={index + 1}
              />
            ))
        }
      </motion.div>
    </motion.section>
  );
};

export default Index;
