
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AudioPlayerProvider } from '@/context/AudioPlayerContext';
import { FocusedModeProvider } from '@/context/FocusedModeContext';
import { Toaster } from '@/components/ui/sonner';
import Index from '@/pages/Index';
import Categories from '@/pages/Categories';
import PodcastDetails from '@/pages/PodcastDetails';
import Category from '@/pages/Category';
import ThemeDetails from '@/pages/ThemeDetails';
import NewEpisodes from '@/pages/NewEpisodes';
import InProgress from '@/pages/InProgress';
import Completed from '@/pages/Completed';
import Favorites from '@/pages/Favorites';
import FocusedMode from '@/pages/FocusedMode';
import SearchResults from '@/pages/SearchResults';
import NotFound from '@/pages/NotFound';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AudioPlayerProvider>
        <FocusedModeProvider>
          <Router>
            <div className="App">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/categorias" element={<Categories />} />
                <Route path="/podcast/:id" element={<PodcastDetails />} />
                <Route path="/categoria/:slug" element={<Category />} />
                <Route path="/categoria/:areaSlug/tema/:themeSlug" element={<ThemeDetails />} />
                <Route path="/episodios-novos" element={<NewEpisodes />} />
                <Route path="/em-progresso" element={<InProgress />} />
                <Route path="/concluidos" element={<Completed />} />
                <Route path="/favoritos" element={<Favorites />} />
                <Route path="/modo-focado" element={<FocusedMode />} />
                <Route path="/busca" element={<SearchResults />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </div>
          </Router>
        </FocusedModeProvider>
      </AudioPlayerProvider>
    </QueryClientProvider>
  );
}

export default App;
