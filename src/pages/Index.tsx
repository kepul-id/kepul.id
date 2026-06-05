import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingCTA from "@/components/layout/FloatingCTA";
import HeroSection from "@/components/home/HeroSection";
import PartnerLogos from "@/components/home/PartnerLogos";
import CorporateHighlight from "@/components/home/CorporateHighlight";
import ServicesGrid from "@/components/home/ServicesGrid";
import HowItWorks from "@/components/home/HowItWorks";
import ImpactMetrics from "@/components/home/ImpactMetrics";
import AppDownload from "@/components/home/AppDownload";
import BlogPreview from "@/components/home/BlogPreview";
import FAQSection from "@/components/home/FAQSection";
import FinalCTA from "@/components/home/FinalCTA";
import AwardsSection from "@/components/home/AwardsSection";
import MediaLogos from "@/components/home/MediaLogos";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import { usePageSections } from "@/hooks/useContent";

const sectionComponents: Record<string, React.ComponentType> = {
  hero: HeroSection,
  partners: PartnerLogos,
  corporate: CorporateHighlight,
  services: ServicesGrid,
  how_it_works: HowItWorks,
  impact: ImpactMetrics,
  app_download: AppDownload,
  awards: AwardsSection,
  media: MediaLogos,
  testimonials: TestimonialsSection,
  blog: BlogPreview,
  faq: FAQSection,
  final_cta: FinalCTA,
};

const defaultOrder = ["hero", "partners", "corporate", "services", "how_it_works", "impact", "app_download", "awards", "media", "testimonials", "blog", "faq", "final_cta"];

function HomeSkeleton() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        {/* Hero skeleton */}
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
                <div className="flex gap-3 pt-2">
                  <div className="h-12 w-44 bg-muted rounded-lg animate-pulse" />
                  <div className="h-12 w-36 bg-muted rounded-lg animate-pulse" />
                </div>
              </div>
              <div className="rounded-3xl bg-muted animate-pulse aspect-[16/10]" />
            </div>
          </div>
        </section>
        {/* Section skeletons */}
        {[1, 2, 3].map(i => (
          <section key={i} className="section-padding">
            <div className="container-narrow mx-auto">
              <div className="text-center mb-14 space-y-3">
                <div className="h-5 w-28 bg-muted rounded animate-pulse mx-auto" />
                <div className="h-10 w-64 bg-muted rounded-lg animate-pulse mx-auto" />
                <div className="h-5 w-96 bg-muted rounded animate-pulse mx-auto" />
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(j => (
                  <div key={j} className="h-48 bg-muted rounded-2xl animate-pulse" />
                ))}
              </div>
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}

export default function Index() {
  const { data: sections, isLoading } = usePageSections("home");

  if (isLoading) return <HomeSkeleton />;

  const visibleSections = sections
    ? sections.filter(s => s.is_visible).map(s => s.section_key)
    : defaultOrder;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        {visibleSections.map(key => {
          const Component = sectionComponents[key];
          return Component ? <Component key={key} /> : null;
        })}
      </main>
      <Footer />
      <FloatingCTA />
    </div>
  );
}