import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useBlogPosts, useSectionContent } from "@/hooks/useContent";

export default function BlogPreview() {
  const { ref, isVisible } = useScrollAnimation();
  const { data: posts } = useBlogPosts();
  const { data: content } = useSectionContent("blog");

  const articles = (posts || []).slice(0, 3);
  const badge = content?.badge || "Insight & Blog";
  const headline = content?.headline || "Pelajari Waste Management bersama Kepul";

  return (
    <section ref={ref} className="section-padding bg-background">
      <div className="container-narrow mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-12">
          <div>
            <span className="text-sm font-medium text-primary">{badge}</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-2 text-foreground">
              {headline.includes("Kepul") ? (
                <>{headline.split("Kepul")[0]}<span className="text-primary">Kepul</span>{headline.split("Kepul")[1] || ""}</>
              ) : headline}
            </h2>
          </div>
          <Link to="/blog" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-all">
            Baca Insight & Blog <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((a, i) => (
            <Link to={`/blog/${a.slug}`} key={a.id}>
              <article className={`glass-card overflow-hidden group transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="overflow-hidden">
                  <img src={a.image_url || ""} alt={a.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                </div>
                <div className="p-5 space-y-2">
                  <span className="text-xs font-semibold text-primary">{a.category}</span>
                  <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">{a.title}</h3>
                  <p className="text-sm text-muted-foreground">{a.excerpt}</p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
