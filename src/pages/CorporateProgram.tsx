import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingCTA from "@/components/layout/FloatingCTA";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Building2, Users, BarChart3, Leaf, MessageCircle } from "lucide-react";
import { useSiteSettings, useSectionContent } from "@/hooks/useContent";
import defaultImg from "@/assets/corporate-program.jpg";

const defaultBenefits = [
  { icon: Building2, title: "Pengelolaan Terarah", desc: "Sistem pilah dan pengumpulan sampah kantor yang terstruktur dan terukur." },
  { icon: Users, title: "Employee Engagement", desc: "Tingkatkan kesadaran dan partisipasi karyawan dalam program keberlanjutan." },
  { icon: BarChart3, title: "Reporting & Dampak", desc: "Laporan berkala tentang volume sampah, nilai ekonomi, dan dampak lingkungan." },
  { icon: Leaf, title: "ESG & Sustainability", desc: "Dukung pencapaian target ESG perusahaan dengan data yang terverifikasi." },
];

const defaultSteps = [
  { num: "1", title: "Diskusi Awal", desc: "Tim Kepul akan memahami kebutuhan dan skala operasional kantor Anda." },
  { num: "2", title: "Setup Program", desc: "Pemasangan fasilitas pilah dan briefing ke tim kantor." },
  { num: "3", title: "Operasional Rutin", desc: "Pengumpulan dan pengelolaan sampah secara berkala." },
  { num: "4", title: "Reporting", desc: "Laporan dampak dan pencapaian program." },
];

export default function CorporateProgram() {
  const { ref, isVisible } = useScrollAnimation();
  const { ref: ref2, isVisible: isVisible2 } = useScrollAnimation();
  const { data: settings } = useSiteSettings();
  const { data: content } = useSectionContent("corporate");
  const waLink = settings?.whatsapp_link || "https://wa.me/6281118888036";
  const imageUrl = content?.image_url || defaultImg;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <section className="section-padding bg-background">
          <div className="container-narrow mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in-up">
              <span className="inline-block bg-accent text-accent-foreground px-4 py-1.5 rounded-full text-sm font-medium">
                {content?.badge || "Program Perusahaan"}
              </span>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground">
                <span className="text-primary">#BerawalDari</span>Kantor
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {content?.description || "Program pengelolaan sampah kantor yang modern, terukur, dan berdampak. Bangun budaya keberlanjutan dari dalam perusahaan Anda."}
              </p>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" asChild>
                  <a href={waLink} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    {content?.cta_text || "Diskusikan Kerja Sama"}
                  </a>
                </Button>
              </div>
            </div>
            <div className="animate-fade-in-up animation-delay-200">
              <img src={imageUrl} alt="Program #BerawalDariKantor" className="rounded-3xl w-full" style={{ boxShadow: "var(--shadow-hero)" }} />
            </div>
          </div>
        </section>

        <section ref={ref} className="section-padding bg-muted/30">
          <div className="container-narrow mx-auto">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">Manfaat untuk Perusahaan</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {defaultBenefits.map((b, i) => {
                const Icon = b.icon;
                return (
                  <div key={b.title} className={`glass-card p-6 flex gap-4 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{ transitionDelay: `${i * 100}ms` }}>
                    <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">{b.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{b.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section ref={ref2} className="section-padding bg-background">
          <div className="container-narrow mx-auto">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">Cara Program Berjalan</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {defaultSteps.map((s, i) => (
                <div key={s.num} className={`text-center space-y-4 transition-all duration-700 ${isVisible2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{ transitionDelay: `${i * 150}ms` }}>
                  <div className="w-14 h-14 rounded-2xl bg-primary text-primary-foreground text-xl font-bold flex items-center justify-center mx-auto">{s.num}</div>
                  <h3 className="font-bold text-foreground">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-narrow mx-auto">
            <div className="rounded-3xl bg-primary px-8 sm:px-14 py-14 text-center">
              <h2 className="text-3xl font-bold text-primary-foreground">Siap Memulai #BerawalDariKantor?</h2>
              <p className="text-primary-foreground/80 mt-4 max-w-lg mx-auto">
                Hubungi tim Kepul untuk diskusi program yang sesuai dengan kebutuhan perusahaan Anda.
              </p>
              <Button size="lg" variant="secondary" className="mt-8" asChild>
                <a href={waLink} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Hubungi Tim Kepul
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingCTA />
    </div>
  );
}
