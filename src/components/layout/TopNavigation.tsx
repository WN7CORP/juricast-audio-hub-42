
import React, { useState, useEffect } from 'react';
import { Search, Menu, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { searchEpisodes } from '@/lib/podcast-service';
import { PodcastEpisode } from '@/lib/types';

interface TopNavigationProps {
  onMenuToggle?: () => void;
  showMobileMenu?: boolean;
}

const TopNavigation: React.FC<TopNavigationProps> = ({ 
  onMenuToggle, 
  showMobileMenu = false 
}) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Debounced search
  const [debouncedQuery, setDebouncedQuery] = useState('');
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: searchResults = [], isLoading } = useQuery({
    queryKey: ['searchEpisodes', debouncedQuery],
    queryFn: () => searchEpisodes(debouncedQuery),
    enabled: debouncedQuery.length >= 2
  });

  useEffect(() => {
    setShowResults(isSearchFocused && debouncedQuery.length >= 2);
  }, [isSearchFocused, debouncedQuery]);

  const handleEpisodeClick = (episode: PodcastEpisode) => {
    navigate(`/podcast/${episode.id}`);
    setSearchQuery('');
    setShowResults(false);
    setIsSearchFocused(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      handleEpisodeClick(searchResults[0]);
    } else if (searchQuery.trim()) {
      navigate(`/buscar?q=${encodeURIComponent(searchQuery)}`);
      setShowResults(false);
      setIsSearchFocused(false);
    }
  };

  return (
    <motion.header 
      className={cn(
        "sticky top-0 z-40 w-full border-b border-juricast-card/20 bg-juricast-background/95 backdrop-blur supports-[backdrop-filter]:bg-juricast-background/60",
        isMobile ? "px-4 py-3" : "px-6 py-4"
      )}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between w-full max-w-full">
        {isMobile && (
          <button
            onClick={onMenuToggle}
            className="mr-4 p-2 rounded-lg hover:bg-juricast-card transition-colors"
            aria-label="Toggle menu"
          >
            {showMobileMenu ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        )}

        <div className="flex-1 max-w-md mx-auto relative">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-juricast-muted h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar episódios..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => {
                // Delay to allow clicking on results
                setTimeout(() => setIsSearchFocused(false), 200);
              }}
              className={cn(
                "w-full pl-10 pr-4 py-2 bg-juricast-card border border-juricast-card/40 rounded-lg",
                "placeholder:text-juricast-muted text-juricast-text",
                "focus:outline-none focus:ring-2 focus:ring-juricast-accent/20 focus:border-juricast-accent",
                "transition-all duration-200",
                isMobile ? "text-sm" : "text-base"
              )}
            />
          </form>

          {/* Search Results Dropdown */}
          <AnimatePresence>
            {showResults && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-juricast-card border border-juricast-card/40 rounded-lg shadow-lg max-h-80 overflow-y-auto z-50"
              >
                {isLoading ? (
                  <div className="p-4 text-center text-juricast-muted">
                    <div className="animate-spin w-5 h-5 border-2 border-juricast-accent border-t-transparent rounded-full mx-auto"></div>
                    <p className="mt-2 text-sm">Buscando...</p>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="py-2">
                    <div className="px-3 py-2 text-xs text-juricast-muted border-b border-juricast-card/20">
                      {searchResults.length} resultados encontrados
                    </div>
                    {searchResults.slice(0, 8).map((episode) => (
                      <button
                        key={episode.id}
                        onClick={() => handleEpisodeClick(episode)}
                        className="w-full px-3 py-3 text-left hover:bg-juricast-background transition-colors border-b border-juricast-card/10 last:border-b-0"
                      >
                        <div className="flex items-start gap-3">
                          <img 
                            src={episode.imagem_miniatura} 
                            alt={episode.titulo}
                            className="w-10 h-10 rounded object-cover flex-shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <h4 className="font-medium text-sm line-clamp-1 text-juricast-text">
                              {episode.titulo}
                            </h4>
                            <p className="text-xs text-juricast-muted mt-1">
                              {episode.area} • {episode.tema}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-juricast-muted">
                    <p className="text-sm">Nenhum resultado encontrado</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {!isMobile && <div className="w-12"></div>}
      </div>
    </motion.header>
  );
};

export default TopNavigation;
