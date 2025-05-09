
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Headphones, 
  Clock, 
  Heart, 
  List, 
  BarChart2, 
  BookOpen 
} from 'lucide-react';

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
  
  return (
    <div className="w-64 h-screen bg-juricast-background border-r border-juricast-card flex flex-col">
      <div className="p-5">
        <h1 className="text-2xl font-bold text-juricast-accent">JuriCast</h1>
        <p className="text-juricast-muted text-sm">Podcast Jurídico</p>
      </div>
      
      <nav className="flex-1 px-4 py-2">
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
          <SidebarLink to="/categoria/direito-penal" icon={BookOpen} label="Direito Penal" count={3} active={isActive('/categoria/direito-penal')} />
          <SidebarLink to="/categoria/direito-civil" icon={BookOpen} label="Direito Civil" count={2} active={isActive('/categoria/direito-civil')} />
          <SidebarLink to="/categoria/direito-constitucional" icon={BookOpen} label="Direito Constitucional" count={1} active={isActive('/categoria/direito-constitucional')} />
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
