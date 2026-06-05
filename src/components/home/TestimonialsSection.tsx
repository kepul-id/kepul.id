import { useState, useEffect } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useSectionContent } from "@/hooks/useContent";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Quote } from "lucide-react";

export default function TestimonialsSection() {
  const { ref, isVisible } = useScrollAnimation();
  const { data: content } = useSectionContent("testimonials");
  const [activeIdx, setActiveIdx] = useState(0);

  const { data: testimonials } = useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase.from("testimonials").select("*").eq("is_active", true).order("sort_order");
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });

  const items = testimonials || [];

  useEffect(() => {
    if (items.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % items.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [items.length]);

  if (items.length === 0) return null;

  const active = items[activeIdx];

  return (
    <section ref={ref} className="section-padding bg-muted/30">
      <div className="container-narrow mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-sm font-medium text-primary">{content?.badge || "Testimonial"}</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-2 text-foreground">{content?.headline || "Apa Kata Mereka"}</h2>
          <p className="text-muted-foreground mt-3">{content?.description || "Cerita dan pengalaman nyata dari pengguna Kepul."}</p>
        </div>

        <div className={`max-w-2xl mx-auto transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <div className="glass-card p-8 sm:p-10 text-center relative">
            <Quote className="w-10 h-10 text-primary/20 mx-auto mb-4" />
            <p
              key={active?.id}
              className="text-lg sm:text-xl text-foreground leading-relaxed mb-6 animate-fade-in"
            >
              "{active?.content}"
            </p>
            <div className="flex items-center justify-center gap-3">
              {active?.avatar_url && (
                <img src={active.avatar_url} alt={active.name} className="w-12 h-12 rounded-full object-cover" />
              )}
              <div className="text-left">
                <p className="font-bold text-foreground">{active?.name}</p>
                {active?.role && <p className="text-sm text-muted-foreground">{active.role}</p>}
              </div>
            </div>
          </div>

          {items.length > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIdx(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${i === activeIdx ? "bg-primary w-8" : "bg-border hover:bg-muted-foreground/50"}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
