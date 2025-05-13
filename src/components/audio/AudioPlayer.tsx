
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Clock, Music } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/hooks/use-toast';

interface AudioPlayerProps {
  src: string;
  title: string;
  thumbnail?: string;
  episodeId?: number;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  src,
  title,
  thumbnail,
  episodeId
}) => {
  const { 
    state, 
    play, 
    pause, 
    resume, 
    setVolume, 
    toggleMute, 
    seekTo, 
    skipForward, 
    skipBackward, 
    setPlaybackRate 
  } = useAudioPlayer();
  
  const { isPlaying, volume, isMuted, currentTime, duration, playbackRate } = state;
  
  const [visualizerData, setVisualizerData] = useState<number[]>([]);
  const [particles, setParticles] = useState<{ x: number, y: number, size: number, speed: number }[]>([]);
  const [showPlaybackOptions, setShowPlaybackOptions] = useState(false);
  const [showSleepTimer, setShowSleepTimer] = useState(false);
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState(30);
  const [sleepTimerActive, setSleepTimerActive] = useState(false);
  const [audioColor, setAudioColor] = useState('#E50914');
  
  const progressRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sleepTimerRef = useRef<number | null>(null);

  // Generate random audio visualization data
  useEffect(() => {
    // Generate initial visualizer data
    const data = Array(50).fill(0).map(() => Math.random() * 100);
    setVisualizerData(data);
    
    // Generate particles
    const newParticles = Array(30).fill(0).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      speed: Math.random() * 0.5 + 0.1
    }));
    setParticles(newParticles);
    
    // Set random color from a curated list of colors
    const colors = ['#E50914', '#1DB954', '#4C7BF4', '#F28C28', '#9B59B6'];
    setAudioColor(colors[Math.floor(Math.random() * colors.length)]);
  }, [src]);

  useEffect(() => {
    // Animate particles
    const animateParticles = () => {
      if (!isPlaying) return;
      
      setParticles(prevParticles => 
        prevParticles.map(particle => ({
          ...particle,
          y: particle.y - particle.speed,
          x: particle.x + (Math.random() - 0.5) * 0.5,
          // Reset particles that go off-screen
          ...(particle.y < 0 ? { y: 100 } : {})
        }))
      );
    };
    
    const particleInterval = setInterval(animateParticles, 50);
    return () => clearInterval(particleInterval);
  }, [isPlaying]);

  // Handle audio visualization
  useEffect(() => {
    // Update visualization
    const updateVisualization = () => {
      if (!isPlaying) return;
      
      // Update visualizer data with randomized values that simulate audio reaction
      setVisualizerData(prev => 
        prev.map(v => {
          // Create a more dynamic effect by having some bars move more than others
          const changeAmount = Math.random() * 20 - 10;
          return Math.max(5, Math.min(100, v + changeAmount));
        })
      );
    };
    
    const visualizationInterval = setInterval(updateVisualization, 100);
    return () => clearInterval(visualizationInterval);
  }, [isPlaying]);

  // Manage sleep timer
  useEffect(() => {
    if (sleepTimerActive && sleepTimerMinutes > 0) {
      toast({
        title: "Sleep Timer Ativado",
        description: `O áudio será pausado em ${sleepTimerMinutes} minutos.`
      });
      
      if (sleepTimerRef.current) {
        clearTimeout(sleepTimerRef.current);
      }
      
      sleepTimerRef.current = window.setTimeout(() => {
        pause();
        setSleepTimerActive(false);
        toast({
          title: "Sleep Timer",
          description: "O áudio foi pausado pelo timer."
        });
      }, sleepTimerMinutes * 60 * 1000);
      
      return () => {
        if (sleepTimerRef.current) {
          clearTimeout(sleepTimerRef.current);
        }
      };
    }
  }, [sleepTimerActive, sleepTimerMinutes, pause]);

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      resume();
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      seekTo(percent * duration);
    }
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

  const activateSleepTimer = () => {
    setSleepTimerActive(true);
    setShowSleepTimer(false);
  };

  return (
    <motion.div 
      initial={{
        opacity: 0,
        y: 20
      }} 
      animate={{
        opacity: 1,
        y: 0
      }} 
      transition={{
        duration: 0.5,
        delay: 0.2
      }} 
      className="p-4 bg-juricast-card rounded-lg border border-juricast-card/30 px-[28px] py-6 relative overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        {particles.map((particle, index) => (
          <motion.div 
            key={index}
            className="absolute rounded-full" 
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              background: audioColor,
            }}
            animate={{
              scale: isPlaying ? [1, 1.2, 1] : 1,
              opacity: isPlaying ? [0.7, 1, 0.7] : 0.7
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      
      <div className="relative z-10">
        <div className="flex flex-col items-center mb-4">
          <motion.div 
            className="relative w-full max-w-xs aspect-square mb-4 overflow-hidden rounded-lg" 
            whileHover={{
              scale: 1.02
            }} 
            transition={{
              duration: 0.3
            }}
          >
            {/* Thumbnail with audio visualizer overlay */}
            <img 
              src={thumbnail || '/placeholder.svg'} 
              alt={title} 
              className="w-full h-full object-cover" 
            />
            <motion.div 
              className="absolute inset-0 bg-black/30 flex items-center justify-center"
              animate={{
                backgroundColor: isPlaying 
                  ? ['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.3)'] 
                  : 'rgba(0,0,0,0.3)'
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              {/* Audio Visualization Circle - Always visible when playing */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <AnimatePresence>
                    {isPlaying && (
                      <motion.div 
                        className="absolute inset-0"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                      >
                        <div className="w-full h-full flex items-center justify-center">
                          {/* Circular Audio Visualizer */}
                          {visualizerData.slice(0, 30).map((value, i) => {
                            const angle = (i / 30) * Math.PI * 2;
                            const height = (value / 100) * 30 + 5;
                            const x = Math.cos(angle) * 40;
                            const y = Math.sin(angle) * 40;
                            return (
                              <motion.div
                                key={i}
                                className="absolute bg-white rounded-full"
                                style={{
                                  height: `${height}px`,
                                  width: '2px',
                                  left: 'calc(50% - 1px)',
                                  top: 'calc(50% - 1px)',
                                  transformOrigin: 'center',
                                  transform: `rotate(${angle}rad) translateY(-40px)`
                                }}
                                animate={{
                                  height: isPlaying ? [`${height}px`, `${height * 0.5}px`, `${height}px`] : `${height}px`
                                }}
                                transition={{
                                  duration: 0.8,
                                  repeat: Infinity,
                                  delay: i * 0.02,
                                  ease: "easeInOut"
                                }}
                              />
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <div className="mb-3">
          <h2 className="text-lg font-semibold text-center mb-1 truncate md:text-clip">{title}</h2>
        </div>

        <div className="w-full h-2 bg-juricast-background rounded-full overflow-hidden mb-2 cursor-pointer" onClick={handleProgressClick} ref={progressRef}>
          <motion.div 
            className="h-full bg-juricast-accent" 
            style={{ width: `${currentTime / duration * 100}%` }}
            animate={{ width: `${currentTime / duration * 100}%` }}
            transition={{ ease: "linear" }}
          />
        </div>

        <div className="flex justify-between text-juricast-muted text-sm mb-4">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        {/* Enhanced waveform visualization - Always visible */}
        <div className="waveform mb-4 flex h-16 items-end justify-center">
          {visualizerData.map((value, index) => (
            <motion.div 
              key={index} 
              className="waveform-bar mx-[1px] w-1 rounded-full"
              style={{
                background: `${audioColor}`,
              }}
              initial={{
                height: 2
              }} 
              animate={{
                height: isPlaying ? `${value * 0.3}%` : `${Math.min(20, value * 0.15)}%`,
                opacity: currentTime / duration > index / visualizerData.length ? 1 : 0.5
              }} 
              transition={{
                duration: isPlaying ? 0.5 : 0.2,
                delay: isPlaying ? index * 0.02 : 0
              }}
            />
          ))}
        </div>

        <div className="flex justify-center items-center gap-4 mb-4">
          <motion.button 
            onClick={() => skipBackward(10)} 
            className="player-button w-10 h-10 flex items-center justify-center rounded-full hover:bg-juricast-background/30" 
            whileHover={{
              scale: 1.1
            }} 
            whileTap={{
              scale: 0.9
            }}
          >
            <SkipBack size={20} />
          </motion.button>
          <motion.button 
            onClick={handlePlayPause} 
            className="player-button w-14 h-14 flex items-center justify-center rounded-full bg-juricast-accent text-white hover:bg-juricast-accent/90" 
            whileHover={{
              scale: 1.05
            }} 
            whileTap={{
              scale: 0.95
            }}
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
          </motion.button>
          <motion.button 
            onClick={() => skipForward(10)} 
            className="player-button w-10 h-10 flex items-center justify-center rounded-full hover:bg-juricast-background/30" 
            whileHover={{
              scale: 1.1
            }} 
            whileTap={{
              scale: 0.9
            }}
          >
            <SkipForward size={20} />
          </motion.button>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <button onClick={toggleMute} className="text-juricast-muted hover:text-juricast-text">
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={isMuted ? 0 : volume} 
            onChange={handleVolumeChange} 
            className="w-full h-1 bg-juricast-background rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-juricast-accent" 
          />
        </div>

        {/* Additional controls */}
        <div className="flex justify-between mt-4">
          {/* Playback speed control */}
          <div className="relative">
            <motion.button
              onClick={() => setShowPlaybackOptions(!showPlaybackOptions)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="px-3 py-1 text-sm bg-juricast-background/30 rounded-full hover:bg-juricast-background/50"
            >
              {playbackRate}x
            </motion.button>
            
            <AnimatePresence>
              {showPlaybackOptions && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-full left-0 mb-2 bg-juricast-card border border-juricast-card/30 rounded-lg p-2 shadow-lg z-20"
                >
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => (
                    <motion.button
                      key={rate}
                      onClick={() => {
                        setPlaybackRate(rate);
                        setShowPlaybackOptions(false);
                      }}
                      className={cn(
                        "block w-full text-left px-3 py-1 rounded-md text-sm",
                        playbackRate === rate 
                          ? "bg-juricast-accent text-white" 
                          : "hover:bg-juricast-background/30"
                      )}
                      whileHover={{ x: 3 }}
                    >
                      {rate}x
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Sleep timer with improved UI */}
          <div className="relative z-30">
            <motion.button
              onClick={() => setShowSleepTimer(!showSleepTimer)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={cn(
                "px-3 py-1 text-sm rounded-full flex items-center gap-1",
                sleepTimerActive 
                  ? "bg-juricast-accent/20 text-juricast-accent" 
                  : "bg-juricast-background/30 hover:bg-juricast-background/50"
              )}
            >
              <Clock size={14} />
              {sleepTimerActive ? `${sleepTimerMinutes}m` : "Timer"}
            </motion.button>
            
            <AnimatePresence>
              {showSleepTimer && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-full right-0 mb-2 bg-juricast-card border border-juricast-card/30 rounded-lg p-3 shadow-lg z-40 w-48"
                >
                  <h4 className="text-sm font-medium mb-2">Sleep Timer</h4>
                  
                  <div className="mb-3">
                    <input
                      type="range"
                      min="5"
                      max="120"
                      step="5"
                      value={sleepTimerMinutes}
                      onChange={(e) => setSleepTimerMinutes(parseInt(e.target.value))}
                      className="w-full h-1 bg-juricast-background rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-juricast-accent"
                    />
                    <div className="text-center text-sm mt-1">{sleepTimerMinutes} minutos</div>
                  </div>
                  
                  <motion.button
                    onClick={activateSleepTimer}
                    className="w-full bg-juricast-accent text-white py-1 rounded-md text-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Ativar Timer
                  </motion.button>
                  
                  {sleepTimerActive && (
                    <motion.button
                      onClick={() => {
                        setSleepTimerActive(false);
                        setShowSleepTimer(false);
                        if (sleepTimerRef.current) {
                          clearTimeout(sleepTimerRef.current);
                          sleepTimerRef.current = null;
                        }
                      }}
                      className="w-full mt-2 border border-juricast-accent/30 text-juricast-accent py-1 rounded-md text-sm"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancelar Timer
                    </motion.button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AudioPlayer;
