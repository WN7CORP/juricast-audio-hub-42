
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
      className="bottom-nav"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
    >
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = path === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.label}
              to={item.href}
              className="flex flex-col items-center"
            >
              <motion.div
                className={cn(
                  "p-2 rounded-full transition-all",
                  isActive 
                    ? "text-juricast-accent" 
                    : "text-juricast-muted"
                )}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Icon size={24} />
              </motion.div>
              <span className={cn(
                "text-xs",
                isActive ? "text-juricast-text" : "text-juricast-muted"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
};

export default BottomNavigation;
