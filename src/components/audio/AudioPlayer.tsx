
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
import { motion } from 'framer-motion';
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
  const [audioColor, setAudioColor] = useState('#E50914');
  const [audioAnalyzerData, setAudioAnalyzerData] = useState<number[]>(Array(20).fill(0));
  const progressRef = useRef<HTMLDivElement>(null);
  const analyzerIntervalRef = useRef<number | null>(null);
  const soundWaveIntervalRef = useRef<number | null>(null);
  
  // Generate sound wave visualization
  useEffect(() => {
    // Clear previous interval if exists
    if (soundWaveIntervalRef.current) {
      window.clearInterval(soundWaveIntervalRef.current);
    }
    
    if (isPlaying) {
      // Simulate sound waves with pulsating circles when playing
      soundWaveIntervalRef.current = window.setInterval(() => {
        const newData = Array(30).fill(0).map(() => 
          Math.max(0.2, Math.random() * (isPlaying ? 1 : 0.3))
        );
        setAudioAnalyzerData(newData);
      }, 120);
    } else {
      // Calm down visualization when paused
      setAudioAnalyzerData(audioAnalyzerData.map(v => v * 0.5));
    }
    
    return () => {
      if (soundWaveIntervalRef.current) {
        window.clearInterval(soundWaveIntervalRef.current);
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

  // Create array of particles for audio visualization
  const particles = Array.from({
    length: 60
  }).map((_, index) => ({
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
      {/* Audio Visualization Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {isPlaying && particles.map(particle => (
          <motion.div 
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: `${particle.x}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              background: audioColor,
              boxShadow: `0 0 ${particle.size * 3}px ${audioColor}`
            }}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: ['0%', '100%'], opacity: [0, 0.8, 0] }}
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
            {/* Thumbnail with sound wave effect */}
            <img 
              src={thumbnail || '/placeholder.svg'} 
              alt={title} 
              className="w-full h-full object-cover"
            />
            
            {/* Sound wave visualization overlay */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              {isPlaying && (
                <div className="absolute inset-0 flex justify-center items-center">
                  <div className="relative w-32 h-32">
                    {audioAnalyzerData.map((value, idx) => (
                      <motion.div
                        key={idx}
                        className="absolute top-1/2 left-1/2 rounded-full bg-white/30"
                        style={{
                          width: `${value * 100 + 20}%`,
                          height: `${value * 100 + 20}%`,
                          transform: 'translate(-50%, -50%)',
                          opacity: 0.3
                        }}
                        animate={{
                          scale: [0.8, 1, 0.8],
                          opacity: [0.2, 0.4, 0.2],
                        }}
                        transition={{
                          duration: 2 + Math.random() * 2,
                          repeat: Infinity,
                          delay: idx * 0.1,
                          ease: "easeInOut"
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {/* Radial sound waves when playing */}
              {isPlaying && (
                <>
                  {[1, 2, 3].map((ring) => (
                    <motion.div
                      key={ring}
                      className="absolute top-1/2 left-1/2 rounded-full border border-white/30"
                      style={{ transform: 'translate(-50%, -50%)' }}
                      animate={{
                        width: ['30%', '100%'],
                        height: ['30%', '100%'],
                        opacity: [0.8, 0],
                      }}
                      transition={{
                        duration: 2 * ring,
                        repeat: Infinity,
                        delay: ring * 0.5,
                        ease: "easeOut"
                      }}
                    />
                  ))}
                </>
              )}
            </div>
          </motion.div>
        </div>

        <div className="mb-3">
          <h2 className="text-lg font-semibold text-center mb-1 truncate md:text-clip">{title}</h2>
        </div>

        <div 
          className="w-full h-2 bg-juricast-background rounded-full overflow-hidden mb-2 cursor-pointer" 
          onClick={handleProgressClick}
          ref={progressRef}
        >
          <motion.div 
            className="h-full bg-juricast-accent"
            style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
            animate={{ width: `${(currentTime / duration) * 100 || 0}%` }}
            transition={{ ease: "linear" }}
          />
        </div>

        <div className="flex justify-between text-juricast-muted text-sm mb-4">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        {/* Controles de reprodução - APENAS O BOTÃO VERMELHO COMO PRINCIPAL */}
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
          <button 
            onClick={toggleMute} 
            className="text-juricast-muted hover:text-juricast-text"
          >
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

        {/* Playback speed control */}
        <div className="flex justify-center mt-4">
          <div className="relative">
            <motion.button 
              onClick={() => setShowPlaybackOptions(!showPlaybackOptions)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="px-3 py-1 text-sm bg-juricast-background/30 rounded-full hover:bg-juricast-background/50"
            >
              {playbackRate}x
            </motion.button>
            
            {showPlaybackOptions && (
              <div className="absolute bottom-full left-0 mb-2 bg-juricast-card border border-juricast-card/30 rounded-lg p-2 shadow-lg z-20">
                {[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => (
                  <motion.button 
                    key={rate}
                    onClick={() => {
                      setPlaybackRate(rate);
                      setShowPlaybackOptions(false);
                    }}
                    className={cn(
                      "block w-full text-left px-3 py-1 rounded-md text-sm",
                      playbackRate === rate ? "bg-juricast-accent text-white" : "hover:bg-juricast-background/30"
                    )}
                    whileHover={{ x: 3 }}
                  >
                    {rate}x
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AudioPlayer;
