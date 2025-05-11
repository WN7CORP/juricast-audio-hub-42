
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AudioPlayerProvider } from "@/context/AudioPlayerContext";
import Index from "./pages/Index";
import PodcastDetails from "./pages/PodcastDetails";
import Favorites from "./pages/Favorites";
import InProgress from "./pages/InProgress";
import Category from "./pages/Category";
import NotFound from "./pages/NotFound";

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
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />
        <Route path="/podcast/:id" element={<PodcastDetails />} />
        <Route path="/favoritos" element={<Favorites />} />
        <Route path="/em-progresso" element={<InProgress />} />
        <Route path="/categoria/:category" element={<Category />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AudioPlayerProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AudioPlayerProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
