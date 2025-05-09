
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, List, BarChart2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const TopNavigation = () => {
  return (
    <div className="top-nav">
      <div className="flex flex-col">
        <div className="flex justify-between items-center px-4 py-2">
          <Link to="/">
            <motion.h1 
              className="text-xl font-bold text-juricast-accent"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              JuriCast
            </motion.h1>
          </Link>
          
          <div className="flex items-center gap-4">
            <motion.button
              className="p-2 rounded-full hover:bg-juricast-card transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Search size={20} />
            </motion.button>
          </div>
        </div>
        
        <CategoryNav />
      </div>
    </div>
  );
};

const CategoryNav = () => {
  const location = useLocation();
  const path = location.pathname;
  
  const categories = [
    { name: "Todos", href: "/" },
    { name: "Em Progresso", href: "/em-progresso" },
    { name: "Favoritos", href: "/favoritos" },
    { name: "Penal", href: "/categoria/penal" },
    { name: "Civil", href: "/categoria/civil" },
    { name: "Trabalhista", href: "/categoria/trabalhista" },
    { name: "Constitucional", href: "/categoria/constitucional" }
  ];
  
  return (
    <div className="overflow-x-auto nav-scrollbar">
      <div className="flex px-4 space-x-4 pb-2 min-w-max">
        {categories.map((category) => {
          const isActive = path === category.href;
          
          return (
            <Link
              key={category.name}
              to={category.href}
              className={cn(
                "px-3 py-1 rounded-full text-sm whitespace-nowrap transition-all duration-300",
                isActive 
                  ? "bg-juricast-accent text-white font-medium" 
                  : "bg-juricast-card text-juricast-text hover:bg-juricast-card/70"
              )}
            >
              {category.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default TopNavigation;
