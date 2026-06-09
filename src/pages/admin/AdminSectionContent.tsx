import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Save, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import MediaPicker from "@/components/admin/MediaPicker";
import { Link } from "react-router-dom";

const sectionFields: Record<string, { key: string; label: string; type: "text" | "textarea" | "image" }[]> = {
  hero: [
    { key: "headline", label: "Headline", type: "text" },
    { key: "subheadline", label: "Subheadline", type: "textarea" },
    { key: "badge_text", label: "Badge Text", type: "text" },
    { key: "stat_number", label: "Stat Number", type: "text" },
    { key: "stat_label", label: "Stat Label", type: "text" },
  ],
  corporate: [
    { key: "badge", label: "Badge Text", type: "text" },
    { key: "headline", label: "Headline", type: "text" },
    { key: "description", label: "Deskripsi", type: "textarea" },
    { key: "image_url", label: "Gambar", type: "image" },
    { key: "cta_text", label: "CTA Text", type: "text" },
    { key: "cta_link", label: "CTA Link", type: "text" },
  ],
  app_download: [
    { key: "badge", label: "Badge Text", type: "text" },
    { key: "headline", label: "Headline", type: "text" },
    { key: "description", label: "Deskripsi", type: "textarea" },
    { key: "image_url", label: "Gambar Aplikasi", type: "image" },
    { key: "note", label: "Catatan Bawah", type: "text" },
  ],
  final_cta: [
    { key: "headline", label: "Headline", type: "text" },
    { key: "description", label: "Deskripsi", type: "textarea" },
    { key: "cta_text", label: "Tombol WhatsApp Text", type: "text" },
    { key: "cta_link2_text", label: "Tombol Download Text", type: "text" },
    { key: "bottom_link_text", label: "Link Bawah Text", type: "text" },
  ],
  how_it_works: [
    { key: "badge", label: "Badge Text", type: "text" },
    { key: "headline", label: "Headline", type: "text" },
    { key: "description", label: "Deskripsi", type: "text" },
    { key: "wilayah", label: "Wilayah Operasi", type: "text" },
  ],
  services: [
    { key: "badge", label: "Badge Text", type: "text" },
    { key: "headline", label: "Headline", type: "text" },
    { key: "description", label: "Deskripsi", type: "text" },
  ],
  impact: [
    { key: "badge", label: "Badge Text", type: "text" },
    { key: "headline", label: "Headline", type: "text" },
    { key: "description", label: "Deskripsi", type: "text" },
  ],
  awards: [
    { key: "badge", label: "Badge Text", type: "text" },
    { key: "headline", label: "Headline", type: "text" },
    { key: "description", label: "Deskripsi", type: "text" },
  ],
  media: [
    { key: "badge", label: "Badge Text", type: "text" },
    { key: "headline", label: "Headline", type: "text" },
    { key: "description", label: "Deskripsi", type: "text" },
  ],
  testimonials: [
    { key: "badge", label: "Badge Text", type: "text" },
    { key: "headline", label: "Headline", type: "text" },
    { key: "description", label: "Deskripsi", type: "text" },
  ],
  blog: [
    { key: "badge", label: "Badge Text", type: "text" },
    { key: "headline", label: "Headline", type: "text" },
    { key: "description", label: "Deskripsi", type: "text" },
  ],
  faq: [
    { key: "badge", label: "Badge Text", type: "text" },
    { key: "headline", label: "Headline", type: "text" },
    { key: "description", label: "Deskripsi", type: "text" },
  ],
  partners: [
    { key: "headline", label: "Headline / Tagline", type: "text" },
    { key: "description", label: "Deskripsi", type: "text" },
  ],
};

const sectionLabels: Record<string, string> = {
  hero: "Hero",
  corporate: "#BerawalDariKantor",
  app_download: "App Download",
  final_cta: "Final CTA",
  how_it_works: "Cara Kerja",
  services: "Layanan Kami",
  impact: "Impact Metrics",
  awards: "Penghargaan",
  media: "Media Coverage",
  testimonials: "Testimonial",
  blog: "Blog Preview",
  faq: "FAQ",
  partners: "Partner Logos",
};

export default function AdminSectionContent() {
  const { sectionKey } = useParams<{ sectionKey: string }>();
  const qc = useQueryClient();
  const [form, setForm] = useState<Record<string, string>>({});

  const { data: section, isLoading } = useQuery({
    queryKey: ["admin-section-content", sectionKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("page_sections")
        .select("*")
        .eq("section_key", sectionKey!)
        .eq("page", "home")
        .limit(1)
        .single();
      if (error && error.code !== "PGRST116") throw error;
      return data || null;
    },
    enabled: !!sectionKey,
  });

  useEffect(() => {
    if (section?.content) {
      setForm((section.content as Record<string, string>) || {});
    }
  }, [section]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (section?.id) {
        const { error } = await supabase
          .from("page_sections")
          .update({ content: form })
          .eq("id", section.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("page_sections")
          .insert({ section_key: sectionKey!, page: "home", label: sectionLabels[sectionKey!] || sectionKey!, content: form });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-section-content", sectionKey] });
      qc.invalidateQueries({ queryKey: ["section-content", sectionKey] });
      toast.success("Saved!");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const fields = sectionFields[sectionKey || ""] || [];

  if (isLoading) return <AdminLayout><p className="text-muted-foreground">Loading...</p></AdminLayout>;

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-2xl">
        <div className="flex items-center gap-3">
          <Link to="/admin/sections" className="p-2 hover:bg-accent rounded-lg">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Edit: {sectionLabels[sectionKey || ""] || sectionKey}</h1>
            <p className="text-sm text-muted-foreground">Edit konten section ini</p>
          </div>
        </div>

        <div className="glass-card p-6 space-y-4">
          {fields.map((field) => (
            <div key={field.key}>
              {field.type === "image" ? (
                <MediaPicker
                  label={field.label}
                  value={form[field.key] || ""}
                  onChange={(url) => setForm({ ...form, [field.key]: url })}
                />
              ) : field.type === "textarea" ? (
                <div>
                  <label className="text-sm font-medium block mb-1">{field.label}</label>
                  <textarea
                    value={form[field.key] || ""}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm resize-none"
                  />
                </div>
              ) : (
                <div>
                  <label className="text-sm font-medium block mb-1">{field.label}</label>
                  <input
                    value={form[field.key] || ""}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
                  />
                </div>
              )}
            </div>
          ))}

          <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
            <Save className="w-4 h-4 mr-2" /> {saveMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
