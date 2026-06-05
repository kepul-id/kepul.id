import { MessageCircle, Download, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useSiteSettings, useSectionContent } from "@/hooks/useContent";

export default function FinalCTA() {
  const { ref, isVisible } = useScrollAnimation();
  const { data: settings } = useSiteSettings();
  const { data: content } = useSectionContent("final_cta");
  const waLink = settings?.whatsapp_link || "https://wa.me/6281118888036";

  const headline = content?.headline || "Mulai Kelola Sampah dengan Kepul";
  const description = content?.description || "Hubungi kami via WhatsApp, download aplikasi, atau diskusikan program kerja sama untuk perusahaan Anda.";
  const ctaText = content?.cta_text || "Mulai dengan WhatsApp";
  const ctaLink2Text = content?.cta_link2_text || "Download Aplikasi";
  const bottomLink = content?.bottom_link_text || "Diskusikan Kerja Sama Perusahaan";

  return (
    <section ref={ref} className="section-padding bg-background">
      <div className="container-narrow mx-auto">
        <div className={`rounded-3xl bg-primary px-8 sm:px-14 py-14 sm:py-20 text-center transition-all duration-700 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
          <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground">{headline}</h2>
          <p className="text-primary-foreground/80 mt-4 max-w-lg mx-auto">{description}</p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Button size="lg" variant="secondary" asChild>
              <a href={waLink} target="_blank" rel="noopener noreferrer"><MessageCircle className="w-5 h-5 mr-2" />{ctaText}</a>
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground/30 text-foreground bg-background hover:bg-muted" asChild>
              <a href="#download"><Download className="w-5 h-5 mr-2" />{ctaLink2Text}</a>
            </Button>
          </div>
          <Link to="/berawal-dari-kantor" className="inline-flex items-center gap-1 text-sm text-primary-foreground/70 hover:text-primary-foreground mt-6 transition-colors">
            {bottomLink} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
