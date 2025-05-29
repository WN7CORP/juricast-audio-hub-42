import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Home, Heart, Clock, List, Check, BookOpen, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllAreas } from '@/lib/podcast-service';
import { AreaCard } from '@/lib/types';
const TopNavigation = () => {
  const [areas, setAreas] = useState<AreaCard[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchActive, setIsSearchActive] = useState<boolean>(false);
  const location = useLocation();
  const path = location.pathname;
  useEffect(() => {
    const fetchAreas = async () => {
      const areaData = await getAllAreas();
      setAreas(areaData);
    };
    fetchAreas();
  }, []);
  const toggleSearch = () => {
    setIsSearchActive(!isSearchActive);
    if (isSearchActive) {
      setSearchQuery('');
    }
  };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/busca?q=${encodeURIComponent(searchQuery)}`;
    }
  };
  return <div className="sticky top-0 z-40 bg-gradient-to-b from-juricast-background to-juricast-background/95 backdrop-blur-md border-b border-juricast-card/20 py-2">
      <div className="flex flex-col">
        {/* Header with logo and search */}
        <div className="flex justify-between items-center px-4 py-2">
          <Link to="/">
            <motion.h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-juricast-accent to-juricast-accent/80 bg-clip-text text-transparent" initial={{
            scale: 0.95,
            opacity: 0
          }} animate={{
            scale: 1,
            opacity: 1
          }} transition={{
            duration: 0.3,
            delay: 0.1
          }}>
              JuriCast
            </motion.h1>
          </Link>
          
          <div className="flex items-center gap-2 md:gap-4">
            <AnimatePresence>
              {isSearchActive && <motion.form initial={{
              width: 0,
              opacity: 0
            }} animate={{
              width: "200px",
              opacity: 1
            }} exit={{
              width: 0,
              opacity: 0
            }} className="relative" onSubmit={handleSearchSubmit}>
                  <input type="text" value={searchQuery} onChange={handleSearchChange} className="w-full py-2 px-4 pr-10 rounded-full bg-juricast-card/50 border border-juricast-card/30 text-sm focus:outline-none focus:ring-2 focus:ring-juricast-accent/50 focus:border-juricast-accent" placeholder="Buscar podcasts..." autoFocus />
                  <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Search size={16} className="text-juricast-accent" />
                  </button>
                </motion.form>}
            </AnimatePresence>
            
            <motion.button className="p-2 rounded-full hover:bg-juricast-card/50 transition-colors" whileHover={{
            scale: 1.1
          }} whileTap={{
            scale: 0.9
          }} initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} transition={{
            delay: 0.2
          }} onClick={toggleSearch} aria-label="Search">
              <Search size={20} />
            </motion.button>
          </div>
        </div>
        
        {/* Enhanced Main Navigation */}
        <MainNavigation path={path} />
      </div>
    </div>;
};
const MainNavigation = ({
  path
}: {
  path: string;
}) => {
  const navItems = [{
    icon: Home,
    label: "Home",
    href: "/"
  }, {
    icon: Clock,
    label: "Novos",
    href: "/episodios-novos"
  }, {
    icon: List,
    label: "Progresso",
    href: "/em-progresso"
  }, {
    icon: Check,
    label: "Concluídos",
    href: "/concluidos"
  }, {
    icon: Heart,
    label: "Favoritos",
    href: "/favoritos"
  }];
  return <div className="flex justify-center mb-3">
      <motion.div initial={{
      y: -20,
      opacity: 0
    }} animate={{
      y: 0,
      opacity: 1
    }} transition={{
      duration: 0.3,
      delay: 0.1
    }} className="bg-juricast-card/40 backdrop-blur-md py-2 rounded-2xl shadow-lg border border-juricast-card/30 flex justify-around items-center gap-1 px-[6px]">
        {navItems.map(item => {
        const isActive = path === item.href || item.href === "/episodios-novos" && path.includes("/episodios-novos");
        const Icon = item.icon;
        return <Link key={item.label} to={item.href} className="flex flex-col items-center relative px-2 md:px-3">
              <motion.div className={cn("p-2 md:p-3 rounded-xl transition-all relative", isActive ? "bg-juricast-accent text-white shadow-lg" : "text-juricast-text/70 hover:text-juricast-text hover:bg-juricast-background/30")} whileHover={{
            scale: 1.05,
            y: -2
          }} whileTap={{
            scale: 0.95
          }}>
                <Icon size={18} />
                {isActive && <motion.div layoutId="navIndicator" className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full" />}
              </motion.div>
              <span className={cn("text-xs mt-1 transition-colors", isActive ? "text-juricast-accent font-medium" : "text-juricast-text/60")}>
                {item.label}
              </span>
            </Link>;
      })}
      </motion.div>
    </div>;
};
export default TopNavigation;