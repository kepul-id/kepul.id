import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard, FileText, Settings, Image, BarChart3, HelpCircle,
  Users, Layers, LogOut, Menu, X, Footprints, Star, Navigation, LayoutList,
  Award, Newspaper, MessageSquare, Package, Info, Inbox, ChevronDown, ExternalLink
} from "lucide-react";

const sidebarGroups = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    label: "Homepage",
    items: [
      { label: "Section Manager", path: "/admin/sections", icon: LayoutList },
      { label: "Hero", path: "/admin/hero", icon: Star },
      { label: "Services", path: "/admin/services", icon: Layers },
      { label: "How It Works", path: "/admin/how-it-works", icon: Footprints },
      { label: "Impact Metrics", path: "/admin/impact", icon: BarChart3 },
      { label: "Awards", path: "/admin/awards", icon: Award },
      { label: "Testimonials", path: "/admin/testimonials", icon: MessageSquare },
      { label: "FAQ", path: "/admin/faq", icon: HelpCircle },
    ],
  },
  {
    label: "Content",
    items: [
      { label: "Blog Posts", path: "/admin/blog", icon: FileText },
      { label: "About Page", path: "/admin/about", icon: Info },
      { label: "Materials", path: "/admin/materials", icon: Package },
    ],
  },
  {
    label: "Brand & Media",
    items: [
      { label: "Partner Logos", path: "/admin/partners", icon: Users },
      { label: "Media Coverage", path: "/admin/media-logos", icon: Newspaper },
      { label: "Media Library", path: "/admin/media", icon: Image },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Navigation Menu", path: "/admin/navigation", icon: Navigation },
      { label: "Contact Inbox", path: "/admin/contact-submissions", icon: Inbox },
      { label: "Site Settings", path: "/admin/settings", icon: Settings },
    ],
  },
];

const allLinks = sidebarGroups.flatMap(g => g.items);

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const { signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/admin/login");
  };

  const toggleGroup = (label: string) => {
    setCollapsed(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const currentLabel = allLinks.find(l => l.path === location.pathname)?.label || "Admin Panel";

  return (
    <div className="min-h-screen bg-muted/30 flex">
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <Link to="/admin" className="font-bold text-lg text-foreground">
              <span className="text-primary">Kepul</span> CMS
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {sidebarGroups.map((group) => {
              const isCollapsed = collapsed[group.label];
              const hasActive = group.items.some(i => location.pathname === i.path || location.pathname.startsWith(i.path + "/"));

              return (
                <div key={group.label}>
                  {group.label !== "Overview" && (
                    <button
                      onClick={() => toggleGroup(group.label)}
                      className="flex items-center justify-between w-full px-3 py-2 mt-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
                    >
                      {group.label}
                      <ChevronDown className={`w-3 h-3 transition-transform ${isCollapsed ? "-rotate-90" : ""}`} />
                    </button>
                  )}

                  {(!isCollapsed || group.label === "Overview") && group.items.map((link) => {
                    const Icon = link.icon;
                    const active = location.pathname === link.path || (link.path !== "/admin" && location.pathname.startsWith(link.path + "/"));
                    return (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground"
                        }`}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
              );
            })}
          </nav>

          <div className="p-3 border-t border-border space-y-1">
            <Link to="/" target="_blank" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground px-3 py-2 rounded-lg hover:bg-accent transition-colors">
              <ExternalLink className="w-3 h-3" /> Lihat Website
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-foreground/20 z-40 lg:hidden" />}

      <div className="flex-1 lg:ml-64">
        <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-xl border-b border-border px-4 sm:px-6 h-14 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-accent">
            <Menu className="w-5 h-5" />
          </button>
          <h2 className="text-sm font-semibold text-foreground">{currentLabel}</h2>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
