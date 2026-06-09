import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import ScrollToTop from "@/components/layout/ScrollToTop";
import BackToTop from "@/components/layout/BackToTop";
import Index from "./pages/Index.tsx";
import About from "./pages/About.tsx";
import CorporateProgram from "./pages/CorporateProgram.tsx";
import Services from "./pages/Services.tsx";
import ServiceDetail from "./pages/ServiceDetail.tsx";
import MaterialPricing from "./pages/MaterialPricing.tsx";
import Impact from "./pages/Impact.tsx";
import Blog from "./pages/Blog.tsx";
import BlogPost from "./pages/BlogPost.tsx";
import Contact from "./pages/Contact.tsx";
import NotFound from "./pages/NotFound.tsx";
import AdminLogin from "./pages/admin/AdminLogin.tsx";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import AdminBlog from "./pages/admin/AdminBlog.tsx";
import AdminHero from "./pages/admin/AdminHero.tsx";
import AdminSettings from "./pages/admin/AdminSettings.tsx";
import AdminMedia from "./pages/admin/AdminMedia.tsx";
import { AdminServices, AdminPartners, AdminImpact, AdminHowItWorks, AdminFaq, AdminAwards, AdminMediaLogos, AdminTestimonials, AdminAbout, AdminContactSubmissions } from "./pages/admin/AdminCrud.tsx";
import AdminSections from "./pages/admin/AdminSections.tsx";
import AdminNavMenu from "./pages/admin/AdminNavMenu.tsx";
import AdminSectionContent from "./pages/admin/AdminSectionContent.tsx";

const queryClient = new QueryClient();

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>;
  if (!user) return <Navigate to="/admin/login" replace />;
  if (!isAdmin) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <BackToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/tentang" element={<About />} />
            <Route path="/berawal-dari-kantor" element={<CorporateProgram />} />
            <Route path="/layanan" element={<Services />} />
            <Route path="/layanan/:slug" element={<ServiceDetail />} />
            <Route path="/material-harga" element={<MaterialPricing />} />
            <Route path="/dampak" element={<Impact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/kontak" element={<Contact />} />
            {/* Admin */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/sections" element={<AdminRoute><AdminSections /></AdminRoute>} />
            <Route path="/admin/sections/:sectionKey" element={<AdminRoute><AdminSectionContent /></AdminRoute>} />
            <Route path="/admin/navigation" element={<AdminRoute><AdminNavMenu /></AdminRoute>} />
            <Route path="/admin/hero" element={<AdminRoute><AdminHero /></AdminRoute>} />
            <Route path="/admin/services" element={<AdminRoute><AdminServices /></AdminRoute>} />
            <Route path="/admin/partners" element={<AdminRoute><AdminPartners /></AdminRoute>} />
            <Route path="/admin/impact" element={<AdminRoute><AdminImpact /></AdminRoute>} />
            <Route path="/admin/how-it-works" element={<AdminRoute><AdminHowItWorks /></AdminRoute>} />
            <Route path="/admin/blog" element={<AdminRoute><AdminBlog /></AdminRoute>} />
            <Route path="/admin/faq" element={<AdminRoute><AdminFaq /></AdminRoute>} />
            <Route path="/admin/media" element={<AdminRoute><AdminMedia /></AdminRoute>} />
            <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
            <Route path="/admin/awards" element={<AdminRoute><AdminAwards /></AdminRoute>} />
            <Route path="/admin/media-logos" element={<AdminRoute><AdminMediaLogos /></AdminRoute>} />
            <Route path="/admin/testimonials" element={<AdminRoute><AdminTestimonials /></AdminRoute>} />

            <Route path="/admin/about" element={<AdminRoute><AdminAbout /></AdminRoute>} />
            <Route path="/admin/contact-submissions" element={<AdminRoute><AdminContactSubmissions /></AdminRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
