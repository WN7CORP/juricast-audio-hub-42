
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, GraduationCap, Search, Filter, Grid, List } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import AreaCard from '@/components/podcast/AreaCard';
import CategoryCard from '@/components/podcast/CategoryCard';
import { getAllAreas } from '@/lib/podcast-service';
import { AreaCard as AreaCardType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const Categories = () => {
  const [searchParams] = useSearchParams();
  const [areas, setAreas] = useState<AreaCardType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'juridico' | 'educativo'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const areasData = await getAllAreas();
        setAreas(areasData);
      } catch (error) {
        console.error('Error fetching areas:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAreas();
  }, []);

  // Handle direct navigation from category cards
  useEffect(() => {
    const hash = window.location.hash;
    if (hash === '#areas-direito') {
      setSelectedCategory('juridico');
    } else if (hash === '#educacao-juridica') {
      setSelectedCategory('educativo');
    }
  }, []);

  // Filter areas based on search and category
  const filteredAreas = areas.filter(area => {
    const matchesSearch = area.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || area.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const juridicoAreas = areas.filter(area => area.category === 'juridico');
  const educativoAreas = areas.filter(area => area.category === 'educativo');
  
  const juridicoTotal = juridicoAreas.reduce((sum, area) => sum + area.episodeCount, 0);
  const educativoTotal = educativoAreas.reduce((sum, area) => sum + area.episodeCount, 0);

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
    <MainLayout>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-juricast-accent to-juricast-text bg-clip-text text-transparent">
            Categorias
          </h1>
          <p className="text-juricast-muted text-lg max-w-3xl mx-auto">
            Explore nosso conteúdo organizado por áreas de conhecimento. 
            Encontre exatamente o que você precisa para sua carreira jurídica.
          </p>
        </motion.div>

        {/* Category Overview Cards */}
        <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-6 mb-8">
          <CategoryCard
            title="Áreas do Direito"
            description="Conteúdo jurídico especializado dividido por áreas de atuação profissional"
            episodeCount={juridicoTotal}
            type="juridico"
            href="#areas-direito"
          />
          <CategoryCard
            title="Educação Jurídica"
            description="Conteúdo educativo, dicas práticas e desenvolvimento profissional"
            episodeCount={educativoTotal}
            type="educativo"
            href="#educacao-juridica"
          />
        </motion.div>

        {/* Search and Filters */}
        <motion.div variants={itemVariants}>
          <Card className="p-6 border-juricast-card/20 bg-juricast-card/50">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-juricast-muted" size={18} />
                <input
                  type="text"
                  placeholder="Buscar áreas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-juricast-background/50 border border-juricast-card/30 rounded-lg text-juricast-text placeholder:text-juricast-muted focus:outline-none focus:ring-2 focus:ring-juricast-accent/50 focus:border-juricast-accent"
                />
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-juricast-muted" />
                <div className="flex bg-juricast-background/30 rounded-lg p-1">
                  {[
                    { value: 'all', label: 'Todas', icon: Filter },
                    { value: 'juridico', label: 'Direito', icon: BookOpen },
                    { value: 'educativo', label: 'Educação', icon: GraduationCap }
                  ].map((category) => {
                    const Icon = category.icon;
                    return (
                      <Button
                        key={category.value}
                        size="sm"
                        variant={selectedCategory === category.value ? "default" : "ghost"}
                        onClick={() => setSelectedCategory(category.value as any)}
                        className={selectedCategory === category.value ? 
                          "bg-juricast-accent text-white" : 
                          "text-juricast-text hover:bg-juricast-card/50"
                        }
                      >
                        <Icon size={16} className="mr-2" />
                        {category.label}
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* View Mode Toggle */}
              <div className="flex bg-juricast-background/30 rounded-lg p-1">
                <Button
                  size="sm"
                  variant={viewMode === 'grid' ? "default" : "ghost"}
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? 
                    "bg-juricast-accent text-white" : 
                    "text-juricast-text hover:bg-juricast-card/50"
                  }
                >
                  <Grid size={16} />
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === 'list' ? "default" : "ghost"}
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 
                    "bg-juricast-accent text-white" : 
                    "text-juricast-text hover:bg-juricast-card/50"
                  }
                >
                  <List size={16} />
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Areas Grid/List */}
        <motion.div variants={itemVariants}>
          {isLoading ? (
            <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}`}>
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-juricast-card animate-pulse rounded-lg h-32" />
              ))}
            </div>
          ) : filteredAreas.length > 0 ? (
            <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1 md:grid-cols-2'}`}>
              {filteredAreas.map((area, index) => (
                <motion.div
                  key={area.name}
                  variants={itemVariants}
                  transition={{ delay: index * 0.05 }}
                >
                  <AreaCard
                    name={area.name}
                    episodeCount={area.episodeCount}
                    slug={area.slug}
                    category={area.category}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center border-juricast-card/20">
              <Search size={48} className="mx-auto text-juricast-muted mb-4" />
              <h3 className="text-xl font-semibold text-juricast-text mb-2">
                Nenhuma área encontrada
              </h3>
              <p className="text-juricast-muted">
                Tente ajustar sua busca ou filtros para encontrar o conteúdo desejado.
              </p>
            </Card>
          )}
        </motion.div>

        {/* Quick Stats */}
        <motion.div variants={itemVariants}>
          <Card className="p-6 border-juricast-card/20 bg-gradient-to-r from-juricast-card/50 to-juricast-card/30">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-juricast-accent">{areas.length}</div>
                <div className="text-sm text-juricast-muted">Total de Áreas</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-juricast-accent">{juridicoAreas.length}</div>
                <div className="text-sm text-juricast-muted">Áreas Jurídicas</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-juricast-accent">{educativoAreas.length}</div>
                <div className="text-sm text-juricast-muted">Áreas Educativas</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-juricast-accent">
                  {areas.reduce((sum, area) => sum + area.episodeCount, 0)}
                </div>
                <div className="text-sm text-juricast-muted">Total de Episódios</div>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </MainLayout>
  );
};

export default Categories;
