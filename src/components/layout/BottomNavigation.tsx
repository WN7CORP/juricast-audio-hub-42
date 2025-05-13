
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Heart, Clock, List, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const BottomNavigation = () => {
  const location = useLocation();
  const path = location.pathname;

  const navItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Clock, label: "Progresso", href: "/em-progresso" },
    { icon: Check, label: "Concluídos", href: "/concluidos" },
    { icon: Heart, label: "Favoritos", href: "/favoritos" },
    { icon: List, label: "Categorias", href: "/?sort=categorias" }
  ];

  return (
    <motion.div 
      className="floating-bottom-nav pb-safe"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.3 }}
    >
      <motion.div 
        className="glassmorphism py-3 px-2 mb-4 rounded-full shadow-xl flex justify-around items-center"
        whileHover={{ y: -2 }}
      >
        {navItems.map((item) => {
          const isActive = path === item.href || 
                        (item.href === "/?sort=categorias" && path.includes("/categoria"));
          const Icon = item.icon;
          
          return (
            <Link
              key={item.label}
              to={item.href}
              className="flex flex-col items-center relative px-2"
            >
              <motion.div
                className={cn(
                  "p-2 rounded-full transition-all",
                  isActive 
                    ? "bg-juricast-accent text-white" 
                    : "text-white/70 hover:text-white"
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
                isActive ? "text-white" : "text-white/70"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </motion.div>
    </motion.div>
  );
};

export default BottomNavigation;
