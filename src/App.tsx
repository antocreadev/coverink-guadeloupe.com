import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { StaticRouter } from "react-router-dom/server";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Product from "./pages/Product.tsx";
import LandingPage from "./pages/LandingPage.tsx";
import NotFound from "./pages/NotFound.tsx";
import OrderSuccess from "./pages/OrderSuccess.tsx";
import AdminOrders from "./pages/AdminOrders.tsx";
import AdminAnalytics from "./pages/AdminAnalytics.tsx";
import AdminHome from "./pages/AdminHome.tsx";
import ScrollToTop from "./components/ScrollToTop.tsx";
import AnalyticsTracker from "./components/AnalyticsTracker.tsx";

const queryClient = new QueryClient();

const AppRoutes = () => (
  <>
    <ScrollToTop />
    <AnalyticsTracker />
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/produit/:id" element={<Product />} />
      <Route path="/commande/:id" element={<OrderSuccess />} />
      <Route path="/admin" element={<AdminHome />} />
      <Route path="/admin/commandes" element={<AdminOrders />} />
      <Route path="/admin/analytics" element={<AdminAnalytics />} />
      <Route path="/:slug" element={<LandingPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </>
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
