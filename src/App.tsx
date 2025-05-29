
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AudioPlayerProvider } from "@/context/AudioPlayerContext";
import { FocusedModeProvider } from "@/context/FocusedModeContext";
import MiniPlayer from "@/components/audio/MiniPlayer";
import Index from "./pages/Index";
import Categories from "./pages/Categories";
import PodcastDetails from "./pages/PodcastDetails";
import Favorites from "./pages/Favorites";
import InProgress from "./pages/InProgress";
import Completed from "./pages/Completed";
import Category from "./pages/Category";
import ThemeDetails from "./pages/ThemeDetails";
import NotFound from "./pages/NotFound";
import SearchResults from "./pages/SearchResults";
import NewEpisodes from "./pages/NewEpisodes";
import FocusedMode from "./pages/FocusedMode";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const AppRoutes = () => {
  const location = useLocation();
  
  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Index />} />
          <Route path="/podcast/:id" element={<PodcastDetails />} />
          <Route path="/favoritos" element={<Favorites />} />
          <Route path="/em-progresso" element={<InProgress />} />
          <Route path="/concluidos" element={<Completed />} />
          <Route path="/categoria/:category" element={<Category />} />
          <Route path="/categoria/:area/tema/:theme" element={<ThemeDetails />} />
          <Route path="/episodios-novos" element={<NewEpisodes />} />
          <Route path="/busca" element={<SearchResults />} />
          <Route path="/modo-focado" element={<FocusedMode />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
      <MiniPlayer />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AudioPlayerProvider>
        <FocusedModeProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </FocusedModeProvider>
      </AudioPlayerProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
