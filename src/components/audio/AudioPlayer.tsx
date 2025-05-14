import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
import { motion } from 'framer-motion';

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
  const { state, pause, resume, setVolume, toggleMute, seekTo, skipForward, skipBackward, setPlaybackRate } = useAudioPlayer();
  const { isPlaying, volume, isMuted, currentTime, duration, playbackRate } = state;
  const [showPlaybackOptions, setShowPlaybackOptions] = useState(false);
  const [audioColor, setAudioColor] = useState('#E50914');
  const progressRef = useRef<HTMLDivElement>(null);

  // Generate random audio color
  useEffect(() => {
    setAudioColor('#E50914'); // Keep with JuriCast red accent
  }, [src]);

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

  // Create array of particles for falling glow visualization
  const particles = Array.from({ length: 50 }).map((_, index) => ({
    id: index,
    x: Math.random() * 100,
    size: Math.random() * 4 + 1,
    delay: Math.random() * 5,
    duration: Math.random() * 3 + 2
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="p-4 bg-juricast-card rounded-lg border border-juricast-card/30 px-[28px] py-6 relative overflow-hidden"
    >
      {/* Elegant Falling Glow Visualization */}
      <div className="absolute inset-0 overflow-hidden">
        {isPlaying && particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: `${particle.x}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              background: audioColor,
              boxShadow: `0 0 ${particle.size * 3}px ${audioColor}`,
            }}
            initial={{ y: -10, opacity: 0 }}
            animate={{
              y: ['0%', '100%'],
              opacity: [0, 0.8, 0]
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeIn"
            }}
          />
        ))}
      </div>
      
      <div className="relative z-10">
        <div className="flex flex-col items-center mb-4">
          <motion.div 
            className="relative w-full max-w-xs aspect-square mb-4 overflow-hidden rounded-lg" 
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            {/* Thumbnail with elegant glow effect */}
            <img src={thumbnail || '/placeholder.svg'} alt={title} className="w-full h-full object-cover" />
            <motion.div 
              className="absolute inset-0 bg-black/30 flex items-center justify-center"
              animate={{
                backgroundColor: isPlaying ? ['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.3)'] : 'rgba(0,0,0,0.3)'
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {/* Play/Pause Button Overlay */}
              <motion.button
                onClick={handlePlayPause}
                className="w-16 h-16 rounded-full bg-juricast-accent/80 flex items-center justify-center"
                whileHover={{ scale: 1.1, backgroundColor: "rgba(229, 9, 20, 0.9)" }}
                whileTap={{ scale: 0.95 }}
              >
                {isPlaying ? <Pause size={30} className="text-white" /> : <Play size={30} className="text-white ml-1" />}
              </motion.button>
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

        <div className="flex justify-center items-center gap-4 mb-4">
          <motion.button
            onClick={() => skipBackward(10)}
            className="player-button w-10 h-10 flex items-center justify-center rounded-full hover:bg-juricast-background/30"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <SkipBack size={20} />
          </motion.button>
          <motion.button
            onClick={handlePlayPause}
            className="player-button w-14 h-14 flex items-center justify-center rounded-full bg-juricast-accent text-white hover:bg-juricast-accent/90"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
          </motion.button>
          <motion.button
            onClick={() => skipForward(10)}
            className="player-button w-10 h-10 flex items-center justify-center rounded-full hover:bg-juricast-background/30"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <SkipForward size={20} />
          </motion.button>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <button onClick={toggleMute} className="text-juricast-muted hover:text-juricast-text">
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <input type="range" min="0" max="1" step="0.01" value={isMuted ? 0 : volume} onChange={handleVolumeChange} className="w-full h-1 bg-juricast-background rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-juricast-accent" />
        </div>

        {/* Playback speed control */}
        <div className="flex justify-center mt-4">
          <div className="relative">
            <motion.button onClick={() => setShowPlaybackOptions(!showPlaybackOptions)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="px-3 py-1 text-sm bg-juricast-background/30 rounded-full hover:bg-juricast-background/50">
              {playbackRate}x
            </motion.button>
            
            {showPlaybackOptions && <div className="absolute bottom-full left-0 mb-2 bg-juricast-card border border-juricast-card/30 rounded-lg p-2 shadow-lg z-20">
                {[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => <motion.button key={rate} onClick={() => {
              setPlaybackRate(rate);
              setShowPlaybackOptions(false);
            }} className={cn("block w-full text-left px-3 py-1 rounded-md text-sm", playbackRate === rate ? "bg-juricast-accent text-white" : "hover:bg-juricast-background/30")} whileHover={{
              x: 3
            }}>
                    {rate}x
                  </motion.button>)}
              </div>}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AudioPlayer;
