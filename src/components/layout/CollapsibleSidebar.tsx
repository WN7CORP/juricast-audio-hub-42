
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Headphones, Clock, Heart, BarChart2, BookOpen, Search, Home, GraduationCap, Menu, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllAreas } from '@/lib/podcast-service';
import { Button } from '@/components/ui/button';

const SidebarLink = ({ 
  to, 
  icon: Icon, 
  label, 
  count,
  active,
  isCollapsed
}: { 
  to: string; 
  icon: React.ElementType; 
  label: string; 
  count?: number;
  active: boolean;
  isCollapsed: boolean;
}) => {
  return (
    <Link 
      to={to} 
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
        active 
          ? "bg-gradient-to-r from-juricast-accent to-juricast-accent/90 text-white shadow-lg" 
          : "hover:bg-juricast-card/50 hover:translate-x-1",
        isCollapsed && "justify-center px-2"
      )}
      title={isCollapsed ? label : undefined}
    >
      <Icon size={18} className={cn(
        "transition-colors flex-shrink-0",
        active ? "text-white" : "text-juricast-accent group-hover:text-juricast-accent"
      )} />
      
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-between flex-1 overflow-hidden"
          >
            <span className="font-medium text-sm whitespace-nowrap">{label}</span>
            {count !== undefined && (
              <span className={cn(
                "px-1.5 py-0.5 rounded text-xs font-medium ml-2 flex-shrink-0",
                active 
                  ? "bg-white/20 text-white" 
                  : "bg-juricast-background/50 text-juricast-muted"
              )}>
                {count}
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Link>
  );
};

const CollapsibleSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  
  const { data: areas = [] } = useQuery({
    queryKey: ['areas'],
    queryFn: getAllAreas
  });
  
  const juridicoAreas = areas.filter(area => area.category === 'juridico');
  const educativoAreas = areas.filter(area => area.category === 'educativo');
  
  return (
    <motion.div 
      className={cn(
        "h-screen bg-gradient-to-b from-juricast-background to-juricast-background/95 border-r border-juricast-card/20 flex flex-col overflow-hidden shadow-xl transition-all duration-300",
        isCollapsed ? "w-16" : "w-72"
      )}
      initial={false}
      animate={{ width: isCollapsed ? 64 : 288 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Header with Toggle */}
      <div className={cn("p-4 border-b border-juricast-card/20 flex items-center", isCollapsed ? "justify-center" : "justify-between")}>
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <h1 className="text-xl font-bold bg-gradient-to-r from-juricast-accent to-juricast-accent/80 bg-clip-text text-transparent">
                JuriCast
              </h1>
              <p className="text-juricast-muted text-xs mt-1">Podcast Jurídico</p>
            </motion.div>
          )}
        </AnimatePresence>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 h-auto hover:bg-juricast-card/50"
        >
          {isCollapsed ? <Menu size={16} /> : <X size={16} />}
        </Button>
      </div>
      
      {/* Search - only show when expanded */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="px-3 py-3 border-b border-juricast-card/10"
          >
            <div className="relative">
              <Search className="absolute left-2.5 top-2 text-juricast-muted" size={14} />
              <input
                type="search"
                placeholder="Buscar..."
                className="w-full bg-juricast-card/30 border border-juricast-card/30 rounded-lg py-1.5 pl-8 pr-3 
                          text-xs text-juricast-text placeholder:text-juricast-muted
                          focus:outline-none focus:ring-1 focus:ring-juricast-accent/30 focus:border-juricast-accent/50
                          transition-all duration-200"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <nav className="flex-1 px-2 py-3 overflow-y-auto custom-scrollbar">
        {/* Main Navigation */}
        <div className="mb-6 space-y-1">
          <SidebarLink to="/" icon={Home} label="Início" active={isActive('/')} isCollapsed={isCollapsed} />
          <SidebarLink to="/em-progresso" icon={Clock} label="Em Progresso" active={isActive('/em-progresso')} isCollapsed={isCollapsed} />
          <SidebarLink to="/favoritos" icon={Heart} label="Favoritos" active={isActive('/favoritos')} isCollapsed={isCollapsed} />
          <SidebarLink to="/modo-focado" icon={Headphones} label="Modo Focado" active={isActive('/modo-focado')} isCollapsed={isCollapsed} />
        </div>
        
        {/* Sorting Options */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mb-6"
            >
              <h2 className="text-juricast-muted font-semibold px-3 py-1 text-xs uppercase tracking-wider flex items-center gap-2">
                <BarChart2 size={12} />
                Ordenação
              </h2>
              <div className="space-y-1 mt-2">
                <SidebarLink to="/?sort=recent" icon={Clock} label="Mais Recentes" active={isActive('/?sort=recent')} isCollapsed={isCollapsed} />
                <SidebarLink to="/?sort=popular" icon={BarChart2} label="Mais Populares" active={isActive('/?sort=popular')} isCollapsed={isCollapsed} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Jurídico Category */}
        {juridicoAreas.length > 0 && (
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mb-6"
              >
                <h2 className="text-juricast-muted font-semibold px-3 py-1 text-xs uppercase tracking-wider flex items-center gap-2">
                  <BookOpen size={12} />
                  Direito
                </h2>
                <div className="space-y-1 mt-2">
                  {juridicoAreas.map((area) => (
                    <SidebarLink 
                      key={area.name} 
                      to={`/categoria/${area.slug}`} 
                      icon={BookOpen} 
                      label={area.name}
                      count={area.episodeCount}
                      active={isActive(`/categoria/${area.slug}`)} 
                      isCollapsed={isCollapsed}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
        
        {/* Educativo Category */}
        {educativoAreas.length > 0 && (
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mb-6"
              >
                <h2 className="text-juricast-muted font-semibold px-3 py-1 text-xs uppercase tracking-wider flex items-center gap-2">
                  <GraduationCap size={12} />
                  Educação Jurídica
                </h2>
                <div className="space-y-1 mt-2">
                  {educativoAreas.map((area) => (
                    <SidebarLink 
                      key={area.name} 
                      to={`/categoria/${area.slug}`} 
                      icon={GraduationCap} 
                      label={area.name}
                      count={area.episodeCount}
                      active={isActive(`/categoria/${area.slug}`)} 
                      isCollapsed={isCollapsed}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </nav>

      {/* Footer - only show when expanded */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="p-3 border-t border-juricast-card/20"
          >
            <div className="bg-gradient-to-r from-juricast-card/50 to-juricast-card/30 p-3 rounded-lg border border-juricast-card/30">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 bg-gradient-to-r from-juricast-accent to-juricast-accent/80 rounded flex items-center justify-center">
                  <Headphones size={12} className="text-white" />
                </div>
                <p className="text-xs font-medium text-juricast-text">JuriCast Premium</p>
              </div>
              <p className="text-xs text-juricast-muted leading-relaxed">
                Acesse conteúdo exclusivo
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CollapsibleSidebar;
