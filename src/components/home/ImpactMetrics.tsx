import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useCountUp } from "@/hooks/useCountUp";
import { useImpactMetrics } from "@/hooks/useContent";

function MetricCard({ value, suffix, label, start }: { value: number; suffix: string; label: string; start: boolean }) {
  const count = useCountUp(value, 2000, start);
  return (
    <div className="text-center space-y-1">
      <p className="text-3xl sm:text-4xl font-extrabold text-primary-foreground">{count.toLocaleString()}{suffix}</p>
      <p className="text-sm text-primary-foreground/70">{label}</p>
    </div>
  );
}

export default function ImpactMetrics() {
  const { ref, isVisible } = useScrollAnimation(0.3);
  const { data: metrics } = useImpactMetrics();

  const items = metrics || [];

  return (
    <section ref={ref} className="section-padding">
      <div className="container-narrow mx-auto">
        <div className="rounded-3xl bg-primary px-8 py-14 sm:py-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {items.map((m) => (
              <MetricCard key={m.id} value={m.value} suffix={m.suffix || "+"} label={m.label} start={isVisible} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
