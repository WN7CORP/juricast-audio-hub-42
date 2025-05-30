import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import MainLayout from '@/components/layout/MainLayout';
import { useFocusedMode } from '@/context/FocusedModeContext';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
import { getAllAreas, getEpisodesByArea, getThemesByArea, getEpisodesByTheme } from '@/lib/podcast-service';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, Settings, BookOpen, GraduationCap, List, Shuffle, FileText, X, Volume2, VolumeX, Clock, Hash, ChevronRight, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PodcastEpisode, AreaCard, ThemeCard } from '@/lib/types';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

const FocusedMode = () => {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'juridico' | 'educativo' | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [playMode, setPlayMode] = useState<'area' | 'theme'>('area');
  const [isShuffled, setIsShuffled] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);

  const {
    isFocusedMode,
    currentPlaylist,
    currentEpisodeIndex,
    autoPlayNext,
    enableFocusedMode,
    disableFocusedMode,
    goToNextEpisode,
    goToPreviousEpisode,
    setAutoPlayNext
  } = useFocusedMode();

  const {
    state,
    play,
    pause,
    resume,
    setVolume,
    toggleMute,
    seekTo,
    skipForward,
    skipBackward
  } = useAudioPlayer();

  const { data: areas = [] } = useQuery({
    queryKey: ['areas'],
    queryFn: getAllAreas
  });

  const { data: areaEpisodes = [], isLoading: loadingEpisodes } = useQuery({
    queryKey: ['areaEpisodes', selectedArea],
    queryFn: () => selectedArea ? getEpisodesByArea(selectedArea) : Promise.resolve([]),
    enabled: !!selectedArea && playMode === 'area'
  });

  const { data: themes = [], isLoading: loadingThemes } = useQuery({
    queryKey: ['themes', selectedArea],
    queryFn: () => selectedArea ? getThemesByArea(selectedArea) : Promise.resolve([]),
    enabled: !!selectedArea
  });

  const { data: themeEpisodes = [], isLoading: loadingThemeEpisodes } = useQuery({
    queryKey: ['themeEpisodes', selectedTheme, selectedArea],
    queryFn: () => selectedTheme && selectedArea ? getEpisodesByTheme(selectedTheme, selectedArea) : Promise.resolve([]),
    enabled: !!selectedTheme && !!selectedArea && playMode === 'theme'
  });

  const juridicoAreas = areas.filter(area => area.category === 'juridico');
  const educativoAreas = areas.filter(area => area.category === 'educativo');

  const currentEpisodes = playMode === 'area' ? areaEpisodes : themeEpisodes;
  const currentLoading = playMode === 'area' ? loadingEpisodes : loadingThemeEpisodes;

  // Reset selectedTheme when playMode changes to 'area'
  React.useEffect(() => {
    if (playMode === 'area') {
      setSelectedTheme(null);
    }
  }, [playMode]);

  const shuffleArray = (array: PodcastEpisode[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const handleStartFocusedMode = (episodes: PodcastEpisode[]) => {
    const playlistEpisodes = isShuffled ? shuffleArray([...episodes]) : episodes;
    enableFocusedMode(playlistEpisodes, 0);
    if (playlistEpisodes.length > 0) {
      play(playlistEpisodes[0]);
    }
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

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    seekTo(percent * state.duration);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '00:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const currentEpisode = currentPlaylist[currentEpisodeIndex];
  const nextEpisodes = currentPlaylist.slice(currentEpisodeIndex + 1, currentEpisodeIndex + 4);

  if (!isFocusedMode) {
    return (
      <MainLayout>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8"
        >
          {/* Header */}
          <div className="text-center space-y-4">
            <motion.h1
              className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-juricast-accent to-juricast-accent/80 bg-clip-text text-transparent"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
            >
              Modo Focado
            </motion.h1>
            <p className="text-juricast-muted text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">
              Escolha uma categoria para ouvir episódios em sequência, sem interrupções, para máximo foco no aprendizado
            </p>
          </div>

          {/* Category Selection */}
          {!selectedCategory && (
            <motion.div
              className="grid sm:grid-cols-2 gap-4 sm:gap-6"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
              }}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}>
                <Card
                  className="p-4 sm:p-6 cursor-pointer hover:shadow-lg transition-all duration-300 border-juricast-card/20 bg-gradient-to-br from-blue-50/10 to-blue-100/10"
                  onClick={() => setSelectedCategory('juridico')}
                >
                  <div className="text-center space-y-3 sm:space-y-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
                      <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold">Áreas do Direito</h3>
                    <p className="text-juricast-muted text-sm sm:text-base">
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
                  className="p-4 sm:p-6 cursor-pointer hover:shadow-lg transition-all duration-300 border-juricast-card/20 bg-gradient-to-br from-emerald-50/10 to-emerald-100/10"
                  onClick={() => setSelectedCategory('educativo')}
                >
                  <div className="text-center space-y-3 sm:space-y-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-xl flex items-center justify-center">
                      <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold">Educação Jurídica</h3>
                    <p className="text-juricast-muted text-sm sm:text-base">
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
                <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                  {selectedCategory === 'juridico' ? (
                    <>
                      <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                      Áreas do Direito
                    </>
                  ) : (
                    <>
                      <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                      Educação Jurídica
                    </>
                  )}
                </h2>
                <Button variant="outline" onClick={() => setSelectedCategory(null)}>
                  Voltar
                </Button>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(selectedCategory === 'juridico' ? juridicoAreas : educativoAreas).map((area) => (
                  <motion.div key={area.slug} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Card
                      className="p-4 cursor-pointer hover:shadow-lg transition-all duration-300 border-juricast-card/20"
                      onClick={() => setSelectedArea(area.slug)}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-sm sm:text-base">{area.name}</h3>
                          <div
                            className={cn(
                              "w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center",
                              selectedCategory === 'juridico'
                                ? "bg-blue-100 text-blue-600"
                                : "bg-emerald-100 text-emerald-600"
                            )}
                          >
                            {selectedCategory === 'juridico' ? (
                              <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
                            ) : (
                              <GraduationCap className="w-3 h-3 sm:w-4 sm:h-4" />
                            )}
                          </div>
                        </div>
                        <p className="text-xs sm:text-sm text-juricast-muted">
                          {area.episodeCount} episódios disponíveis
                        </p>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Play Mode Selection */}
          {selectedArea && !selectedTheme && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl sm:text-2xl font-bold">
                  {areas.find((a) => a.slug === selectedArea)?.name}
                </h2>
                <Button variant="outline" onClick={() => {
                  setSelectedArea(null);
                  setSelectedTheme(null);
                  setPlayMode('area');
                }}>
                  Voltar
                </Button>
              </div>

              {/* Mode Selection */}
              <Card className="p-4 sm:p-6 space-y-4">
                <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Modo de Reprodução
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Button
                    variant={playMode === 'area' ? "default" : "outline"}
                    onClick={() => setPlayMode('area')}
                    className="h-auto p-4 justify-start text-left"
                  >
                    <div>
                      <div className="font-medium">Por Área</div>
                      <div className="text-xs opacity-70">
                        Todos os episódios da área em sequência
                      </div>
                    </div>
                  </Button>
                  <Button
                    variant={playMode === 'theme' ? "default" : "outline"}
                    onClick={() => setPlayMode('theme')}
                    className="h-auto p-4 justify-start text-left"
                  >
                    <div>
                      <div className="font-medium">Por Tema</div>
                      <div className="text-xs opacity-70">
                        Escolha um tema específico
                      </div>
                    </div>
                  </Button>
                </div>
              </Card>

              {/* Theme Selection (if theme mode) */}
              {playMode === 'theme' && (
                <Card className="p-4 sm:p-6 space-y-4">
                  <h3 className="text-base sm:text-lg font-semibold">Escolha um Tema</h3>
                  {loadingThemes ? (
                    <div className="text-center py-4">Carregando temas...</div>
                  ) : themes.length === 0 ? (
                    <div className="text-center py-4 text-juricast-muted">
                      Nenhum tema encontrado para esta área.
                    </div>
                  ) : (
                    <div className="grid gap-2 max-h-60 overflow-y-auto">
                      {themes.map((theme) => (
                        <Button
                          key={theme.slug}
                          variant={selectedTheme === theme.slug ? "default" : "ghost"}
                          onClick={() => {
                            console.log("Selected theme:", theme.slug);
                            setSelectedTheme(theme.slug);
                          }}
                          className="justify-between h-auto p-3"
                        >
                          <div className="text-left">
                            <div className="font-medium">{theme.name}</div>
                            <div className="text-xs text-juricast-muted">
                              {theme.episodeCount} episódios
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      ))}
                    </div>
                  )}
                </Card>
              )}

              {/* Start Player (for area mode or after theme selection) */}
              {((playMode === 'area' && currentEpisodes.length > 0) || 
                (playMode === 'theme' && selectedTheme && currentEpisodes.length > 0)) && (
                <Card className="p-4 sm:p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold">Configurações de Reprodução</h3>
                      <p className="text-xs sm:text-sm text-juricast-muted">
                        {currentEpisodes.length} episódios {playMode === 'theme' ? `do tema "${themes.find(t => t.slug === selectedTheme)?.name}"` : 'da área'} serão reproduzidos
                      </p>
                    </div>
                    <Button
                      variant={isShuffled ? "default" : "outline"}
                      size="sm"
                      onClick={() => setIsShuffled(!isShuffled)}
                      className="gap-2 w-full sm:w-auto"
                    >
                      <Shuffle className="w-4 h-4" />
                      {isShuffled ? "Aleatório" : "Sequencial"}
                    </Button>
                  </div>

                  <Button
                    onClick={() => handleStartFocusedMode(currentEpisodes)}
                    className="w-full h-12 text-base sm:text-lg bg-gradient-to-r from-juricast-accent to-juricast-accent/90"
                    disabled={currentLoading}
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Iniciar Modo Focado
                  </Button>
                </Card>
              )}

              {/* Episode Preview */}
              {currentEpisodes.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <List className="w-4 h-4" />
                    Próximos Episódios
                    {playMode === 'theme' && selectedTheme && (
                      <span className="text-juricast-accent">
                        - {themes.find(t => t.slug === selectedTheme)?.name}
                      </span>
                    )}
                  </h4>
                  {currentEpisodes.slice(0, 5).map((episode, index) => (
                    <Card key={episode.id} className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-juricast-accent/10 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate text-sm sm:text-base">{episode.titulo}</h4>
                          <p className="text-xs sm:text-sm text-juricast-muted">
                            {episode.tema} • {episode.area}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                  {currentEpisodes.length > 5 && (
                    <div className="text-center text-xs sm:text-sm text-juricast-muted py-2">
                      E mais {currentEpisodes.length - 5} episódios...
                    </div>
                  )}
                </div>
              )}

              {/* Debug info for theme selection */}
              {playMode === 'theme' && (
                <div className="text-xs text-juricast-muted">
                  <p>Modo: {playMode}</p>
                  <p>Área selecionada: {selectedArea}</p>
                  <p>Tema selecionado: {selectedTheme || 'Nenhum'}</p>
                  <p>Temas carregados: {themes.length}</p>
                  <p>Episódios do tema: {themeEpisodes.length}</p>
                  <p>Carregando episódios do tema: {loadingThemeEpisodes ? 'Sim' : 'Não'}</p>
                </div>
              )}
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
        className="max-w-4xl mx-auto space-y-6 sm:px-6 lg:px-8 pb-20 px-[2px]"
      >
        {/* Enhanced Header with Details */}
        <Card className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Modo Focado Ativo</h1>
              <p className="text-juricast-muted text-sm sm:text-base">
                {currentPlaylist.length} episódios na playlist
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowPlaylist(!showPlaylist)} size="sm">
                <List className="w-4 h-4 mr-1" />
                Playlist
              </Button>
              <Button variant="outline" onClick={disableFocusedMode} size="sm">
                Sair
              </Button>
            </div>
          </div>

          {/* Current Episode Info */}
          {currentEpisode && (
            <div className="grid sm:grid-cols-2 gap-4 p-4 bg-juricast-background/30 rounded-lg">
              <div>
                <h3 className="font-semibold text-juricast-accent mb-2">Episódio Atual</h3>
                <p className="text-sm font-medium mb-1">{currentEpisode.titulo}</p>
                <p className="text-xs text-juricast-muted">
                  <strong>Área:</strong> {currentEpisode.area}
                </p>
                <p className="text-xs text-juricast-muted">
                  <strong>Tema:</strong> {currentEpisode.tema}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-juricast-accent mb-2">Progresso</h3>
                <p className="text-sm mb-1">
                  Episódio {currentEpisodeIndex + 1} de {currentPlaylist.length}
                </p>
                <div className="flex items-center gap-2 text-xs text-juricast-muted">
                  <Clock className="w-3 h-3" />
                  <span>{formatTime(state.currentTime)} / {formatTime(state.duration)}</span>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Enhanced Player */}
        {currentEpisode && (
          <Card className="p-4 sm:p-6">
            <div className="space-y-4 sm:space-y-6">
              {/* Episode Thumbnail and Info */}
              <div className="text-center">
                <motion.img
                  src={currentEpisode.imagem_miniatura}
                  alt={currentEpisode.titulo}
                  className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-lg mx-auto mb-4 shadow-lg"
                  whileHover={{ scale: 1.05 }}
                />
                <h2 className="text-lg sm:text-xl font-bold mb-2">{currentEpisode.titulo}</h2>
                <p className="text-juricast-muted text-sm sm:text-base">{currentEpisode.area}</p>
              </div>

              {/* Enhanced Progress Bar */}
              <div className="space-y-2">
                <div
                  className="w-full h-3 bg-juricast-background/50 rounded-full overflow-hidden cursor-pointer shadow-inner"
                  onClick={handleProgressClick}
                >
                  <motion.div
                    className="h-full bg-gradient-to-r from-juricast-accent to-juricast-accent/80 relative"
                    style={{ width: `${(state.currentTime / state.duration) * 100 || 0}%` }}
                    animate={{ width: `${(state.currentTime / state.duration) * 100 || 0}%` }}
                    transition={{ ease: "linear" }}
                  >
                    <div className="absolute right-0 top-0 w-1 h-full bg-white/50 shadow-lg" />
                  </motion.div>
                </div>
                <div className="flex justify-between text-juricast-muted text-sm font-mono">
                  <span>{formatTime(state.currentTime)}</span>
                  <span>{formatTime(state.duration)}</span>
                </div>
              </div>

              {/* Main Controls */}
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
                  onClick={() => (state.isPlaying ? pause() : resume())}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full"
                >
                  {state.isPlaying ? (
                    <Pause className="w-6 h-6 sm:w-7 sm:h-7" />
                  ) : (
                    <Play className="w-6 h-6 sm:w-7 sm:h-7 ml-1" />
                  )}
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

              {/* Additional Controls */}
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => skipBackward(10)}
                  className="gap-1"
                >
                  -10s
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => skipForward(10)}
                  className="gap-1"
                >
                  +10s
                </Button>
              </div>

              {/* Volume Control */}
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMute}
                  className="text-juricast-muted hover:text-juricast-text"
                >
                  {state.isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </Button>

                <div className="flex-1">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={state.isMuted ? 0 : state.volume}
                    onChange={handleVolumeChange}
                    className="w-full h-2 bg-juricast-background/50 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-juricast-accent [&::-webkit-slider-thumb]:shadow-lg"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowDescription(!showDescription)}
                  className="gap-2 text-white"
                  size="sm"
                >
                  <FileText className="w-4 h-4" />
                  {showDescription ? "Ocultar" : "Descrição"}
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Next Episodes Preview */}
        {nextEpisodes.length > 0 && (
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Hash className="w-4 h-4" />
              Próximos Episódios
            </h3>
            <div className="space-y-2">
              {nextEpisodes.map((episode, index) => (
                <div key={episode.id} className="flex items-center gap-3 p-2 rounded-lg bg-juricast-background/20">
                  <div className="w-6 h-6 bg-juricast-accent/10 rounded-full flex items-center justify-center text-xs font-medium">
                    {currentEpisodeIndex + index + 2}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{episode.titulo}</p>
                    <p className="text-xs text-juricast-muted">{episode.tema}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Settings */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span className="font-medium text-sm sm:text-base">Reprodução automática</span>
            </div>
            <Button
              variant={autoPlayNext ? "default" : "outline"}
              size="sm"
              onClick={() => setAutoPlayNext(!autoPlayNext)}
              className="w-full sm:w-auto"
            >
              {autoPlayNext ? "Ativada" : "Desativada"}
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Playlist Overlay */}
      <AnimatePresence>
        {showPlaylist && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4"
            onClick={() => setShowPlaylist(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 500 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-juricast-card rounded-t-2xl sm:rounded-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto my-[42px]"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-white">Playlist Completa</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowPlaylist(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-2">
                {currentPlaylist.map((episode, index) => (
                  <div 
                    key={episode.id} 
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg transition-colors",
                      index === currentEpisodeIndex 
                        ? "bg-juricast-accent/20 border border-juricast-accent/30" 
                        : "bg-juricast-background/20 hover:bg-juricast-background/30"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                      index === currentEpisodeIndex 
                        ? "bg-juricast-accent text-white" 
                        : "bg-juricast-accent/10 text-juricast-muted"
                    )}>
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "font-medium truncate text-sm",
                        index === currentEpisodeIndex ? "text-white" : "text-white/80"
                      )}>
                        {episode.titulo}
                      </p>
                      <p className="text-xs text-juricast-muted">{episode.tema} • {episode.area}</p>
                    </div>
                    {index === currentEpisodeIndex && (
                      <div className="text-juricast-accent">
                        <Play className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Description Overlay */}
      <AnimatePresence>
        {showDescription && currentEpisode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4"
            onClick={() => setShowDescription(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 500 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-juricast-card rounded-t-2xl sm:rounded-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto my-[42px]"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-white">Descrição do Episódio</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowDescription(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-juricast-accent">{currentEpisode.titulo}</h4>
                <div className="prose prose-sm max-w-none text-white prose-headings:text-white prose-strong:text-white prose-em:text-juricast-accent">
                  <ReactMarkdown>{currentEpisode.descricao}</ReactMarkdown>
                </div>
                <div className="pt-4 border-t border-juricast-card/20">
                  <p className="text-xs sm:text-sm text-juricast-muted">
                    <strong>Área:</strong> {currentEpisode.area} • <strong>Tema:</strong> {currentEpisode.tema}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </MainLayout>
  );
};

export default FocusedMode;
