import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingCTA from "@/components/layout/FloatingCTA";
import { Button } from "@/components/ui/button";
import { MessageCircle, Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { useSiteSettings } from "@/hooks/useContent";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const needTypes = [
  { label: "Rumah Tangga", desc: "Saya ingin jual atau kelola sampah dari rumah" },
  { label: "Perusahaan", desc: "Saya tertarik program #BerawalDariKantor" },
  { label: "Media / Partnership", desc: "Saya ingin bekerja sama atau liputan" },
];

export default function Contact() {
  const [selectedNeed, setSelectedNeed] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "", category: "Rumah Tangga", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const { data: settings } = useSiteSettings();
  const waLink = settings?.whatsapp_link || "https://wa.me/6281118888036";
  const cities = settings?.contact_cities || "Jakarta, Tangerang, Medan, Binjai, Deli Serdang";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Mohon lengkapi semua field");
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.from("contact_submissions").insert({
        name: formData.name,
        email: formData.email,
        category: formData.category,
        message: formData.message,
      });
      if (error) throw error;
      toast.success("Pesan terkirim! Kami akan segera menghubungi Anda.");
      setFormData({ name: "", email: "", category: "Rumah Tangga", message: "" });
    } catch {
      toast.error("Gagal mengirim pesan. Silakan coba lagi.");
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <section className="section-padding bg-background">
          <div className="container-narrow mx-auto animate-fade-in-up">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-sm font-medium text-primary">Kontak</span>
              <h1 className="text-4xl sm:text-5xl font-extrabold mt-3 text-foreground">Hubungi Kepul</h1>
              <p className="text-lg text-muted-foreground mt-4">Kami siap membantu. Pilih kebutuhanmu dan hubungi tim Kepul.</p>
            </div>
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div>
                  <h3 className="font-bold text-foreground mb-4">Pilih Kebutuhan</h3>
                  <div className="space-y-3">
                    {needTypes.map((n) => (
                      <button key={n.label} onClick={() => setSelectedNeed(n.label)} className={`w-full text-left p-4 rounded-xl border transition-all ${selectedNeed === n.label ? "border-primary bg-accent" : "border-border bg-card hover:border-primary/30"}`}>
                        <p className="font-semibold text-foreground">{n.label}</p>
                        <p className="text-sm text-muted-foreground">{n.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <a href={`mailto:${settings?.email || "hi@kepul.id"}`} className="flex items-center gap-3 text-foreground hover:text-primary transition-colors"><Mail className="w-5 h-5 text-primary" /><span>{settings?.email || "hi@kepul.id"}</span></a>
                  <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-foreground hover:text-primary transition-colors"><Phone className="w-5 h-5 text-primary" /><span>{settings?.phone_display || "+62 811-1888-8036"}</span></a>
                  <div className="flex items-start gap-3 text-foreground"><MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" /><span>{cities}</span></div>
                </div>
                <Button size="lg" className="w-full sm:w-auto" asChild><a href={waLink} target="_blank" rel="noopener noreferrer"><MessageCircle className="w-5 h-5 mr-2" />Hubungi via WhatsApp</a></Button>
              </div>
              <div className="glass-card p-8">
                <h3 className="text-xl font-bold text-foreground mb-6">Kirim Pesan</h3>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div><label className="text-sm font-medium text-foreground block mb-1.5">Nama</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Nama lengkap" required /></div>
                  <div><label className="text-sm font-medium text-foreground block mb-1.5">Email</label><input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="email@example.com" required /></div>
                  <div><label className="text-sm font-medium text-foreground block mb-1.5">Kategori</label><select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"><option>Rumah Tangga</option><option>Perusahaan</option><option>Media / Partnership</option><option>Lainnya</option></select></div>
                  <div><label className="text-sm font-medium text-foreground block mb-1.5">Pesan</label><textarea rows={4} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" placeholder="Tulis pesan Anda..." required /></div>
                  <Button type="submit" className="w-full" disabled={submitting}>{submitting ? "Mengirim..." : "Kirim Pesan"}</Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingCTA />
    </div>
  );
}
