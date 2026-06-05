import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingCTA from "@/components/layout/FloatingCTA";
import { useBlogPosts } from "@/hooks/useContent";
import { ArrowRight, Calendar, User } from "lucide-react";
import { Link } from "react-router-dom";

export default function Blog() {
  const { data: posts, isLoading } = useBlogPosts();
  const articles = posts || [];
  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        {/* Header */}
        <section className="pt-32 pb-16 bg-background">
          <div className="container-narrow mx-auto text-center max-w-3xl">
            <span className="text-sm font-medium text-primary tracking-wider uppercase">Blog & Insight</span>
            <h1 className="text-4xl sm:text-5xl font-extrabold mt-4 text-foreground leading-tight">
              Insight Seputar<br /><span className="text-primary">Waste Management</span>
            </h1>
            <p className="text-lg text-muted-foreground mt-4 max-w-xl mx-auto">
              Tips memilah sampah, panduan daur ulang, inspirasi zero waste, dan cerita dampak dari lapangan.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="pb-24 bg-background">
          <div className="container-narrow mx-auto">
            {isLoading && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1,2,3].map(i => (
                  <div key={i} className="rounded-2xl overflow-hidden">
                    <div className="h-52 bg-muted animate-pulse" />
                    <div className="p-6 space-y-3">
                      <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                      <div className="h-6 w-full bg-muted rounded animate-pulse" />
                      <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Featured Article */}
            {featured && (
              <Link to={`/blog/${featured.slug}`} className="block mb-16 group">
                <article className="grid lg:grid-cols-2 gap-8 items-center">
                  <div className="rounded-2xl overflow-hidden aspect-[16/10]">
                    {featured.image_url ? (
                      <img
                        src={featured.image_url}
                        alt={featured.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted" />
                    )}
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      {featured.category && (
                        <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                          {featured.category}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">Featured</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
                      {featured.title}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed line-clamp-3">
                      {featured.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {featured.author_name && (
                        <span className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5" /> {featured.author_name}
                        </span>
                      )}
                      {featured.published_at && (
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(featured.published_at).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })}
                        </span>
                      )}
                    </div>
                    <span className="inline-flex items-center text-sm font-medium text-primary gap-1 group-hover:gap-2 transition-all">
                      Baca selengkapnya <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </article>
              </Link>
            )}

            {/* Grid */}
            {rest.length > 0 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {rest.map((a) => (
                  <Link to={`/blog/${a.slug}`} key={a.id}>
                    <article className="group cursor-pointer h-full flex flex-col rounded-2xl border border-border bg-card overflow-hidden hover:shadow-lg transition-shadow duration-300">
                      <div className="overflow-hidden aspect-[16/10]">
                        {a.image_url ? (
                          <img
                            src={a.image_url}
                            alt={a.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted" />
                        )}
                      </div>
                      <div className="p-6 flex flex-col flex-1 space-y-3">
                        <div className="flex items-center gap-2">
                          {a.category && (
                            <span className="text-xs font-semibold text-primary">{a.category}</span>
                          )}
                          {a.published_at && (
                            <span className="text-xs text-muted-foreground">
                              • {new Date(a.published_at).toLocaleDateString("id-ID", { month: "short", day: "numeric", year: "numeric" })}
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
                          {a.title}
                        </h3>
                        <p className="text-sm text-muted-foreground flex-1 line-clamp-2">{a.excerpt}</p>
                        <span className="inline-flex items-center text-sm font-medium text-primary gap-1 group-hover:gap-2 transition-all mt-auto pt-2">
                          Baca <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}

            {articles.length === 0 && !isLoading && (
              <div className="text-center py-20">
                <p className="text-lg text-muted-foreground">Belum ada artikel.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <FloatingCTA />
    </div>
  );
}
