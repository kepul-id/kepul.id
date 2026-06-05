import { Link } from "react-router-dom";
import { Mail, MapPin, Instagram, Youtube } from "lucide-react";
import { useSiteSettings } from "@/hooks/useContent";
import logoImg from "@/assets/kepul-logo.png";

export default function Footer() {
  const { data: settings } = useSiteSettings();

  const layananLinks = (settings?.footer_layanan || "Jual Sampah:/layanan,Sedekah Sampah:/layanan,Kepul Point:/layanan,Program Perusahaan:/berawal-dari-kantor,Sekolah & Komunitas:/layanan")
    .split(",").map((s: string) => { const [label, path] = s.split(":"); return { label: label?.trim(), path: path?.trim() || "/" }; });
  const perusahaanLinks = (settings?.footer_perusahaan || "Tentang Kepul:/tentang,#BerawalDariKantor:/berawal-dari-kantor,Dampak:/dampak,Blog & Insight:/blog,Kontak:/kontak")
    .split(",").map((s: string) => { const [label, path] = s.split(":"); return { label: label?.trim(), path: path?.trim() || "/" }; });
  const infoLinks = (settings?.footer_informasi || "Material & Harga:/material-harga,FAQ:/#faq,Area Layanan:/kontak")
    .split(",").map((s: string) => { const [label, path] = s.split(":"); return { label: label?.trim(), path: path?.trim() || "/" }; });

  const footerLinks: Record<string, { label: string; path: string }[]> = {
    Layanan: layananLinks,
    Perusahaan: perusahaanLinks,
    Informasi: infoLinks,
  };

  const tagline = settings?.footer_tagline || "Solusi waste management modern untuk rumah tangga, bisnis, sekolah, dan komunitas.";
  const hashtag = settings?.footer_hashtag || "#JualSampahJadiMudah";

  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container-narrow mx-auto section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2 space-y-4">
            <img src={logoImg} alt="Kepul" className="h-12 brightness-0 invert" />
            <p className="text-sm opacity-70 max-w-xs leading-relaxed">{tagline}</p>
            <p className="text-sm font-semibold text-primary">{hashtag}</p>
            <div className="flex gap-3 pt-2">
              <a href={settings?.instagram_url || "#"} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"><Instagram className="w-4 h-4" /></a>
              <a href={settings?.youtube_url || "#"} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"><Youtube className="w-4 h-4" /></a>
            </div>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-sm mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}><Link to={link.path} className="text-sm opacity-60 hover:opacity-100 transition-opacity">{link.label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-primary-foreground/10 flex flex-col sm:flex-row items-start sm:items-center gap-4 text-sm opacity-60">
          <div className="flex items-center gap-2"><Mail className="w-4 h-4" /><span>{settings?.email || "hi@kepul.id"}</span></div>
          <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /><span>{settings?.contact_cities || "Jakarta, Tangerang, Medan, Binjai, Deli Serdang"}</span></div>
        </div>
        <div className="mt-8 pt-6 border-t border-primary-foreground/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs opacity-40">
          <p>© {new Date().getFullYear()} Kepul. All rights reserved.</p>
          <div className="flex gap-6"><a href="#" className="hover:opacity-100">Kebijakan Privasi</a><a href="#" className="hover:opacity-100">Syarat & Ketentuan</a></div>
        </div>
      </div>
    </footer>
  );
}
