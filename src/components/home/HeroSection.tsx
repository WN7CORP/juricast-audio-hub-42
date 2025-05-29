
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="relative mb-12 overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-juricast-accent/5 via-transparent to-juricast-accent/10 rounded-2xl" />
      
      <Card className="relative p-8 md:p-12 border-juricast-card/20 bg-gradient-to-br from-juricast-card/80 to-juricast-card/40 backdrop-blur-sm">
        <motion.div variants={itemVariants} className="text-center space-y-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-juricast-accent to-juricast-accent/80 rounded-xl flex items-center justify-center">
              <Play className="w-6 h-6 text-white" />
            </div>
            <Sparkles className="w-6 h-6 text-juricast-accent animate-pulse" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-juricast-accent to-juricast-text bg-clip-text text-transparent">
            JuriCast
          </h1>
          
          <p className="text-lg md:text-xl text-juricast-muted max-w-2xl mx-auto leading-relaxed">
            Sua plataforma de podcasts jurídicos. Aprenda com os melhores especialistas, 
            organize seu conhecimento e desenvolva sua carreira jurídica.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link to="/modo-focado">
              <Button size="lg" className="bg-gradient-to-r from-juricast-accent to-juricast-accent/90 hover:from-juricast-accent/90 hover:to-juricast-accent px-8 py-3">
                <Play className="w-5 h-5 mr-2" />
                Começar Agora
              </Button>
            </Link>
            
            <Link to="/categorias">
              <Button variant="outline" size="lg" className="border-juricast-accent/30 hover:bg-juricast-accent/10 px-8 py-3">
                Explorar Categorias
              </Button>
            </Link>
          </div>
        </motion.div>
      </Card>
    </motion.section>
  );
};

export default HeroSection;
