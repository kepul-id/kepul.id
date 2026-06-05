import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingCTA from "@/components/layout/FloatingCTA";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/hooks/useContent";

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: settings } = useSiteSettings();
  const waLink = settings?.whatsapp_link || "https://wa.me/6281118888036";

  const { data: service, isLoading } = useQuery({
    queryKey: ["service-detail", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("slug", slug!)
        .eq("is_active", true)
        .limit(1)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <section className="pt-28 pb-20 bg-background">
          <div className="container-narrow mx-auto">
            <Link to="/layanan" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-10 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Kembali ke Layanan
            </Link>

            {isLoading && (
              <div className="animate-pulse space-y-6">
                <div className="h-10 w-2/3 bg-muted rounded-lg" />
                <div className="h-6 w-full bg-muted rounded" />
                <div className="w-full aspect-[21/9] bg-muted rounded-2xl" />
                <div className="space-y-3">
                  <div className="h-5 w-full bg-muted rounded" />
                  <div className="h-5 w-5/6 bg-muted rounded" />
                  <div className="h-5 w-4/5 bg-muted rounded" />
                </div>
              </div>
            )}

            {service && (
              <article className="animate-fade-in-up">
                {service.image_url && (
                  <div className="rounded-2xl overflow-hidden mb-10 aspect-[21/9]">
                    <img src={service.image_url} alt={service.title} className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="max-w-3xl mx-auto">
                  <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-foreground leading-[1.15] mb-4">
                    {service.title}
                  </h1>
                  <p className="text-xl text-muted-foreground leading-relaxed mb-8">{service.description}</p>

                  {service.features && service.features.length > 0 && (
                    <div className="mb-10 p-6 rounded-2xl bg-muted/30 border border-border">
                      <h3 className="font-bold text-foreground mb-4">Keunggulan</h3>
                      <ul className="space-y-2">
                        {service.features.map((f: string) => (
                          <li key={f} className="flex items-start gap-2 text-foreground/90">
                            <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {(service as any).detail_content && (
                    <>
                      <hr className="border-border mb-10" />
                      <div
                        className="prose prose-lg max-w-none text-foreground
                          prose-headings:text-foreground prose-headings:font-bold
                          prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4
                          prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                          prose-p:leading-[1.8] prose-p:text-foreground/90 prose-p:mb-6
                          prose-a:text-primary hover:prose-a:underline
                          prose-img:rounded-xl prose-img:shadow-md prose-img:my-8
                          prose-blockquote:border-primary prose-blockquote:bg-muted/30 prose-blockquote:rounded-r-xl
                          prose-li:text-foreground/90
                          prose-strong:text-foreground
                          [&_p+p]:mt-6 [&_video]:rounded-xl [&_video]:my-8 [&_video]:w-full
                        "
                        dangerouslySetInnerHTML={{ __html: (service as any).detail_content }}
                      />
                    </>
                  )}

                  <div className="mt-12 p-8 rounded-2xl bg-primary/5 border border-primary/20 text-center">
                    <h3 className="text-xl font-bold text-foreground mb-2">Tertarik dengan layanan ini?</h3>
                    <p className="text-muted-foreground mb-6">Hubungi kami untuk konsultasi gratis.</p>
                    <Button size="lg" asChild>
                      <a href={waLink} target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="w-5 h-5 mr-2" /> Hubungi WhatsApp
                      </a>
                    </Button>
                  </div>
                </div>
              </article>
            )}

            {!isLoading && !service && (
              <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-foreground mb-3">Layanan tidak ditemukan</h2>
                <Link to="/layanan" className="text-primary font-medium hover:underline">← Kembali ke Layanan</Link>
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
