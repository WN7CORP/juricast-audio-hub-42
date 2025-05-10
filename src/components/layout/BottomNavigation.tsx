
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Heart, Clock, List } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const BottomNavigation = () => {
  const location = useLocation();
  const path = location.pathname;

  const navItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Clock, label: "Progresso", href: "/em-progresso" },
    { icon: Heart, label: "Favoritos", href: "/favoritos" },
    { icon: List, label: "Categorias", href: "/?sort=categorias" }
  ];

  return (
    <motion.div 
      className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 w-11/12 max-w-xs"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
    >
      <div className="bg-juricast-card/80 backdrop-blur-lg border border-white/10 rounded-full px-4 py-3 shadow-xl">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const isActive = path === item.href || 
                           (item.href === "/?sort=categorias" && path.includes("/categoria"));
            const Icon = item.icon;
            
            return (
              <Link
                key={item.label}
                to={item.href}
                className="flex flex-col items-center relative"
              >
                <motion.div
                  className={cn(
                    "p-2 rounded-full transition-all",
                    isActive 
                      ? "bg-juricast-accent text-juricast-text" 
                      : "text-juricast-muted hover:text-juricast-text"
                  )}
                  whileHover={{ scale: 1.1, y: -4 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon size={20} />
                  {isActive && (
                    <motion.div 
                      className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"
                      layoutId="navIndicator"
                    />
                  )}
                </motion.div>
                <span className={cn(
                  "text-xs mt-1",
                  isActive ? "text-juricast-text" : "text-juricast-muted"
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default BottomNavigation;
