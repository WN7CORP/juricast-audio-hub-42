
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import MainLayout from '@/components/layout/MainLayout';
import AudioPlayer from '@/components/audio/AudioPlayer';
import { getEpisodeById } from '@/lib/podcast-service';
import { ArrowLeft, Check, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toggleFavorite } from '@/lib/podcast-service';

const PodcastDetails = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const episodeId = parseInt(id || '0');
  const { progress } = useAudioPlayer();
  
  const { data: episode, isLoading } = useQuery({
    queryKey: ['episode', episodeId],
    queryFn: () => getEpisodeById(episodeId),
    enabled: !!episodeId
  });
  
  const isCompleted = progress >= 0.95; // Consider completed if 95% listened

  const handleToggleFavorite = () => {
    if (episode) {
      const newFavoriteState = toggleFavorite(episode.id);
      toast({
        title: newFavoriteState ? "Adicionado aos favoritos" : "Removido dos favoritos",
        duration: 2000,
      });
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['episode', episodeId] });
      queryClient.invalidateQueries({ queryKey: ['favoriteEpisodes'] });
    }
  };

  // Loading state
  if (isLoading) {
    return <MainLayout>
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-juricast-card w-3/4 rounded"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-juricast-card rounded-lg p-6 h-96"></div>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-juricast-card rounded-lg p-6 h-64"></div>
            </div>
          </div>
        </div>
      </MainLayout>;
  }
  
  // Error state
  if (!episode) {
    return <MainLayout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <h2 className="text-2xl font-bold mb-4">Episódio não encontrado</h2>
          <Link to="/" className="text-juricast-accent hover:underline">
            Voltar para a página inicial
          </Link>
        </div>
      </MainLayout>;
  }
  
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
  
  return (
    <MainLayout>
      <motion.div initial="hidden" animate="visible" variants={fadeIn}>
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Link to="/" className="mr-4 p-2 bg-juricast-card hover:bg-juricast-accent hover:text-white rounded-full transition-all">
                <ArrowLeft size={20} />
              </Link>
            </motion.div>
            <h1 className="text-xl font-bold truncate md:text-2xl md:max-w-[400px]">{episode.titulo}</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <motion.button 
              whileHover={{ scale: 1.1 }} 
              whileTap={{ scale: 0.9 }}
              onClick={handleToggleFavorite}
              className="p-2 rounded-full hover:bg-juricast-card/80"
            >
              <Heart 
                size={20} 
                fill={episode.favorito ? "#E50914" : "none"} 
                color={episode.favorito ? "#E50914" : "currentColor"}
              />
            </motion.button>
            
            {isCompleted && (
              <div className="flex items-center gap-2 bg-green-500/20 px-3 py-1 rounded-full">
                <Check size={16} className="text-green-500" />
                <span className="text-sm text-green-500 font-medium">Concluído</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Main column */}
          <div className="col-span-1">            
            <motion.div 
              className="bg-juricast-card rounded-lg p-6 mb-6 border border-juricast-card/30" 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.4 }}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-semibold">{episode.titulo}</h2>
                  <p className="text-juricast-accent">{episode.area}</p>
                </div>
              </div>

              {/* Audio Player First */}
              <div className="mb-6">
                {episode && <AudioPlayer episode={episode} />}
              </div>

              {/* Content Tabs */}
              <div className="mt-6">
                <Tabs defaultValue="visualizacao" className="w-full">
                  <TabsList className="w-full grid grid-cols-2 mb-4">
                    <TabsTrigger value="visualizacao" className="data-[state=active]:text-juricast-accent">Visualização</TabsTrigger>
                    <TabsTrigger value="detalhes" className="data-[state=active]:text-juricast-accent">Detalhes</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="visualizacao">
                    <motion.div 
                      className="bg-juricast-background/40 rounded-lg p-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <h3 className="font-semibold mb-2">Sobre este episódio</h3>
                      <p className="text-juricast-muted">{episode.descricao}</p>
                    </motion.div>
                  </TabsContent>
                  
                  <TabsContent value="detalhes">
                    <motion.div className="space-y-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                      <div>
                        <h3 className="font-medium mb-2">Tags:</h3>
                        <div className="flex flex-wrap gap-2">
                          {Array.isArray(episode.tag) && episode.tag.map((tag: string, index: number) => (
                            <motion.span
                              key={index}
                              className="bg-juricast-background/50 px-3 py-1 rounded-full text-sm border border-juricast-card/30"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                              whileHover={{ scale: 1.05, backgroundColor: "rgba(229, 9, 20, 0.1)" }}
                            >
                              {tag}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-2">Data de publicação:</h3>
                        <p className="text-juricast-muted">{episode.data_publicacao || 'Não informada'}</p>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-2">Área:</h3>
                        <p className="text-juricast-muted">{episode.area}</p>
                      </div>
                    </motion.div>
                  </TabsContent>
                </Tabs>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default PodcastDetails;
