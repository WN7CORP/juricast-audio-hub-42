import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
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
    pause,
    resume,
    setVolume,
    toggleMute,
    seekTo,
    skipForward,
    skipBackward,
    setPlaybackRate
  } = useAudioPlayer();
  const {
    isPlaying,
    volume,
    isMuted,
    currentTime,
    duration,
    playbackRate
  } = state;
  const [showPlaybackOptions, setShowPlaybackOptions] = useState(false);
  const [visualizerBars, setVisualizerBars] = useState<number[]>(Array(32).fill(0));
  const progressRef = useRef<HTMLDivElement>(null);
  const visualizerIntervalRef = useRef<number | null>(null);

  // Professional audio visualizer effect
  useEffect(() => {
    if (visualizerIntervalRef.current) {
      window.clearInterval(visualizerIntervalRef.current);
    }
    if (isPlaying) {
      visualizerIntervalRef.current = window.setInterval(() => {
        const newBars = Array(32).fill(0).map((_, index) => {
          // Create more realistic frequency response
          const baseHeight = Math.random() * 0.8 + 0.2;
          const frequencyMultiplier = 1 - index / 32 * 0.6; // Lower frequencies are typically louder
          return Math.min(1, baseHeight * frequencyMultiplier * (0.3 + Math.random() * 0.7));
        });
        setVisualizerBars(newBars);
      }, 100);
    } else {
      // Gradually decrease bars when paused
      const fadeOut = () => {
        setVisualizerBars(prev => prev.map(bar => Math.max(0, bar * 0.85)));
      };
      visualizerIntervalRef.current = window.setInterval(fadeOut, 150);
    }
    return () => {
      if (visualizerIntervalRef.current) {
        window.clearInterval(visualizerIntervalRef.current);
      }
    };
  }, [isPlaying]);
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
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.5,
    delay: 0.2
  }} className="p-4 md:p-6 bg-gradient-to-br from-juricast-card via-juricast-card to-juricast-card/80 rounded-xl border border-juricast-card/50 shadow-2xl relative overflow-hidden">
      {/* Professional gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-juricast-accent/5 via-transparent to-juricast-accent/10" />
      
      {/* Modern geometric pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(229,9,20,0.1),transparent_50%)]" />
      </div>
      
      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-6 mb-6">
          {/* Enhanced thumbnail with professional styling */}
          <motion.div className="relative w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 flex-shrink-0 overflow-hidden rounded-2xl shadow-2xl" whileHover={{
          scale: 1.02
        }} transition={{
          duration: 0.3
        }}>
            <img src={thumbnail || '/placeholder.svg'} alt={title} className="w-full h-full object-cover" />
            
            {/* Professional overlay with play state indicator */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Audio visualizer overlay */}
            <AnimatePresence>
              {isPlaying && <motion.div initial={{
              opacity: 0
            }} animate={{
              opacity: 1
            }} exit={{
              opacity: 0
            }} className="absolute inset-0 flex items-end justify-center p-4">
                  <div className="flex items-end gap-1 h-16">
                    {visualizerBars.map((height, index) => <motion.div key={index} className="bg-white/80 rounded-full" style={{
                  width: '3px',
                  height: `${height * 60 + 4}px`,
                  minHeight: '4px'
                }} animate={{
                  height: `${height * 60 + 4}px`,
                  backgroundColor: `rgba(255, 255, 255, ${0.5 + height * 0.5})`
                }} transition={{
                  duration: 0.1
                }} />)}
                  </div>
                </motion.div>}
            </AnimatePresence>
            
            {/* Professional play/pause overlay */}
            <motion.div className="absolute inset-0 flex items-center justify-center" animate={{
            opacity: isPlaying ? 0.8 : 1
          }}>
              
            </motion.div>
          </motion.div>

          {/* Episode info and controls */}
          <div className="flex-1 w-full">
            <div className="mb-6 text-center lg:text-left">
              <h2 className="text-xl md:text-2xl font-bold mb-2 text-juricast-text line-clamp-2">{title}</h2>
              <div className="flex items-center justify-center lg:justify-start gap-2 text-juricast-accent">
                <div className="w-2 h-2 bg-juricast-accent rounded-full animate-pulse" />
                <span className="text-sm font-medium">
                  {isPlaying ? 'Reproduzindo agora' : 'Pausado'}
                </span>
              </div>
            </div>

            {/* Professional progress bar */}
            <div className="mb-4">
              <div className="w-full h-3 bg-juricast-background/50 rounded-full overflow-hidden cursor-pointer shadow-inner" onClick={handleProgressClick} ref={progressRef}>
                <motion.div className="h-full bg-gradient-to-r from-juricast-accent to-juricast-accent/80 relative" style={{
                width: `${currentTime / duration * 100 || 0}%`
              }} animate={{
                width: `${currentTime / duration * 100 || 0}%`
              }} transition={{
                ease: "linear"
              }}>
                  <div className="absolute right-0 top-0 w-1 h-full bg-white/50 shadow-lg" />
                </motion.div>
              </div>
              <div className="flex justify-between text-juricast-muted text-sm mt-2">
                <span className="font-mono">{formatTime(currentTime)}</span>
                <span className="font-mono">{formatTime(duration)}</span>
              </div>
            </div>

            {/* Professional control buttons */}
            <div className="flex justify-center items-center gap-4 mb-6">
              <motion.button onClick={() => skipBackward(10)} className="w-12 h-12 flex items-center justify-center rounded-full bg-juricast-background/30 hover:bg-juricast-background/50 backdrop-blur-sm border border-juricast-card/30 transition-colors" whileHover={{
              scale: 1.1
            }} whileTap={{
              scale: 0.9
            }}>
                <SkipBack size={20} />
              </motion.button>
              
              <motion.button onClick={handlePlayPause} className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-r from-juricast-accent to-juricast-accent/90 text-white shadow-lg hover:shadow-xl transition-all" whileHover={{
              scale: 1.05
            }} whileTap={{
              scale: 0.95
            }}>
                <AnimatePresence mode="wait">
                  {isPlaying ? <motion.div key="pause" initial={{
                  scale: 0
                }} animate={{
                  scale: 1
                }} exit={{
                  scale: 0
                }}>
                      <Pause size={24} />
                    </motion.div> : <motion.div key="play" initial={{
                  scale: 0
                }} animate={{
                  scale: 1
                }} exit={{
                  scale: 0
                }}>
                      <Play size={24} className="ml-1" />
                    </motion.div>}
                </AnimatePresence>
              </motion.button>
              
              <motion.button onClick={() => skipForward(10)} className="w-12 h-12 flex items-center justify-center rounded-full bg-juricast-background/30 hover:bg-juricast-background/50 backdrop-blur-sm border border-juricast-card/30 transition-colors" whileHover={{
              scale: 1.1
            }} whileTap={{
              scale: 0.9
            }}>
                <SkipForward size={20} />
              </motion.button>
            </div>

            {/* Volume and playback controls */}
            <div className="flex items-center gap-4 mb-4">
              <motion.button onClick={toggleMute} className="text-juricast-muted hover:text-juricast-text transition-colors" whileHover={{
              scale: 1.1
            }} whileTap={{
              scale: 0.9
            }}>
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </motion.button>
              
              <div className="flex-1">
                <input type="range" min="0" max="1" step="0.01" value={isMuted ? 0 : volume} onChange={handleVolumeChange} className="w-full h-2 bg-juricast-background/50 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-juricast-accent [&::-webkit-slider-thumb]:shadow-lg" />
              </div>
              
              <div className="relative">
                <motion.button onClick={() => setShowPlaybackOptions(!showPlaybackOptions)} whileHover={{
                scale: 1.1
              }} whileTap={{
                scale: 0.9
              }} className="px-3 py-1 text-sm bg-juricast-background/30 rounded-full hover:bg-juricast-background/50 backdrop-blur-sm border border-juricast-card/30 min-w-[3rem]">
                  {playbackRate}x
                </motion.button>
                
                <AnimatePresence>
                  {showPlaybackOptions && <motion.div initial={{
                  opacity: 0,
                  y: 10,
                  scale: 0.9
                }} animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1
                }} exit={{
                  opacity: 0,
                  y: 10,
                  scale: 0.9
                }} className="absolute bottom-full right-0 mb-2 bg-juricast-card/90 backdrop-blur-md border border-juricast-card/50 rounded-lg p-2 shadow-xl z-20">
                      {[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => <motion.button key={rate} onClick={() => {
                    setPlaybackRate(rate);
                    setShowPlaybackOptions(false);
                  }} className={cn("block w-full text-left px-3 py-2 rounded-md text-sm transition-colors", playbackRate === rate ? "bg-juricast-accent text-white" : "hover:bg-juricast-background/30")} whileHover={{
                    x: 3
                  }}>
                          {rate}x velocidade
                        </motion.button>)}
                    </motion.div>}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>;
};
export default AudioPlayer;