import { Recycle, Heart, MapPin, Building2, GraduationCap, CalendarCheck, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useServices, useSectionContent } from "@/hooks/useContent";

const iconMap: Record<string, any> = { Recycle, Heart, MapPin, Building2, GraduationCap, CalendarCheck };

export default function ServicesGrid() {
  const { ref, isVisible } = useScrollAnimation();
  const { data: services } = useServices();
  const { data: content } = useSectionContent("services");

  const items = services || [];
  const badge = content?.badge || "Layanan Kepul";
  const headline = content?.headline || "Solusi untuk Setiap Kebutuhan";
  const description = content?.description || "Dari rumah tangga hingga perusahaan, Kepul menyediakan layanan pengelolaan sampah yang praktis, fleksibel, dan berdampak.";

  return (
    <section id="services" ref={ref} className="section-padding bg-muted/30">
      <div className="container-narrow mx-auto">
        <div className="text-center mb-14">
          <span className="text-sm font-medium text-primary">{badge}</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-2 text-foreground">{headline}</h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">{description}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((s, i) => {
            const Icon = iconMap[s.icon_name || "Recycle"] || Recycle;
            const imageUrl = (s as any).image_url;
            const slug = (s as any).slug;
            return (
              <div key={s.id} className={`glass-card p-6 space-y-4 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{ transitionDelay: `${i * 100}ms` }}>
                {imageUrl ? (
                  <img src={imageUrl} alt={s.title} className="w-12 h-12 rounded-xl object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center"><Icon className="w-6 h-6 text-primary" /></div>
                )}
                <h3 className="text-lg font-bold text-foreground">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>
                {slug ? (
                  <Link to={`/layanan/${slug}`} className="inline-flex items-center text-sm font-medium text-primary hover:gap-2 transition-all gap-1">Pelajari <ArrowRight className="w-3.5 h-3.5" /></Link>
                ) : (
                  <Link to="/layanan" className="inline-flex items-center text-sm font-medium text-primary hover:gap-2 transition-all gap-1">Pelajari <ArrowRight className="w-3.5 h-3.5" /></Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}