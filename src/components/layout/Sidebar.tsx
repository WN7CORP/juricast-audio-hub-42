
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Headphones, Clock, Heart, List, BarChart2, BookOpen } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

const fetchCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('juricast')
      .select('area')
      .order('area', { ascending: true });

    if (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }

    // Extract unique areas
    const areas = [...new Set(data?.map(item => item.area))];
    return areas;
  } catch (error) {
    console.error("Error in fetchCategories:", error);
    return [];
  }
};

const SidebarLink = ({ 
  to, 
  icon: Icon, 
  label, 
  count,
  active
}: { 
  to: string; 
  icon: React.ElementType; 
  label: string; 
  count?: number;
  active: boolean;
}) => {
  return (
    <Link 
      to={to} 
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-md hover:bg-juricast-card transition-colors",
        active && "bg-juricast-card"
      )}
    >
      <Icon size={20} className="text-juricast-accent" />
      <span className="flex-grow">{label}</span>
      {count !== undefined && (
        <span className="bg-juricast-card px-2 py-0.5 rounded-full text-xs text-juricast-muted">
          {count}
        </span>
      )}
    </Link>
  );
};

const Sidebar = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });
  
  return (
    <div className="w-64 h-screen bg-juricast-background border-r border-juricast-card flex flex-col">
      <div className="p-5">
        <h1 className="text-2xl font-bold text-juricast-accent">JuriCast</h1>
        <p className="text-juricast-muted text-sm">Podcast Jurídico</p>
      </div>
      
      <nav className="flex-1 px-4 py-2 overflow-y-auto">
        <div className="mb-6">
          <SidebarLink to="/" icon={Headphones} label="Todos" active={isActive('/')} />
          <SidebarLink to="/em-progresso" icon={Clock} label="Em Progresso" active={isActive('/em-progresso')} />
          <SidebarLink to="/favoritos" icon={Heart} label="Favoritos" active={isActive('/favoritos')} />
        </div>
        
        <div className="mb-6">
          <h2 className="text-juricast-muted font-medium px-4 py-2">Ordenação</h2>
          <SidebarLink to="/?sort=recent" icon={List} label="Mais Recentes" active={isActive('/?sort=recent')} />
          <SidebarLink to="/?sort=popular" icon={BarChart2} label="Mais Populares" active={isActive('/?sort=popular')} />
          <SidebarLink to="/?sort=title" icon={BookOpen} label="Por Título" active={isActive('/?sort=title')} />
        </div>
        
        <div className="mb-6">
          <h2 className="text-juricast-muted font-medium px-4 py-2">Categorias</h2>
          {categories.map((category) => (
            <SidebarLink 
              key={category} 
              to={`/categoria/${category.toLowerCase().replace(/\s+/g, '-')}`} 
              icon={BookOpen} 
              label={category}
              active={isActive(`/categoria/${category.toLowerCase().replace(/\s+/g, '-')}`)} 
            />
          ))}
          {categories.length === 0 && (
            <p className="text-juricast-muted text-sm px-4 py-2">Nenhuma categoria disponível</p>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
