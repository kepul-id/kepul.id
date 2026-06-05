import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useHowItWorks, useSectionContent } from "@/hooks/useContent";

export default function HowItWorks() {
  const { ref, isVisible } = useScrollAnimation();
  const { data: steps } = useHowItWorks();
  const { data: content } = useSectionContent("how_it_works");

  const items = steps || [];
  const badge = content?.badge || "Cara Kerja Kepul";
  const headline = content?.headline || "4 Langkah Mudah Memulai";
  const description = content?.description || "Menjual atau mengelola sampah bersama Kepul semudah ini.";
  const wilayah = content?.wilayah || "Layanan tersedia di Jabodetabek, Bandung, Surabaya, Malang, dan Gresik.";

  return (
    <section ref={ref} className="section-padding bg-background">
      <div className="container-narrow mx-auto">
        <div className="text-center mb-14">
          <span className="text-sm font-medium text-primary">{badge}</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-2 text-foreground">{headline}</h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">{description}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((step, i) => (
            <div key={step.id} className={`text-center space-y-4 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{ transitionDelay: `${i * 150}ms` }}>
              {(step as any).image_url && (
                <img src={(step as any).image_url} alt={step.title} className="w-20 h-20 object-contain mx-auto rounded-xl" />
              )}
              <div className="w-14 h-14 rounded-2xl bg-primary text-primary-foreground text-xl font-bold flex items-center justify-center mx-auto">{step.step_number}</div>
              <h3 className="text-lg font-bold text-foreground">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-primary mt-10 flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary" />
          {wilayah}
        </p>
      </div>
    </section>
  );
}
