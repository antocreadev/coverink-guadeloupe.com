import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { StaticRouter } from "react-router-dom/server";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Product from "./pages/Product.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/produit/:id" element={<Product />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = ({ url }: { url?: string }) => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {url !== undefined ? (
        <StaticRouter location={url}>
          <AppRoutes />
        </StaticRouter>
      ) : (
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      )}
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
