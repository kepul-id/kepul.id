import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useSiteSettings, useSectionContent } from "@/hooks/useContent";

export default function AppDownload() {
  const { ref, isVisible } = useScrollAnimation();
  const { data: settings } = useSiteSettings();
  const { data: content, isLoading } = useSectionContent("app_download");

  if (isLoading) {
    return (
      <section className="section-padding bg-muted/30">
        <div className="container-narrow mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <div className="h-6 w-32 bg-muted rounded animate-pulse" />
              <div className="h-10 w-3/4 bg-muted rounded-lg animate-pulse" />
              <div className="h-16 w-full bg-muted rounded animate-pulse" />
            </div>
            <div className="flex justify-center">
              <div className="w-80 h-[420px] bg-muted rounded-3xl animate-pulse" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  const badge = content?.badge || "Aplikasi Kepul";
  const headline = content?.headline || "Lebih Mudah dengan Aplikasi Kepul";
  const description = content?.description || "Tersedia di Android dan iOS. Kelola sampah, pantau riwayat, kumpulkan poin, dan jual sampah kapan saja di genggamanmu.";
  const imageUrl = content?.image_url;
  const note = content?.note || "Untuk sementara, pemesanan penjemputan dapat dilakukan melalui WhatsApp admin.";

  return (
    <section id="download" ref={ref} className="section-padding bg-muted/30">
      <div className="container-narrow mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}>
            <span className="text-sm font-medium text-primary">{badge}</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-2 text-foreground">
              {headline.includes("Kepul") ? (
                <>{headline.split("Kepul")[0]}<span className="text-primary">Kepul{headline.split("Kepul")[1] || ""}</span></>
              ) : headline}
            </h2>
            <p className="text-muted-foreground mt-4 leading-relaxed max-w-md">{description}</p>
            <div className="flex items-center gap-4 mt-6">
              <a href={settings?.app_store_url || "#"} target="_blank" rel="noopener noreferrer">
                <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="App Store" className="h-12 hover:scale-105 transition-transform" />
              </a>
              <a href={settings?.play_store_url || "#"} target="_blank" rel="noopener noreferrer">
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="h-12 hover:scale-105 transition-transform" />
              </a>
            </div>
            <p className="text-xs text-muted-foreground mt-4">{note}</p>
          </div>
          <div className={`flex justify-center transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}>
            {imageUrl ? (
              <img src={imageUrl} alt="Aplikasi Kepul" className="w-80 lg:w-[420px] max-w-none drop-shadow-2xl" loading="lazy" width={800} height={1024} />
            ) : (
              <div className="w-80 lg:w-[420px] h-[500px] bg-muted/50 rounded-3xl" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
