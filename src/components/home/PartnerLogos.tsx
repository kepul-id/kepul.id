import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { usePartnerLogos, useSectionContent } from "@/hooks/useContent";

export default function PartnerLogos() {
  const { ref, isVisible } = useScrollAnimation();
  const { data: partners } = usePartnerLogos();
  const { data: content } = useSectionContent("partners");

  const items = partners || [];
  const headline = content?.headline || "Dipercaya oleh berbagai brand dan mitra";

  return (
    <section ref={ref} className="border-y border-border bg-muted/30">
      <div className="container-narrow mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <p className="text-center text-sm text-muted-foreground mb-8 font-medium">
          {headline}
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-14">
          {items.map((p, i) => (
            <div
              key={p.id}
              className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {p.logo_url ? (
                <img src={p.logo_url} alt={p.name} className="h-8 md:h-10 object-contain grayscale hover:grayscale-0 transition-all" loading="lazy" />
              ) : (
                <span className="text-lg md:text-xl font-bold text-muted-foreground/40">{p.name}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
