import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import BlogLogin from "./pages/BlogLogin";
import BlogPost from "./pages/BlogPost";
import CertLogin from "./pages/CertLogin";
import Dashboard from "./pages/Dashboard";
import VenerableThomasPaulRamban from "./pages/VenerableThomasPaulRamban";
import Autodialer from "./pages/Autodialer";
import SeoAudit from "./pages/seo/SeoAudit";
import SeoReport from "./pages/seo/SeoReport";
import SeoAdmin from "./pages/seo/SeoAdmin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/autodailer" element={<Autodialer />} />
          <Route path="/autodialer" element={<Autodialer />} />
          <Route path="/seo" element={<SeoAudit />} />
          <Route path="/seo/report/:jobId" element={<SeoReport />} />
          <Route path="/seo/admin" element={<SeoAdmin />} />
          <Route path="/blogin" element={<BlogLogin />} />
          <Route path="/certlogin" element={<CertLogin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/blog" element={<BlogPost />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/Venerable_Thomas_Paul_Ramban" element={<VenerableThomasPaulRamban />} />
          <Route path="/" element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
