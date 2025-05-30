import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, FileText, Heart } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { PodcastEpisode } from '@/lib/types';
import { toggleFavorite } from '@/lib/podcast-service';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
interface SupportContentProps {
  description: string;
  episode?: PodcastEpisode;
}
const SupportContent: React.FC<SupportContentProps> = ({
  description,
  episode
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!episode) return;
    const newStatus = toggleFavorite(episode.id);
    queryClient.invalidateQueries({
      queryKey: ['favoriteEpisodes']
    });
    queryClient.invalidateQueries({
      queryKey: ['episode', episode.id]
    });
    toast({
      title: newStatus ? "Adicionado aos favoritos" : "Removido dos favoritos",
      description: newStatus ? "Este episódio foi adicionado à sua lista de favoritos." : "Este episódio foi removido da sua lista de favoritos."
    });
  };
  return <div className="mt-4">
      <motion.button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-center gap-2 p-3 bg-juricast-card hover:bg-juricast-card/80 rounded-lg border border-juricast-card/30 transition-colors" whileHover={{
      scale: 1.02
    }} whileTap={{
      scale: 0.98
    }}>
        <FileText size={20} className="text-juricast-accent" />
        <span className="font-medium text-white">Mostrar Descrição</span>
        {isOpen ? <ChevronUp size={20} className="text-white" /> : <ChevronDown size={20} className="text-white" />}
      </motion.button>

      <AnimatePresence>
        {isOpen && <motion.div initial={{
        height: 0,
        opacity: 0,
        y: 20
      }} animate={{
        height: 'auto',
        opacity: 1,
        y: 0
      }} exit={{
        height: 0,
        opacity: 0,
        y: 20
      }} transition={{
        duration: 0.4,
        ease: [0.4, 0.0, 0.2, 1],
        height: {
          duration: 0.4
        },
        opacity: {
          duration: 0.3,
          delay: 0.1
        }
      }} className="overflow-hidden origin-top">
            <div className="mt-4 p-4 bg-juricast-background/30 rounded-lg border border-juricast-card/20">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-juricast-accent">Descrição do Episódio</h3>
                {episode && <motion.button onClick={handleToggleFavorite} className="p-2 rounded-full hover:bg-juricast-accent/10 transition-colors" whileTap={{
              scale: 0.9
            }}>
                    <AnimatePresence mode="wait">
                      <motion.div key={episode.favorito ? 'filled' : 'empty'} initial={{
                  scale: 0.8,
                  opacity: 0
                }} animate={{
                  scale: 1,
                  opacity: 1
                }} exit={{
                  scale: 0.8,
                  opacity: 0
                }} transition={{
                  duration: 0.2
                }}>
                        <Heart className={cn("w-5 h-5 transition-colors", episode.favorito ? "fill-red-500 text-red-500" : "text-juricast-muted")} />
                      </motion.div>
                    </AnimatePresence>
                  </motion.button>}
              </div>
              
              <div className="prose prose-sm max-w-none text-white prose-headings:text-white prose-strong:text-white prose-em:text-juricast-accent prose-p:text-white prose-ul:text-white prose-li:text-white">
                <ReactMarkdown components={{
              p: ({
                children
              }) => <p className="mb-4 text-white leading-relaxed px-0">{children}</p>,
              br: () => <br className="mb-2" />,
              strong: ({
                children
              }) => <strong className="text-white font-semibold">{children}</strong>,
              em: ({
                children
              }) => <em className="text-juricast-accent">{children}</em>
            }}>
                  {description}
                </ReactMarkdown>
              </div>

              {episode && <motion.div initial={{
            opacity: 0,
            y: 10
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.2
          }} className="mt-6 pt-4 border-t border-juricast-card/30">
                  <h4 className="font-medium text-juricast-accent mb-3">Detalhes do Episódio</h4>
                  
                  {/* Tags */}
                  {Array.isArray(episode.tag) && episode.tag.length > 0 && <div className="mb-4">
                      <span className="text-sm text-juricast-muted mb-2 block">Tags:</span>
                      <div className="flex flex-wrap gap-2">
                        {episode.tag.map((tag: string, index: number) => <span key={index} className="bg-juricast-background/50 px-2 py-1 rounded-full text-xs border border-juricast-card/30 text-white">
                            {tag}
                          </span>)}
                      </div>
                    </div>}

                  {/* Episode Details Grid */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-juricast-muted block">Área:</span>
                      <span className="text-white">{episode.area}</span>
                    </div>
                    <div>
                      <span className="text-juricast-muted block">Tema:</span>
                      <span className="text-white">{episode.tema}</span>
                    </div>
                    <div>
                      <span className="text-juricast-muted block">Sequência:</span>
                      <span className="text-white">{episode.sequencia || 'Não informada'}</span>
                    </div>
                    <div>
                      <span className="text-juricast-muted block">Data:</span>
                      <span className="text-white">{episode.data_publicacao || 'Não informada'}</span>
                    </div>
                  </div>
                </motion.div>}
            </div>
          </motion.div>}
      </AnimatePresence>
    </div>;
};
export default SupportContent;