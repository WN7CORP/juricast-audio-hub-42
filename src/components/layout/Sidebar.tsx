
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Headphones, Clock, Heart, List, BarChart2, BookOpen, Search, Home, GraduationCap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { getAllAreas } from '@/lib/podcast-service';
import { AreaCard } from '@/lib/types';

const sidebarAnimation = {
  hidden: { opacity: 0, x: -20 },
  visible: (custom: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: custom * 0.1,
      duration: 0.5,
      ease: "easeOut"
    }
  })
};

const SidebarLink = ({ 
  to, 
  icon: Icon, 
  label, 
  count,
  active,
  index
}: { 
  to: string; 
  icon: React.ElementType; 
  label: string; 
  count?: number;
  active: boolean;
  index: number;
}) => {
  return (
    <motion.div
      custom={index}
      variants={sidebarAnimation}
      initial="hidden"
      animate="visible"
    >
      <Link 
        to={to} 
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
          active 
            ? "bg-gradient-to-r from-juricast-accent to-juricast-accent/90 text-white shadow-lg" 
            : "hover:bg-juricast-card/50 hover:translate-x-1"
        )}
      >
        <Icon size={20} className={cn(
          "transition-colors",
          active ? "text-white" : "text-juricast-accent group-hover:text-juricast-accent"
        )} />
        <span className="flex-grow font-medium">{label}</span>
        {count !== undefined && (
          <span className={cn(
            "px-2 py-0.5 rounded-full text-xs font-medium",
            active 
              ? "bg-white/20 text-white" 
              : "bg-juricast-background/50 text-juricast-muted"
          )}>
            {count}
          </span>
        )}
      </Link>
    </motion.div>
  );
};

const Sidebar = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  
  const { data: areas = [] } = useQuery({
    queryKey: ['areas'],
    queryFn: getAllAreas
  });
  
  // Separate areas by category
  const juridicoAreas = areas.filter(area => area.category === 'juridico');
  const educativoAreas = areas.filter(area => area.category === 'educativo');
  
  return (
    <motion.div 
      className="w-72 h-screen bg-gradient-to-b from-juricast-background to-juricast-background/95 border-r border-juricast-card/20 flex flex-col overflow-hidden shadow-xl"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Enhanced Header */}
      <div className="p-6 border-b border-juricast-card/20">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <h1 className="text-2xl font-bold bg-gradient-to-r from-juricast-accent to-juricast-accent/80 bg-clip-text text-transparent">
            JuriCast
          </h1>
          <p className="text-juricast-muted text-sm mt-1">Podcast Jurídico Professional</p>
        </motion.div>
      </div>
      
      {/* Enhanced Search */}
      <div className="px-4 py-4 border-b border-juricast-card/10">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-juricast-muted" size={16} />
          <input
            type="search"
            placeholder="Buscar episódios..."
            className="w-full bg-juricast-card/30 border border-juricast-card/30 rounded-xl py-2.5 pl-9 pr-4 
                      text-sm text-juricast-text placeholder:text-juricast-muted
                      focus:outline-none focus:ring-2 focus:ring-juricast-accent/30 focus:border-juricast-accent/50
                      transition-all duration-200"
          />
        </div>
      </div>
      
      <nav className="flex-1 px-4 py-4 overflow-y-auto custom-scrollbar">
        {/* Main Navigation */}
        <div className="mb-8 space-y-2">
          <SidebarLink to="/" icon={Home} label="Início" active={isActive('/')} index={0} />
          <SidebarLink to="/em-progresso" icon={Clock} label="Em Progresso" active={isActive('/em-progresso')} index={1} />
          <SidebarLink to="/favoritos" icon={Heart} label="Favoritos" active={isActive('/favoritos')} index={2} />
        </div>
        
        {/* Sorting Options */}
        <div className="mb-8">
          <h2 className="text-juricast-muted font-semibold px-4 py-2 text-xs uppercase tracking-wider flex items-center gap-2">
            <BarChart2 size={14} />
            Ordenação
          </h2>
          <div className="space-y-1">
            <SidebarLink to="/?sort=recent" icon={Clock} label="Mais Recentes" active={isActive('/?sort=recent')} index={3} />
            <SidebarLink to="/?sort=popular" icon={BarChart2} label="Mais Populares" active={isActive('/?sort=popular')} index={4} />
          </div>
        </div>
        
        {/* Jurídico Category */}
        {juridicoAreas.length > 0 && (
          <div className="mb-8">
            <h2 className="text-juricast-muted font-semibold px-4 py-2 text-xs uppercase tracking-wider flex items-center gap-2">
              <BookOpen size={14} />
              Direito
            </h2>
            <div className="space-y-1">
              {juridicoAreas.map((area, index) => (
                <SidebarLink 
                  key={area.name} 
                  to={`/categoria/${area.slug}`} 
                  icon={BookOpen} 
                  label={area.name}
                  count={area.episodeCount}
                  active={isActive(`/categoria/${area.slug}`)} 
                  index={5 + index}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* Educativo Category */}
        {educativoAreas.length > 0 && (
          <div className="mb-8">
            <h2 className="text-juricast-muted font-semibold px-4 py-2 text-xs uppercase tracking-wider flex items-center gap-2">
              <GraduationCap size={14} />
              Educação Jurídica
            </h2>
            <div className="space-y-1">
              {educativoAreas.map((area, index) => (
                <SidebarLink 
                  key={area.name} 
                  to={`/categoria/${area.slug}`} 
                  icon={GraduationCap} 
                  label={area.name}
                  count={area.episodeCount}
                  active={isActive(`/categoria/${area.slug}`)} 
                  index={5 + juridicoAreas.length + index}
                />
              ))}
            </div>
          </div>
        )}
        
        {(juridicoAreas.length === 0 && educativoAreas.length === 0) && (
          <div className="px-4 py-8 text-center">
            <div className="text-juricast-muted text-sm">
              <Headphones size={32} className="mx-auto mb-2 opacity-50" />
              Carregando categorias...
            </div>
          </div>
        )}
      </nav>

      {/* Enhanced Footer */}
      <div className="p-4 border-t border-juricast-card/20">
        <div className="bg-gradient-to-r from-juricast-card/50 to-juricast-card/30 p-4 rounded-xl border border-juricast-card/30">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-gradient-to-r from-juricast-accent to-juricast-accent/80 rounded-lg flex items-center justify-center">
              <Headphones size={16} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-juricast-text">JuriCast Premium</p>
            </div>
          </div>
          <p className="text-xs text-juricast-muted leading-relaxed">
            Acesse conteúdo exclusivo e funcionalidades avançadas
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
