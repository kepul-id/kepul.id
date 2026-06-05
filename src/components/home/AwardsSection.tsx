import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useSectionContent } from "@/hooks/useContent";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Award } from "lucide-react";

export default function AwardsSection() {
  const { ref, isVisible } = useScrollAnimation();
  const { data: content } = useSectionContent("awards");

  const { data: awards } = useQuery({
    queryKey: ["awards"],
    queryFn: async () => {
      const { data, error } = await supabase.from("awards").select("*").eq("is_active", true).order("sort_order");
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });

  const items = awards || [];

  return (
    <section ref={ref} className="section-padding bg-muted/30">
      <div className="container-narrow mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-sm font-medium text-primary">{content?.badge || "Penghargaan"}</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-2 text-foreground">{content?.headline || "Kepercayaan & Penghargaan"}</h2>
          <p className="text-muted-foreground mt-3">{content?.description || "Bukti nyata kontribusi Kepul."}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((a, i) => (
            <div
              key={a.id}
              className={`glass-card overflow-hidden text-center p-6 space-y-4 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {a.image_url ? (
                <img src={a.image_url} alt={a.title} className="w-full h-48 object-contain rounded-xl" />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-accent flex items-center justify-center mx-auto">
                  <Award className="w-8 h-8 text-primary" />
                </div>
              )}
              <h3 className="font-bold text-foreground">{a.title}</h3>
              {a.description && <p className="text-sm text-muted-foreground">{a.description}</p>}
            </div>
          ))}
        </div>
        {items.length === 0 && <p className="text-center text-muted-foreground py-8">Belum ada penghargaan.</p>}
      </div>
    </section>
  );
}
