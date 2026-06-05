import { Link } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  FileText, Users, Layers, BarChart3, HelpCircle, Star, Award, MessageSquare,
  Package, Newspaper, Inbox, ArrowRight, LayoutList, Settings, Image, Info
} from "lucide-react";

function StatCard({ icon: Icon, label, count, to }: { icon: any; label: string; count: number; to: string }) {
  return (
    <Link to={to} className="glass-card p-5 flex items-center gap-4 hover:shadow-md transition-shadow group">
      <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div className="flex-1">
        <p className="text-2xl font-bold text-foreground">{count}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
      <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
    </Link>
  );
}

const quickActions = [
  { label: "Manage Sections", path: "/admin/sections", icon: LayoutList, desc: "Atur urutan & visibilitas" },
  { label: "Edit Hero", path: "/admin/hero", icon: Star, desc: "Headline, gambar utama" },
  { label: "Blog Baru", path: "/admin/blog", icon: FileText, desc: "Tulis artikel baru" },
  { label: "Media Library", path: "/admin/media", icon: Image, desc: "Upload & kelola gambar" },
  { label: "About Page", path: "/admin/about", icon: Info, desc: "Edit halaman tentang" },
  { label: "Settings", path: "/admin/settings", icon: Settings, desc: "WA, email, social links" },
];

export default function AdminDashboard() {
  const { data: blogs } = useQuery({ queryKey: ["dash-blogs"], queryFn: async () => { const { count } = await supabase.from("blog_posts").select("*", { count: "exact", head: true }); return count || 0; } });
  const { data: services } = useQuery({ queryKey: ["dash-services"], queryFn: async () => { const { count } = await supabase.from("services").select("*", { count: "exact", head: true }); return count || 0; } });
  const { data: partners } = useQuery({ queryKey: ["dash-partners"], queryFn: async () => { const { count } = await supabase.from("partner_logos").select("*", { count: "exact", head: true }); return count || 0; } });
  const { data: faqs } = useQuery({ queryKey: ["dash-faqs"], queryFn: async () => { const { count } = await supabase.from("faqs").select("*", { count: "exact", head: true }); return count || 0; } });
  const { data: testimonials } = useQuery({ queryKey: ["dash-testimonials"], queryFn: async () => { const { count } = await supabase.from("testimonials").select("*", { count: "exact", head: true }); return count || 0; } });
  const { data: contacts } = useQuery({ queryKey: ["dash-contacts"], queryFn: async () => { const { count } = await supabase.from("contact_submissions").select("*", { count: "exact", head: true }); return count || 0; } });

  const { data: recentBlogs } = useQuery({
    queryKey: ["dash-recent-blogs"],
    queryFn: async () => {
      const { data } = await supabase.from("blog_posts").select("id, title, is_published, created_at").order("created_at", { ascending: false }).limit(5);
      return data || [];
    },
  });

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Selamat datang di Kepul CMS</p>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard icon={FileText} label="Blog Posts" count={blogs || 0} to="/admin/blog" />
          <StatCard icon={Layers} label="Services" count={services || 0} to="/admin/services" />
          <StatCard icon={Users} label="Partners" count={partners || 0} to="/admin/partners" />
          <StatCard icon={HelpCircle} label="FAQs" count={faqs || 0} to="/admin/faq" />
          <StatCard icon={MessageSquare} label="Testimonials" count={testimonials || 0} to="/admin/testimonials" />
          <StatCard icon={Inbox} label="Pesan Masuk" count={contacts || 0} to="/admin/contact-submissions" />
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">Quick Actions</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {quickActions.map(a => (
              <Link key={a.path} to={a.path} className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:bg-accent/50 transition-colors group">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <a.icon className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{a.label}</p>
                  <p className="text-xs text-muted-foreground">{a.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Blog Posts */}
        {recentBlogs && recentBlogs.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-foreground">Recent Blog Posts</h2>
              <Link to="/admin/blog" className="text-sm text-primary hover:underline">View all →</Link>
            </div>
            <div className="glass-card divide-y divide-border">
              {recentBlogs.map(blog => (
                <div key={blog.id} className="px-4 py-3 flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">{blog.title}</p>
                    <p className="text-xs text-muted-foreground">{new Date(blog.created_at).toLocaleDateString("id-ID")}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${blog.is_published ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {blog.is_published ? "Published" : "Draft"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
