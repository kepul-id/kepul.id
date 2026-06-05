import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingCTA from "@/components/layout/FloatingCTA";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Target, Eye, Heart, Zap, Shield } from "lucide-react";

const iconMap: Record<string, any> = { Zap, Heart, Target, Shield, Eye };

const defaultValues = [
  { icon: "Zap", title: "Mudah", desc: "Proses lebih praktis dan lebih terarah" },
  { icon: "Heart", title: "Bernilai", desc: "Sampah dapat menjadi nilai ekonomi dan manfaat nyata" },
  { icon: "Target", title: "Berdampak", desc: "Membantu perubahan perilaku dan pengelolaan yang lebih baik" },
  { icon: "Shield", title: "Terpercaya", desc: "Punya operasional nyata, mitra, dan pencapaian" },
  { icon: "Eye", title: "Modern", desc: "Tampil profesional, rapi, dan relevan" },
];

const defaultMilestones = [
  { year: "2019", event: "Kepul didirikan di Jakarta" },
  { year: "2020", event: "Ekspansi ke Jabodetabek" },
  { year: "2021", event: "Peluncuran aplikasi mobile" },
  { year: "2022", event: "Program #BerawalDariKantor dimulai" },
  { year: "2023", event: "50+ mitra perusahaan bergabung" },
  { year: "2024", event: "Ekspansi ke Bandung, Surabaya, Malang, Gresik" },
];

export default function About() {
  const { ref, isVisible } = useScrollAnimation();
  const { ref: ref2, isVisible: isVisible2 } = useScrollAnimation();

  const { data: aboutContent } = useQuery({
    queryKey: ["about-content"],
    queryFn: async () => {
      const { data, error } = await supabase.from("about_content").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });

  const getSection = (key: string) => aboutContent?.find((s) => s.section_key === key);
  const getSections = (prefix: string) => aboutContent?.filter((s) => s.section_key.startsWith(prefix)) || [];
  const hero = getSection("hero");
  const visi = getSection("visi");
  const misi = getSection("misi");
  const values = getSections("value_");
  const milestones = getSections("milestone_");

  const displayValues = values.length > 0
    ? values.map((v) => ({ icon: v.image_url || "Zap", title: v.title || "", desc: v.content || "" }))
    : defaultValues;

  const displayMilestones = milestones.length > 0
    ? milestones.map((m) => ({ year: m.title || "", event: m.content || "" }))
    : defaultMilestones;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <section className="section-padding bg-background">
          <div className="container-narrow mx-auto text-center max-w-3xl animate-fade-in-up">
            <span className="text-sm font-medium text-primary">Tentang Kepul</span>
            <h1 className="text-4xl sm:text-5xl font-extrabold mt-3 text-foreground">{hero?.title || "Mengubah Cara Indonesia Mengelola Sampah"}</h1>
            <p className="text-lg text-muted-foreground mt-6 leading-relaxed">{hero?.content || "Kepul adalah layanan waste management modern."}</p>
            {hero?.image_url && <img src={hero.image_url} alt="About Kepul" className="w-full max-w-2xl mx-auto mt-8 rounded-2xl object-cover" />}
          </div>
        </section>

        <section className="section-padding bg-muted/30">
          <div className="container-narrow mx-auto grid md:grid-cols-2 gap-12">
            <div className="glass-card p-8 space-y-4">
              <h2 className="text-2xl font-bold text-foreground">{visi?.title || "Visi"}</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{visi?.content || "Menjadi platform waste management terdepan di Indonesia."}</p>
              {visi?.image_url && <img src={visi.image_url} alt="Visi" className="w-full rounded-xl mt-4" />}
            </div>
            <div className="glass-card p-8 space-y-4">
              <h2 className="text-2xl font-bold text-foreground">{misi?.title || "Misi"}</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{misi?.content || "• Menyediakan layanan pengelolaan sampah yang praktis"}</p>
              {misi?.image_url && <img src={misi.image_url} alt="Misi" className="w-full rounded-xl mt-4" />}
            </div>
          </div>
        </section>

        <section ref={ref} className="section-padding bg-background">
          <div className="container-narrow mx-auto">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">Nilai Utama Kami</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {displayValues.map((v, i) => {
                const Icon = iconMap[v.icon] || Zap;
                return (
                  <div key={v.title || i} className={`text-center space-y-3 p-6 rounded-2xl hover:bg-accent transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{ transitionDelay: `${i * 100}ms` }}>
                    <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mx-auto"><Icon className="w-6 h-6 text-primary" /></div>
                    <h3 className="font-bold text-foreground">{v.title}</h3>
                    <p className="text-sm text-muted-foreground">{v.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section ref={ref2} className="section-padding bg-muted/30">
          <div className="container-narrow mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">Perjalanan Kepul</h2>
            <div className="space-y-6">
              {displayMilestones.map((m, i) => (
                <div key={m.year || i} className={`flex gap-6 items-start transition-all duration-700 ${isVisible2 ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"}`} style={{ transitionDelay: `${i * 100}ms` }}>
                  <span className="text-lg font-bold text-primary w-16 flex-shrink-0">{m.year}</span>
                  <div className="flex-1 pb-6 border-b border-border"><p className="text-foreground">{m.event}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingCTA />
    </div>
  );
}
