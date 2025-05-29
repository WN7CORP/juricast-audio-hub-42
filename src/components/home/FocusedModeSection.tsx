
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Headphones, Sparkles, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const FocusedModeSection = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-12"
    >
      <Card className="relative p-8 border-juricast-card/20 bg-gradient-to-br from-juricast-accent/10 via-juricast-accent/5 to-transparent overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-juricast-accent/20 to-transparent rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-juricast-accent/10 to-transparent rounded-full translate-y-12 -translate-x-12" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex-1 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-juricast-accent to-juricast-accent/80 rounded-xl flex items-center justify-center">
                <Headphones className="w-5 h-5 text-white" />
              </div>
              <Sparkles className="w-5 h-5 text-juricast-accent animate-pulse" />
            </div>
            
            <h3 className="text-2xl md:text-3xl font-bold mb-3 text-juricast-text">
              Modo Focado
            </h3>
            
            <p className="text-juricast-muted text-lg leading-relaxed mb-6 max-w-2xl">
              Ouça episódios em sequência sem interrupções para máximo foco no aprendizado. 
              Selecione uma área e deixe o sistema criar a playlist perfeita para você.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link to="/modo-focado">
                <Button className="bg-gradient-to-r from-juricast-accent to-juricast-accent/90 hover:from-juricast-accent/90 hover:to-juricast-accent px-6 py-3">
                  <Play className="w-4 h-4 mr-2" />
                  Experimentar Agora
                </Button>
              </Link>
              
              <Link to="/categorias">
                <Button variant="outline" className="border-juricast-accent/30 hover:bg-juricast-accent/10 px-6 py-3">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Ver Categorias
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Visual element */}
          <div className="relative">
            <div className="w-32 h-32 lg:w-40 lg:h-40 bg-gradient-to-br from-juricast-accent/20 to-juricast-accent/10 rounded-full flex items-center justify-center border border-juricast-accent/20">
              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-juricast-accent to-juricast-accent/80 rounded-full flex items-center justify-center animate-pulse">
                <Play className="w-8 h-8 lg:w-10 lg:h-10 text-white ml-1" />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.section>
  );
};

export default FocusedModeSection;
