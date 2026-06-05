import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHeroContent, useSiteSettings } from "@/hooks/useContent";

function HeroSkeleton() {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="container-narrow mx-auto section-padding">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-6">
            <div className="h-8 w-32 bg-muted rounded-full animate-pulse" />
            <div className="space-y-3">
              <div className="h-12 w-full bg-muted rounded-lg animate-pulse" />
              <div className="h-12 w-3/4 bg-muted rounded-lg animate-pulse" />
            </div>
            <div className="h-6 w-full bg-muted rounded animate-pulse" />
            <div className="h-6 w-2/3 bg-muted rounded animate-pulse" />
            <div className="flex gap-3 pt-2">
              <div className="h-12 w-44 bg-muted rounded-lg animate-pulse" />
              <div className="h-12 w-36 bg-muted rounded-lg animate-pulse" />
            </div>
          </div>
          <div className="rounded-3xl bg-muted animate-pulse aspect-[16/10]" />
        </div>
      </div>
    </section>
  );
}

export default function HeroSection() {
  const { data: hero, isLoading: heroLoading } = useHeroContent();
  const { data: settings, isLoading: settingsLoading } = useSiteSettings();

  if (heroLoading || settingsLoading) return <HeroSkeleton />;

  const waLink = settings?.whatsapp_link || "https://wa.me/6281118888036";
  const headline = hero?.headline || "Jual Sampah Jadi Mudah, Berdampak";
  const subheadline = hero?.subheadline || "Kepul adalah solusi pengelolaan sampah modern untuk rumah tangga, bisnis, sekolah, dan komunitas.";
  const badge = hero?.badge_text || "#DiKepulAja";
  const statNum = hero?.stat_number || "10.000+";
  const statLabel = hero?.stat_label || "Ton Sampah Terkumpul";
  const imgUrl = hero?.image_url;

  const parts = headline.split(",");

  return (
    <section className="relative overflow-hidden bg-background">
      <div className="container-narrow mx-auto section-padding">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-6 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-1.5 rounded-full text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              {badge}
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] text-foreground">
              {parts.length > 1 ? (
                <>
                  {parts[0]}{" "}
                  <span className="text-primary">{parts.slice(1).join(",")}</span>
                </>
              ) : headline}
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">{subheadline}</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button size="lg" asChild>
                <a href={waLink} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Hubungi WhatsApp
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="#services">
                  Lihat Layanan
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </div>
            <div className="flex items-center gap-4 pt-2">
              <a href={settings?.app_store_url || "#"} target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 transition-opacity">
                <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="App Store" className="h-10" />
              </a>
              <a href={settings?.play_store_url || "#"} target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 transition-opacity">
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="h-10" />
              </a>
            </div>
          </div>
          <div className="relative animate-fade-in-up animation-delay-200">
            {imgUrl ? (
              <div className="rounded-3xl overflow-hidden" style={{ boxShadow: "var(--shadow-hero)" }}>
                <img src={imgUrl} alt="Tim Kepul" className="w-full h-auto object-cover" width={1280} height={800} />
              </div>
            ) : (
              <div className="rounded-3xl bg-muted aspect-[16/10]" />
            )}
            <div className="absolute -bottom-4 -left-4 bg-card rounded-2xl p-4 border border-border" style={{ boxShadow: "var(--shadow-card)" }}>
              <p className="text-2xl font-bold text-primary">{statNum}</p>
              <p className="text-xs text-muted-foreground">{statLabel}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
