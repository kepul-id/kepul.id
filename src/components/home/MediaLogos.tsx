import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useSectionContent } from "@/hooks/useContent";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function MediaLogos() {
  const { ref, isVisible } = useScrollAnimation();
  const { data: content } = useSectionContent("media");

  const { data: logos } = useQuery({
    queryKey: ["media-logos"],
    queryFn: async () => {
      const { data, error } = await supabase.from("media_logos").select("*").eq("is_active", true).order("sort_order");
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });

  const items = logos || [];

  return (
    <section ref={ref} className="section-padding bg-background">
      <div className="container-narrow mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-sm font-medium text-primary">{content?.badge || "Media"}</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-2 text-foreground">{content?.headline || "Kepul di Media"}</h2>
          <p className="text-muted-foreground mt-3">{content?.description || "Liputan media tentang Kepul."}</p>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12">
          {items.map((logo, i) => (
            <a
              key={logo.id}
              href={logo.link_url || "#"}
              target={logo.link_url ? "_blank" : undefined}
              rel="noopener noreferrer"
              className={`grayscale hover:grayscale-0 transition-all duration-700 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              {logo.logo_url ? (
                <img src={logo.logo_url} alt={logo.name} className="h-10 sm:h-12 object-contain" />
              ) : (
                <span className="text-sm font-semibold text-muted-foreground">{logo.name}</span>
              )}
            </a>
          ))}
        </div>
        {items.length === 0 && <p className="text-center text-muted-foreground py-8">Belum ada media coverage.</p>}
      </div>
    </section>
  );
}
