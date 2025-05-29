
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import MainLayout from '@/components/layout/MainLayout';
import { useFocusedMode } from '@/context/FocusedModeContext';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
import { getAllAreas, getEpisodesByArea } from '@/lib/podcast-service';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, Settings, BookOpen, GraduationCap, List, Shuffle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PodcastEpisode, AreaCard } from '@/lib/types';
import { cn } from '@/lib/utils';

const FocusedMode = () => {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'juridico' | 'educativo' | null>(null);
  const [isShuffled, setIsShuffled] = useState(false);
  
  const {
    isFocusedMode,
    currentPlaylist,
    currentEpisodeIndex,
    autoPlayNext,
    enableFocusedMode,
    disableFocusedMode,
    goToNextEpisode,
    goToPreviousEpisode,
    setAutoPlayNext,
  } = useFocusedMode();

  const { state, play, pause } = useAudioPlayer();

  const { data: areas = [] } = useQuery({
    queryKey: ['areas'],
    queryFn: getAllAreas
  });

  const { data: areaEpisodes = [], isLoading: loadingEpisodes } = useQuery({
    queryKey: ['areaEpisodes', selectedArea],
    queryFn: () => selectedArea ? getEpisodesByArea(selectedArea) : Promise.resolve([]),
    enabled: !!selectedArea
  });

  // Separate areas by category
  const juridicoAreas = areas.filter(area => area.category === 'juridico');
  const educativoAreas = areas.filter(area => area.category === 'educativo');

  const handleStartFocusedMode = (episodes: PodcastEpisode[]) => {
    const playlistEpisodes = isShuffled ? shuffleArray([...episodes]) : episodes;
    enableFocusedMode(playlistEpisodes, 0);
    if (playlistEpisodes.length > 0) {
      play(playlistEpisodes[0]);
    }
  };

  const shuffleArray = (array: PodcastEpisode[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const handleNextEpisode = () => {
    const hasNext = goToNextEpisode();
    if (hasNext && currentPlaylist[currentEpisodeIndex + 1]) {
      play(currentPlaylist[currentEpisodeIndex + 1]);
    }
  };

  const handlePreviousEpisode = () => {
    const hasPrevious = goToPreviousEpisode();
    if (hasPrevious && currentPlaylist[currentEpisodeIndex - 1]) {
      play(currentPlaylist[currentEpisodeIndex - 1]);
    }
  };

  const currentEpisode = currentPlaylist[currentEpisodeIndex];

  if (!isFocusedMode) {
    return (
      <MainLayout>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto space-y-8"
        >
          {/* Header */}
          <div className="text-center space-y-4">
            <motion.h1 
              className="text-4xl font-bold bg-gradient-to-r from-juricast-accent to-juricast-accent/80 bg-clip-text text-transparent"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
            >
              Modo Focado
            </motion.h1>
            <p className="text-juricast-muted text-lg max-w-2xl mx-auto">
              Escolha uma categoria para ouvir episódios em sequência, sem interrupções, para máximo foco no aprendizado
            </p>
          </div>

          {/* Category Selection */}
          {!selectedCategory && (
            <motion.div 
              className="grid md:grid-cols-2 gap-6"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
              }}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}>
                <Card 
                  className="p-6 cursor-pointer hover:shadow-lg transition-all duration-300 border-juricast-card/20 bg-gradient-to-br from-blue-50/10 to-blue-100/10"
                  onClick={() => setSelectedCategory('juridico')}
                >
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
                      <BookOpen className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold">Áreas do Direito</h3>
                    <p className="text-juricast-muted">
                      Conteúdo jurídico especializado por área de atuação
                    </p>
                    <div className="text-sm text-juricast-accent font-medium">
                      {juridicoAreas.length} áreas disponíveis
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } }}>
                <Card 
                  className="p-6 cursor-pointer hover:shadow-lg transition-all duration-300 border-juricast-card/20 bg-gradient-to-br from-emerald-50/10 to-emerald-100/10"
                  onClick={() => setSelectedCategory('educativo')}
                >
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-xl flex items-center justify-center">
                      <GraduationCap className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold">Educação Jurídica</h3>
                    <p className="text-juricast-muted">
                      Conteúdo educativo e dicas para desenvolvimento profissional
                    </p>
                    <div className="text-sm text-juricast-accent font-medium">
                      {educativoAreas.length} categorias disponíveis
                    </div>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          )}

          {/* Area Selection */}
          {selectedCategory && !selectedArea && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  {selectedCategory === 'juridico' ? (
                    <>
                      <BookOpen className="w-6 h-6 text-blue-600" />
                      Áreas do Direito
                    </>
                  ) : (
                    <>
                      <GraduationCap className="w-6 h-6 text-emerald-600" />
                      Educação Jurídica
                    </>
                  )}
                </h2>
                <Button variant="outline" onClick={() => setSelectedCategory(null)}>
                  Voltar
                </Button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(selectedCategory === 'juridico' ? juridicoAreas : educativoAreas).map((area) => (
                  <motion.div
                    key={area.slug}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card 
                      className="p-4 cursor-pointer hover:shadow-lg transition-all duration-300 border-juricast-card/20"
                      onClick={() => setSelectedArea(area.slug)}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{area.name}</h3>
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center",
                            selectedCategory === 'juridico' 
                              ? "bg-blue-100 text-blue-600" 
                              : "bg-emerald-100 text-emerald-600"
                          )}>
                            {selectedCategory === 'juridico' ? <BookOpen className="w-4 h-4" /> : <GraduationCap className="w-4 h-4" />}
                          </div>
                        </div>
                        <p className="text-sm text-juricast-muted">
                          {area.episodeCount} episódios disponíveis
                        </p>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Episode List and Start */}
          {selectedArea && areaEpisodes.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  {areas.find(a => a.slug === selectedArea)?.name}
                </h2>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedArea(null)}
                  >
                    Voltar
                  </Button>
                </div>
              </div>

              <Card className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Configurações de Reprodução</h3>
                    <p className="text-sm text-juricast-muted">
                      {areaEpisodes.length} episódios serão reproduzidos em sequência
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Button
                      variant={isShuffled ? "default" : "outline"}
                      size="sm"
                      onClick={() => setIsShuffled(!isShuffled)}
                      className="gap-2"
                    >
                      <Shuffle className="w-4 h-4" />
                      {isShuffled ? "Aleatório" : "Sequencial"}
                    </Button>
                  </div>
                </div>

                <Button 
                  onClick={() => handleStartFocusedMode(areaEpisodes)}
                  className="w-full h-12 text-lg bg-gradient-to-r from-juricast-accent to-juricast-accent/90"
                  disabled={loadingEpisodes}
                >
                  <Play className="w-5 h-5 mr-2" />
                  Iniciar Modo Focado
                </Button>
              </Card>

              <div className="space-y-2">
                {areaEpisodes.slice(0, 5).map((episode, index) => (
                  <Card key={episode.id} className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-juricast-accent/10 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{episode.titulo}</h4>
                        <p className="text-sm text-juricast-muted">{episode.area}</p>
                      </div>
                    </div>
                  </Card>
                ))}
                {areaEpisodes.length > 5 && (
                  <div className="text-center text-sm text-juricast-muted py-2">
                    E mais {areaEpisodes.length - 5} episódios...
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>
      </MainLayout>
    );
  }

  // Focused Mode Active View
  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Modo Focado Ativo</h1>
            <p className="text-juricast-muted">
              {currentPlaylist.length} episódios na playlist
            </p>
          </div>
          <Button variant="outline" onClick={disableFocusedMode}>
            Sair do Modo Focado
          </Button>
        </div>

        {/* Current Episode */}
        {currentEpisode && (
          <Card className="p-6">
            <div className="space-y-4">
              <div className="text-center">
                <img 
                  src={currentEpisode.imagem_miniatura} 
                  alt={currentEpisode.titulo}
                  className="w-32 h-32 object-cover rounded-lg mx-auto mb-4"
                />
                <h2 className="text-xl font-bold">{currentEpisode.titulo}</h2>
                <p className="text-juricast-muted">{currentEpisode.area}</p>
              </div>

              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousEpisode}
                  disabled={currentEpisodeIndex === 0}
                >
                  <SkipBack className="w-4 h-4" />
                </Button>

                <Button
                  onClick={() => state.isPlaying ? pause() : play(currentEpisode)}
                  className="w-12 h-12 rounded-full"
                >
                  {state.isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextEpisode}
                  disabled={currentEpisodeIndex === currentPlaylist.length - 1}
                >
                  <SkipForward className="w-4 h-4" />
                </Button>
              </div>

              <div className="text-center text-sm text-juricast-muted">
                Episódio {currentEpisodeIndex + 1} de {currentPlaylist.length}
              </div>
            </div>
          </Card>
        )}

        {/* Settings */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span className="font-medium">Reprodução automática</span>
            </div>
            <Button
              variant={autoPlayNext ? "default" : "outline"}
              size="sm"
              onClick={() => setAutoPlayNext(!autoPlayNext)}
            >
              {autoPlayNext ? "Ativada" : "Desativada"}
            </Button>
          </div>
        </Card>
      </motion.div>
    </MainLayout>
  );
};

export default FocusedMode;
