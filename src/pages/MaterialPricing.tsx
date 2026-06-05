import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingCTA from "@/components/layout/FloatingCTA";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useState } from "react";
import { Search, CheckCircle, XCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function MaterialPricing() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");
  const { ref, isVisible } = useScrollAnimation();

  const { data: materials, isLoading } = useQuery({
    queryKey: ["materials"],
    queryFn: async () => {
      const { data, error } = await supabase.from("materials").select("*").eq("is_active", true).order("sort_order");
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });

  const items = materials || [];
  const categories = ["Semua", ...Array.from(new Set(items.map((m) => m.category)))];

  const filtered = items.filter((m) => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = activeCategory === "Semua" || m.category === activeCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <section className="section-padding bg-background">
          <div className="container-narrow mx-auto text-center max-w-3xl animate-fade-in-up">
            <span className="text-sm font-medium text-primary">Material & Harga</span>
            <h1 className="text-4xl sm:text-5xl font-extrabold mt-3 text-foreground">Jenis Material & Kisaran Harga</h1>
            <p className="text-lg text-muted-foreground mt-4">Ketahui jenis sampah yang diterima dan kisaran harga per kilogram.</p>
          </div>
        </section>
        <section ref={ref} className="section-padding bg-muted/30 pt-0">
          <div className="container-narrow mx-auto">
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="text" placeholder="Cari material..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${activeCategory === cat ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:text-foreground"}`}>{cat}</button>
                ))}
              </div>
            </div>
            {isLoading && <p className="text-center text-muted-foreground">Loading...</p>}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((m, i) => (
                <div key={m.id} className={`glass-card p-5 flex items-center gap-4 transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`} style={{ transitionDelay: `${i * 50}ms` }}>
                  {m.image_url && (
                    <img src={m.image_url} alt={m.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground">{m.name}</h3>
                    <p className="text-xs text-muted-foreground">{m.category}</p>
                    <p className="text-sm font-medium text-primary mt-1">{m.price}</p>
                  </div>
                  {m.accepted ? <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" /> : <XCircle className="w-5 h-5 text-destructive flex-shrink-0" />}
                </div>
              ))}
            </div>
            {filtered.length === 0 && !isLoading && <p className="text-center text-muted-foreground py-12">Tidak ada material yang ditemukan.</p>}
          </div>
        </section>
      </main>
      <Footer />
      <FloatingCTA />
    </div>
  );
}
