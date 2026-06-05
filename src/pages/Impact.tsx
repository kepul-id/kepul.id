import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingCTA from "@/components/layout/FloatingCTA";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useCountUp } from "@/hooks/useCountUp";
import { MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useImpactMetrics, useSiteSettings } from "@/hooks/useContent";

function Metric({ value, suffix, label, start }: { value: number; suffix: string; label: string; start: boolean }) {
  const count = useCountUp(value, 2000, start);
  return (
    <div className="glass-card p-6 text-center">
      <p className="text-3xl font-extrabold text-primary">{count.toLocaleString()}{suffix}</p>
      <p className="text-sm text-muted-foreground mt-1">{label}</p>
    </div>
  );
}

export default function Impact() {
  const { ref, isVisible } = useScrollAnimation(0.2);
  const { data: metrics } = useImpactMetrics();
  const { data: settings } = useSiteSettings();
  const cities = settings?.contact_cities || "Jakarta, Tangerang, Medan, Binjai, Deli Serdang";
  const areas = cities.split(",").map((c: string) => c.trim()).filter(Boolean);
  const items = metrics || [];

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <section className="section-padding bg-background">
          <div className="container-narrow mx-auto text-center max-w-3xl animate-fade-in-up">
            <span className="text-sm font-medium text-primary">Dampak Kepul</span>
            <h1 className="text-4xl sm:text-5xl font-extrabold mt-3 text-foreground">
              Dampak Nyata untuk Indonesia
            </h1>
            <p className="text-lg text-muted-foreground mt-4">
              Setiap kilogram sampah yang dikelola Kepul menciptakan nilai ekonomi, sosial, dan lingkungan.
            </p>
          </div>
        </section>

        <section ref={ref} className="section-padding bg-muted/30 pt-0">
          <div className="container-narrow mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((m) => (
                <Metric key={m.id} value={m.value} suffix={m.suffix || "+"} label={m.label} start={isVisible} />
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding bg-background">
          <div className="container-narrow mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-8">Area Layanan</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {areas.map((area) => (
                <span key={area} className="inline-flex items-center gap-1.5 bg-accent text-accent-foreground px-4 py-2 rounded-full text-sm font-medium">
                  <MapPin className="w-3.5 h-3.5" />
                  {area}
                </span>
              ))}
            </div>
            <Button className="mt-10" asChild>
              <Link to="/berawal-dari-kantor">
                Bergabung dengan Kepul <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingCTA />
    </div>
  );
}
