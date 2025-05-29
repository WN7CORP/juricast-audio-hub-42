
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, Shuffle, Repeat, Volume2, List, X, Plus } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { useFocusedMode } from '@/context/FocusedModeContext';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
import { getAllEpisodes, getRecentEpisodes } from '@/lib/podcast-service';
import { PodcastEpisode } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const FocusedMode = () => {
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
    addToPlaylist,
    removeFromPlaylist
  } = useFocusedMode();
  
  const { 
    currentEpisode, 
    isPlaying, 
    currentTime, 
    duration,
    play,
    pause,
    playEpisode 
  } = useAudioPlayer();

  const [showPlaylist, setShowPlaylist] = useState(false);
  const [shuffleMode, setShuffleMode] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'none' | 'one' | 'all'>('none');

  const { data: recentEpisodes = [] } = useQuery({
    queryKey: ['recentEpisodes'],
    queryFn: getRecentEpisodes
  });

  const { data: allEpisodes = [] } = useQuery({
    queryKey: ['allEpisodes'],
    queryFn: getAllEpisodes
  });

  const currentPlaylistEpisode = currentPlaylist[currentEpisodeIndex];

  const handleStartFocusedMode = (playlist: PodcastEpisode[], startIndex = 0) => {
    enableFocusedMode(playlist, startIndex);
    if (playlist[startIndex]) {
      playEpisode(playlist[startIndex]);
    }
  };

  const handleNext = () => {
    if (goToNextEpisode()) {
      playEpisode(currentPlaylist[currentEpisodeIndex + 1]);
    }
  };

  const handlePrevious = () => {
    if (goToPreviousEpisode()) {
      playEpisode(currentPlaylist[currentEpisodeIndex - 1]);
    }
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!isFocusedMode) {
    return (
      <MainLayout>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto space-y-8"
        >
          <div className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-juricast-accent to-juricast-accent/80 rounded-full flex items-center justify-center mb-6">
                <Repeat className="w-12 h-12 text-white" />
              </div>
            </motion.div>
            
            <h1 className="text-4xl font-bold bg-gradient-to-r from-juricast-accent to-juricast-text bg-clip-text text-transparent">
              Modo Focado
            </h1>
            <p className="text-juricast-muted text-lg max-w-2xl mx-auto leading-relaxed">
              Ouça seus episódios em sequência sem interrupções. Perfeito para estudos e foco total no conteúdo jurídico.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-6 border-juricast-card/20 bg-juricast-card/30">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <List className="w-5 h-5 text-juricast-accent" />
                Episódios Recentes
              </h3>
              <p className="text-juricast-muted mb-4">
                Inicie uma sessão focada com os episódios mais recentes
              </p>
              <Button 
                onClick={() => handleStartFocusedMode(recentEpisodes)}
                className="w-full bg-gradient-to-r from-juricast-accent to-juricast-accent/90 hover:from-juricast-accent/90 hover:to-juricast-accent"
                disabled={recentEpisodes.length === 0}
              >
                <Play className="w-4 h-4 mr-2" />
                Iniciar com Recentes ({recentEpisodes.length} episódios)
              </Button>
            </Card>

            <Card className="p-6 border-juricast-card/20 bg-juricast-card/30">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Shuffle className="w-5 h-5 text-juricast-accent" />
                Todos os Episódios
              </h3>
              <p className="text-juricast-muted mb-4">
                Sessão focada com toda a biblioteca de episódios
              </p>
              <Button 
                onClick={() => handleStartFocusedMode(allEpisodes)}
                variant="outline"
                className="w-full border-juricast-accent/30 hover:bg-juricast-accent/10"
                disabled={allEpisodes.length === 0}
              >
                <Shuffle className="w-4 h-4 mr-2" />
                Iniciar com Todos ({allEpisodes.length} episódios)
              </Button>
            </Card>
          </div>

          <Card className="p-6 border-juricast-card/20 bg-juricast-card/30">
            <h3 className="text-xl font-semibold mb-4">Recursos do Modo Focado</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-juricast-accent/20 rounded-lg flex items-center justify-center">
                  <Play className="w-4 h-4 text-juricast-accent" />
                </div>
                <div>
                  <h4 className="font-medium">Reprodução Automática</h4>
                  <p className="text-sm text-juricast-muted">Próximo episódio inicia automaticamente</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-juricast-accent/20 rounded-lg flex items-center justify-center">
                  <List className="w-4 h-4 text-juricast-accent" />
                </div>
                <div>
                  <h4 className="font-medium">Playlist Dinâmica</h4>
                  <p className="text-sm text-juricast-muted">Gerencie a ordem dos episódios</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-juricast-accent/20 rounded-lg flex items-center justify-center">
                  <Volume2 className="w-4 h-4 text-juricast-accent" />
                </div>
                <div>
                  <h4 className="font-medium">Interface Simplificada</h4>
                  <p className="text-sm text-juricast-muted">Foco total no conteúdo</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-r from-juricast-accent to-juricast-accent/80 rounded">
                <Repeat className="w-6 h-6 text-white p-1" />
              </div>
              Modo Focado Ativo
            </h1>
            <p className="text-juricast-muted">
              {currentPlaylist.length} episódios na playlist • {currentEpisodeIndex + 1} de {currentPlaylist.length}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPlaylist(!showPlaylist)}
              className="border-juricast-accent/30"
            >
              <List className="w-4 h-4 mr-2" />
              Playlist
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={disableFocusedMode}
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              <X className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Player */}
          <div className="lg:col-span-2">
            <Card className="p-8 border-juricast-card/20 bg-juricast-card/30">
              {currentPlaylistEpisode && (
                <motion.div
                  key={currentPlaylistEpisode.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Episode Info */}
                  <div className="text-center">
                    <img 
                      src={currentPlaylistEpisode.imagem_miniatura} 
                      alt={currentPlaylistEpisode.titulo}
                      className="w-48 h-48 mx-auto rounded-xl shadow-lg object-cover"
                    />
                    <h2 className="text-2xl font-bold mt-6 leading-tight">
                      {currentPlaylistEpisode.titulo}
                    </h2>
                    <p className="text-juricast-muted mt-2">
                      {currentPlaylistEpisode.area} • {currentPlaylistEpisode.tema}
                    </p>
                  </div>

                  {/* Progress */}
                  <div className="space-y-2">
                    <Progress value={progress} className="h-2" />
                    <div className="flex justify-between text-sm text-juricast-muted">
                      <span>{Math.floor(currentTime / 60)}:{String(Math.floor(currentTime % 60)).padStart(2, '0')}</span>
                      <span>{Math.floor(duration / 60)}:{String(Math.floor(duration % 60)).padStart(2, '0')}</span>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-center gap-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setShuffleMode(!shuffleMode)}
                      className={cn(
                        "border-juricast-accent/30",
                        shuffleMode && "bg-juricast-accent text-white"
                      )}
                    >
                      <Shuffle className="w-4 h-4" />
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handlePrevious}
                      disabled={currentEpisodeIndex === 0}
                      className="border-juricast-accent/30"
                    >
                      <SkipBack className="w-4 h-4" />
                    </Button>

                    <Button
                      size="icon"
                      onClick={isPlaying ? pause : play}
                      className="w-14 h-14 bg-gradient-to-r from-juricast-accent to-juricast-accent/90 hover:from-juricast-accent/90 hover:to-juricast-accent"
                    >
                      {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleNext}
                      disabled={currentEpisodeIndex === currentPlaylist.length - 1}
                      className="border-juricast-accent/30"
                    >
                      <SkipForward className="w-4 h-4" />
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setRepeatMode(repeatMode === 'none' ? 'all' : repeatMode === 'all' ? 'one' : 'none')}
                      className={cn(
                        "border-juricast-accent/30",
                        repeatMode !== 'none' && "bg-juricast-accent text-white"
                      )}
                    >
                      <Repeat className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Auto-play toggle */}
                  <div className="flex items-center justify-center gap-2">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={autoPlayNext}
                        onChange={(e) => setAutoPlayNext(e.target.checked)}
                        className="rounded border-juricast-accent/30"
                      />
                      Reprodução automática
                    </label>
                  </div>
                </motion.div>
              )}
            </Card>
          </div>

          {/* Playlist Sidebar */}
          <div className={cn("space-y-4", !showPlaylist && "hidden lg:block")}>
            <Card className="p-4 border-juricast-card/20 bg-juricast-card/30">
              <h3 className="font-semibold mb-4 flex items-center justify-between">
                Playlist
                <span className="text-sm text-juricast-muted">
                  {currentPlaylist.length} episódios
                </span>
              </h3>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {currentPlaylist.map((episode, index) => (
                  <motion.div
                    key={episode.id}
                    className={cn(
                      "flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors",
                      index === currentEpisodeIndex 
                        ? "bg-juricast-accent text-white" 
                        : "hover:bg-juricast-card/50"
                    )}
                    onClick={() => {
                      playEpisode(episode);
                      // Update the focused mode index
                    }}
                  >
                    <span className="text-xs font-medium w-6 text-center">
                      {index + 1}
                    </span>
                    <img 
                      src={episode.imagem_miniatura} 
                      alt={episode.titulo}
                      className="w-10 h-10 rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{episode.titulo}</p>
                      <p className="text-xs opacity-70 truncate">{episode.area}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromPlaylist(episode.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default FocusedMode;
