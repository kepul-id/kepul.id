import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useSectionContent } from "@/hooks/useContent";

export default function CorporateHighlight() {
  const { ref, isVisible } = useScrollAnimation();
  const { data: content, isLoading } = useSectionContent("corporate");

  if (isLoading) {
    return (
      <section className="section-padding bg-background">
        <div className="container-narrow mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <div className="h-8 w-40 bg-muted rounded-full animate-pulse" />
              <div className="h-10 w-3/4 bg-muted rounded-lg animate-pulse" />
              <div className="h-20 w-full bg-muted rounded animate-pulse" />
            </div>
            <div className="rounded-3xl bg-muted animate-pulse aspect-[16/10]" />
          </div>
        </div>
      </section>
    );
  }

  const badge = content?.badge || "Untuk Perusahaan";
  const headline = content?.headline || "#BerawalDariKantor";
  const description = content?.description || "Program pengelolaan sampah kantor yang modern, terukur, dan berdampak.";
  const features = content?.features ? (content.features as unknown as string[]) : ["Mudah dijalankan & terkelola", "Meningkatkan engagement karyawan", "Mendukung program ESG & keberlanjutan"];
  const imageUrl = content?.image_url;
  const ctaText = content?.cta_text || "Pelajari Program";
  const ctaLink = content?.cta_link || "/berawal-dari-kantor";

  return (
    <section ref={ref} className="section-padding bg-background">
      <div className="container-narrow mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className={`space-y-6 transition-all duration-700 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}>
            <span className="inline-block bg-accent text-accent-foreground px-4 py-1.5 rounded-full text-sm font-medium">
              {badge}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              <span className="text-primary">#BerawalDari</span>Kantor
            </h2>
            <p className="text-muted-foreground leading-relaxed">{description}</p>
            <ul className="space-y-3">
              {(Array.isArray(features) ? features : []).map((item: string) => (
                <li key={item} className="flex items-center gap-3 text-sm text-foreground">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Button asChild>
              <Link to={ctaLink}>
                {ctaText}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>

          <div className={`transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}>
            {imageUrl ? (
              <div className="rounded-3xl overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
                <img src={imageUrl} alt="Program perusahaan Kepul" className="w-full h-auto object-cover" loading="lazy" width={1280} height={800} />
              </div>
            ) : (
              <div className="rounded-3xl bg-muted aspect-[16/10]" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
