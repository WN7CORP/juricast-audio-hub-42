import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Home, Heart, Clock, List, Check, BookOpen, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllAreas, getAllEpisodes } from '@/lib/podcast-service';
import { AreaCard, PodcastEpisode } from '@/lib/types';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const TopNavigation = () => {
  const [areas, setAreas] = useState<AreaCard[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchActive, setIsSearchActive] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<PodcastEpisode[]>([]);
  const [allEpisodes, setAllEpisodes] = useState<PodcastEpisode[]>([]);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  useEffect(() => {
    const fetchAreas = async () => {
      const areaData = await getAllAreas();
      setAreas(areaData);
    };
    fetchAreas();
  }, []);

  // Load all episodes for search
  useEffect(() => {
    const fetchEpisodes = async () => {
      const episodes = await getAllEpisodes();
      setAllEpisodes(episodes);
    };
    fetchEpisodes();
  }, []);

  // Handle search with real-time results - with null safety
  useEffect(() => {
    if (searchQuery.trim() && allEpisodes.length > 0) {
      const query = searchQuery.toLowerCase();
      const filtered = allEpisodes.filter(episode => {
        return (
          (episode.titulo && episode.titulo.toLowerCase().includes(query)) ||
          (episode.descricao && episode.descricao.toLowerCase().includes(query)) ||
          (episode.area && episode.area.toLowerCase().includes(query)) ||
          (episode.tema && episode.tema.toLowerCase().includes(query)) ||
          (episode.tag && Array.isArray(episode.tag) && episode.tag.some(tag => tag && tag.toLowerCase().includes(query)))
        );
      }).slice(0, 10); // Limit to 10 results for performance
      
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, allEpisodes]);

  const toggleSearch = () => {
    if (isSearchActive) {
      setIsSearchActive(false);
      setSearchQuery('');
      setSearchResults([]);
    } else {
      setIsCommandOpen(true);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleEpisodeSelect = (episodeId: number) => {
    setIsCommandOpen(false);
    setSearchQuery('');
    navigate(`/podcast/${episodeId}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsCommandOpen(false);
      navigate(`/busca?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleViewAllResults = () => {
    if (searchQuery.trim()) {
      setIsCommandOpen(false);
      navigate(`/busca?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Keyboard shortcut to open search
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsCommandOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <div className="sticky top-0 z-40 bg-gradient-to-b from-juricast-background to-juricast-background/95 backdrop-blur-md border-b border-juricast-card/20 py-0">
      <div className="flex flex-col">
        {/* Header with logo and search */}
        <div className="flex justify-between items-center px-4 py-2">
          <Link to="/">
            <motion.h1 
              className="text-xl md:text-2xl font-bold bg-gradient-to-r from-juricast-accent to-juricast-accent/80 bg-clip-text text-transparent"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              JuriCast
            </motion.h1>
          </Link>
          
          <div className="flex items-center gap-2 md:gap-4">
            <motion.button
              className="p-2 rounded-full hover:bg-juricast-card/50 transition-colors flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              onClick={toggleSearch}
              aria-label="Search"
            >
              <Search size={20} />
              <span className="hidden md:inline text-sm text-juricast-muted">
                Ctrl+K
              </span>
            </motion.button>
          </div>
        </div>
        
        {/* Enhanced Main Navigation */}
        <MainNavigation path={path} />
      </div>

      {/* Command Dialog for Search */}
      <CommandDialog open={isCommandOpen} onOpenChange={setIsCommandOpen}>
        <Command className="rounded-lg border shadow-md">
          <form onSubmit={handleSearchSubmit}>
            <CommandInput
              placeholder="Buscar episódios..."
              value={searchQuery}
              onValueChange={handleSearchChange}
            />
          </form>
          <CommandList>
            <CommandEmpty>
              {searchQuery ? (
                <div className="py-6 text-center text-sm">
                  <p>Nenhum episódio encontrado para "{searchQuery}"</p>
                  <button
                    onClick={handleViewAllResults}
                    className="mt-2 text-juricast-accent hover:underline"
                  >
                    Ver todos os resultados
                  </button>
                </div>
              ) : (
                "Digite para buscar episódios..."
              )}
            </CommandEmpty>
            {searchResults.length > 0 && (
              <CommandGroup heading="Episódios">
                {searchResults.map((episode) => (
                  <CommandItem
                    key={episode.id}
                    value={episode.titulo || ''}
                    onSelect={() => handleEpisodeSelect(episode.id)}
                    className="flex items-center gap-3 p-3 cursor-pointer"
                  >
                    <img
                      src={episode.imagem_miniatura}
                      alt={episode.titulo || 'Episódio'}
                      className="w-10 h-10 rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{episode.titulo || 'Título não disponível'}</p>
                      <p className="text-xs text-juricast-muted">{episode.area || 'Área não especificada'}</p>
                    </div>
                  </CommandItem>
                ))}
                {searchResults.length === 10 && (
                  <CommandItem
                    onSelect={handleViewAllResults}
                    className="text-center text-juricast-accent hover:underline cursor-pointer"
                  >
                    Ver mais resultados...
                  </CommandItem>
                )}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
};

const MainNavigation = ({ path }: { path: string }) => {
  const navItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Clock, label: "Novos", href: "/episodios-novos" },
    { icon: List, label: "Progresso", href: "/em-progresso" },
    { icon: Check, label: "Concluídos", href: "/concluidos" },
    { icon: Heart, label: "Favoritos", href: "/favoritos" },
  ];

  return (
    <div className="flex justify-center mb-3">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-juricast-card/40 backdrop-blur-md py-2 rounded-2xl shadow-lg border border-juricast-card/30 flex justify-around items-center gap-1 px-[6px]"
      >
        {navItems.map((item) => {
          const isActive = path === item.href || (item.href === "/episodios-novos" && path.includes("/episodios-novos"));
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              to={item.href}
              className="flex flex-col items-center relative px-2 md:px-3"
            >
              <motion.div
                className={cn(
                  "p-2 md:p-3 rounded-xl transition-all relative",
                  isActive
                    ? "bg-juricast-accent text-white shadow-lg"
                    : "text-juricast-text/70 hover:text-juricast-text hover:bg-juricast-background/30"
                )}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon size={18} />
                {isActive && (
                  <motion.div
                    layoutId="navIndicator"
                    className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"
                  />
                )}
              </motion.div>
              <span
                className={cn(
                  "text-xs mt-1 transition-colors",
                  isActive ? "text-juricast-accent font-medium" : "text-juricast-text/60"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </motion.div>
    </div>
  );
};

export default TopNavigation;
