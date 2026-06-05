import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingCTA from "@/components/layout/FloatingCTA";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Recycle, Heart, MapPin, Building2, GraduationCap, CalendarCheck, ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useServices, useSiteSettings } from "@/hooks/useContent";

const iconMap: Record<string, any> = { Recycle, Heart, MapPin, Building2, GraduationCap, CalendarCheck };

export default function Services() {
  const { ref, isVisible } = useScrollAnimation();
  const { data: services } = useServices();
  const { data: settings } = useSiteSettings();
  const waLink = settings?.whatsapp_link || "https://wa.me/6281118888036";
  const items = services || [];

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <section className="section-padding bg-background">
          <div className="container-narrow mx-auto text-center max-w-3xl animate-fade-in-up">
            <span className="text-sm font-medium text-primary">Layanan Kepul</span>
            <h1 className="text-4xl sm:text-5xl font-extrabold mt-3 text-foreground">
              Solusi untuk Setiap Kebutuhan
            </h1>
            <p className="text-lg text-muted-foreground mt-4">
              Dari rumah tangga hingga perusahaan, Kepul menyediakan layanan yang praktis, fleksibel, dan berdampak.
            </p>
          </div>
        </section>

        <section ref={ref} className="section-padding bg-muted/30 pt-0">
          <div className="container-narrow mx-auto space-y-8">
            {items.map((s, i) => {
              const Icon = iconMap[s.icon_name || "Recycle"] || Recycle;
              const imageUrl = (s as any).image_url;
              const features = s.features || [];
              return (
                <div
                  key={s.id}
                  className={`glass-card p-8 grid md:grid-cols-3 gap-6 items-start transition-all duration-700 ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                  }`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div className="md:col-span-2 space-y-3">
                    <div className="flex items-center gap-3">
                      {imageUrl ? (
                        <img src={imageUrl} alt={s.title} className="w-10 h-10 rounded-lg object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                      )}
                      <h3 className="text-xl font-bold text-foreground">{s.title}</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{s.description}</p>
                  </div>
                  {features.length > 0 && (
                    <ul className="space-y-2">
                      {features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                          <ArrowRight className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section className="section-padding bg-background">
          <div className="container-narrow mx-auto text-center">
            <h2 className="text-2xl font-bold text-foreground">Tertarik dengan layanan kami?</h2>
            <p className="text-muted-foreground mt-2">Hubungi tim Kepul untuk informasi lebih lanjut.</p>
            <Button size="lg" className="mt-6" asChild>
              <a href={waLink} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-5 h-5 mr-2" />
                Hubungi WhatsApp
              </a>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingCTA />
    </div>
  );
}
