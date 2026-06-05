import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingCTA from "@/components/layout/FloatingCTA";
import SEOHead from "@/components/SEOHead";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Calendar, User, Tag, Share2, Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function PostSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="w-full aspect-[21/9] bg-muted rounded-2xl mb-10" />
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="h-4 w-32 bg-muted rounded" />
        <div className="h-10 w-full bg-muted rounded-lg" />
        <div className="h-10 w-2/3 bg-muted rounded-lg" />
        <div className="h-6 w-full bg-muted rounded mt-8" />
        <div className="h-6 w-5/6 bg-muted rounded" />
        <div className="h-6 w-4/5 bg-muted rounded" />
      </div>
    </div>
  );
}

function ShareButtons({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);

  const shareWhatsApp = () => window.open(`https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`, "_blank");
  const shareTwitter = () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, "_blank");
  const shareLinkedIn = () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank");
  const copyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground mr-1"><Share2 className="w-4 h-4 inline" /> Share:</span>
      <button onClick={shareWhatsApp} className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground" title="WhatsApp">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.79 23.492l4.574-1.47A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818c-2.17 0-4.18-.594-5.912-1.628l-.424-.252-2.714.872.888-2.645-.276-.44A9.787 9.787 0 0 1 2.182 12c0-5.422 4.396-9.818 9.818-9.818S21.818 6.578 21.818 12s-4.396 9.818-9.818 9.818z"/></svg>
      </button>
      <button onClick={shareTwitter} className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground" title="Twitter/X">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
      </button>
      <button onClick={shareLinkedIn} className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground" title="LinkedIn">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
      </button>
      <button onClick={copyLink} className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground" title="Copy Link">
        {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
      </button>
    </div>
  );
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug!)
        .eq("is_published", true)
        .limit(1)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  const { data: relatedPosts } = useQuery({
    queryKey: ["related-posts", post?.category, post?.id],
    queryFn: async () => {
      let query = supabase
        .from("blog_posts")
        .select("id, title, slug, image_url, category, published_at, excerpt")
        .eq("is_published", true)
        .neq("id", post!.id)
        .order("published_at", { ascending: false })
        .limit(3);
      if (post?.category) {
        query = query.eq("category", post.category);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!post?.id,
  });

  const pageUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="min-h-screen">
      <Navbar />
      {post && <SEOHead title={post.title} description={post.excerpt || undefined} image={post.image_url || undefined} url={pageUrl} />}
      <main>
        <section className="pt-28 pb-20 bg-background">
          <div className="container-narrow mx-auto">
            <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-10 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Kembali ke Blog
            </Link>

            {isLoading && <PostSkeleton />}

            {post && (
              <article className="animate-fade-in-up">
                {post.image_url && (
                  <div className="rounded-2xl overflow-hidden mb-10 aspect-[21/9]">
                    <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="max-w-3xl mx-auto">
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    {post.category && (
                      <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">{post.category}</span>
                    )}
                    {post.published_at && (
                      <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(post.published_at).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })}
                      </span>
                    )}
                    {post.author_name && (
                      <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <User className="w-3.5 h-3.5" />
                        {post.author_name}
                      </span>
                    )}
                  </div>

                  <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-foreground leading-[1.15] mb-6">{post.title}</h1>

                  {post.excerpt && (
                    <p className="text-xl text-muted-foreground leading-relaxed mb-8 border-l-4 border-primary pl-5">{post.excerpt}</p>
                  )}

                  <div className="flex items-center justify-between mb-10 pb-6 border-b border-border">
                    <ShareButtons title={post.title} url={pageUrl} />
                  </div>

                  <div
                    className="prose prose-lg max-w-none text-foreground 
                      prose-headings:text-foreground prose-headings:font-bold prose-headings:leading-tight
                      prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4
                      prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                      prose-p:leading-[1.8] prose-p:text-foreground/90 prose-p:mb-6
                      prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                      prose-img:rounded-xl prose-img:shadow-md prose-img:my-8
                      prose-blockquote:border-primary prose-blockquote:bg-muted/30 prose-blockquote:rounded-r-xl prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:not-italic prose-blockquote:text-foreground/80
                      prose-li:text-foreground/90 prose-li:leading-relaxed
                      prose-strong:text-foreground prose-strong:font-semibold
                      prose-code:text-primary prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                      [&_p+p]:mt-6 [&_p:empty]:h-6 [&_video]:rounded-xl [&_video]:my-8 [&_video]:w-full
                    "
                    dangerouslySetInnerHTML={{ __html: post.content || "" }}
                  />

                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 mt-12 pt-8 border-t border-border">
                      <Tag className="w-4 h-4 text-muted-foreground" />
                      {post.tags.map((tag) => (
                        <span key={tag} className="px-3 py-1.5 bg-muted text-xs font-medium rounded-full text-foreground">{tag}</span>
                      ))}
                    </div>
                  )}

                  <div className="mt-10 pt-6 border-t border-border">
                    <ShareButtons title={post.title} url={pageUrl} />
                  </div>

                  {post.author_name && (
                    <div className="mt-10 p-6 rounded-2xl bg-muted/30 border border-border flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <User className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{post.author_name}</p>
                        <p className="text-sm text-muted-foreground">Kontributor Kepul</p>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            )}

            {/* Related Articles */}
            {relatedPosts && relatedPosts.length > 0 && (
              <div className="max-w-3xl mx-auto mt-16 pt-12 border-t border-border">
                <h3 className="text-2xl font-bold text-foreground mb-8">Artikel Terkait</h3>
                <div className="grid sm:grid-cols-3 gap-6">
                  {relatedPosts.map((rp) => (
                    <Link to={`/blog/${rp.slug}`} key={rp.id} className="group">
                      <div className="glass-card overflow-hidden">
                        {rp.image_url && (
                          <img src={rp.image_url} alt={rp.title} className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                        )}
                        <div className="p-4 space-y-1">
                          <span className="text-xs font-semibold text-primary">{rp.category}</span>
                          <h4 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2">{rp.title}</h4>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {!isLoading && !post && (
              <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-foreground mb-3">Artikel tidak ditemukan</h2>
                <p className="text-muted-foreground mb-6">Artikel yang Anda cari tidak tersedia.</p>
                <Link to="/blog" className="text-primary font-medium hover:underline">← Kembali ke Blog</Link>
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
